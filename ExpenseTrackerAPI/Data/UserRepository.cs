
using ExpenseTrackerAPI.Models;
using Microsoft.Data.SqlClient;

namespace ExpenseTrackerAPI.Data
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        // Check whether email already exists
        public bool EmailExists(string email)
        {
            using SqlConnection con = new SqlConnection(_connectionString);

            string query = "SELECT COUNT(*) FROM Users WHERE Email = @Email";

            using SqlCommand cmd = new SqlCommand(query, con);

            cmd.Parameters.AddWithValue("@Email", email);

            con.Open();

            int count = Convert.ToInt32(cmd.ExecuteScalar());

            return count > 0;
        }

        // Register new user
        public int RegisterUser(Users user)
        {
            using SqlConnection con = new SqlConnection(_connectionString);

            string query = @"
                INSERT INTO Users (FullName, Email, PasswordHash)
                VALUES (@FullName, @Email, @PasswordHash);

                SELECT SCOPE_IDENTITY();";

            using SqlCommand cmd = new SqlCommand(query, con);

            cmd.Parameters.AddWithValue("@FullName", user.FullName);
            cmd.Parameters.AddWithValue("@Email", user.Email);
            cmd.Parameters.AddWithValue("@PasswordHash", user.PasswordHash);

            con.Open();

            return Convert.ToInt32(cmd.ExecuteScalar());
        }

        // Get user by email for login
        public Users? GetUserByEmail(string email)
        {
            using SqlConnection con = new SqlConnection(_connectionString);

            string query = @"
                SELECT UserId, FullName, Email, PasswordHash, CreatedAt
                FROM Users
                WHERE Email = @Email";

            using SqlCommand cmd = new SqlCommand(query, con);

            cmd.Parameters.AddWithValue("@Email", email);

            con.Open();

            using SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return new Users
                {
                    UserId = Convert.ToInt32(reader["UserId"]),
                    FullName = reader["FullName"].ToString()!,
                    Email = reader["Email"].ToString()!,
                    PasswordHash = reader["PasswordHash"].ToString()!,
                    CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
                };
            }

            return null;
        }
    }
}
