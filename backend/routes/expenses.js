const express = require("express");
const Expense = require("../models/Expense");
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all expenses (optional for debugging)
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Group expenses by date
router.get("/by-date", async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
          entries: { $push: "$$ROOT" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
    ]);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get category-wise total
router.get("/categories", async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);
    const categoryData = {};
    expenses.forEach((expense) => {
      categoryData[expense._id] = expense.total;
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Predict next 7 days expenses
router.get("/forecast", async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const expenses = await Expense.find({ date: { $gte: last7Days } });
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const forecast = (total / 7) * 7; // Simple forecast logic
    res.status(200).json({ forecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document
      runValidators: true,
    });

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
