import "dotenv/config";
import { updateCampaigns } from "../src/lib/seed-campaigns";

async function main() {
  console.log("[cron] Uppdaterar kampanjer (inga automatiska mejl)...");
  const campaigns = await updateCampaigns();
  console.log("[cron] Kampanjer:", campaigns);
  console.log("[cron] Klart! (mejlutskick sker manuellt via /admin)");
}

main()
  .catch((err) => {
    console.error("[cron] Fel:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
