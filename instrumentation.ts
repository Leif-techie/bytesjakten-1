export async function register() {
  if (process.env.NODE_ENV === "production" && !process.env.ENABLE_LOCAL_CRON) {
    return;
  }

  const cron = await import("node-cron");
  const { CRON_TIMEZONE } = await import("@/lib/constants");

  const secret = process.env.CRON_SECRET ?? "dev-secret-change-me";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  cron.default.schedule(
    "0 7 * * *",
    async () => {
      console.log("[cron] Kör daglig uppdatering kl 07:00...");
      try {
        const res = await fetch(`${baseUrl}/api/cron`, {
          method: "POST",
          headers: { Authorization: `Bearer ${secret}` },
        });
        const data = await res.json();
        console.log("[cron] Klart:", data);
      } catch (error) {
        console.error("[cron] Fel:", error);
      }
    },
    { timezone: CRON_TIMEZONE }
  );

  console.log("[cron] Schemalagd: kampanjuppdatering + mejl kl 07:00 (Europe/Stockholm)");
}
