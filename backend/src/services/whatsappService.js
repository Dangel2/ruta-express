import axios from "axios";

export const sendNewOrderWhatsApp = async (order) => {
  try {
    if (
      !process.env.WHATSAPP_TOKEN ||
      !process.env.WHATSAPP_PHONE_NUMBER_ID ||
      !process.env.WHATSAPP_ADMIN_NUMBER
    ) {
      console.log("WhatsApp no configurado. Se omitió la notificación.");
      return;
    }

    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_ADMIN_NUMBER,
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US"
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("RESPUESTA META:", JSON.stringify(response.data, null, 2));
    console.log("WhatsApp de prueba enviado con plantilla hello_world");
  } catch (error) {
    console.error(
      "Error enviando WhatsApp:",
      error.response?.data || error.message
    );
  }
};