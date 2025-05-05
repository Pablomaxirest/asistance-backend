const axios = require('axios');

const GEMINI_API_KEY = "AIzaSyA9YKTSTY8BMU3PC7on5u_2fUSqJJt6RmM"; // Tu clave actual de AI Studio

axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`)
  .then(res => {
    console.log("📋 Modelos disponibles:");
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(err => {
    console.error("❌ Error al listar modelos:", err.response?.data || err.message);
  });

  