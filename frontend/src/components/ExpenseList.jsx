import React, { useState } from "react";
import axios from "axios"; // Assuming you use axios for API calls

function ExpenseList({ expenses, onEditSuccess, onDeleteSuccess }) {
  const [expandedDate, setExpandedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editExpenseData, setEditExpenseData] = useState({});

  // Helper function to safely parse and format dates
  const formatDate = (dateString) => {
    const parsedDate = Date.parse(dateString);
    if (!isNaN(parsedDate)) {
      return new Date(parsedDate).toISOString().split("T")[0];
    }
    return null;
  };

  // Filter expenses by date range
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = formatDate(expense.incurredOn);
    return (
      expenseDate &&
      (!startDate || expenseDate >= startDate) &&
      (!endDate || expenseDate <= endDate)
    );
  });

  // Group expenses by date
  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const date = formatDate(expense.incurredOn);
    if (date) {
      acc[date] = acc[date] || [];
      acc[date].push(expense);
    }
    return acc;
  }, {});

  // Calculate total expense
  const totalExpense = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Handle editing an expense
  const handleEditClick = (expense) => {
    setEditExpenseId(expense._id);
    setEditExpenseData({ ...expense });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(`/api/expenses/${editExpenseId}`, editExpenseData);
      if (response.status === 200) {
        onEditSuccess(response.data); // Notify parent to refresh the list
        setEditExpenseId(null); // Exit edit mode
      }
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/expenses/${id}`);
      if (response.status === 200) {
        onDeleteSuccess(id); // Notify parent to remove the deleted item
      }
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEditCancel = () => {
    setEditExpenseId(null); // Exit edit mode
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-lg font-bold mb-4">Expense Report</h2>

      {/* Date Range Filter */}
      <div className="flex space-x-4 mb-4">
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
        <div>
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

     

      {/* Expandable Date-Wise List */}
      {Object.keys(groupedExpenses).map((date) => (
        <div key={date} className="mb-4">
          <div
            className="flex justify-between items-center bg-gray-200 p-3 rounded cursor-pointer"
            onClick={() =>
              setExpandedDate(expandedDate === date ? null : date)
            }
          >
            <span className="font-bold">{date}</span>
            <span className="font-semibold">
              ${groupedExpenses[date]
                .reduce((sum, exp) => sum + exp.amount, 0)
                .toFixed(2)}
            </span>
          </div>

          {expandedDate === date && (
            <ul className="mt-2 space-y-2">
              {groupedExpenses[date].map((expense) => (
                <li
                  key={expense._id}
                  className="flex justify-between bg-gray-100 p-3 rounded"
                >
                  {editExpenseId === expense._id ? (
                    <div className="flex-1">
                      {/* Edit Mode */}
                      <input
                        type="text"
                        name="title"
                        value={editExpenseData.title}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Title"
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editExpenseData.amount}
                        onChange={handleEditChange}
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Amount"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleEditSave}
                          className="text-green-500 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* View Mode */}
                      <div>
                        <span className="font-bold">{expense.title}</span>
                        <p className="text-sm text-gray-600">
                          {expense.category}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(expense)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
      ))}


       {/* Total Expense */}
       <div className="flex justify-end text-xl font-bold text-gray-800 p-4">
        Total Expense: ${totalExpense.toFixed(2)}
      </div>
    </div>
  );
}

export default ExpenseList;
