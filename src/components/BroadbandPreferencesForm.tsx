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
    <section className="border-y border-zinc-100 bg-zinc-50 px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PreferenceCard
          icon="⚡"
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
          icon="🔌"
          label="Teknik"
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
          icon="🏠"
          label="Nuvarande leverantör"
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
          icon="📅"
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
  icon,
  label,
  value,
  children,
}: {
  icon: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span aria-hidden>{icon}</span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </p>
          <p className="text-sm font-semibold text-zinc-900">{value}</p>
        </div>
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
  minSpeedMbps: 250,
  technology: "any",
  currentOperator: BROADBAND_OPERATORS[0],
  contractEndDate: defaultContractEnd(),
};
