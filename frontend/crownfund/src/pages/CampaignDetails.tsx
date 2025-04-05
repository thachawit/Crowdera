"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ArrowLeft, Target, Coins, Clock, Users } from "lucide-react";
import {
  createWalletClient,
  custom,
  createPublicClient,
  http,
  encodeFunctionData,
} from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useWallet } from "../context/WalletContext";
import {
  campaignContractAddress,
  campaignAbi,
  mockUsdtContractAddress,
  mockUsdtAbi,
} from "../lib/contract";
import { zircuitGarfieldTestnet } from "../chains";

async function approveAndDonate(
  campaignId: number,
  amountInUnits: string,
  walletClient: any
) {
  try {
    const approveTx = await walletClient.signTransaction({
      chain: zircuitGarfieldTestnet,
      to: mockUsdtContractAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: mockUsdtAbi,
        functionName: "approve",
        args: [campaignContractAddress, BigInt(amountInUnits)],
      }),
      gas: 100000n,
      maxFeePerGas: 1000000000n,
      maxPriorityFeePerGas: 1000000000n,
    });

    const approveRes = await fetch(
      "https://b543-111-235-226-130.ngrok-free.app/submit-tx",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedTx: approveTx }),
      }
    );
    if (!approveRes.ok) throw new Error("Approval failed");

    const authorization = await walletClient.signAuthorization({
      contractAddress: campaignContractAddress,
      chainId: zircuitGarfieldTestnet.id,
      nonce: 0n,
    });

    const donateTx = await walletClient.signTransaction({
      chain: zircuitGarfieldTestnet,
      to: campaignContractAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: campaignAbi,
        functionName: "donate",
        args: [BigInt(campaignId), BigInt(amountInUnits)],
      }),
      gas: 1000000n,
      type: "eip7702",
      authorizationList: [authorization],
      maxFeePerGas: 1000000000n,
      maxPriorityFeePerGas: 1000000000n,
    });

    const donateRes = await fetch(
      "https://b543-111-235-226-130.ngrok-free.app/submit-tx",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signedTx: donateTx }),
      }
    );

    if (!donateRes.ok) throw new Error("Donation failed");
    const { txHash } = await donateRes.json();
    return { txHash };
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}

interface Campaign {
  id: bigint;
  name: string;
  target: bigint;
  raised: bigint;
  receiver: string;
  deadline: bigint;
}

interface Donation {
  campaignId: number;
  donor: string;
  amount: bigint;
  timestamp: string;
}

