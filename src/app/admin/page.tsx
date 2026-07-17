"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { OPERATORS, DATA_OPTIONS, NETWORK_OPTIONS } from "@/lib/constants";

type Stats = {
  userCount: number;
  activeUsers: number;
  campaignCount: number;
  activeCampaigns: number;
  recentNotifications: number;
  lastCampaignUpdate: string | null;
};

type Campaign = {
  id: string;
  operator: string;
  name: string;
  dataGB: number;
  campaignPrice: number;
  regularPrice: number;
  campaignStart: string;
  campaignEnd: string;
  url: string;
  network: string;
  active: boolean;
};

type User = {
  id: string;
  email: string;
  currentOperator: string;
  contractEndDate: string;
  minDataGB: number;
  notificationCount: number;
  lastNotificationAt: string | null;
  lastCampaignOperator: string | null;
  lastCampaignName: string | null;
};

type NotificationEntry = {
  id: string;
  type: string;
  sentAt: string;
  email: string;
  currentOperator: string;
  campaignOperator: string | null;
  campaignName: string | null;
  campaignPrice: number | null;
};

type EmailConfig = {
  resendConfigured: boolean;
  fromEmail: string;
  testModeOnly: boolean;
  note: string;
};

const NOTIFICATION_LABELS: Record<string, string> = {
  switch_reminder: "Påminnelse om byte",
};

