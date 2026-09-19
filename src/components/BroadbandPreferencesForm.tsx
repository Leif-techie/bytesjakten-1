"use client";

import {
  BROADBAND_OPERATORS,
  BROADBAND_SPEED_OPTIONS,
  BROADBAND_TECHNOLOGY_OPTIONS,
} from "@/lib/constants";

export type BroadbandPreferences = {
  minSpeedMbps: number;
  technology: string;
  currentOperator: string;
  contractEndDate: string;
};

type BroadbandPreferencesFormProps = {
  preferences: BroadbandPreferences;
  onChange: (prefs: BroadbandPreferences) => void;
};

function technologyLabel(value: string): string {
  return (
    BROADBAND_TECHNOLOGY_OPTIONS.find((opt) => opt.value === value)?.label ??
    value
  );
}

export function BroadbandPreferencesForm({
  preferences,
  onChange,
}: BroadbandPreferencesFormProps) {
  const update = (partial: Partial<BroadbandPreferences>) => {
    onChange({ ...preferences, ...partial });
  };

  return (
    <section className="border-y border-bj-line bg-bj-soft/40 px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PreferenceCard
          label="Önskad hastighet"
          value={`${preferences.minSpeedMbps} Mbit/s`}
        >
          <select
            value={preferences.minSpeedMbps}
            onChange={(e) => update({ minSpeedMbps: Number(e.target.value) })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            {BROADBAND_SPEED_OPTIONS.map((speed) => (
              <option key={speed} value={speed}>
                {speed} Mbit/s
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          label="Nät"
          value={technologyLabel(preferences.technology)}
        >
          <select
            value={preferences.technology}
            onChange={(e) => update({ technology: e.target.value })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            {BROADBAND_TECHNOLOGY_OPTIONS.map((opt) => (
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
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          >
            {BROADBAND_OPERATORS.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          label="Avtalet tar slut"
          value={preferences.contractEndDate}
        >
          <input
            type="date"
            value={preferences.contractEndDate}
            onChange={(e) => update({ contractEndDate: e.target.value })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
          />
        </PreferenceCard>
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
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-bj-line bg-white p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-bj-muted">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-bj-ink">{value}</p>
      </div>
      {children}
    </div>
  );
}

function defaultContractEnd(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().slice(0, 10);
}

export const defaultBroadbandPreferences: BroadbandPreferences = {
  minSpeedMbps: 100,
  technology: "5g",
  currentOperator: BROADBAND_OPERATORS[0],
  contractEndDate: defaultContractEnd(),
};
