
using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IncomesController : ControllerBase
    {
        private readonly IncomeRepository _repository;

        public IncomesController(IncomeRepository repository)
        {
            _repository = repository;
        }

        private int GetUserId()
        {
            return int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );
        }

        // GET: api/incomes
        [HttpGet]
        public IActionResult GetIncomes()
        {
            int userId = GetUserId();

            var incomes = _repository.GetAllIncomes(userId);

            return Ok(incomes);
        }

        // POST: api/incomes
        [HttpPost]
        public IActionResult AddIncome(Income income)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int userId = GetUserId();

            _repository.AddIncome(income, userId);

            return Ok(new
            {
                message = "Income added successfully!"
            });
        }

        // PUT: api/incomes/1
        [HttpPut("{id}")]
        public IActionResult UpdateIncome(int id, Income income)
        {
            int userId = GetUserId();

            bool updated = _repository.UpdateIncome(
                id, income, userId
            );

            if (!updated)
                return NotFound(new
                {
                    message = "Income not found."
                });

            return Ok(new
            {
                message = "Income updated successfully!"
            });
        }

        // DELETE: api/incomes/1
        [HttpDelete("{id}")]
        public IActionResult DeleteIncome(int id)
        {
            int userId = GetUserId();

            bool deleted = _repository.DeleteIncome(id, userId);

            if (!deleted)
                return NotFound(new
                {
                    message = "Income not found."
                });

            return Ok(new
            {
                message = "Income deleted successfully!"
            });
        }
    }
}
