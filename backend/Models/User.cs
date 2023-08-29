
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MyApp.Models
{
public class User
    {
     public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string PhoneNumber { get; set; }
    public required string Gender { get; set; }
    public required string Email { get; set; }
    public required DateTime DateOfBirth { get; set; }
    [Range(1, int.MaxValue)]
    public required int Age { get; set; }
    public required int CityId { get; set; }
    public  required int CountryId { get; set; } 
     public required City City { get; set; } 
    public required Country Country { get; set; } 
    public required int IsDeleted { get; set; }
    [NotMapped] 
    public required int CurrentPage { get; set; }

    [NotMapped] 
    public required int PageSize { get; set; }
    }

    
}
