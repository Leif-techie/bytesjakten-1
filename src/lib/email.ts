import { APP_URL, KIVRA_URL } from "./constants";
import { formatDate, formatSEK, getNetworkLabel } from "./campaigns";
import { ESIM_GUIDE_STEPS } from "./esim-guide";

const MAILEROO_API_URL = "https://smtp.maileroo.com/api/v2/emails";
const API_KEY = process.env.MAILEROO_API_KEY?.trim() || "";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Bytesjakten <hej@bytesjakten.se>";

function unsubscribeUrl(token: string): string {
  return `${APP_URL}/avregistrera?token=${token}`;
}

function switchCompleteUrl(token: string, operator?: string): string {
  const url = new URL(`${APP_URL}/byte-klart`);
  url.searchParams.set("token", token);
  if (operator) {
    url.searchParams.set("operator", operator);
  }
  return url.toString();
}

function esimGuideUrl(): string {
  return `${APP_URL}/#esim`;
}

function parseFromAddress(raw: string): { address: string; display_name?: string } {
  const match = raw.match(/^(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    const displayName = match[1].replace(/^["']|["']$/g, "").trim();
    return {
      address: match[2].trim(),
      ...(displayName ? { display_name: displayName } : {}),
    };
  }
  return { address: raw.trim() };
}

function htmlToPlain(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderEsimGuideHtml(): string {
  const steps = ESIM_GUIDE_STEPS.map(
    (step, index) => `
      <tr>
        <td style="vertical-align: top; padding: 0 12px 14px 0; width: 28px;">
          <span style="display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center; border-radius: 999px; background: #16a34a; color: #fff; font-size: 12px; font-weight: 700;">${index + 1}</span>
        </td>
        <td style="padding: 0 0 14px 0;">
          <p style="margin: 0 0 4px; font-weight: 600; color: #18181b;">${step.title}</p>
          <p style="margin: 0; color: #52525b; font-size: 14px; line-height: 1.5;">${step.body}</p>
        </td>
      </tr>`
  ).join("");

  return `
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
    <h3 style="font-size: 16px; margin: 0 0 8px;">Byt med eSIM – så gör du</h3>
    <p style="color: #666; font-size: 14px; margin: 0 0 16px;">
      Med eSIM byter du operatör utan att vänta på ett plastkort:
    </p>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      ${steps}
    </table>
    <p style="margin: 8px 0 0;">
      <a href="${esimGuideUrl()}" style="color: #16a34a; font-weight: 600;">Läs hela eSIM-guiden på Bytesjakten →</a>
    </p>
  `;
}

export function getEmailConfigStatus() {
  const fromEmail = FROM_EMAIL;
  const configured = Boolean(API_KEY);

  return {
    emailConfigured: configured,
    fromEmail,
    testModeOnly: false,
    note: !configured
      ? "MAILEROO_API_KEY saknas – inga mejl skickas."
      : "Mejl skickas via Maileroo. Verifiera din domän (t.ex. bytesjakten.se) i Maileroo-dashboarden och sätt EMAIL_FROM till en adress på den domänen.",
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

async function sendMailerooEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!API_KEY) {
    const message = "MAILEROO_API_KEY saknas – mejlet skickades inte.";
    console.error("[email]", message, params.to);
    return { success: false, error: message };
  }

  try {
    const response = await fetch(MAILEROO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        from: parseFromAddress(FROM_EMAIL),
        to: [{ address: params.to }],
        subject: params.subject,
        html: params.html,
        plain: htmlToPlain(params.html),
      }),
    });

    const data = (await response.json()) as {
      success?: boolean;
      message?: string;
      data?: { reference_id?: string; id?: string };
    };

    if (!response.ok || !data.success) {
      const message = data.message ?? `Maileroo HTTP ${response.status}`;
      console.error("[email] Maileroo-fel:", message, "till:", params.to);
      return { success: false, error: message };
    }

    const id = data.data?.reference_id ?? data.data?.id;
    console.log("[email] Skickat till", params.to, "id:", id);
    return { success: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    console.error("[email] Undantag:", message, "till:", params.to);
    return { success: false, error: message };
  }
}

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
        <a href="${campaignUrl}" style="display: inline-block; background: #16a34a; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;" rel="sponsored">
          Beställ kampanjen hos ${operator} →
        </a>
      </p>

      <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 8px 0 24px;">
        <p style="margin: 0 0 12px; color: #52525b; font-size: 14px; line-height: 1.5;">
          När bytet har gått igenom: berätta till oss så sätter vi datum för nästa påminnelse.
        </p>
        <a href="${switchCompleteUrl(unsubscribeToken, operator)}" style="display: inline-block; background: #fff; color: #16a34a; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600; border: 2px solid #16a34a;">
          Klicka här när bytet har gått igenom
        </a>
      </div>

      ${renderEsimGuideHtml()}

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

  return sendMailerooEmail({ to: email, subject, html });
}

type PrefsConfirmationParams = {
  email: string;
  currentOperator: string;
  contractEndDate: Date;
  minDataGB: number;
  networkPreference: string;
  unsubscribeToken: string;
  kind: "register" | "update";
};

export async function sendPrefsConfirmationEmail(
  params: PrefsConfirmationParams
): Promise<{ success: boolean; id?: string; error?: string }> {
  const {
    email,
    currentOperator,
    contractEndDate,
    minDataGB,
    networkPreference,
    unsubscribeToken,
    kind,
  } = params;

  const isNew = kind === "register";
  const subject = isNew
    ? "Välkommen till Bytesjakten – din registrering är klar"
    : "Dina uppgifter på Bytesjakten är uppdaterade";

  const intro = isNew
    ? "Tack för att du registrerade dig! Vi har sparat dina uppgifter och håller koll åt dig."
    : "Vi har uppdaterat dina uppgifter. Så här ser de ut nu:";

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="color: #16a34a; font-size: 24px;">${isNew ? "Välkommen till Bytesjakten!" : "Uppgifter uppdaterade"}</h1>
      <p>${intro}</p>

      <div style="background: #f4f4f5; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 12px; font-size: 13px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em;">Dina uppgifter</p>
        <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr>
            <td style="padding: 6px 0; color: #71717a;">E-post</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Nuvarande operatör</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${currentOperator}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Abonnemanget går ut</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${formatDate(contractEndDate)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Minsta data</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${minDataGB} GB</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Nätpreferens</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600;">${getNetworkLabel(networkPreference)}</td>
          </tr>
        </table>
      </div>

      <p style="color: #52525b; font-size: 15px; line-height: 1.5;">
        När det närmar sig dags att byta skickar vi dig ett mejl med ett aktuellt erbjudande utan bindningstid.
        Vill du ändra något? Fyll i formuläret på Bytesjakten igen med samma e-postadress.
      </p>

      <p style="margin: 24px 0;">
        <a href="${APP_URL}" style="display: inline-block; background: #16a34a; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Till Bytesjakten →
        </a>
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 32px;">
        Du får det här mejlet eftersom du ${isNew ? "registrerat dig" : "uppdaterat dina uppgifter"} på
        <a href="${APP_URL}" style="color: #16a34a;">Bytesjakten</a>.
        Tjänsten är alltid gratis.
        <br><a href="${unsubscribeUrl(unsubscribeToken)}" style="color: #999;">Avregistrera</a>
      </p>
    </div>
  `;

  return sendMailerooEmail({ to: email, subject, html });
}
