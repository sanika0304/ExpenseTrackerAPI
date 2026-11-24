using Microsoft.AspNetCore.Identity;
using System.Text;

namespace ExpenseTrackerAPI.Helpers
{
    public class PasswordHelper
    {// Encode password into Base64
        public string HashPassword(string password)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(password);

            return Convert.ToBase64String(bytes);
        }

        // Decode and compare password
        public bool VerifyPassword(
            string encodedPassword,
            string enteredPassword)
        {
            byte[] bytes =
                Convert.FromBase64String(encodedPassword);

            string decodedPassword =
                Encoding.UTF8.GetString(bytes);

            return decodedPassword == enteredPassword;
        }
    }
}
