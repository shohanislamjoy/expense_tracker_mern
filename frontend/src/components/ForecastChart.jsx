import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ForecastChart() {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      const res = await fetch("http://localhost:5000/api/expenses/forecast");
      const data = await res.json();
      setForecastData(data.forecast);
    };

    fetchForecast();
  }, []);

 
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Prepare chart data
  const chartData = {
    labels: forecastData.map(
      (day) => `${getDayName(day.date)}, ${day.date}` // Format: "Day, Date"
    ),
    datasets: [
      {
        label: "Predicted Expense ($)",
        data: forecastData.map((day) => day.predictedExpense),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#4b5563",
          font: {
            size: 16,
          },
        },
        ticks: {
          color: "#4b5563",
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Expense ($)",
          color: "#4b5563",
          font: {
            size: 16,
          },
        },
        ticks: {
          color: "#4b5563",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        7-Day Expense Forecast
      </h2>
      <div className="overflow-x-auto">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default ForecastChart;
