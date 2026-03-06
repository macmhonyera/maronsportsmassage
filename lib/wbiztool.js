import { buildWhatsAppPayloadFromPhone, normalizeCountryDialCode } from "./phoneNumber.js";

const DEFAULT_BASE_URL = "https://wbiztool.com/api/v1";

function readEnv(name) {
  return String(process.env[name] ?? "").trim();
}

function toBooleanFlag(value) {
  return String(value ?? "").trim() === "1";
}

function formatApiKeyForLog(value) {
  const key = String(value ?? "");
  if (!key) return "(empty)";
  if (toBooleanFlag(process.env.WBIZTOOL_LOG_RAW_API_KEY)) return key;
  if (key.length <= 8) return `${key.slice(0, 1)}*** (len:${key.length})`;
  return `${key.slice(0, 4)}...${key.slice(-4)} (len:${key.length})`;
}

function logCredentialSnapshot(config, context) {
  if (!toBooleanFlag(process.env.WBIZTOOL_DEBUG_LOG)) return;
  console.info(`[WbizTool] ${context}`, {
    clientId: config.clientId || "(empty)",
    whatsappClient: config.whatsappClient || "(empty)",
    apiKey: formatApiKeyForLog(config.apiKey),
  });
}

function getConfig() {
  const clientId = readEnv("WBIZTOOL_CLIENT_ID");
  const apiKey = readEnv("WBIZTOOL_API_KEY");
  const whatsappClient = readEnv("WBIZTOOL_WHATSAPP_CLIENT_ID") || readEnv("WBIZTOOL_WHATSAPP_CLIENT");
  const defaultCountryCode = normalizeCountryDialCode(readEnv("WBIZTOOL_COUNTRY_CODE"));
  const baseUrl = readEnv("WBIZTOOL_BASE_URL") || DEFAULT_BASE_URL;

  return {
    clientId,
    apiKey,
    whatsappClient,
    defaultCountryCode,
    baseUrl,
  };
}

function getMissingConfig(config) {
  const missing = [];
  if (!config.clientId) missing.push("WBIZTOOL_CLIENT_ID");
  if (!config.apiKey) missing.push("WBIZTOOL_API_KEY");
  if (!config.whatsappClient) missing.push("WBIZTOOL_WHATSAPP_CLIENT_ID");
  return missing;
}

function getApiUrl(baseUrl) {
  return `${String(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "")}/send_msg/`;
}

function extractErrorMessage(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (payload.error) return String(payload.error);
  if (payload.msg) return String(payload.msg);
  if (payload.message) return String(payload.message);
  return "";
}

export function isWbizToolConfigured() {
  const config = getConfig();
  return getMissingConfig(config).length === 0;
}

export async function sendWhatsApp({
  phone,
  countryCode,
  message,
  expireAfterSeconds,
  webhook,
}) {
  const text = String(message ?? "").trim();
  if (!text) {
    throw new Error("WhatsApp message cannot be empty.");
  }

  const config = getConfig();
  const missing = getMissingConfig(config);
  if (missing.length) {
    throw new Error(`WbizTool WhatsApp is not configured. Missing: ${missing.join(", ")}`);
  }
  logCredentialSnapshot(config, "Using credentials");

  const fallbackCountryCode =
    normalizeCountryDialCode(countryCode) || config.defaultCountryCode || undefined;
  const recipient = buildWhatsAppPayloadFromPhone(phone, fallbackCountryCode);
  if (!recipient?.phone || !recipient?.countryCode) {
    throw new Error("Invalid recipient phone number for WhatsApp delivery.");
  }

  const payload = {
    client_id: config.clientId,
    api_key: config.apiKey,
    whatsapp_client: config.whatsappClient,
    msg_type: 0,
    msg: text,
    phone: recipient.phone,
    country_code: recipient.countryCode,
  };

  const ttl = Number(expireAfterSeconds);
  if (Number.isFinite(ttl) && ttl > 0) {
    payload.expire_after_seconds = Math.floor(ttl);
  }

  if (webhook) {
    payload.webhook = String(webhook);
  }

  const response = await fetch(getApiUrl(config.baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await response.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = { raw };
  }

  if (!response.ok) {
    const detail = extractErrorMessage(data) || raw || response.statusText;
    if (/auth|api key|invalid api key/i.test(detail)) {
      console.error("[WbizTool] Auth failure details", {
        clientId: config.clientId || "(empty)",
        whatsappClient: config.whatsappClient || "(empty)",
        apiKey: formatApiKeyForLog(config.apiKey),
      });
    }
    throw new Error(`WbizTool request failed (${response.status}): ${detail}`);
  }

  if (data && Object.prototype.hasOwnProperty.call(data, "status")) {
    const status = Number(data.status);
    if (Number.isFinite(status) && status !== 1) {
      const detail = extractErrorMessage(data) || JSON.stringify(data);
      throw new Error(`WbizTool rejected message: ${detail}`);
    }
  }

  return data;
}
