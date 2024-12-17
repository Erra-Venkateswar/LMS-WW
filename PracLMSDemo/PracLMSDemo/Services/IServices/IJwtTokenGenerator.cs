using PracLMSDemo.Models;

namespace PracLMSDemo.Services.IServices
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}
