import axios from "axios";

export async function sendWhatsApp({ phone, message }) {
  try {
    const res = await axios.post(
      "https://wbiztool.com/api/v1/send_msg/",
      {
        client_id: process.env.WBIZTOOL_CLIENT_ID,
        api_key: process.env.WBIZTOOL_API_KEY,
        whatsapp_client: process.env.WBIZTOOL_WHATSAPP_CLIENT_ID,
        msg_type: 0,
        phone,
        country_code: process.env.WBIZTOOL_COUNTRY_CODE,
        msg: message,
      }
    );

    return res.data;
  } catch (err) {
    console.error("Wbiztool error:", err.response?.data || err.message);
    throw err;
  }
}
