namespace AssignmentOneClient.Models
{
  public class GreetingRequest {
    public string? timeOfDay { get; set; }
    public string? language { get; set; }
    public string? tone { get; set; } = "Formal";

  }
}
