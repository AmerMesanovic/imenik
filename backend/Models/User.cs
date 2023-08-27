
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Models
{
public class User
    {
     public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string Gender { get; set; }
    public string Email { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int? Age { get; set; }
    public int CityId { get; set; }
    public int? CountryId { get; set; }  public City City { get; set; } 
    public Country Country { get; set; } 
    public int IsDeleted { get; set; }
    [NotMapped] 
    public int CurrentPage { get; set; }

    [NotMapped] 
    public int PageSize { get; set; }
    }

    
}
