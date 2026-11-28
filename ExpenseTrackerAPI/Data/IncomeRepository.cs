using ExpenseTrackerAPI.Models;
using Microsoft.Data.SqlClient;

namespace ExpenseTrackerAPI.Data
{
    public class IncomeRepository
    {
        private readonly string _connectionString;

        public IncomeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        // GET: Get incomes belonging to a specific user
        public List<Income> GetAllIncomes(int userId)
        {
            List<Income> incomes = new List<Income>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"SELECT * FROM Incomes
                                 WHERE UserId = @UserId
                                 ORDER BY IncomeDate DESC";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Income income = new Income();

                    income.IncomeId = Convert.ToInt32(reader["IncomeId"]);
                    income.UserId = Convert.ToInt32(reader["UserId"]);
                    income.Title = reader["Title"].ToString()!;
                    income.Amount = Convert.ToDecimal(reader["Amount"]);
                    income.Source = reader["Source"].ToString()!;
                    income.IncomeDate = Convert.ToDateTime(reader["IncomeDate"]);

                    income.Description = reader["Description"] == DBNull.Value
                        ? null
                        : reader["Description"].ToString();

                    income.CreatedAt = reader["CreatedAt"] == DBNull.Value
                        ? null
                        : Convert.ToDateTime(reader["CreatedAt"]);

                    incomes.Add(income);
                }
            }

            return incomes;
        }

        // POST: Add income for a specific user
        public void AddIncome(Income income, int userId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Incomes
                    (UserId, Title, Amount, Source, IncomeDate, Description)
                    VALUES
                    (@UserId, @Title, @Amount, @Source, @IncomeDate, @Description)";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@Title", income.Title);
                cmd.Parameters.AddWithValue("@Amount", income.Amount);
                cmd.Parameters.AddWithValue("@Source", income.Source);
                cmd.Parameters.AddWithValue("@IncomeDate", income.IncomeDate);
                cmd.Parameters.AddWithValue("@Description",
                    (object?)income.Description ?? DBNull.Value);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        // PUT: Update only the logged-in user's income
        public bool UpdateIncome(int id, Income income, int userId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Incomes
                    SET Title = @Title,
                        Amount = @Amount,
                        Source = @Source,
                        IncomeDate = @IncomeDate,
                        Description = @Description
                    WHERE IncomeId = @IncomeId
                    AND UserId = @UserId";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@Title", income.Title);
                cmd.Parameters.AddWithValue("@Amount", income.Amount);
                cmd.Parameters.AddWithValue("@Source", income.Source);
                cmd.Parameters.AddWithValue("@IncomeDate", income.IncomeDate);
                cmd.Parameters.AddWithValue("@Description",
                    (object?)income.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IncomeId", id);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }

        // DELETE: Delete only the logged-in user's income
        public bool DeleteIncome(int id, int userId)
        {
            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                string query = @"DELETE FROM Incomes
                                 WHERE IncomeId = @IncomeId
                                 AND UserId = @UserId";

                SqlCommand cmd = new SqlCommand(query, con);

                cmd.Parameters.AddWithValue("@IncomeId", id);
                cmd.Parameters.AddWithValue("@UserId", userId);

                con.Open();

                int rowsAffected = cmd.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }
    }
}
