import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import PieChart from "./components/PieChart";
import Forecast from "./components/ForecastChart";


function App() {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState({});


  useEffect(() => {
    fetchExpenses();
    fetchCategoryData();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses");
    setExpenses(res.data);
  };

  const fetchCategoryData = async () => {
    const res = await axios.get("http://localhost:5000/api/expenses/categories");
    setCategoryData(res.data);
  };

 
  const handleEditSuccess = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
    );
  };

 
  const handleDeleteSuccess = (deletedId) => {
    setExpenses((prev) => prev.filter((expense) => expense._id !== deletedId));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto p-6 space-y-4">
        {/* Expense Form */}
        <ExpenseForm fetchExpenses={fetchExpenses} />
  
        {/* Expense List */}
        <ExpenseList
          expenses={expenses}
          onEditSuccess={handleEditSuccess}
          onDeleteSuccess={handleDeleteSuccess}
        />
  
        {/* Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Forecast Chart */}
          <div className="bg-white shadow-md rounded p-4 md:col-span-2">
            <Forecast data={expenses}/>
          </div>
  
          {/* Pie Chart */}
          <div className="bg-white shadow-md rounded p-4">
            <PieChart data={categoryData} />
          </div>
        </div>
      </main>
    </div>
  );
  
}

export default App;