export function CampaignDetails() {
  const { id: paramId } = useParams<{ id: string }>();
  const campaignId = paramId
    ? isNaN(parseInt(paramId, 10)) || parseInt(paramId, 10) <= 0
      ? 0
      : parseInt(paramId, 10)
    : 0;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [usdtBalance, setUsdtBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { connectWallet } = useWallet();

  const walletClient = isConnected
    ? createWalletClient({
        account: address as `0x${string}`,
        chain: zircuitGarfieldTestnet,
        transport: custom(window.ethereum!),
      })
    : null;

  const publicClient = createPublicClient({
    chain: zircuitGarfieldTestnet,
    transport: http(zircuitGarfieldTestnet.rpcUrls.default.http[0]),
  });

  useEffect(() => {
    async function fetchCampaignData() {
      if (isNaN(campaignId) || campaignId <= 0) {
        setError("Invalid campaign ID");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const campaignData = (await publicClient.readContract({
          address: campaignContractAddress,
          abi: campaignAbi,
          functionName: "campaigns",
          args: [BigInt(campaignId)],
        })) as [bigint, string, bigint, bigint, string, bigint];
        console.log("Campaign data:", campaignData); // Debug raw data
        if (campaignData[0] === 0n && campaignData[1] === "") {
          setCampaign(null); // No campaign found
        } else {
          setCampaign({
            id: campaignData[0],
            name: campaignData[1],
            target: campaignData[2],
            raised: campaignData[3],
            receiver: campaignData[4],
            deadline: campaignData[5],
          });
        }

        if (isConnected && address) {
          const balance = (await publicClient.readContract({
            address: mockUsdtContractAddress,
            abi: mockUsdtAbi,
            functionName: "balanceOf",
            args: [address as `0x${string}`],
          })) as bigint;
          setUsdtBalance(balance);
        }

        const donationResponse = await fetch(
          `https://b543-111-235-226-130.ngrok-free.app/donations?campaignId=${campaignId}`
        );
        if (donationResponse.ok) {
          const donationData = await donationResponse.json();
          setDonations(
            donationData.map((d: any) => ({
              campaignId: campaignId,
              donor: d.donor,
              amount: BigInt(d.amount),
              timestamp: d.timestamp,
            }))
          );
        } else {
          setDonations([]);
        }
      } catch (err) {
        console.error("Failed to fetch campaign data:", err);
        setError("Failed to fetch campaign data: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaignData();
  }, [campaignId, isConnected, address]);

  const handleDonate = async () => {
    if (!donationAmount || !isConnected || !walletClient) return;
    setLoading(true);
    setError(null);

    try {
      const amountInUnits = (Number(donationAmount) * 1e6).toString();
      if (BigInt(amountInUnits) > usdtBalance)
        throw new Error("Insufficient USDT balance");

      const { txHash } = await approveAndDonate(
        campaignId,
        amountInUnits,
        walletClient
      );
      const newDonation = {
        campaignId: campaignId,
        donor: address!,
        amount: BigInt(amountInUnits),
        timestamp: new Date().toISOString(),
      };
      setDonations((prev) => [...prev, newDonation]);
      setUsdtBalance((prev) => prev - BigInt(amountInUnits));
      setDonationAmount("");
      alert(`Donation successful! Transaction hash: ${txHash}`);
    } catch (err) {
      setError("Failed to process donation: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="text-4xl font-bold text-slate-300 mb-4">
          Campaign Not Found
        </div>
        <p className="text-slate-500 mb-6">
          The campaign you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
        </Link>
      </div>
    );
  }

  const goalAmount = Number(campaign.target) / 1e6;
  const raisedAmount = Number(campaign.raised) / 1e6;
  const percentRaised = Math.min(
    Math.round((raisedAmount / goalAmount) * 100),
    100
  );
  const totalDonations = donations.length;
  const latestDonation =
    donations.length > 0
      ? new Date(donations[donations.length - 1].timestamp)
      : null;
  const isActive = new Date(Number(campaign.deadline) * 1000) > new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-slate-600 hover:text-purple-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {campaign.name}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Campaign Overview
              </CardTitle>
              <CardDescription>
                Campaign ID: {campaign.id.toString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      Fundraising Goal
                    </span>
                    <span className="font-bold">
                      {goalAmount.toFixed(2)} USDT
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">
                        Total Raised
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {raisedAmount.toFixed(2)} USDT
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full"
                        style={{ width: `${percentRaised}%` }}
                      ></div>
                    </div>

                    <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                      {percentRaised}% of goal reached
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Receiver</span>
                    <span className="font-mono">
                      {campaign.receiver.slice(0, 6)}...
                      {campaign.receiver.slice(-4)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Deadline</span>
                    <span>
                      {new Date(
                        Number(campaign.deadline) * 1000
                      ).toLocaleDateString()}
                      ({isActive ? "Active" : "Expired"})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Total Donors
                      </div>
                      <div className="font-bold">{totalDonations}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Latest Donation
                      </div>
                      <div className="font-bold">
                        {latestDonation
                          ? latestDonation.toLocaleTimeString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-600" />
                Donation History
              </CardTitle>
              <CardDescription>
                Recent contributions to this campaign
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800">
                      <TableHead className="font-medium">Donor</TableHead>
                      <TableHead className="font-medium text-right">
                        Amount (USDT)
                      </TableHead>
                      <TableHead className="font-medium">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center text-slate-500 py-6"
                        >
                          No donations yet. Be the first to contribute!
                        </TableCell>
                      </TableRow>
                    ) : (
                      donations.map((donation, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <TableCell className="font-mono text-sm">
                            {donation.donor.slice(0, 6)}...
                            {donation.donor.slice(-4)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-purple-600 dark:text-purple-400">
                            {(Number(donation.amount) / 1e6).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {new Date(donation.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-700 sticky top-6">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10">
              <CardTitle className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-purple-600" />
                Make a Donation
              </CardTitle>
              <CardDescription>Support this campaign with USDT</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-6">
                {!isConnected ? (
                  <Button onClick={() => connectWallet()} className="w-full">
                    Connect Wallet
                  </Button>
                ) : (
                  <>
                    <p className="text-sm text-slate-600">
                      Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                    <p className="text-sm text-slate-600">
                      USDT Balance: {(Number(usdtBalance) / 1e6).toFixed(2)}
                    </p>
                    <Button
                      onClick={() => disconnect()}
                      className="w-full mb-4"
                    >
                      Disconnect
                    </Button>
                  </>
                )}

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Donation Amount (USDT)
                  </label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="pl-8"
                      disabled={loading || !isActive}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                      $
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDonationAmount(amount.toString())}
                      disabled={loading || !isActive}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-400">
                  <p className="mb-2">
                    Your USDT donation will be processed on Zircuit Garfield
                    Testnet.
                  </p>
                  <p>
                    100% of your donation goes directly to the campaign
                    receiver.
                  </p>
                </div>
              </div>
            </CardContent>

            {isConnected && (
              <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <Button
                  onClick={handleDonate}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!donationAmount || loading || !isActive}
                >
                  {loading ? "Processing..." : "Donate Now"}
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  Share This Campaign
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Help spread the word about this campaign
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-blue-600"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-sky-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-green-600"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
