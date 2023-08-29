namespace MyApp.Models
{
    public class City
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public required int CountryId { get; set; }
        public required Country Country { get; set; }

    }

}