
using Microsoft.Data.SqlClient;
using ExpenseTrackerAPI.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace ExpenseTrackerAPI.Data
{
    public class ExpenseRepository
    {
        private readonly string _connectionString;

        public ExpenseRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        // GET: Get expenses belonging to a specific user
        public List<Expense> GetAllExpenses(int userId)
        {
            List<Expense> expenses = new List<Expense>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"SELECT * FROM Expenses
                                 WHERE UserId = @UserId";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Expense expense = new Expense();

                    expense.ExpenseId = Convert.ToInt32(reader["ExpenseId"]);
                    expense.Title = reader["Title"].ToString()!;
                    expense.Amount = Convert.ToDecimal(reader["Amount"]);
                    expense.Category = reader["Category"].ToString()!;
                    expense.ExpenseDate = Convert.ToDateTime(reader["ExpenseDate"]);
                    expense.Description = reader["Description"] == DBNull.Value
                        ? null
                        : reader["Description"].ToString();

                    expense.UserId = Convert.ToInt32(reader["UserId"]);

                    expenses.Add(expense);
                }
            }

            return expenses;
        }

        // POST: Add expense for a specific user
        public void AddExpense(Expense expense, int userId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Expenses
                    (Title, Amount, Category, ExpenseDate, Description, UserId)
                    VALUES
                    (@Title, @Amount, @Category, @ExpenseDate, @Description, @UserId)";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@Title", (object?)expense.Title ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Amount", expense.Amount);
                cmd.Parameters.AddWithValue("@Category", (object?)expense.Category ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ExpenseDate", expense.ExpenseDate);
                cmd.Parameters.AddWithValue("@Description", (object?)expense.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // PUT: Update only the logged-in user's expense
        public bool UpdateExpense(int id, Expense expense, int userId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Expenses
                    SET Title = @Title,
                        Amount = @Amount,
                        Category = @Category,
                        ExpenseDate = @ExpenseDate,
                        Description = @Description
                    WHERE ExpenseId = @ExpenseId
                    AND UserId = @UserId";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@Title", (object?)expense.Title ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Amount", expense.Amount);
                cmd.Parameters.AddWithValue("@Category", (object?)expense.Category ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ExpenseDate", expense.ExpenseDate);
                cmd.Parameters.AddWithValue("@Description", (object?)expense.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ExpenseId", id);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }

        // DELETE: Delete only the logged-in user's expense
        public bool DeleteExpense(int id, int userId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"DELETE FROM Expenses
                                 WHERE ExpenseId = @ExpenseId
                                 AND UserId = @UserId";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@ExpenseId", id);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }
    }
}
