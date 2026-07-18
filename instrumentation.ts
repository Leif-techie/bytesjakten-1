export async function register() {
  // Mejl skickas manuellt via admin – ingen lokal cron för utskick.
  // Kampanjutskick/uppdatering körs vid behov från adminpanelen.
  if (process.env.ENABLE_LOCAL_CRON !== "true") {
    return;
  }

  console.log(
    "[cron] ENABLE_LOCAL_CRON är satt, men automatiska mejl är avstängda. Använd adminpanelen."
  );
}
