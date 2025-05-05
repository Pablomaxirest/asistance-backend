const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Clave API generada desde Google AI Studio (válida y activa)
const GEMINI_API_KEY = "AIzaSyA9YKTSTY8BMU3PC7on5u_2fUSqJJt6RmM";

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { mensaje } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: mensaje }] }]
      }
    );

    // ✅ Manejo robusto de la respuesta
    let respuestaIA = "No se recibió respuesta válida.";
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const parts = response.data.candidates[0].content?.parts;
      if (parts && parts.length > 0 && parts[0].text) {
        respuestaIA = parts[0].text;
      } else {
        console.warn("⚠️ La respuesta no contenía texto válido en parts[0]:", parts);
      }
    } else {
      console.warn("⚠️ No se encontraron candidates en la respuesta:", response.data);
    }

    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error("❌ Error al llamar a IA:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al comunicarse con la IA" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
