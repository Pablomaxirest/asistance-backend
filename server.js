const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Carga variables del archivo .env

const promptGlobal = require('./prompt/prompt_global'); // ✅ Importa el contexto base

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
          { parts: [{ text: promptGlobal }] }, // 👉 prompt base con reglas
          { parts: [{ text: mensaje }] }       // 👉 mensaje del usuario
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
