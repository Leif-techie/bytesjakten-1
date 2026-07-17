"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SavingsBar } from "@/components/SavingsBar";
import {
  PreferencesForm,
  defaultPreferences,
  type UserPreferences,
} from "@/components/PreferencesForm";
import { BestOfferCard } from "@/components/BestOfferCard";
import { SignupSection } from "@/components/SignupSection";
import { EsimGuide } from "@/components/EsimGuide";
import { KivraSection } from "@/components/KivraSection";
import { Footer } from "@/components/Footer";
import { daysUntil } from "@/lib/campaigns";

type CampaignData = {
  operator: string;
  name: string;
  campaignPrice: number;
  regularPrice: number;
  url: string;
  network?: string;
  campaignStart: string;
  campaignEnd: string;
  annualSavings: number;
  averageMonthlyCost: number;
  campaignMonths: number;
};

export default function HomePage() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBestOffer = useCallback(async (prefs: UserPreferences) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        best: "true",
        minDataGB: String(prefs.minDataGB),
        network: prefs.networkPreference,
        currentOperator: prefs.currentOperator,
      });
      const res = await fetch(`/api/campaigns?${params}`);
      const data = await res.json();
      setCampaign(data.campaign ?? null);
    } catch {
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestOffer(preferences);
  }, [preferences, fetchBestOffer]);

  const contractEnd = new Date(preferences.contractEndDate);
  const readyToSwitch = daysUntil(contractEnd) <= 7;

  const savings = campaign?.annualSavings ?? 0;
  const campaignPrice = campaign?.averageMonthlyCost ?? 0;
  const refPrice = campaign?.regularPrice ?? 250;
  const campaignMonths = campaign?.campaignMonths;

  return (
    <>
      <Header />
      <main>
        <Hero />
        {campaign && (
          <SavingsBar
            annualSavings={savings}
            campaignPrice={campaignPrice}
            referencePrice={refPrice}
            campaignMonths={campaignMonths}
          />
        )}
        <PreferencesForm preferences={preferences} onChange={setPreferences} />
        <BestOfferCard
          campaign={
            campaign
              ? { ...campaign, readyToSwitch }
              : null
          }
          loading={loading}
        />
        <SignupSection preferences={preferences} />
        <EsimGuide />
        <KivraSection />
      </main>
      <Footer />
    </>
  );
}
