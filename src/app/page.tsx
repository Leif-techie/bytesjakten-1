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
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [lastCampaignUpdate, setLastCampaignUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBestOffer = useCallback(async (prefs: UserPreferences) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        best: "true",
        top: "3",
        minDataGB: String(prefs.minDataGB),
        network: prefs.networkPreference,
        currentOperator: prefs.currentOperator,
        isStudent: String(prefs.isStudent),
      });
      const res = await fetch(`/api/campaigns?${params}`);
      const data = await res.json();
      const top = Array.isArray(data.campaigns)
        ? (data.campaigns as CampaignData[])
        : data.campaign
          ? [data.campaign as CampaignData]
          : [];
      setCampaigns(top);
      setCampaign(top[0] ?? null);
      setActiveCount(
        typeof data.activeCount === "number" ? data.activeCount : null,
      );
      setLastCampaignUpdate(
        typeof data.lastCampaignUpdate === "string"
          ? data.lastCampaignUpdate
          : null,
      );
    } catch {
      setCampaign(null);
      setCampaigns([]);
      setActiveCount(null);
      setLastCampaignUpdate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestOffer(preferences);
  }, [preferences, fetchBestOffer]);

  const contractEnd = new Date(preferences.contractEndDate);
  const readyToSwitch = daysUntil(contractEnd) <= 7;
  const ranked = campaigns.map((c) => ({ ...c, readyToSwitch }));

  return (
    <>
      <Header />
      <main>
        <Hero />
        <SignupSection preferences={preferences} />
        {campaign && (
          <SavingsBar />
        )}
        <PreferencesForm preferences={preferences} onChange={setPreferences} />
        <BestOfferCard
          campaigns={ranked}
          campaign={ranked[0] ?? null}
          loading={loading}
          activeCount={activeCount}
          lastCampaignUpdate={lastCampaignUpdate}
        />
        <EsimGuide />
        <KivraSection />
      </main>
      <Footer />
    </>
  );
}
