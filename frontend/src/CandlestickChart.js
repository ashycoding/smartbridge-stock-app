import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns";
import {
  CandlestickController,
  CandlestickElement
} from "chartjs-chart-financial";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale,
  CandlestickController,
  CandlestickElement
);

function CandlestickChart({ symbol }) {
  const [dataPoints, setDataPoints] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCandles = async () => {
      const res = await axios.get(
        `https://smartbridge-backend-pcfd.onrender.com/api/stocks/candles/${symbol}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const formatted = res.data.map((candle, index) => ({
        x: new Date(Date.now() - (30 - index) * 24 * 60 * 60 * 1000),
        o: candle.open,
        h: candle.high,
        l: candle.low,
        c: candle.close
      }));

      setDataPoints(formatted);
    };

    fetchCandles();
  }, [symbol]);

  const chartData = {
    datasets: [
      {
        label: symbol,
        data: dataPoints
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day"
        }
      }
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <Chart type="candlestick" data={chartData} options={options} />
    </div>
  );
}

export default CandlestickChart;