using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Activity = "Could not find activity" });

                AppUser user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());

                UserActivity attendance = await _context.UserActivities.SingleOrDefaultAsync(x => x.ActivityId == activity.Id && x.AppUserId == user.Id);

                if (attendance == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "User unattending this activity" });
                    
                if (attendance.IsHost)
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "You cannot remove yourself as host" });

                _context.UserActivities.Remove(attendance);

                bool success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}