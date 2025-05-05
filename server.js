const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Clave real de Gemini confirmada
const GEMINI_API_KEY = "AIzaSyAu0fmLj9IyPzRh5oEAim_Xvaqr4Qfa4Dk";

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { mensaje } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/chat-bison-001:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: mensaje }]
          }
        ]
      }
    );

    // Manejo robusto de respuesta
    let respuestaIA = "No se recibió respuesta válida.";
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const parts = response.data.candidates[0].content?.parts;
      if (parts && parts.length > 0 && parts[0].text) {
        respuestaIA = parts[0].text;
      } else {
        console.warn("⚠️ La respuesta no contenía texto en parts[0]:", parts);
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
