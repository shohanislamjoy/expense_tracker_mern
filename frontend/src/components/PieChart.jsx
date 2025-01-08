import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const chartOptions = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Allow custom width and height
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded p-6 mt-4 w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto" style={{ position: "relative", height: "600px" }}>
      <h2 className="text-lg font-bold mb-4">Category-wise Expense Chart</h2>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}

export default PieChart;
