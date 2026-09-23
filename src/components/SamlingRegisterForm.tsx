"use client";

import { useState } from "react";
import Link from "next/link";
import {
  OPERATORS,
  BROADBAND_OPERATORS,
  ELECTRICITY_OPERATORS,
  DATA_OPTIONS,
  BROADBAND_SPEED_OPTIONS,
  NETWORK_OPTIONS,
  BROADBAND_TECHNOLOGY_OPTIONS,
  ELECTRICITY_PRICE_TYPE_OPTIONS,
  ELECTRICITY_BINDING_OPTIONS,
} from "@/lib/constants";
import {
  SAMLING_SERVICE_OPTIONS,
  INSURANCE_SUBTYPES,
  INSPECTION_SUBTYPES,
  STREAMING_SUBTYPES,
  type SamlingServiceKey,
  type ReminderCategory,
} from "@/lib/samling-constants";
import { trackSignUp } from "@/lib/snap-pixel";

type ReminderDraft = {
  key: string;
  category: ReminderCategory;
  subtype: string;
  provider: string;
  renewalDate: string;
  objectLabel: string;
};

function emptyReminder(category: ReminderCategory): ReminderDraft {
  const subtype =
    category === "insurance"
      ? INSURANCE_SUBTYPES[0].value
      : category === "inspection"
        ? INSPECTION_SUBTYPES[0].value
        : STREAMING_SUBTYPES[0].value;
  return {
    key: `${category}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    category,
    subtype,
    provider: "",
    renewalDate: "",
    objectLabel: "",
  };
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-bj-line bg-white px-3 py-2.5 text-sm text-bj-ink focus:border-bj-ink focus:outline-none focus:ring-2 focus:ring-bj-ink/10";
const labelClass = "block text-sm font-medium text-bj-ink";

export function SamlingRegisterForm() {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<Set<SamlingServiceKey>>(new Set());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const [mobileOperator, setMobileOperator] = useState<string>(OPERATORS[0]);
  const [mobileEnd, setMobileEnd] = useState("");
  const [mobileData, setMobileData] = useState<number>(20);
  const [mobileNetwork, setMobileNetwork] = useState("any");
  const [mobileStudent, setMobileStudent] = useState(false);

  const [bbOperator, setBbOperator] = useState<string>(BROADBAND_OPERATORS[0]);
  const [bbEnd, setBbEnd] = useState("");
  const [bbSpeed, setBbSpeed] = useState<number>(100);
  const [bbTech, setBbTech] = useState("any");

  const [elOperator, setElOperator] = useState<string>(ELECTRICITY_OPERATORS[0]);
  const [elEnd, setElEnd] = useState("");
  const [elPrice, setElPrice] = useState("any");
  const [elBinding, setElBinding] = useState("any");

  const [reminders, setReminders] = useState<ReminderDraft[]>([]);

  function toggleService(key: SamlingServiceKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        if (key === "insurance" || key === "inspection" || key === "streaming") {
          setReminders((rows) => rows.filter((r) => r.category !== key));
        }
      } else {
        next.add(key);
        if (key === "insurance" || key === "inspection" || key === "streaming") {
          setReminders((rows) => [...rows, emptyReminder(key)]);
        }
      }
      return next;
    });
  }

  function updateReminder(key: string, patch: Partial<ReminderDraft>) {
    setReminders((rows) =>
      rows.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
  }

  function addReminder(category: ReminderCategory) {
    setReminders((rows) => [...rows, emptyReminder(category)]);
  }

  function removeReminder(key: string) {
    setReminders((rows) => rows.filter((r) => r.key !== key));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const services = Array.from(selected);
    if (services.length === 0) {
      setStatus("error");
      setMessage("Välj minst en tjänst.");
      return;
    }

    const bindingOpt = ELECTRICITY_BINDING_OPTIONS.find(
      (o) => o.value === elBinding,
    );

    const body = {
      email,
      services,
      mobile: selected.has("mobile")
        ? {
            currentOperator: mobileOperator,
            contractEndDate: mobileEnd,
            minDataGB: mobileData,
            networkPreference: mobileNetwork,
            isStudent: mobileStudent,
          }
        : undefined,
      broadband: selected.has("broadband")
        ? {
            currentOperator: bbOperator,
            contractEndDate: bbEnd,
            minSpeedMbps: bbSpeed,
            technology: bbTech,
          }
        : undefined,
      electricity: selected.has("electricity")
        ? {
            currentOperator: elOperator,
            contractEndDate: elEnd,
            priceTypePreference: elPrice,
            maxBindingMonths: bindingOpt?.months ?? null,
          }
        : undefined,
      reminders: reminders
        .filter((r) => selected.has(r.category))
        .map((r) => ({
          category: r.category,
          subtype: r.subtype,
          provider: r.provider,
          renewalDate: r.renewalDate || null,
          objectLabel: r.objectLabel || null,
        })),
    };

    try {
      const res = await fetch("/api/samling/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Något gick fel.");
        return;
      }
      setStatus("success");
      setMessage(data.message);
      trackSignUp({ vertical: "samling", email });
    } catch {
      setStatus("error");
      setMessage("Kunde inte ansluta. Försök igen.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10">
      <div>
        <label htmlFor="samling-email" className={labelClass}>
          E-post
        </label>
        <input
          id="samling-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.se"
          className={fieldClass}
        />
        <p className="mt-2 text-sm text-bj-muted">
          Inget konto – vi sparar bara mejl och dina påminnelser.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-[0.14em] text-bj-muted">
          Vilka tjänster vill du ha koll på?
        </legend>
        <ul className="mt-4 space-y-2">
          {SAMLING_SERVICE_OPTIONS.map((opt) => {
            const checked = selected.has(opt.key);
            return (
              <li key={opt.key}>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                    checked
                      ? "border-bj-ink bg-bj-soft/60"
                      : "border-bj-line bg-white hover:border-bj-ink/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleService(opt.key)}
                    className="mt-1 h-4 w-4 rounded border-bj-line text-bj-ink focus:ring-bj-ink/20"
                  />
                  <span>
                    <span className="block font-semibold text-bj-ink">
                      {opt.label}
                    </span>
                    <span className="block text-sm text-bj-muted">
                      {opt.description}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {selected.has("mobile") && (
        <section className="space-y-4 rounded-xl border border-bj-line bg-white p-5">
          <h2 className="text-lg font-bold text-bj-ink">Mobilabonnemang</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nuvarande operatör</label>
              <select
                value={mobileOperator}
                onChange={(e) => setMobileOperator(e.target.value)}
                className={fieldClass}
                required
              >
                {OPERATORS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Abonnemanget går ut</label>
              <input
                type="date"
                required
                value={mobileEnd}
                onChange={(e) => setMobileEnd(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Minsta data</label>
              <select
                value={mobileData}
                onChange={(e) => setMobileData(Number(e.target.value))}
                className={fieldClass}
              >
                {DATA_OPTIONS.map((gb) => (
                  <option key={gb} value={gb}>
                    {gb} GB
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Nätpreferens</label>
              <select
                value={mobileNetwork}
                onChange={(e) => setMobileNetwork(e.target.value)}
                className={fieldClass}
              >
                {NETWORK_OPTIONS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-bj-ink">
            <input
              type="checkbox"
              checked={mobileStudent}
              onChange={(e) => setMobileStudent(e.target.checked)}
              className="h-4 w-4 rounded border-bj-line"
            />
            Studentabonnemang
          </label>
        </section>
      )}

      {selected.has("broadband") && (
        <section className="space-y-4 rounded-xl border border-bj-line bg-white p-5">
          <h2 className="text-lg font-bold text-bj-ink">Mobilt bredband</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nuvarande operatör</label>
              <select
                value={bbOperator}
                onChange={(e) => setBbOperator(e.target.value)}
                className={fieldClass}
                required
              >
                {BROADBAND_OPERATORS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Avtalet går ut</label>
              <input
                type="date"
                required
                value={bbEnd}
                onChange={(e) => setBbEnd(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Önskad hastighet</label>
              <select
                value={bbSpeed}
                onChange={(e) => setBbSpeed(Number(e.target.value))}
                className={fieldClass}
              >
                {BROADBAND_SPEED_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} Mbit/s
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Teknik</label>
              <select
                value={bbTech}
                onChange={(e) => setBbTech(e.target.value)}
                className={fieldClass}
              >
                {BROADBAND_TECHNOLOGY_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {selected.has("electricity") && (
        <section className="space-y-4 rounded-xl border border-bj-line bg-white p-5">
          <h2 className="text-lg font-bold text-bj-ink">Elavtal</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nuvarande elleverantör</label>
              <select
                value={elOperator}
                onChange={(e) => setElOperator(e.target.value)}
                className={fieldClass}
                required
              >
                {ELECTRICITY_OPERATORS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Avtalet går ut</label>
              <input
                type="date"
                required
                value={elEnd}
                onChange={(e) => setElEnd(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pristyp</label>
              <select
                value={elPrice}
                onChange={(e) => setElPrice(e.target.value)}
                className={fieldClass}
              >
                {ELECTRICITY_PRICE_TYPE_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Max bindningstid</label>
              <select
                value={elBinding}
                onChange={(e) => setElBinding(e.target.value)}
                className={fieldClass}
              >
                {ELECTRICITY_BINDING_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {(["insurance", "inspection", "streaming"] as const).map((category) => {
        if (!selected.has(category)) return null;
        const title =
          category === "insurance"
            ? "Försäkring"
            : category === "inspection"
              ? "Besiktning"
              : "Streaming";
        const subtypes =
          category === "insurance"
            ? INSURANCE_SUBTYPES
            : category === "inspection"
              ? INSPECTION_SUBTYPES
              : STREAMING_SUBTYPES;
        const rows = reminders.filter((r) => r.category === category);

        return (
          <section
            key={category}
            className="space-y-4 rounded-xl border border-bj-line bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-bj-ink">{title}</h2>
              <button
                type="button"
                onClick={() => addReminder(category)}
                className="text-sm font-semibold text-bj-ink underline-offset-2 hover:underline"
              >
                + Lägg till
              </button>
            </div>
            {rows.map((row) => (
              <div
                key={row.key}
                className="grid gap-3 border-t border-bj-line pt-4 sm:grid-cols-2"
              >
                <div>
                  <label className={labelClass}>Typ</label>
                  <select
                    value={row.subtype}
                    onChange={(e) =>
                      updateReminder(row.key, { subtype: e.target.value })
                    }
                    className={fieldClass}
                  >
                    {subtypes.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                {category !== "streaming" && (
                  <div>
                    <label className={labelClass}>
                      {category === "insurance" ? "Bolag" : "Station / bolag"}
                    </label>
                    <input
                      type="text"
                      required
                      value={row.provider}
                      onChange={(e) =>
                        updateReminder(row.key, { provider: e.target.value })
                      }
                      placeholder={
                        category === "insurance" ? "t.ex. If" : "t.ex. Bilprovningen"
                      }
                      className={fieldClass}
                    />
                  </div>
                )}
                {category !== "streaming" && (
                  <div>
                    <label className={labelClass}>
                      {category === "insurance"
                        ? "Förnyelsedatum"
                        : "Nästa besiktning"}
                    </label>
                    <input
                      type="date"
                      required
                      value={row.renewalDate}
                      onChange={(e) =>
                        updateReminder(row.key, { renewalDate: e.target.value })
                      }
                      className={fieldClass}
                    />
                  </div>
                )}
                {category === "streaming" && (
                  <div>
                    <label className={labelClass}>
                      Påminnelsedatum (valfritt)
                    </label>
                    <input
                      type="date"
                      value={row.renewalDate}
                      onChange={(e) =>
                        updateReminder(row.key, { renewalDate: e.target.value })
                      }
                      className={fieldClass}
                    />
                  </div>
                )}
                {(category === "insurance" || category === "inspection") && (
                  <div>
                    <label className={labelClass}>
                      {category === "inspection"
                        ? "Regnr (valfritt)"
                        : "Objekt (valfritt)"}
                    </label>
                    <input
                      type="text"
                      value={row.objectLabel}
                      onChange={(e) =>
                        updateReminder(row.key, { objectLabel: e.target.value })
                      }
                      placeholder={
                        category === "inspection" ? "ABC123" : "t.ex. regnr / hund"
                      }
                      className={fieldClass}
                    />
                  </div>
                )}
                {rows.length > 1 && (
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => removeReminder(row.key)}
                      className="text-sm text-bj-muted hover:text-bj-ink hover:underline"
                    >
                      Ta bort rad
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        );
      })}

      <div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center rounded-md bg-bj-ink px-6 py-3.5 font-semibold text-background transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Sparar…" : "Spara påminnelser →"}
        </button>
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "error" ? "text-red-700" : "text-bj-ink"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-4 text-sm text-bj-muted">
          Genom att registrera dig godkänner du vår{" "}
          <Link href="/integritet" className="font-semibold text-bj-ink hover:underline">
            integritetspolicy
          </Link>
          . Avregistrera när som helst via länk i mejl.
        </p>
      </div>
    </form>
  );
}
