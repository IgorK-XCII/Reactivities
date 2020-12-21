using System.Net;
using System.Reflection;
using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Errors;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null) 
                    throw new RestException(HttpStatusCode.NotFound, new {activity = "Not found"});

                PropertyInfo[] newProperty = typeof(Command).GetProperties();
                for (int i = 0; i < newProperty.Length; i++)
                {
                    PropertyInfo property = typeof(Activity).GetProperties()[i];
                    property.SetValue(activity, typeof(Command).GetProperties()[i].GetValue(request) ?? property.GetValue(activity));
                }

                bool success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}