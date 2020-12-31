using Microsoft.AspNetCore.Http;
using Application.Photos;

namespace Application.interfaces
{
    public interface IPhotoAccessor
    {
        PhotoUploadResult AddPhoto(IFormFile file);
        string DeletePhoto(string publicId);
    }
}