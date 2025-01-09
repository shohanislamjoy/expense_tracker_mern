import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

// Create a new expense
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
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$incurredOn" } },
          total: { $sum: "$amount" },
          entries: { $push: "$$ROOT" },
        },
      },
      { $sort: { _id: 1 } },
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

// Update an expense by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
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

// Predict expenses for the next 7 days
router.get("/forecast", async (req, res) => {
  try {
    const expenses = await Expense.find();

    const weekdayTotals = Array(7).fill(0);
    const weekdayCounts = Array(7).fill(0);

    expenses.forEach((expense) => {
      const dayOfWeek = new Date(expense.incurredOn).getDay();
      weekdayTotals[dayOfWeek] += expense.amount;
      weekdayCounts[dayOfWeek] += 1;
    });

    const weekdayAverages = weekdayTotals.map((total, i) =>
      weekdayCounts[i] > 0 ? total / weekdayCounts[i] : 0
    );

    const forecast = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = date.getDay();
      return {
        date: date.toISOString().split("T")[0],
        predictedExpense: weekdayAverages[dayOfWeek],
      };
    });

    res.status(200).json({ forecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
