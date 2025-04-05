export interface Campaign {
  id: number;
  name: string;
  description?: string;
  goal: string;
  totalRaised: string;
  chainBreakdown: {
    zircuit: string;
    optimism?: string;
    polygon?: string;
  };
  endDate?: string;
  organizer: string;
}

export interface DonationEvent {
  id: number;
  campaignId: number;
  donor: string;
  amount: string;
  timestamp: string;
  chain: string;
}
