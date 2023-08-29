namespace MyApp.DTOs
{
    public class EditUserDTO
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Gender { get; set; }
        public required string Email { get; set; }
        public int CityId { get; set; }
        public int CountryId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
    }
}