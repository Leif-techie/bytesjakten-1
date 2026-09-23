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
    <section className="border-y border-bj-line bg-bj-soft/40 px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <PreferenceCard
          label="Minsta data/mån"
          value={`${preferences.minDataGB} GB`}
        >
          <select
            value={preferences.minDataGB}
            onChange={(e) => update({ minDataGB: Number(e.target.value) })}
            className="mt-2 w-full rounded-lg border border-bj-line bg-white px-3 py-2 text-sm"
          >
            {DATA_OPTIONS.map((gb) => (
              <option key={gb} value={gb}>
                {gb} GB
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          label="Mobilnät"
          value={getNetworkLabel(preferences.networkPreference)}
        >
          <select
            value={preferences.networkPreference}
            onChange={(e) => update({ networkPreference: e.target.value })}
            className="mt-2 w-full rounded-lg border border-bj-line bg-white px-3 py-2 text-sm"
          >
            {NETWORK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          label="Nuvarande operatör"
          value={preferences.currentOperator}
        >
          <select
            value={preferences.currentOperator}
            onChange={(e) => update({ currentOperator: e.target.value })}
            className="mt-2 w-full rounded-lg border border-bj-line bg-white px-3 py-2 text-sm"
          >
            {OPERATORS.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          label="Nuvarande tar slut"
          value={preferences.contractEndDate}
        >
          <input
            type="date"
            value={preferences.contractEndDate}
            onChange={(e) => update({ contractEndDate: e.target.value })}
            className="mt-2 w-full rounded-lg border border-bj-line bg-white px-3 py-2 text-sm"
          />
        </PreferenceCard>

        <div className="flex flex-col justify-center self-stretch rounded-lg border border-bj-line bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-bj-muted">
            Studentabonnemang
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update({ isStudent: true })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                preferences.isStudent
                  ? "border-bj-mobile bg-bj-mobile text-bj-ink"
                  : "border-bj-line bg-white text-bj-muted hover:bg-bj-soft"
              }`}
            >
              Ja
            </button>
            <button
              type="button"
              onClick={() => update({ isStudent: false })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                !preferences.isStudent
                  ? "border-bj-mobile bg-bj-mobile text-bj-ink"
                  : "border-bj-line bg-white text-bj-muted hover:bg-bj-soft"
              }`}
            >
              Nej
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreferenceCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-bj-line bg-white p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-bj-muted">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-bj-ink">{value}</p>
        {children}
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
