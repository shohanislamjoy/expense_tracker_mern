const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  incurredOn: { type: Date, required: true }, 
  notes: { type: String, default: "" }, 
  createdAt: { type: Date, default: Date.now }, 
});


expenseSchema.index({ incurredOn: 1, category: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
