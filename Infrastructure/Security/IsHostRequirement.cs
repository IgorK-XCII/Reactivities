using System;
using System.Linq;
using System.Threading.Tasks;
using Application.interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context, IUserAccessor userAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
            _userAccessor = userAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            string currentUserName = _userAccessor.GetCurrentUserName();

            Guid activitiId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

            Activity activity = _context.Activities.FindAsync(activitiId).Result;

            UserActivity host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

            if (host?.AppUser?.UserName == currentUserName)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}