namespace MyApp.Models
{
    public class Country
    {
         public int Id { get; set; }
        public required string Name { get; set; }
         public required ICollection<City> Cities { get; set; }
    }
}
