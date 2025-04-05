export const mockCampaigns = [
  {
    id: 1,
    name: "Taipei Music Fest",
    goal: "1000000000", // 1000 USDT (1e9 units, 6 decimals = 1000 USDT)
    totalRaised: "600000000", // 600 USDT
    organizer: "0x5678...",
    chainBreakdown: {
      zircuit: "500000000", // 500 USDT
    },
  },
  {
    id: 2,
    name: "ZK Hackathon Prize",
    goal: "2000000000", // 2000 USDT
    totalRaised: "800000000", // 800 USDT
    organizer: "0x9abc...",
    chainBreakdown: {
      zircuit: "600000000", // 600 USDT
      optimism: "100000000", // 100 USDT
      polygon: "100000000", // 100 USDT
    },
  },
];

export const mockDonationEvents = [
  {
    campaignId: 1,
    donor: "0x1234...",
    amount: "100000000",
    timestamp: "2025-04-05T10:00:00Z",
  }, // 100 USDT
  {
    campaignId: 2,
    donor: "0x5678...",
    amount: "200000000",
    timestamp: "2025-04-05T10:05:00Z",
  }, // 200 USDT
];
