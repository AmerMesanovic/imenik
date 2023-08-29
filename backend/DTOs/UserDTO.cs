namespace MyApp.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Gender { get; set; }
        public required string Email { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
        public int CurrentPage { get; internal set; }
        public int PageSize { get; internal set; }
        public int TotalPages { get; set; }
        public int CityIds { get; internal set; }
        public int CountryIds { get; internal set; }
        public int IsDeleted { get; set; }
    }
}