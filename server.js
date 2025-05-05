const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Carga variables del .env

const promptGlobal = require('./pront/prompt_global'); // 👉 Importa el prompt base

const app = express();
const PORT = process.env.PORT || 10000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { mensaje } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { role: "system", parts: [{ text: promptGlobal }] },
          { role: "user", parts: [{ text: mensaje }] }
        ]
      }
    );

    const respuestaIA = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Respuesta vacía de Gemini.";
    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error("❌ Error al llamar a Gemini:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
