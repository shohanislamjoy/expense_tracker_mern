import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import PieChart from "./components/PieChart";


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
        <ExpenseForm fetchExpenses={fetchExpenses} />
        <ExpenseList
          expenses={expenses}
          onEditSuccess={handleEditSuccess}
          onDeleteSuccess={handleDeleteSuccess}
        />
        <PieChart data={categoryData} />
    
      </main>
    </div>
  );
}

export default App;
