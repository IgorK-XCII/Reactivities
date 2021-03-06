using System.Linq;
using Domain;

namespace Application.Profiles
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, Profile>()
                .ForMember(p => p.Image, opt => opt.MapFrom(user => user.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(p => p.FollowersCount, opt => opt.MapFrom(user => user.Followers.Count()))
                .ForMember(p => p.FollowingCount, opt => opt.MapFrom(user => user.Followings.Count));
        }
    }
}