using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PracLMSDemo.Data;
using PracLMSDemo.Models;

namespace PracLMSDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeaveRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveRequestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequest()
        {
            return await _context.LeaveRequest.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveRequest>> GetLeaveRequest(int id)
        {
            var leaveRequest = await _context.LeaveRequest.FindAsync(id);

            if (leaveRequest == null)
            {
                return NotFound();
            }

            return leaveRequest;
        }

        [HttpGet("employee/{empId}")]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaves(int empId)
        {
            var leaveRequests = await _context.LeaveRequest
                                               .Where(lr => lr.EmployeeId == empId)
                                               .ToListAsync();

            if(leaveRequests == null || !leaveRequests.Any())
            {
                return NotFound("No Leaves found with the requested Employee Id");
            }

            return leaveRequests;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeaveRequest(int id, LeaveRequest leaveRequest)
        {
            if (id != leaveRequest.LeaveId)
            {
                return BadRequest();
            }

            _context.Entry(leaveRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaveRequestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost("ApplyLeave")]
        public async Task<ActionResult<LeaveRequest>> PostLeaveRequest(LeaveRequest leaveRequest)
        {
            _context.LeaveRequest.Add(leaveRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLeaveRequest", new { id = leaveRequest.LeaveId }, leaveRequest);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveRequest(int id)
        {
            var leaveRequest = await _context.LeaveRequest.FindAsync(id);
            if (leaveRequest == null)
            {
                return NotFound();
            }

            _context.LeaveRequest.Remove(leaveRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaveRequestExists(int id)
        {
            return _context.LeaveRequest.Any(e => e.LeaveId == id);
        }

        [HttpGet("manager/{managerName}")]
        public async Task<ActionResult<IEnumerable<LeaveRequest>>> GetLeaveRequestsByManager(string managerName)
        {
            var leaveRequests = await _context.LeaveRequest
                                              .Where(lr => lr.ManagerName.ToLower() == managerName.ToLower()) // Case insensitive search
                                              .ToListAsync();

            if (leaveRequests == null || !leaveRequests.Any())
            {
                return NotFound($"No leave requests found for manager: {managerName}");
            }

            return leaveRequests;
        }
    }
}
