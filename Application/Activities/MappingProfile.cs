using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dto => dto.Username, opt => opt.MapFrom(s => s.AppUser.UserName))
                .ForMember(dto => dto.DisplayName, opt => opt.MapFrom(s => s.AppUser.DisplayName));
        }
    }
}