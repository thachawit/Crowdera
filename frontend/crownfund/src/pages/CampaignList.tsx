import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { mockCampaigns } from "../lib/mockData";
import { ArrowRight, Target, Coins } from "lucide-react";

export function CampaignList() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Active Campaigns
        </h1>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm font-medium">
          {mockCampaigns.length} campaigns available
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCampaigns.map((campaign) => {
          // Calculate percentage raised
          const goalAmount = Number(campaign.goal) / 1e6;
          const raisedAmount = Number(campaign.totalRaised) / 1e6;
          const percentRaised = Math.min(
            Math.round((raisedAmount / goalAmount) * 100),
            100
          );

          return (
            <Card
              key={campaign.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
            >
              <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <CardTitle className="text-xl font-bold">
                  {campaign.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <Target className="h-4 w-4 mr-2" />
                    <span className="text-sm">Goal</span>
                  </div>
                  <span className="font-bold">
                    {goalAmount.toFixed(2)} USDT
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <Coins className="h-4 w-4 mr-2" />
                      <span className="text-sm">Raised</span>
                    </div>
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
                    {percentRaised}% of goal
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-2">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Chain Distribution
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white dark:bg-slate-700 rounded-md p-2 shadow-sm">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Zircuit
                      </div>
                      <div className="font-semibold">
                        {(
                          Number(campaign.chainBreakdown.zircuit) / 1e6
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded-md p-2 shadow-sm">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Optimism
                      </div>
                      <div className="font-semibold">
                        {(
                          Number(campaign.chainBreakdown.optimism) / 1e6
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-700 rounded-md p-2 shadow-sm">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Polygon
                      </div>
                      <div className="font-semibold">
                        {(
                          Number(campaign.chainBreakdown.polygon) / 1e6
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Link to={`/campaign/${campaign.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 group">
                    <span>View Details</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
