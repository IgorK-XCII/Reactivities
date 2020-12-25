using Domain;

namespace Application.interfaces
{
    public interface IJwtGenerator
    {
        string GenerateToken(AppUser user);
    }
}