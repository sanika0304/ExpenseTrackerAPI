# 💰 ExpenseTracker – Personal Expense Management System

## **Project Description**

**ExpenseTracker** is a web-based personal expense management application designed to help users manage their daily expenses, monitor spending habits, and organize their financial transactions efficiently. The system provides a centralized dashboard where users can manage expenses, view transaction history, analyze spending patterns, and keep track of their budgets.

The application is developed using ASP.NET Core Web API, C#, SQL Server, and frontend web technologies. It follows a frontend-backend architecture where RESTful APIs communicate with the SQL Server database to perform data operations.

The project features:

- **User Authentication:** Users can create an account and securely log in using JWT-based authentication.
- **Dashboard:** Provides an overview of expenses and easy navigation to different sections of the application.
- **Transaction Management:** Users can add, view, update, and delete their expense transactions.
- **Analytics:** Helps users understand their spending patterns through visual representations of financial data.
- **Budget Management:** Provides a dedicated section for managing and monitoring budgets.
- **User-Specific Data:** Expense records are associated with the authenticated user.

This project aims to make personal financial management simple, organized, and accessible through an interactive web application.

## **Project Structure**

```text
ExpenseTrackerAPI/
│
├── Controllers/                   # API Controllers
│   ├── AuthController.cs          # User registration and login
│   └── ExpensesController.cs      # Expense CRUD operations
│
├── Data/                          # Database operations
│   ├── UserRepository.cs          # User database operations
│   └── ExpenseRepository.cs       # Expense database operations
│
├── Models/                        # Application models
│   ├── Users.cs                   # User model
│   └── Expense.cs                 # Expense model
│
├── wwwroot/                       # Frontend files (if hosted here)
│   ├── css/                       # Stylesheets
│   ├── js/                        # JavaScript files
│   ├── images/                    # Application images
│   └── index.html                 # Dashboard
│
├── Program.cs                     # Application configuration
├── appsettings.json               # Application settings
└── ExpenseTrackerAPI.csproj       # Project dependencies
```

*Note: Update the folder and file names to match your actual repository structure.*

## **Tech Stack / Technologies Used**

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** C#, ASP.NET Core Web API
- **Database:** Microsoft SQL Server
- **Database Connectivity:** ADO.NET, Microsoft.Data.SqlClient
- **Authentication:** JWT (JSON Web Token)
- **API Architecture:** RESTful APIs
- **Development Environment:** Visual Studio
- **Database Management:** SQL Server Management Studio (SSMS)
- **API Testing:** Postman
- **Version Control:** Git and GitHub

## **API Functionalities**

The application provides RESTful APIs for user authentication and expense management.

**Authentication APIs**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and generate authentication token |

**Expense APIs**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Retrieve expenses |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/{id}` | Update an existing expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

## **Installation & Setup**

Follow these steps to run the project locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/sanika0304/ExpenseTrackerAPI.git
cd ExpenseTrackerAPI
```

### Step 2: Open the Project

Open the `.sln` or `.csproj` file in Visual Studio.

### Step 3: Configure SQL Server Database

- Open SQL Server Management Studio (SSMS).
- Create a database named `ExpenseTrackerDB`.
- Create the required tables for user and expense management.
- Configure the database connection string in `appsettings.json`.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=ExpenseTrackerDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### Step 4: Configure JWT Authentication

Configure the JWT secret key and authentication settings in your application configuration.

Keep your actual secret key private and never upload it to GitHub.

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

Open the local application URL displayed in the Visual Studio output or terminal.

## **Future Enhancements**

- **Recurring Expenses:** Add support for automatically tracking recurring monthly expenses.
- **Export Reports:** Allow users to export transaction details and expense reports in PDF or Excel format.
- **Advanced Analytics:** Introduce more detailed financial reports and spending comparisons.
- **Notifications:** Provide reminders for budget limits and upcoming payments.
- **Category Management:** Allow users to create and customize expense categories.
- **Enhanced Dashboard:** Add more financial insights and interactive charts.

## **Conclusion**

The ExpenseTracker project provides a convenient solution for managing personal expenses and monitoring financial activities. Developed using ASP.NET Core Web API, C#, and SQL Server, it demonstrates practical knowledge of backend development, RESTful API implementation, database connectivity, CRUD operations, and JWT authentication.

Through this project, I gained hands-on experience in integrating frontend applications with backend APIs, managing SQL Server databases, implementing authentication, and developing a functional web-based application.

This project represents my practical learning and development experience in **.NET, C#, ASP.NET Core Web API, and SQL Server**.

---

## **Developer**

**Sanika Patil**

.NET Developer | C# | ASP.NET Core | SQL Server

- **Email:** sanikapatilsp03@gmail.com
- **LinkedIn:** https://linkedin.com/in/sanika-patil0304
- **GitHub:** https://github.com/sanika0304

