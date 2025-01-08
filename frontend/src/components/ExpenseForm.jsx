import React, { useState } from "react";
import axios from "axios";

function ExpenseForm({ fetchExpenses, closeForm }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    incurredOn: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/expenses", formData);
    fetchExpenses();
    setFormData({
      title: "",
      amount: "",
      category: "",
      incurredOn: "",
      notes: "",
    });
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      amount: "",
      category: "",
      incurredOn: "",
      notes: "",
    });
    if (closeForm) closeForm(); //closefrom
  };

  return (
    <div className="bg-white shadow-md rounded p-6 mb-4">
      <h2 className="text-lg font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Incurred On */}
        <input
          type="date"
          value={formData.incurredOn}
          onChange={(e) => setFormData({ ...formData, incurredOn: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        {/* Notes */}
        <textarea
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-2 border rounded h-24"
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 text-white p-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
