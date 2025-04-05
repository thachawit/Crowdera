"use client";

import { Outlet, Link } from "react-router-dom";
import "./App.css";
import { Coins, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "./context/WalletContext";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { walletAddress, connectWallet, error } = useWallet();

  // Truncate address for display
  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center space-x-2">
              <Coins className="h-6 w-6" />
              <h1 className="text-2xl font-bold">ZK-Enhanced Event Funding</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="font-medium hover:text-white/80 transition-colors"
              >
                Campaigns
              </Link>
              <Link
                to="/about"
                className="font-medium hover:text-white/80 transition-colors"
              >
                About
              </Link>
              <Link
                to="/faq"
                className="font-medium hover:text-white/80 transition-colors"
              >
                FAQ
              </Link>
              <Button
                className="bg-white text-purple-600 hover:bg-white/90"
                onClick={connectWallet}
              >
                {walletAddress
                  ? truncateAddress(walletAddress)
                  : "Connect Wallet"}
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-3 border-t border-white/20">
              <Link
                to="/"
                className="block font-medium hover:text-white/80 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Campaigns
              </Link>
              <Link
                to="/about"
                className="block font-medium hover:text-white/80 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/faq"
                className="block font-medium hover:text-white/80 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Button
                className="w-full bg-white text-purple-600 hover:bg-white/90"
                onClick={connectWallet}
              >
                {walletAddress
                  ? truncateAddress(walletAddress)
                  : "Connect Wallet"}
              </Button>
            </nav>
          )}
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800 h-2 w-full overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-full w-full animate-gradient"></div>
      </div>

      {error && (
        <div className="container mx-auto p-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <Outlet /> {/* Renders CampaignList or CampaignDetails */}
      </main>

      <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Coins className="h-5 w-5 text-purple-600" />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                ZK-Enhanced Event Funding
              </span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} ZK-Enhanced Event Funding. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
