const functions = require("firebase-functions");
const axios = require("axios");

exports.generateCareerRoadmap = functions.https.onCall(async (data, context) => {
  const apiKey = functions.config().gemini.key;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: data.prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
      }
    );

    return { text: response.data.candidates[0].content.parts[0].text };
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "Gemini API call failed");
  }
});
