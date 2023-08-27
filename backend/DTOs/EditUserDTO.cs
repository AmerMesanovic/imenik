namespace MyApp.DTOs
{
    public class EditUserDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public int CityId { get; set; }
        public int CountryId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
    }
}