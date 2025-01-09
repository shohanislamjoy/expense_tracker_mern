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




router.get("/forecast", async (req, res) => {
  try {
    const expenses = await Expense.find();

    // Group expenses by weekday
    const weekdayTotals = Array(7).fill(0); // Total expense for each weekday
    const weekdayCounts = Array(7).fill(0); // Count of expenses for each weekday

    expenses.forEach((expense) => {
      const dayOfWeek = new Date(expense.incurredOn).getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
      weekdayTotals[dayOfWeek] += expense.amount;
      weekdayCounts[dayOfWeek] += 1;
    });

    // Calculate average expense for each weekday
    const weekdayAverages = weekdayTotals.map((total, i) => 
      weekdayCounts[i] > 0 ? total / weekdayCounts[i] : 0
    );

    // Predict the next 7 days
    const forecast = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = date.getDay(); // Get the day of the week
      return {
        date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        predictedExpense: weekdayAverages[dayOfWeek], // Use the average for this day
      };
    });

    res.status(200).json({ forecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
