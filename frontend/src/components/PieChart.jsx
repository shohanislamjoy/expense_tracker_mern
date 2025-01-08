import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // No filtering needed on pre-aggregated data
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded p-6 mt-4 w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto" style={{ position: "relative", height: "800px" }}>
      <h2 className="text-lg font-bold mb-4">Category-wise Expense Chart</h2>

      {/* Date Range Filter */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value || null)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value || null)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}

export default PieChart;
