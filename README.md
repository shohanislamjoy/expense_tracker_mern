
## **Expense Tracking Application**

An intuitive web application to track daily expenses, generate detailed reports, and forecast future expenses. Built using **React**, **Express.js**, and **MongoDB**, with styling powered by **Tailwind CSS**.

---

### **Live Demo**
[Live Deployment Link](https://expense-tracker-mern-gra6.onrender.com/) 

---

### **Features**
- **Add Expenses**: Input expense details, including title, amount, category, date, and notes.
- **Date Range Filters**: View expenses within a specific date range.
- **Category-wise Reports**: Visualize expense distribution with a pie chart.
- **Expense Forecasting**: Predict expenses for the next 7 days using historical data and display them in a bar chart.
- **Editable and Deletable Entries**: Update or remove individual expense records.
- **Responsive Design**: Fully optimized for desktop and mobile devices.

---

### **Technology Stack**
#### **Frontend**
- **React** with functional components and hooks.
- **Chart.js** for visualizing data.
- **Tailwind CSS** for responsive styling.

#### **Backend**
- **Express.js** for API development.
- **Mongoose** for MongoDB interactions.

#### **Database**
- **MongoDB Atlas** (cloud-based NoSQL database).

---

### **Setup Instructions**

#### **1. Clone the Repository**
```bash
git clone https://github.com/shohanislamjoy/expense_tracker_mern.git
cd expense-tracker-mern
```

#### **2. Install Dependencies**
##### **Backend**
```bash
npm install
```

##### **Frontend**
```bash
cd ../frontend
npm install
```

#### **3. Environment Variables**
Create a `.env` file in the **backend** directory and configure it:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
PORT=5000
```

#### **4. Start the Application**
##### **Backend**
```bash
npm run dev
```

##### **Frontend**
```bash
cd frontend
npm start
```

The application will be accessible at `http://localhost:[port]`.

---

### **Deployment**
The application is deployed on:
- **Frontend && Backend**:[Render](https://render.com/)


### **API Endpoints**
#### **Expenses**
- `POST /api/expenses`: Add a new expense.
- `GET /api/expenses`: Fetch all expenses.
- `GET /api/expenses/by-date`: Group expenses by date.
- `GET /api/expenses/categories`: Get category-wise totals.
- `GET /api/expenses/forecast`: Predict expenses for the next 7 days.
- `DELETE /api/expenses/:id`: Delete an expense.

---

### **Contributing**
Contributions are welcome! 😊 Fork the repository, make changes, and submit a pull request.

