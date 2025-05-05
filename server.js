const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Clave real de Gemini (ya la confirmamos antes)
const GEMINI_API_KEY = "AIzaSyAu0fmLj9IyPzRh5oEAim_Xvaqr4Qfa4Dk";

app.use(cors());
app.use(express.json());

// ✅ Ruta cambiada: ahora es /chat (antes era /chat-gemini)
app.post('/chat', async (req, res) => {
  const { mensaje } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: mensaje }] }]
      }
    );

    console.log("Respuesta completa de Gemini:", JSON.stringify(response.data, null, 2));
    const respuestaIA = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No se recibió respuesta de Gemini.";

    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error("Error al llamar a Gemini:", error.message);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
