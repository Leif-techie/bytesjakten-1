import "dotenv/config";
import { updateCampaigns } from "../src/lib/seed-campaigns";
import { processUserNotifications } from "../src/lib/notifications";

async function main() {
  console.log("[cron] Startar daglig körning...");
  const campaigns = await updateCampaigns();
  console.log("[cron] Kampanjer:", campaigns);

  const notifications = await processUserNotifications();
  console.log("[cron] Mejl:", notifications);

  console.log("[cron] Klart!");
}

main()
  .catch((err) => {
    console.error("[cron] Fel:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
