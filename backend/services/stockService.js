const axios = require("axios");

const fetchStockPrice = async (symbol) => {
  try {
    const response = await axios.get(
      "https://finnhub.io/api/v1/quote",
      {
        params: {
          symbol: symbol,
          token: process.env.FINNHUB_API_KEY,
        },
      }
    );

    const data = response.data;

    if (!data || data.c === 0) {
      throw new Error("Invalid stock symbol");
    }

    return {
      price: data.c,
      volume: data.v || 0,
    };

  } catch (error) {
    throw new Error("Failed to fetch stock data");
  }
};

module.exports = { fetchStockPrice };