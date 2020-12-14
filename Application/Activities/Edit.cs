using System.Reflection;
using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

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

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities.FirstAsync(act => act.Id == request.Id);

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