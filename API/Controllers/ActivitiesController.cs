using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List() =>
            await _mediator.Send(new List.Query());

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id) =>
            await _mediator.Send(new Details.Query { Id = id });

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command) =>
            await _mediator.Send(command);

        [HttpPut]
        public async Task<ActionResult<Unit>> Edit(Edit.Command command) =>
            await _mediator.Send(command);

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Remove(Guid id) =>
            await _mediator.Send(new Delete.Command { Id = id });
    }
}