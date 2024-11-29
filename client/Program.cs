using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using AssignmentOneClient.Models;

namespace AssignmentOneClient
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var url = "http://localhost:8080/api";

            using HttpClient client = new HttpClient();

            try
            {
                // Fetch available times of day
                var timesOfDay = await client.GetFromJsonAsync<List<string>>(url + "/timesOfDay");
                if (timesOfDay == null || timesOfDay.Count == 0)
                {
                    Console.WriteLine("No available times of day.");
                    return;
                }

                // Fetch available languages
                var languages = await client.GetFromJsonAsync<List<string>>(url + "/languages");
                if (languages == null || languages.Count == 0)
                {
                    Console.WriteLine("No supported languages.");
                    return;
                }

                // Display available times of day
                Console.WriteLine("Available Times of Day:");
                foreach (var time in timesOfDay)
                {
                    Console.WriteLine($"- {time}");
                }

                // Display supported languages
                Console.WriteLine("\nSupported Languages:");
                foreach (var language in languages)
                {
                    Console.WriteLine($"- {language}");
                }

                // User input for time of day
                Console.WriteLine("\nEnter a time of day from the list above:");
                var timeOfDayInput = Console.ReadLine();

                // User input for language
                Console.WriteLine("\nEnter a language from the list above:");
                var languageInput = Console.ReadLine();

                // User input for tone
                Console.WriteLine("\nEnter a tone (Formal or Casual, default is Formal):");
                var toneInput = Console.ReadLine();

                // Create the greeting request object
                var greetingRequest = new GreetingRequest
                {
                    timeOfDay = timeOfDayInput,
                    language = languageInput,
                    tone = string.IsNullOrEmpty(toneInput) ? "Formal" : toneInput
                };

                // Send the request to the API
                var response = await client.PostAsJsonAsync(url + "/greet", greetingRequest);
                if (response.IsSuccessStatusCode)
                {
                    var serializedContent = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<GreetingResponse>(serializedContent);
                    if (result != null)
                    {
                        Console.WriteLine("\nGreeting: " + result.greetingMessage);
                    }
                }
                else
                {
                    Console.WriteLine("\nGreeting not found for the given time of day and language.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
            }
        }
    }
}