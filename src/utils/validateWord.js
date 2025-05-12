export const validateWord = async (guess) => {
  try {
    const response = await fetch(
      "https://wordle-apis.vercel.app/api/validate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: guess.toLowerCase() }),
      }
    );

    const data = await response.json();

    return {
      isValid: data.is_valid_word,
      score: data.score,
    };
  } catch (error) {
    console.error("Validation error:", error);
    return { isValid: false, score: [] };
  }
};
