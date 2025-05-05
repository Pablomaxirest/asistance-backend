const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyAu0fmLj9IyPzRh5oEAim_Xvaqr4Qfa4Dk"; // Tu clave real

app.post("/chat-gemini", async (req, res) => {
  const { message, context } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `${context}\n\nConsulta: ${message}` }]
          }
        ]
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No entendí tu mensaje.";
    res.json({ reply });
  } catch (error) {
    console.error("Error con Gemini:", error.message);
    res.status(500).json({ reply: "Ocurrió un error al procesar tu mensaje." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
