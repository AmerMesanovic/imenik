using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Models;
using MyApp.DTOs;
using AutoMapper;
using X.PagedList;
using System.Text.Json;

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
                .AsQueryable();

            var totalUsers = await usersWithLocation.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalUsers / pageSize);

            var pagedUsers = await usersWithLocation.ToPagedListAsync(page, pageSize);

            var pagedUsersDTO = _mapper.Map<IEnumerable<UserDTO>>(pagedUsers);

            foreach (var user in pagedUsersDTO)
            {
                user.CurrentPage = page;
                user.PageSize = pageSize;
                user.TotalPages = totalPages;
            }

            if (pagedUsersDTO.Any())
            {
                return Ok(pagedUsersDTO);
            }
            
                return NoContent();
            
        }


        [HttpGet("edit/{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(int id)
        {
            var user = await _context.Users
        .Include(u => u.City)
        .ThenInclude(c => c.Country)
        .FirstOrDefaultAsync(u => u.Id == id);

    if (user == null)
    {
        return NotFound();
    }

    var userDTO = _mapper.Map<UserDTO>(user);

    return Ok(userDTO);
        }


    [HttpPost("addUser")]
    public async Task<ActionResult<UserDTO>> AddUser(AddUserDTO userDTO)
    {
        if (!ModelState.IsValid){
            return BadRequest(ModelState);
        }

        var existingEmailUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDTO.Email && u.IsDeleted == 0);
        
        if (existingEmailUser != null ){
            return StatusCode(200, $"User with email: '{userDTO.Email}' already exists.");
        }

        var existingPhoneUser = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == userDTO.PhoneNumber && u.IsDeleted == 0);
        if (existingPhoneUser != null){
            return StatusCode(200, $"User with phone number: '{userDTO.PhoneNumber}' already exists.");
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
