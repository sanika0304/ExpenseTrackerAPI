
using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Helpers;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly PasswordHelper _passwordHelper;
        private readonly JwtHelper _jwtHelper;

        public AuthController(
            UserRepository userRepository,
            PasswordHelper passwordHelper, JwtHelper jwtHelper)
        {
            _userRepository = userRepository;
            _passwordHelper = passwordHelper;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            if (_userRepository.EmailExists(request.Email))
            {
                return BadRequest(new
                {
                    message = "Email already registered."
                });
            }

            Users user = new Users
            {
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                PasswordHash = _passwordHelper.HashPassword(request.Password),
                CreatedAt = DateTime.Now
            };

            int userId = _userRepository.RegisterUser(user);

            return Ok(new
            {
                message = "Registration successful!",
                userId = userId
            });
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            // Find user by email
            var user = _userRepository.GetUserByEmail(request.Email.Trim());

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            // Verify password
            bool isPasswordValid = _passwordHelper.VerifyPassword(
                user.PasswordHash,
                request.Password
            );

            if (!isPasswordValid)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            // Generate JWT token
            string token = _jwtHelper.GenerateToken(user);

            return Ok(new
            {
                message = "Login successful!",
                token = token,
                userId = user.UserId,
                fullName = user.FullName,
                email = user.Email
            });
        }

    }
}