function daysUntil(date: string) {
  const ms = new Date(date).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function getMailStatus(user: User) {
  if (user.lastNotificationAt) {
    return {
      label: "Mejl skickat",
      className: "bg-emerald-100 text-emerald-700",
    };
  }

  const days = daysUntil(user.contractEndDate);
  if (days >= 6 && days <= 8) {
    return {
      label: "Bör få mejl nu",
      className: "bg-amber-100 text-amber-800",
    };
  }

  if (days > 8) {
    return {
      label: `Mejl om ${days - 7} dagar`,
      className: "bg-zinc-100 text-zinc-600",
    };
  }

  return {
    label: "Fönster passerat",
    className: "bg-zinc-100 text-zinc-500",
  };
}

const emptyCampaign = {
  operator: "Hallon",
  name: "",
  dataGB: 25,
  campaignPrice: 49,
  regularPrice: 199,
  campaignStart: new Date().toISOString().slice(0, 10),
  campaignEnd: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  url: "",
  network: "any",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [newCampaign, setNewCampaign] = useState(emptyCampaign);

  const loadData = useCallback(async () => {
    const res = await fetch("/api/admin");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setAuthed(true);
    setStats(data.stats);
    setCampaigns(data.campaigns);
    setUsers(data.users);
    setNotifications(data.notifications ?? []);
    setEmailConfig(data.emailConfig ?? null);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Fel lösenord.");
      return;
    }
    setAuthed(true);
    loadData();
  }

  async function runAction(action: string, extra?: Record<string, string>) {
    setMessage("");
    setMessageIsError(false);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();

    if (action === "run_notifications" && data.result) {
      const { sent, skipped, failures } = data.result;
      if (failures?.length) {
        setMessageIsError(true);
        setMessage(
          `Skickade ${sent} mejl. ${failures.length} misslyckades: ${failures
            .map((f: { email: string; error: string }) => `${f.email} (${f.error})`)
            .join("; ")}`
        );
      } else if (sent === 0) {
        setMessage(`Inga mejl skickades (${skipped} hoppades över – t.ex. fel tidsfönster eller redan skickat).`);
      } else {
        setMessage(`Skickade ${sent} mejl.`);
      }
    } else if (action === "test_email") {
      if (data.success) {
        setMessage("Testmejl skickat! Kolla inkorgen (och skräppost).");
      } else {
        setMessageIsError(true);
        setMessage(data.error ?? "Testmejl misslyckades.");
      }
    } else {
      setMessage(res.ok ? "Klart!" : data.error ?? "Fel");
      setMessageIsError(!res.ok);
    }

    if (res.ok) loadData();
  }

  async function addCampaign(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCampaign),
    });
    const data = await res.json();
    setMessage(res.ok ? "Kampanj tillagd!" : data.error ?? "Fel");
    if (res.ok) {
      setNewCampaign(emptyCampaign);
      loadData();
    }
  }

  async function deleteCampaign(id: string) {
    const res = await fetch(`/api/admin/campaigns?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessageIsError(true);
      setMessage(data.error ?? "Kunde inte ta bort kampanjen.");
      return;
    }
    setMessageIsError(false);
    setMessage("Kampanj borttagen.");
    loadData();
  }

  if (authed === null) {
    return (
      <>
        <Header />
        <p className="py-20 text-center text-zinc-500">Laddar...</p>
      </>
    );
  }

  if (!authed) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-sm px-4 py-20">
          <h1 className="text-2xl font-bold">Admin</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Admin-lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-4 py-3"
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white"
            >
              Logga in
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin – Bytesjakten</h1>
          <button
            onClick={() => fetch("/api/admin/login", { method: "DELETE" }).then(() => setAuthed(false))}
            className="text-sm text-zinc-500 hover:text-zinc-700"
          >
            Logga ut
          </button>
        </div>

        {message && (
          <p
            className={`mt-4 rounded-lg px-4 py-2 ${
              messageIsError
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </p>
        )}

        {emailConfig && (!emailConfig.resendConfigured || emailConfig.testModeOnly) && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-semibold">Mejlkonfiguration</p>
            <p className="mt-1">{emailConfig.note}</p>
            <p className="mt-2 text-xs text-amber-800">
              Avsändare: {emailConfig.fromEmail}
              {!emailConfig.resendConfigured && " · Lägg till RESEND_API_KEY i Render → Environment"}
              {emailConfig.testModeOnly && " · Verifiera domän på resend.com/domains och sätt EMAIL_FROM"}
            </p>
          </div>
        )}

        {stats && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Registrerade", stats.activeUsers],
              ["Kampanjer aktiva", stats.activeCampaigns],
              ["Mejl (7 dagar)", stats.recentNotifications],
              [
                "Senaste uppdatering",
                stats.lastCampaignUpdate
                  ? new Date(stats.lastCampaignUpdate).toLocaleString("sv-SE")
                  : "Aldrig",
              ],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-xs uppercase text-zinc-400">{label}</p>
                <p className="mt-1 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => runAction("refresh_campaigns")}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            Uppdatera kampanjer
          </button>
          <button
            onClick={() => runAction("run_notifications")}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
          >
            Kör mejlutskick nu
          </button>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="test@epost.se"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <button
              onClick={() => runAction("test_email", { email: testEmail })}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
            >
              Skicka testmejl
            </button>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold">Lägg till kampanj</h2>
          <form onSubmit={addCampaign} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <select
              value={newCampaign.operator}
              onChange={(e) => setNewCampaign({ ...newCampaign, operator: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              {OPERATORS.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            <input
              placeholder="Namn (t.ex. Hallon – 25 GB)"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
            <select
              value={newCampaign.dataGB}
              onChange={(e) => setNewCampaign({ ...newCampaign, dataGB: Number(e.target.value) })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              {DATA_OPTIONS.map((gb) => (
                <option key={gb} value={gb}>{gb} GB</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Kampanjpris kr/mån"
              value={newCampaign.campaignPrice}
              onChange={(e) => setNewCampaign({ ...newCampaign, campaignPrice: Number(e.target.value) })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Ordinarie pris kr/mån"
              value={newCampaign.regularPrice}
              onChange={(e) => setNewCampaign({ ...newCampaign, regularPrice: Number(e.target.value) })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
            <input
              type="url"
              placeholder="https://..."
              value={newCampaign.url}
              onChange={(e) => setNewCampaign({ ...newCampaign, url: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              required
            />
            <input
              type="date"
              value={newCampaign.campaignStart}
              onChange={(e) => setNewCampaign({ ...newCampaign, campaignStart: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
            <input
              type="date"
              value={newCampaign.campaignEnd}
              onChange={(e) => setNewCampaign({ ...newCampaign, campaignEnd: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
            <select
              value={newCampaign.network}
              onChange={(e) => setNewCampaign({ ...newCampaign, network: e.target.value })}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              {NETWORK_OPTIONS.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
            <button type="submit" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
              Lägg till
            </button>
          </form>
        </section>

        <section className="mt-10 overflow-x-auto">
          <h2 className="text-lg font-bold">Kampanjer ({campaigns.length})</h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-zinc-500">
                <th className="py-2 pr-4">Operatör</th>
                <th className="py-2 pr-4">Namn</th>
                <th className="py-2 pr-4">Pris</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100">
                  <td className="py-2 pr-4">{c.operator}</td>
                  <td className="py-2 pr-4">{c.name}</td>
                  <td className="py-2 pr-4">{c.campaignPrice} kr</td>
                  <td className="py-2 pr-4">
                    <span className={c.active ? "text-emerald-600" : "text-zinc-400"}>
                      {c.active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => deleteCampaign(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-10 overflow-x-auto">
          <h2 className="text-lg font-bold">Aktiva användare ({users.length})</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Mejl skickas automatiskt 6–8 dagar före slutdatum, med kampanj hos annat telebolag.
          </p>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-zinc-500">
                <th className="py-2 pr-4">E-post</th>
                <th className="py-2 pr-4">Operatör</th>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Slutdatum</th>
                <th className="py-2 pr-4">Mejlstatus</th>
                <th className="py-2 pr-4">Senaste kampanj i mejl</th>
                <th className="py-2">Antal mejl</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const status = getMailStatus(u);
                return (
                  <tr key={u.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">{u.currentOperator}</td>
                    <td className="py-2 pr-4">{u.minDataGB} GB</td>
                    <td className="py-2 pr-4">
                      {new Date(u.contractEndDate).toLocaleDateString("sv-SE")}
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                      {u.lastNotificationAt && (
                        <p className="mt-1 text-xs text-zinc-400">
                          {new Date(u.lastNotificationAt).toLocaleString("sv-SE")}
                        </p>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      {u.lastCampaignName ? (
                        <>
                          <p className="font-medium">{u.lastCampaignOperator}</p>
                          <p className="text-xs text-zinc-500">{u.lastCampaignName}</p>
                        </>
                      ) : (
                        <span className="text-zinc-400">–</span>
                      )}
                    </td>
                    <td className="py-2">{u.notificationCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-10 overflow-x-auto">
          <h2 className="text-lg font-bold">Mejlhistorik ({notifications.length})</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Senaste skickade mejl med kampanj hos annat telebolag.
          </p>
          {notifications.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-400">Inga mejl har skickats ännu.</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b text-zinc-500">
                  <th className="py-2 pr-4">Skickat</th>
                  <th className="py-2 pr-4">E-post</th>
                  <th className="py-2 pr-4">Nuvarande operatör</th>
                  <th className="py-2 pr-4">Typ</th>
                  <th className="py-2">Kampanj i mejlet</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(n.sentAt).toLocaleString("sv-SE")}
                    </td>
                    <td className="py-2 pr-4">{n.email}</td>
                    <td className="py-2 pr-4">{n.currentOperator}</td>
                    <td className="py-2 pr-4">
                      {NOTIFICATION_LABELS[n.type] ?? n.type}
                    </td>
                    <td className="py-2">
                      {n.campaignName ? (
                        <>
                          <p className="font-medium">{n.campaignOperator}</p>
                          <p className="text-xs text-zinc-500">
                            {n.campaignName}
                            {n.campaignPrice != null ? ` · ${n.campaignPrice} kr/mån` : ""}
                          </p>
                        </>
                      ) : (
                        <span className="text-zinc-400">–</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}
