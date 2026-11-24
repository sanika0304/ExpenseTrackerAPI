
// Check whether user is logged in
(function () {
    const token = sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
})();
// Get JWT token
const API_URL = "/api/expenses";
function getToken() {
    return sessionStorage.getItem("token");
}

// Add JWT token to API requests
function getAuthHeaders() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        console.error("JWT token is missing!");
        return {};
    }

    return {
        "Authorization": `Bearer ${token}`
    };
}

let expenses = [];
let editingId = null;
let monthlyChart = null;
let categoryChart = null;

// Budget setting
let monthlyBudget = Number(localStorage.getItem("monthlyBudget")) || 0;

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("todayDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    document.getElementById("expenseDate").value =
        getTodayDate();

    loadExpenses();
    updateBudgetDisplay();
});

// Format today's date as yyyy-mm-dd
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Convert date safely for month calculations
function getExpenseDate(dateValue) {
    if (!dateValue) return null;

    const parts = String(dateValue).substring(0, 10).split("-");

    if (parts.length !== 3) return null;

    const [year, month, day] = parts.map(Number);

    const date = new Date(year, month - 1, day);

    return Number.isNaN(date.getTime()) ? null : date;
}

// Format currency
function formatCurrency(value) {
    return Number(value || 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    });
}

// GET: Load all expenses
async function loadExpenses() {
    try {
        console.log("Token available:", !!sessionStorage.getItem("token"));
        const response = await fetch(API_URL, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        console.log("Expenses loaded:", expenses);
        expenses = await response.json();

        displayExpenses();
        updateSummary();
        updateCharts();
        updateBudgetDisplay();

    } catch (error) {
        console.error("Loading error:", error);
        console.error("Error details:", error.message);
        alert("Unable to load expenses: " + error.message);
    }
}

// Display transaction table
function displayExpenses() {

    const tbody = document.getElementById("expenseTableBody");
    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const selectedCategory =
        document.getElementById("categoryFilter").value;

    const selectedMonth =
        document.getElementById("monthFilter").value;

    tbody.innerHTML = "";

    const filteredExpenses = expenses.filter(expense => {

        const title = (expense.title || "").toLowerCase();
        const description =
            (expense.description || "").toLowerCase();

        const categoryMatch =
            !selectedCategory ||
            expense.category === selectedCategory;

        const searchMatch =
            title.includes(searchText) ||
            description.includes(searchText) ||
            (expense.category || "").toLowerCase().includes(searchText);

        const date = getExpenseDate(expense.expenseDate);

        const monthMatch =
            !selectedMonth ||
            (date &&
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
                === selectedMonth);

        return categoryMatch && searchMatch && monthMatch;
    });

    document.getElementById("noExpenses").style.display =
        filteredExpenses.length === 0 ? "block" : "none";

    filteredExpenses.forEach(expense => {

        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title || "-";

        const categoryCell = document.createElement("td");
        const categoryPill = document.createElement("span");
        categoryPill.className = "category-pill";
        categoryPill.textContent = expense.category || "Other";
        categoryCell.appendChild(categoryPill);

        const dateCell = document.createElement("td");
        const date = getExpenseDate(expense.expenseDate);

        dateCell.textContent = date
            ? date.toLocaleDateString("en-IN")
            : "-";

        const amountCell = document.createElement("td");
        amountCell.className = "amount-cell";
        amountCell.textContent = formatCurrency(expense.amount);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = expense.description || "-";

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "action-btn edit-btn";
        editButton.addEventListener("click", () => {
            editExpense(expense.expenseId);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "action-btn delete-btn";
        deleteButton.addEventListener("click", () => {
            deleteExpense(expense.expenseId);
        });

        actionCell.append(editButton, deleteButton);

        row.append(
            titleCell,
            categoryCell,
            dateCell,
            amountCell,
            descriptionCell,
            actionCell
        );

        tbody.appendChild(row);
    });
}

// Update summary cards
function updateSummary() {

    const total = expenses.reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
    );

    const currentDate = new Date();

    const currentMonthExpenses = expenses.filter(item => {
        const date = getExpenseDate(item.expenseDate);

        return date &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear();
    });

    const monthlyTotal = currentMonthExpenses.reduce(
        (sum, item) => sum + Number(item.amount || 0), 0
    );

    const average = expenses.length > 0
        ? total / expenses.length
        : 0;

    document.getElementById("totalExpenses").textContent =
        formatCurrency(total);

    document.getElementById("monthlyExpenses").textContent =
        formatCurrency(monthlyTotal);

    document.getElementById("totalTransactions").textContent =
        expenses.length;

    document.getElementById("averageExpense").textContent =
        formatCurrency(average);
}

// Create and update charts
function updateCharts() {

    if (typeof Chart === "undefined") {
        console.error("Chart.js could not be loaded.");
        return;
    }

    const currentYear = new Date().getFullYear();

    const monthlyTotals = Array(12).fill(0);

    const categoryTotals = {};

    expenses.forEach(item => {

        const amount = Number(item.amount || 0);
        const date = getExpenseDate(item.expenseDate);

        if (date && date.getFullYear() === currentYear) {
            monthlyTotals[date.getMonth()] += amount;
        }

        const category = item.category || "Other";

        categoryTotals[category] =
            (categoryTotals[category] || 0) + amount;
    });

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Monthly bar chart
    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart = new Chart(
        document.getElementById("monthlyChart"),
        {
            type: "bar",
            data: {
                labels: months,
                datasets: [{
                    label: "Monthly Spending",
                    data: monthlyTotals,
                    backgroundColor: "#7893bd",
                    borderRadius: 5,
                    maxBarThickness: 32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: context =>
                                formatCurrency(context.raw)
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => "₹" + value
                        },
                        grid: {
                            color: "#edf0f5"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        }
    );

    // Category doughnut chart
    if (categoryChart) {
        categoryChart.destroy();
    }

    const categoryLabels = Object.keys(categoryTotals);
    const categoryValues = Object.values(categoryTotals);

    categoryChart = new Chart(
        document.getElementById("categoryChart"),
        {
            type: "doughnut",
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryValues,
                    backgroundColor: [
                        "#5876a8",
                        "#8c7ab8",
                        "#d3a36d",
                        "#70a58a",
                        "#bd7d86",
                        "#78a6b4",
                        "#a4aabb"
                    ],
                    borderWidth: 3,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: context =>
                                context.label + ": " +
                                formatCurrency(context.raw)
                        }
                    }
                }
            }
        }
    );
}

// POST and PUT: Save expense
document.getElementById("expenseForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const expense = {
            title: document.getElementById("title").value.trim(),
            amount: Number(document.getElementById("amount").value),
            category: document.getElementById("category").value,
            expenseDate: document.getElementById("expenseDate").value,
            description: document.getElementById("description").value.trim()
        };

        if (
            !expense.title ||
            !expense.category ||
            !expense.expenseDate ||
            !Number.isFinite(expense.amount) ||
            expense.amount <= 0
        ) {
            alert("Please enter valid expense details.");
            return;
        }

        const isEditing = editingId !== null;

        const url = isEditing
            ? `${API_URL}/${editingId}`
            : API_URL;

        const method = isEditing ? "PUT" : "POST";

        const button = document.getElementById("submitBtn");
        button.disabled = true;

        try {

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                body: JSON.stringify(expense)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP ${response.status}`);
            }

            alert(isEditing
                ? "Expense updated successfully!"
                : "Expense added successfully!");

            resetForm();
            await loadExpenses();

        } catch (error) {
            console.error("Save error:", error);
            alert("Unable to save expense: " + error.message);
        } finally {
            button.disabled = false;
        }
    });

// Edit expense
function editExpense(id) {

    const expense = expenses.find(
        item => item.expenseId === id
    );

    if (!expense) return;

    editingId = id;

    document.getElementById("title").value =
        expense.title || "";

    document.getElementById("amount").value =
        expense.amount ?? "";

    document.getElementById("category").value =
        expense.category || "";

    const date = getExpenseDate(expense.expenseDate);

    document.getElementById("expenseDate").value =
        date
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
            : "";

    document.getElementById("description").value =
        expense.description || "";

    document.getElementById("formHeading").textContent =
        "Update Expense";

    document.getElementById("submitBtn").textContent =
        "Update Expense";

    document.getElementById("cancelEditBtn").hidden = false;

    document.getElementById("addExpense").scrollIntoView({
        behavior: "smooth"
    });
}

// DELETE: Delete expense
async function deleteExpense(id) {

    if (!confirm("Are you sure you want to delete this expense?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        alert("Expense deleted successfully!");

        await loadExpenses();

    } catch (error) {
        console.error("Delete error:", error);
        alert("Unable to delete expense: " + error.message);
    }
}

// Reset form
function resetForm() {

    document.getElementById("expenseForm").reset();

    editingId = null;

    document.getElementById("formHeading").textContent =
        "Add New Expense";

    document.getElementById("submitBtn").textContent =
        "Save Expense";

    document.getElementById("cancelEditBtn").hidden = true;

    document.getElementById("expenseDate").value =
        getTodayDate();
}

// Cancel editing
document.getElementById("cancelEditBtn")
    .addEventListener("click", resetForm);

// Search and filters
document.getElementById("searchInput")
    .addEventListener("input", displayExpenses);

document.getElementById("categoryFilter")
    .addEventListener("change", displayExpenses);

document.getElementById("monthFilter")
    .addEventListener("change", displayExpenses);

// Clear filters
document.getElementById("clearFiltersBtn")
    .addEventListener("click", () => {

        document.getElementById("searchInput").value = "";
        document.getElementById("categoryFilter").value = "";
        document.getElementById("monthFilter").value = "";

        displayExpenses();
    });

// Set monthly budget
document.getElementById("editBudgetBtn")
    .addEventListener("click", () => {

        const enteredBudget = prompt(
            "Enter your monthly budget in rupees:",
            monthlyBudget || ""
        );

        if (enteredBudget === null) return;

        const amount = Number(enteredBudget);

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }

        monthlyBudget = amount;

        localStorage.setItem("monthlyBudget", monthlyBudget);

        updateBudgetDisplay();
    });

// Update budget progress
function updateBudgetDisplay() {

    const currentDate = new Date();

    const currentMonthTotal = expenses
        .filter(item => {
            const date = getExpenseDate(item.expenseDate);

            return date &&
                date.getMonth() === currentDate.getMonth() &&
                date.getFullYear() === currentDate.getFullYear();
        })
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    document.getElementById("budgetSpent").textContent =
        formatCurrency(currentMonthTotal);

    document.getElementById("budgetLimit").textContent =
        formatCurrency(monthlyBudget);

    const percentage = monthlyBudget > 0
        ? (currentMonthTotal / monthlyBudget) * 100
        : 0;

    const progress = Math.min(percentage, 100);

    document.getElementById("budgetProgress").style.width =
        progress + "%";

    const message = document.getElementById("budgetMessage");

    if (monthlyBudget === 0) {
        message.textContent =
            "Set a monthly budget to start tracking.";
    } else if (percentage > 100) {
        message.textContent =
            `You have exceeded your budget by ${formatCurrency(currentMonthTotal - monthlyBudget)}.`;
    } else {
        message.textContent =
            `${percentage.toFixed(1)}% of your monthly budget used. ${formatCurrency(monthlyBudget - currentMonthTotal)} remaining.`;
    }
}

// Navigate to Add Expense
function goToAddExpense() {
    document.getElementById("addExpense").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("title").focus();
}

// Sidebar navigation
document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", function () {

        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        document.getElementById("sidebar").classList.remove("open");
    });
});

// Mobile menu
document.getElementById("menuToggle")
    .addEventListener("click", () => {
        document.getElementById("sidebar").classList.toggle("open");
    });

// Export CSV
document.getElementById("exportBtn")
    .addEventListener("click", () => {

        if (expenses.length === 0) {
            alert("There are no expenses to export.");
            return;
        }

        const headers = [
            "Expense ID",
            "Title",
            "Amount",
            "Category",
            "Date",
            "Description"
        ];

        const rows = expenses.map(item => [
            item.expenseId,
            item.title,
            item.amount,
            item.category,
            item.expenseDate,
            item.description
        ]);

        function escapeCSV(value) {
            let text = String(value ?? "");

            // Prevent spreadsheet formula execution
            if (/^[=+\-@\t\r]/.test(text)) {
                text = "'" + text;
            }

            return '"' + text.replace(/"/g, '""') + '"';
        }

        const csvContent = [headers, ...rows]
            .map(row => row.map(escapeCSV).join(","))
            .join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "ExpenseTracker_Report.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    });


// Logout functionality
document.getElementById("logoutBtn")
    .addEventListener("click", function () {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        sessionStorage.clear();

        window.location.href = "login.html";
    });
