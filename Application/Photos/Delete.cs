using System.Linq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using Application.Errors;
using System.Net;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());

                Photo photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                    throw new RestException(HttpStatusCode.BadRequest, new {Photo = "Photo not found!"});

                if (photo.IsMain)
                    throw new RestException(HttpStatusCode.BadRequest, new {Photo = "Cannot delete main photo"});

                user.Photos.Remove(photo);

                string result = _photoAccessor.DeletePhoto(request.Id);

                if (result == null)
                    throw new RestException(HttpStatusCode.BadRequest, new {Photo = "Problem deleting the photo"});

                bool success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}