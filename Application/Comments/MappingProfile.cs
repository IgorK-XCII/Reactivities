using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(dto => dto.Username, comment => comment.MapFrom(opt => opt.Author.UserName))
                .ForMember(dto => dto.DisplayName, comment => comment.MapFrom(opt => opt.Author.DisplayName))
                .ForMember(dto => dto.Image, comment => comment.MapFrom(opt => opt.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}