import { ensureCampaignsSeeded } from "../src/lib/seed-campaigns";

async function main() {
  const result = await ensureCampaignsSeeded();
  console.log("Kampanjer seedade.");
}

main().catch(console.error);
