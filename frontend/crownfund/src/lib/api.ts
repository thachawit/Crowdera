// src/lib/api.ts
const API_BASE_URL =
  "https://app.multibaas.com/api/v0/contracts/EventFunding/0x1234..."; // Placeholder
const API_TOKEN = "YOUR_API_TOKEN"; // Replace with env variable later

export async function fetchCampaigns() {
  // Mock for now
  return import("./mockData").then((module) => module.mockCampaigns);
  // Real implementation later:
  // const res = await fetch(`${API_BASE_URL}/campaigns`, {
  //   headers: { "Authorization": `Bearer ${API_TOKEN}` },
  // });
  // return res.json();
}

export async function donate(campaignId: number, amount: string) {
  // Mock for now
  return {
    success: true,
    donor: "0xmockuser...",
    amount,
    timestamp: new Date().toISOString(),
  };
  // Real implementation:
  // const res = await fetch(`${API_BASE_URL}/donate`, {
  //   method: "POST",
  //   headers: { "Authorization": `Bearer ${API_TOKEN}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ args: [campaignId, amount] }),
  // });
  // return res.json();
}

export async function fetchDonationEvents(campaignId: number) {
  // Mock for now
  return import("./mockData").then((module) =>
    module.mockDonationEvents.filter((d) => d.campaignId === campaignId)
  );
  // Real implementation:
  // const res = await fetch(`${API_BASE_URL}/events/DonationReceived?filter=campaignId=${campaignId}`, {
  //   headers: { "Authorization": `Bearer ${API_TOKEN}` },
  // });
  // return res.json();
}
