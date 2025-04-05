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
import { mockCampaigns, mockDonationEvents } from "../lib/mockData";
import {
  ArrowLeft,
  Target,
  Coins,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Hexagon,
  Triangle,
} from "lucide-react";

export function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const campaign = mockCampaigns.find((c) => c.id === Number(id));
  const [donationAmount, setDonationAmount] = useState("");
  const [donations, setDonations] = useState(
    mockDonationEvents.filter((d) => d.campaignId === Number(id))
  );

  // Simulate Webhook updates (mocked)
  useEffect(() => {
    const interval = setInterval(() => {
      const newDonation = {
        campaignId: Number(id),
        donor: `0x${Math.random().toString(16).slice(2, 6)}...`,
        amount: "50000000", // 50 USDT
        timestamp: new Date().toISOString(),
      };
      setDonations((prev) => [...prev, newDonation]);
    }, 10000); // Every 10s for demo
    return () => clearInterval(interval);
  }, [id]);

  const handleDonate = () => {
    if (!donationAmount) return;
    const newDonation = {
      campaignId: Number(id),
      donor: "0xmockuser...",
      amount: (Number(donationAmount) * 1e6).toString(), // Convert USDT to 6-decimal units
      timestamp: new Date().toISOString(),
    };
    setDonations((prev) => [...prev, newDonation]);
    setDonationAmount("");
    // TODO: Call MultiBaas REST API to transfer USDT on Zircuit testnet
  };

  if (!campaign)
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

  // Calculate percentage raised
  const goalAmount = Number(campaign.goal) / 1e6;
  const raisedAmount = Number(campaign.totalRaised) / 1e6;
  const percentRaised = Math.min(
    Math.round((raisedAmount / goalAmount) * 100),
    100
  );

  // Calculate total donations
  const totalDonations = donations.length;

  // Get latest donation time
  const latestDonation =
    donations.length > 0
      ? new Date(donations[donations.length - 1].timestamp)
      : null;

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
              <CardDescription>Campaign ID: {campaign.id}</CardDescription>
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
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Chain Distribution
              </CardTitle>
              <CardDescription>
                Funds raised across different blockchains
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Zircuit
                  </div>
                  <div className="font-bold text-lg">
                    {(Number(campaign.chainBreakdown.zircuit) / 1e6).toFixed(2)}{" "}
                    USDT
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                      <Triangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Optimism
                  </div>
                  <div className="font-bold text-lg">
                    {(Number(campaign.chainBreakdown.optimism) / 1e6).toFixed(
                      2
                    )}{" "}
                    USDT
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Hexagon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Polygon
                  </div>
                  <div className="font-bold text-lg">
                    {(Number(campaign.chainBreakdown.polygon) / 1e6).toFixed(2)}{" "}
                    USDT
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
                            {donation.donor}
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
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-400">
                  <p className="mb-2">
                    Your donation will be processed on Zircuit blockchain for
                    lower fees and faster confirmation.
                  </p>
                  <p>100% of your donation goes directly to the campaign.</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <Button
                onClick={handleDonate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={!donationAmount}
              >
                Donate Now
              </Button>
            </CardFooter>
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
