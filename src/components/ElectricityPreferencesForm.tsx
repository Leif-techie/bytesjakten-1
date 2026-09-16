"use client";

import {
  ELECTRICITY_BINDING_OPTIONS,
  ELECTRICITY_OPERATORS,
  ELECTRICITY_PRICE_TYPE_OPTIONS,
} from "@/lib/constants";

export type ElectricityPreferences = {
  priceTypePreference: string; // any|fixed|variable
  maxBindingMonths: number | null; // null = any
  currentOperator: string;
  contractEndDate: string;
};

type ElectricityPreferencesFormProps = {
  preferences: ElectricityPreferences;
  onChange: (prefs: ElectricityPreferences) => void;
};

function priceTypeLabel(value: string): string {
  return (
    ELECTRICITY_PRICE_TYPE_OPTIONS.find((opt) => opt.value === value)?.label ??
    value
  );
}

function bindingLabel(months: number | null): string {
  const opt = ELECTRICITY_BINDING_OPTIONS.find((o) => o.months === months);
  return opt?.label ?? (months == null ? "Spelar ingen roll" : `Max ${months} mån`);
}

function bindingSelectValue(months: number | null): string {
  const opt = ELECTRICITY_BINDING_OPTIONS.find((o) => o.months === months);
  return opt?.value ?? "any";
}

export function ElectricityPreferencesForm({
  preferences,
  onChange,
}: ElectricityPreferencesFormProps) {
  const update = (partial: Partial<ElectricityPreferences>) => {
    onChange({ ...preferences, ...partial });
  };

  return (
    <section className="border-y border-zinc-100 bg-zinc-50 px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PreferenceCard
          icon="💡"
          label="Pristyp"
          value={priceTypeLabel(preferences.priceTypePreference)}
        >
          <select
            value={preferences.priceTypePreference}
            onChange={(e) => update({ priceTypePreference: e.target.value })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {ELECTRICITY_PRICE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          icon="🔗"
          label="Max bindningstid"
          value={bindingLabel(preferences.maxBindingMonths)}
        >
          <select
            value={bindingSelectValue(preferences.maxBindingMonths)}
            onChange={(e) => {
              const opt = ELECTRICITY_BINDING_OPTIONS.find(
                (o) => o.value === e.target.value,
              );
              update({ maxBindingMonths: opt?.months ?? null });
            }}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {ELECTRICITY_BINDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </PreferenceCard>

        <PreferenceCard
          icon="⚡"
          label="Nuvarande elleverantör"
          value={preferences.currentOperator}
        >
          <select
            value={preferences.currentOperator}
            onChange={(e) => update({ currentOperator: e.target.value })}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {ELECTRICITY_OPERATORS.map((op) => (
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
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

export const defaultElectricityPreferences: ElectricityPreferences = {
  priceTypePreference: "any",
  maxBindingMonths: null,
  currentOperator: ELECTRICITY_OPERATORS[0],
  contractEndDate: defaultContractEnd(),
};
