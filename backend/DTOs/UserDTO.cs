namespace MyApp.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
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