import { Resend } from "resend";
import { APP_URL, KIVRA_URL } from "./constants";
import { formatDate, formatSEK, getNetworkLabel } from "./campaigns";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM ?? "Bytesjakten <onboarding@resend.dev>";

function unsubscribeUrl(token: string): string {
  return `${APP_URL}/avregistrera?token=${token}`;
}

export function getEmailConfigStatus() {
  const fromEmail = FROM_EMAIL;
  const testModeOnly = fromEmail.includes("@resend.dev");

  return {
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    fromEmail,
    testModeOnly,
    note: !process.env.RESEND_API_KEY
      ? "RESEND_API_KEY saknas – inga mejl skickas."
      : testModeOnly
        ? "Testläge: med onboarding@resend.dev kan mejl bara skickas till e-postadressen du registrerade Resend med. Verifiera en egen domän för att skicka till alla användare."
        : "Mejl är konfigurerade för produktion.",
  };
}

type SwitchEmailParams = {
  email: string;
  operator: string;
  campaignName: string;
  campaignPrice: number;
  regularPrice: number;
  campaignUrl: string;
  contractEndDate: Date;
  network: string;
  unsubscribeToken: string;
};

export async function sendSwitchReminderEmail(
  params: SwitchEmailParams
): Promise<{ success: boolean; id?: string; error?: string }> {
  const {
    email,
    operator,
    campaignName,
    campaignPrice,
    regularPrice,
    campaignUrl,
    contractEndDate,
    network,
    unsubscribeToken,
  } = params;

  const subject = `Dags att byta mobilabonnemang – spara med ${operator}`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="color: #16a34a; font-size: 24px;">Hej från Bytesjakten!</h1>
      <p>Ditt nuvarande abonnemang går ut <strong>${formatDate(contractEndDate)}</strong>. 
      Nu är det dags att byta till ett kampanjpris utan bindningstid.</p>
      
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #15803d; text-transform: uppercase; letter-spacing: 0.05em;">Bästa erbjudande just nu</p>
        <h2 style="margin: 0 0 8px; font-size: 20px;">${campaignName}</h2>
        <p style="margin: 0; font-size: 28px; font-weight: bold; color: #16a34a;">${formatSEK(campaignPrice)} kr/mån</p>
        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">
          Nät: ${getNetworkLabel(network)} · Ingen bindningstid<br>
          Ordinarie pris därefter: ${formatSEK(regularPrice)} kr/mån
        </p>
      </div>

      <p style="margin: 24px 0;">
        <a href="${campaignUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Beställ kampanjen hos ${operator} →
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />

      <h3 style="font-size: 16px;">Tips: Samla dina mobilfakturor i Kivra</h3>
      <p style="color: #666; font-size: 14px;">
        När du byter operatör ofta kan det bli rörigt med fakturor. 
        Med Kivra får du alla mobilräkningar samlade på ett ställe.
      </p>
      <p>
        <a href="${KIVRA_URL}" style="color: #16a34a; font-weight: 600;">Skaffa Kivra gratis →</a>
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 32px;">
        Du får det här mejlet eftersom du registrerat dig på 
        <a href="${APP_URL}" style="color: #16a34a;">Bytesjakten</a>. 
        Tjänsten är alltid gratis.
        <br><a href="${unsubscribeUrl(unsubscribeToken)}" style="color: #999;">Avregistrera</a>
      </p>
    </div>
  `;

  if (!resend) {
    const message = "RESEND_API_KEY saknas – mejlet skickades inte.";
    console.error("[email]", message, email);
    if (process.env.NODE_ENV === "production") {
      return { success: false, error: message };
    }
    console.log("[email] Dev-läge – ämne:", subject);
    return { success: false, error: message };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend-fel:", error.message, "till:", email);
      return { success: false, error: error.message };
    }

    console.log("[email] Skickat till", email, "id:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    console.error("[email] Undantag:", message, "till:", email);
    return { success: false, error: message };
  }
}

export async function sendWelcomeEmail(
  email: string,
  contractEndDate: Date,
  unsubscribeToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    const message = "RESEND_API_KEY saknas – välkomstmejl skickades inte.";
    console.error("[email]", message, email);
    return { success: false, error: message };
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Välkommen till Bytesjakten – vi håller koll åt dig",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="color: #16a34a;">Välkommen!</h1>
        <p>Du är nu registrerad på Bytesjakten. Vi bevakar kampanjer utan bindningstid 
        och mejlar dig en vecka innan ditt abonnemang går ut (${formatDate(contractEndDate)}).</p>
        <p>Du behöver inte göra något mer – vi hörs när det är dags att byta.</p>
        <p style="color: #666; font-size: 14px;">Alltid gratis. 
        <a href="${unsubscribeUrl(unsubscribeToken)}">Avregistrera</a> när som helst.</p>
      </div>
    `,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
