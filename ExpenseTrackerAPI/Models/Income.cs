namespace ExpenseTrackerAPI.Models
{
    public class Income
    {
        public int IncomeId { get; set; }

        public int UserId { get; set; }

        public string Title { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string Source { get; set; } = string.Empty;

        public DateTime IncomeDate { get; set; }

        public string? Description { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
