"use client";

import { DATA_OPTIONS, NETWORK_OPTIONS, OPERATORS } from "@/lib/constants";
import { getNetworkLabel } from "@/lib/campaigns";

export type UserPreferences = {
  minDataGB: number;
  networkPreference: string;
  currentOperator: string;
  contractEndDate: string;
  isStudent: boolean;
};

type PreferencesFormProps = {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
};

export function PreferencesForm({ preferences, onChange }: PreferencesFormProps) {
  const update = (partial: Partial<UserPreferences>) => {
    onChange({ ...preferences, ...partial });
  };

  return (
    <section className="border-y border-zinc-100 bg-zinc-50 px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <PreferenceCard
          icon="📱"
          label="Minsta data/mån"
          value={`${preferences.minDataGB} GB`}
        >
          <select
            value={preferences.minDataGB}
            onChange={(e) => update({ minDataGB: Number(e.target.value) })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            {DATA_OPTIONS.map((gb) => (
              <option key={gb} value={gb}>
                {gb} GB
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          icon="📶"
          label="Mobilnät"
          value={getNetworkLabel(preferences.networkPreference)}
        >
          <select
            value={preferences.networkPreference}
            onChange={(e) => update({ networkPreference: e.target.value })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            {NETWORK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          icon="👤"
          label="Nuvarande operatör"
          value={preferences.currentOperator}
        >
          <select
            value={preferences.currentOperator}
            onChange={(e) => update({ currentOperator: e.target.value })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            {OPERATORS.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          icon="📅"
          label="Nuvarande tar slut"
          value={preferences.contractEndDate}
        >
          <input
            type="date"
            value={preferences.contractEndDate}
            onChange={(e) => update({ contractEndDate: e.target.value })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          />
        </PreferenceCard>

        <PreferenceCard
          icon="🎯"
          label="Studentabonnemang"
          value={preferences.isStudent ? "Ja" : "Nej"}
        >
          <label className="mt-2 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.isStudent}
              onChange={(e) => update({ isStudent: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-700">Visa studentpriser</span>
          </label>
        </PreferenceCard>
      </div>
    </section>
  );
}

function PreferenceCard({
  icon,
  label,
  value,
  children,
}: {
  icon: string;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
          <p className="mt-0.5 truncate font-semibold text-zinc-900">{value}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export const defaultPreferences: UserPreferences = {
  minDataGB: 25,
  networkPreference: "any",
  currentOperator: "Telia",
  contractEndDate: "2026-08-31",
  isStudent: false,
};
