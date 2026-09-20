"use client";

import { useMemo, useState } from "react";

export type SamlingProfileItem =
  | {
      kind: "mobile" | "broadband" | "electricity";
      id: string;
      label: string;
      provider: string;
      endDate: string | null;
      detail: string;
      active: boolean;
      unsubscribeToken: string;
    }
  | {
      kind: "reminder";
      id: string;
      category: string;
      subtype: string;
      label: string;
      provider: string;
      endDate: string | null;
      detail: string;
      active: boolean;
      unsubscribeToken: string;
      objectLabel: string | null;
    };

export type SamlingEmailProfile = {
  email: string;
  items: SamlingProfileItem[];
};

type CampaignOption = {
  id: string;
  operator: string;
  name: string;
  campaignPrice: number;
};

type Props = {
  profiles: SamlingEmailProfile[];
  mobileCampaigns: CampaignOption[];
  broadbandCampaigns: CampaignOption[];
  electricityCampaigns: CampaignOption[];
  onAction: (
    action: string,
    extra?: Record<string, string>
  ) => Promise<void>;
  busyKey: string | null;
};

function daysUntil(date: string) {
  const end = new Date(date);
  const start = new Date();
  end.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function isDueWithin10Days(date: string | null) {
  if (!date) return false;
  const days = daysUntil(date);
  return days >= 0 && days <= 10;
}

function kindBadge(kind: SamlingProfileItem["kind"]) {
  if (kind === "mobile") {
    return { label: "Mobil", className: "bg-emerald-50 text-emerald-800" };
  }
  if (kind === "broadband") {
    return {
      label: "Mobilt bredband",
      className: "bg-orange-50 text-orange-800",
    };
  }
  if (kind === "electricity") {
    return { label: "Elavtal", className: "bg-blue-50 text-blue-800" };
  }
  return { label: "Påminnelse", className: "bg-violet-50 text-violet-800" };
}

function itemKey(item: SamlingProfileItem) {
  return `${item.kind}:${item.id}`;
}

export function AdminSamlingSection({
  profiles,
  mobileCampaigns,
  broadbandCampaigns,
  electricityCampaigns,
  onAction,
  busyKey,
}: Props) {
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [primaryChoice, setPrimaryChoice] = useState<Record<string, string>>(
    {}
  );
  const [campaignChoice, setCampaignChoice] = useState<Record<string, string>>(
    {}
  );

  const dueSoon = useMemo(() => {
    const rows: {
      email: string;
      item: SamlingProfileItem;
      days: number;
    }[] = [];
    for (const profile of profiles) {
      for (const item of profile.items) {
        if (!item.active || !item.endDate || !isDueWithin10Days(item.endDate)) {
          continue;
        }
        rows.push({
          email: profile.email,
          item,
          days: daysUntil(item.endDate),
        });
      }
    }
    return rows.sort((a, b) => a.days - b.days);
  }, [profiles]);

  function campaignsForKind(kind: SamlingProfileItem["kind"]) {
    if (kind === "mobile") return mobileCampaigns;
    if (kind === "broadband") return broadbandCampaigns;
    if (kind === "electricity") return electricityCampaigns;
    return [];
  }

  function priceUnit(kind: SamlingProfileItem["kind"]) {
    return kind === "electricity" ? "öre/kWh" : "kr";
  }

  async function sendForProfile(profile: SamlingEmailProfile) {
    const primaryKey =
      primaryChoice[profile.email] ??
      itemKey(profile.items.find((i) => i.active) ?? profile.items[0]);
    const [kind, id] = primaryKey.split(":");
    if (!kind || !id) return;

    const needsCampaign =
      kind === "mobile" || kind === "broadband" || kind === "electricity";
    const campaignId = campaignChoice[profile.email] ?? "";
    if (needsCampaign && !campaignId) {
      return;
    }

    await onAction("send_samling_email", {
      email: profile.email,
      primaryKind: kind,
      primaryId: id,
      ...(campaignId ? { campaignId } : {}),
    });
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold">Samlingsvy – e-postprofiler</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Alla tjänster per e-postadress (mobil, bredband, elavtal och
        påminnelser). Skicka samlingsmejl, avregistrera eller ta bort hela
        profilen.
      </p>

      <div className="mt-6">
        <h3 className="text-base font-semibold text-amber-900">
          Snart (inom 10 dagar) ({dueSoon.length})
        </h3>
        {dueSoon.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-400">
            Inga aktiva tjänster i det här fönstret.
          </p>
        ) : (
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-zinc-500">
                <th className="py-2 pr-4">Typ</th>
                <th className="py-2 pr-4">E-post</th>
                <th className="py-2 pr-4">Tjänst</th>
                <th className="py-2 pr-4">Provider</th>
                <th className="py-2">Datum</th>
              </tr>
            </thead>
            <tbody>
              {dueSoon.map(({ email, item, days }) => {
                const badge = kindBadge(item.kind);
                return (
                  <tr
                    key={`${email}-${itemKey(item)}`}
                    className="border-b border-zinc-100 bg-amber-50"
                  >
                    <td className="py-2 pr-4">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-2 pr-4 font-medium">{email}</td>
                    <td className="py-2 pr-4">{item.label}</td>
                    <td className="py-2 pr-4">
                      {item.provider}
                      {item.detail ? (
                        <span className="text-zinc-500"> · {item.detail}</span>
                      ) : null}
                    </td>
                    <td className="py-2">
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("sv-SE")
                        : "–"}
                      <span className="ml-2 inline-block rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">
                        {days === 0
                          ? "I dag"
                          : days === 1
                            ? "1 dag kvar"
                            : `${days} dagar kvar`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="text-base font-semibold">
          Profiler ({profiles.length})
        </h3>
        {profiles.length === 0 ? (
          <p className="text-sm text-zinc-400">Inga registrerade e-poster ännu.</p>
        ) : (
          profiles.map((profile) => {
            const open = expandedEmail === profile.email;
            const activeItems = profile.items.filter((i) => i.active);
            const defaultPrimary =
              primaryChoice[profile.email] ??
              (activeItems[0] ? itemKey(activeItems[0]) : "");
            const [selectedKind] = defaultPrimary.split(":") as [
              SamlingProfileItem["kind"] | "",
              string?
            ];
            const selectable = selectedKind
              ? campaignsForKind(selectedKind)
              : [];
            const needsCampaign =
              selectedKind === "mobile" ||
              selectedKind === "broadband" ||
              selectedKind === "electricity";

            return (
              <div
                key={profile.email}
                className="rounded-xl border border-zinc-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedEmail(open ? null : profile.email)
                  }
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <div>
                    <p className="font-medium">{profile.email}</p>
                    <p className="text-xs text-zinc-500">
                      {activeItems.length} aktiva ·{" "}
                      {profile.items.length - activeItems.length} avregistrerade
                    </p>
                  </div>
                  <span className="text-sm text-zinc-400">
                    {open ? "Dölj" : "Visa"}
                  </span>
                </button>

                {open && (
                  <div className="border-t border-zinc-100 px-4 py-4">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-zinc-500">
                          <th className="py-2 pr-3">Typ</th>
                          <th className="py-2 pr-3">Tjänst</th>
                          <th className="py-2 pr-3">Detalj</th>
                          <th className="py-2 pr-3">Datum</th>
                          <th className="py-2">Åtgärder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profile.items.map((item) => {
                          const badge = kindBadge(item.kind);
                          const key = itemKey(item);
                          return (
                            <tr
                              key={key}
                              className={`border-b border-zinc-50 ${
                                !item.active ? "bg-zinc-50" : ""
                              }`}
                            >
                              <td className="py-2 pr-3">
                                <span
                                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                                >
                                  {badge.label}
                                </span>
                              </td>
                              <td className="py-2 pr-3">
                                <span
                                  className={
                                    !item.active
                                      ? "text-zinc-500 line-through"
                                      : undefined
                                  }
                                >
                                  {item.label}
                                </span>
                                {!item.active && (
                                  <span className="ml-2 text-xs text-zinc-500">
                                    Avregistrerad
                                  </span>
                                )}
                              </td>
                              <td className="py-2 pr-3 text-zinc-600">
                                {item.provider}
                                {item.detail ? ` · ${item.detail}` : ""}
                                {item.kind === "reminder" && item.objectLabel
                                  ? ` · ${item.objectLabel}`
                                  : ""}
                              </td>
                              <td className="py-2 pr-3 whitespace-nowrap">
                                {item.endDate
                                  ? new Date(item.endDate).toLocaleDateString(
                                      "sv-SE"
                                    )
                                  : "–"}
                              </td>
                              <td className="py-2">
                                {item.kind === "reminder" && (
                                  <div className="flex flex-wrap gap-2">
                                    {item.active && (
                                      <button
                                        type="button"
                                        disabled={busyKey === `unsub:${item.id}`}
                                        onClick={() =>
                                          onAction("unsubscribe_reminder", {
                                            reminderId: item.id,
                                          })
                                        }
                                        className="text-xs font-medium text-zinc-600 hover:underline disabled:opacity-50"
                                      >
                                        Avregistrera
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      disabled={busyKey === `del:${item.id}`}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `Ta bort påminnelsen ${item.label}?`
                                          )
                                        ) {
                                          onAction("delete_reminder", {
                                            reminderId: item.id,
                                          });
                                        }
                                      }}
                                      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                                    >
                                      Ta bort
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-zinc-100 pt-4">
                      <label className="text-sm">
                        <span className="mb-1 block text-xs text-zinc-500">
                          Primär tjänst i mejlet
                        </span>
                        <select
                          value={defaultPrimary}
                          onChange={(e) =>
                            setPrimaryChoice((prev) => ({
                              ...prev,
                              [profile.email]: e.target.value,
                            }))
                          }
                          className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
                        >
                          {activeItems.length === 0 ? (
                            <option value="">Inga aktiva tjänster</option>
                          ) : (
                            activeItems.map((item) => (
                              <option key={itemKey(item)} value={itemKey(item)}>
                                {item.label} · {item.provider}
                              </option>
                            ))
                          )}
                        </select>
                      </label>

                      {needsCampaign && (
                        <label className="text-sm">
                          <span className="mb-1 block text-xs text-zinc-500">
                            Erbjudande
                          </span>
                          <select
                            value={campaignChoice[profile.email] ?? ""}
                            onChange={(e) =>
                              setCampaignChoice((prev) => ({
                                ...prev,
                                [profile.email]: e.target.value,
                              }))
                            }
                            className="max-w-[240px] rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
                          >
                            <option value="">Välj kampanj</option>
                            {selectable.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.operator} – {c.name} ({c.campaignPrice}{" "}
                                {priceUnit(selectedKind)})
                              </option>
                            ))}
                          </select>
                        </label>
                      )}

                      <button
                        type="button"
                        disabled={
                          busyKey === `send:${profile.email}` ||
                          activeItems.length === 0 ||
                          (needsCampaign &&
                            !(campaignChoice[profile.email] ?? ""))
                        }
                        onClick={() => sendForProfile(profile)}
                        className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                      >
                        {busyKey === `send:${profile.email}`
                          ? "Skickar..."
                          : "Skicka samlingsmejl"}
                      </button>

                      <button
                        type="button"
                        disabled={busyKey === `off:${profile.email}`}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Avregistrera alla tjänster för ${profile.email}?`
                            )
                          ) {
                            onAction("deactivate_all_for_email", {
                              email: profile.email,
                            });
                          }
                        }}
                        className="text-xs font-medium text-zinc-600 hover:underline disabled:opacity-50"
                      >
                        Avregistrera allt
                      </button>

                      <button
                        type="button"
                        disabled={busyKey === `wipe:${profile.email}`}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Ta bort ALLA data för ${profile.email}? Detta går inte att ångra.`
                            )
                          ) {
                            onAction("delete_all_for_email", {
                              email: profile.email,
                            });
                          }
                        }}
                        className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        Ta bort profil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
