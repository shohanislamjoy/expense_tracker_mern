import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Colors
  const categoryColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#80D4FF",
  ];

  // Filter data based on date range
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => {
      const date = new Date(key);
      const withinStartDate = startDate ? date >= new Date(startDate) : true;
      const withinEndDate = endDate ? date <= new Date(endDate) : true;
      return withinStartDate && withinEndDate;
    })
  );

  // Chart data
  const chartData = {
    labels: Object.keys(filteredData),
    datasets: [
      {
        data: Object.values(filteredData),
        backgroundColor: categoryColors.slice(0, Object.keys(filteredData).length),
        hoverBackgroundColor: categoryColors
          .slice(0, Object.keys(filteredData).length)
          .map((color) => color.replace("FF", "DD")),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
        Category-wise Expense Chart
      </h2>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value || null)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mt-2 sm:mt-0">
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value || null)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="relative h-[300px] sm:h-[400px]">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default PieChart;
