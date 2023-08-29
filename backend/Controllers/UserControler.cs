using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Models;
using MyApp.DTOs;
using AutoMapper;
using X.PagedList;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly IMapper _mapper;

        public UserController(UserContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("getAllUsers")]
        public async Task<ActionResult> GetAllUsers(int page = 1, int pageSize = 5)
        {
            var usersWithLocation = _context.Users
             .Include(u => u.City)
             .ThenInclude(c => c.Country)
             .Where(u => u.IsDeleted == 0)
             .OrderBy(u => u.Id)
             .Select(u => new UserDTO
             {
                 Id = u.Id,
                 FirstName = u.FirstName,
                 LastName = u.LastName,
                 PhoneNumber = u.PhoneNumber,
                 Gender = u.Gender.ToString(),
                 Email = u.Email,
                 City = u.City.Name,
                 Country = u.City.Country.Name,
                 DateOfBirth = u.DateOfBirth,
                 Age = (int)u.Age

             })
             .AsQueryable();

            var totalUsers = await usersWithLocation.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalUsers / pageSize);

            var pagedUsers = await usersWithLocation.ToPagedListAsync(page, pageSize);

            foreach (var user in pagedUsers)
            {
                user.CurrentPage = page;
                user.PageSize = pageSize;
                user.TotalPages = totalPages;
            }

            if (pagedUsers.Any())
            {
                return Ok(pagedUsers);
            }
            else
            {
                return NoContent();
            }
        }


        [HttpGet("edit/{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var usersWithLocation = _context.Users
                .Include(u => u.City)
                .ThenInclude(c => c.Country)
                .Where(u => u.Id == id)
                .OrderBy(u => u.Id)
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    PhoneNumber = u.PhoneNumber,
                    Gender = u.Gender.ToString(),
                    Email = u.Email,
                    City = u.City.Name,
                    Country = u.City.Country.Name,
                    DateOfBirth = u.DateOfBirth,
                    CityIds = u.CityId,
                    CountryIds = (int)u.CountryId,
                    Age = (int)u.Age,
                    IsDeleted = u.IsDeleted
                })
                .AsQueryable();

            return Ok(usersWithLocation);
        }


        [HttpPost("addUser")]
        public async Task<ActionResult<UserDTO>> AddUser(AddUserDTO userDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _mapper.Map<User>(userDTO);

            user.DateOfBirth = DateTime.SpecifyKind(userDTO.DateOfBirth, DateTimeKind.Utc);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userResponseDTO = _mapper.Map<UserDTO>(user);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userResponseDTO);
        }

        [HttpPost("editUser/{id}")]
        public async Task<ActionResult<UserDTO>> EditUser(int id, EditUserDTO userDTO)
        {

            var existingUser = await _context.Users.FindAsync(id);


            if (existingUser == null)
            {
                return NotFound();
            }

            _mapper.Map(userDTO, existingUser);

            existingUser.DateOfBirth = DateTime.SpecifyKind(userDTO.DateOfBirth, DateTimeKind.Utc);

            await _context.SaveChangesAsync();

            var updatedUserResponseDTO = _mapper.Map<UserDTO>(existingUser);

            return Ok(updatedUserResponseDTO);
        }

        [HttpGet("getCitiesByCountry/{countryId}")]
        public async Task<ActionResult<IEnumerable<City>>> GetCitiesByCountry(int countryId)
        {
            var cities = await _context.Cities
                .Where(c => c.CountryId == countryId)
                .ToListAsync();

            return Ok(cities);
        }

        [HttpGet("getAllCountries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetAllCountries()
        {
            var countries = await _context.Countries.ToListAsync();
            return Ok(countries);
        }

        [HttpPost("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.IsDeleted = 1;
            await _context.SaveChangesAsync();

            return Ok(true);
        }
    }
}
