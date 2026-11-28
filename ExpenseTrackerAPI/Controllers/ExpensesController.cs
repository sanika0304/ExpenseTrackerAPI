
using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseRepository _repository;

        public ExpensesController(ExpenseRepository repository)
        {
            _repository = repository;
        }

        // Get logged-in user's expenses
        [HttpGet]
        public IActionResult GetExpenses()
        {
            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var expenses = _repository.GetAllExpenses(userId);

            return Ok(expenses);
        }

        // Add expense for logged-in user
        [HttpPost]
        public IActionResult AddExpense([FromBody] Expense expense)
        {
            if (expense == null)
            {
                return BadRequest("Invalid expense data");
            }

            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            _repository.AddExpense(expense, userId);

            return Ok("Expense added successfully");
        }

        // Update logged-in user's expense
        [HttpPut("{id}")]
        public IActionResult UpdateExpense(int id, [FromBody] Expense expense)
        {
            if (expense == null)
            {
                return BadRequest("Invalid expense data");
            }

            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            bool result = _repository.UpdateExpense(id, expense, userId);

            if (!result)
            {
                return NotFound("Expense not found");
            }

            return Ok("Expense updated successfully");
        }

        // Delete logged-in user's expense
        [HttpDelete("{id}")]
        public IActionResult DeleteExpense(int id)
        {
            int userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            bool result = _repository.DeleteExpense(id, userId);

            if (!result)
            {
                return NotFound("Expense not found");
            }

            return Ok("Expense deleted successfully");
        }
    }
}
