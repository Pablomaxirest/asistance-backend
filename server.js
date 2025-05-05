const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Clave real de Gemini confirmada
const GEMINI_API_KEY = "AIzaSyAu0fmLj9IyPzRh5oEAim_Xvaqr4Qfa4Dk";

app.use(cors());
app.use(express.json());

// Ruta del chat
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

    console.log("✅ Respuesta completa de IA:", JSON.stringify(response.data, null, 2));
    const respuestaIA = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No se recibió respuesta de IA.";
    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error("❌ Error al llamar a IA:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al comunicarse con la IA" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
