using AutoMapper;
using MyApp.DTOs;
using MyApp.Models;

namespace MyApp.Profiles
{
    public class ProfileClass : Profile
    {
        public ProfileClass()
        {
            CreateMap<AddUserDTO, User>();
            CreateMap<User, UserDTO>();
            CreateMap<EditUserDTO, User>();
        }
    }
}