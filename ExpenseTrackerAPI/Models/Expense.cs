
using System;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTrackerAPI.Models
{
    public class Expense
    {
            public int ExpenseId { get; set; }

            public string? Title { get; set; }

            public decimal? Amount { get; set; }

            public string? Category { get; set; }

            public DateTime? ExpenseDate { get; set; }

            public string? Description { get; set; }
             public int UserId { get; set; }

    }
}
