# 💰 ExpenseTracker – Personal Expense Management System

## 📌 Project Overview

**ExpenseTracker** is a full-stack web-based personal finance management application developed to help users manage their daily expenses, track income, monitor spending habits, and manage monthly budgets.

The application provides an interactive dashboard where users can view their financial summaries, manage income and expenses, analyze spending patterns through charts, and maintain their transaction history.

The project follows a frontend-backend architecture using **ASP.NET Core Web API, C#, SQL Server, HTML, CSS, and JavaScript**. RESTful APIs connect the frontend with the backend and SQL Server database to perform data operations.

## ✨ Key Features

### 1. User Authentication
- User registration and login.
- JWT-based authentication.
- Protected API endpoints.
- User-specific financial records.

### 2. Financial Dashboard
- Total Expenses overview.
- This Month's Expenses.
- Total Transactions.
- Average Expense.
- Total Income.
- Available Balance.
- Responsive dashboard layout with gradient summary cards.

### 3. Expense Management
- Add new expenses.
- View expense transaction history.
- Edit existing expenses.
- Delete expenses.
- Organize expenses by category and date.

### 4. Income Management
- Add income records.
- View income history.
- Edit income details.
- Delete income records.
- Track total income and available balance.

### 5. Financial Analytics
- Monthly expense analysis using charts.
- Category-wise expense visualization.
- Interactive charts using Chart.js.

### 6. Monthly Budget Management
- Set a monthly spending budget.
- Monitor expenses against the budget.
- View budget utilization through a progress indicator.
- Track remaining budget.

### 7. Transaction Management
- Search transactions.
- Filter by category.
- Filter by month.
- Export transaction records to CSV.

### 8. Responsive User Interface
- Modern dashboard design.
- Sidebar navigation.
- Responsive layout for different screen sizes.
- Separate login and registration interface.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | C#, ASP.NET Core Web API |
| Framework | .NET 10 |
| Database | Microsoft SQL Server |
| Database Connectivity | ADO.NET, Microsoft.Data.SqlClient |
| Authentication | JWT (JSON Web Token) |
| Data Access | Repository Pattern |
| Charts | Chart.js |
| API Architecture | RESTful APIs |
| Development Environment | Visual Studio |
| Database Management | SQL Server Management Studio (SSMS) |
| API Testing | Postman |
| Version Control | Git and GitHub |

## 📂 Project Structure

```text
ExpenseTrackerAPI/
│
├── Controllers/
│   ├── AuthController.cs
│   ├── ExpensesController.cs
│   └── IncomesController.cs
│
├── Data/
│   ├── UserRepository.cs
│   ├── ExpenseRepository.cs
│   └── IncomeRepository.cs
│
├── Models/
│   ├── Users.cs
│   ├── Expense.cs
│   └── Income.cs
│
├── Helpers/
│   └── PasswordHelper.cs
│
├── wwwroot/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── login.html
│   ├── login.css
│   └── login.js
│
├── Program.cs
├── appsettings.json
└── ExpenseTrackerAPI.csproj
```

*Note: The structure above reflects the main application files. Additional configuration and generated files may also exist in the repository.*

## 🔗 API Functionalities

The application uses RESTful APIs to communicate between the frontend and backend.

### Authentication APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user and generate JWT token |

### Expense APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Retrieve user expenses |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/{id}` | Update an existing expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

### Income APIs

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/incomes` | Retrieve user income records |
| POST | `/api/incomes` | Add a new income record |
| PUT | `/api/incomes/{id}` | Update an existing income record |
| DELETE | `/api/incomes/{id}` | Delete an income record |

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/sanika0304/ExpenseTrackerAPI.git
cd ExpenseTrackerAPI
```

### Step 2: Open the Project

Open the `.sln` or `.csproj` file in Visual Studio.

### Step 3: Configure SQL Server

1. Open SQL Server Management Studio (SSMS).
2. Create a database named `ExpenseTrackerDB`.
3. Create the required tables for users, expenses, and income.
4. Configure the SQL Server connection string for your local environment.

Example connection string:

```text
Server=YOUR_SERVER_NAME;Database=ExpenseTrackerDB;Trusted_Connection=True;TrustServerCertificate=True;
```

### Step 4: Configure Application Secrets

Configure the database connection string and JWT settings using local .NET User Secrets.

Keep your actual connection details and JWT secret key private. Do not upload credentials or secret keys to GitHub.

### Step 5: Restore Dependencies

```bash
dotnet restore
```

### Step 6: Build the Project

```bash
dotnet build
```

### Step 7: Run the Application

```bash
dotnet run
```

### Step 8: Access the Application

Open the local application URL displayed in Visual Studio or the terminal.

## 📸 Application Modules

The application includes the following main sections:

- **Login & Registration:** User authentication interface.
- **Dashboard:** Financial overview and summary cards.
- **Income:** Income entry and history management.
- **Add Expense:** Expense entry and editing.
- **Transactions:** Expense history, filters, and CSV export.
- **Analytics:** Monthly and category-wise charts.
- **Budget:** Monthly budget monitoring.

## 🚀 Future Enhancements

- Recurring expense management.
- PDF and Excel report generation.
- Advanced financial analytics.
- Budget limit notifications.
- Custom expense categories.
- Improved financial reporting and insights.

## 🎯 Learning Outcomes

Through this project, I gained practical experience in:

- Developing RESTful APIs using ASP.NET Core Web API.
- Implementing CRUD operations using C# and ADO.NET.
- Connecting ASP.NET Core applications with SQL Server.
- Implementing JWT-based authentication and authorization.
- Working with repository-based data access.
- Integrating frontend applications with backend APIs.
- Creating interactive dashboards using JavaScript and Chart.js.
- Managing source code using Git and GitHub.

## 👩‍💻 Developer

**Sanika Patil**

.NET Developer | C# | ASP.NET Core | SQL Server

- **Email:** sanikapatilsp03@gmail.com
- **LinkedIn:** https://linkedin.com/in/sanika-patil0304
- **GitHub:** https://github.com/sanika0304

---

⭐ If you find this project interesting, feel free to explore the repository and its implementation.
