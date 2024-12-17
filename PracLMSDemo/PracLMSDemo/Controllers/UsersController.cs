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
using PracLMSDemo.Services.IServices;

namespace PracLMSDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public UsersController(AppDbContext context, IJwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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


        [HttpPost]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            var existingUser = await _context.Users
            .SingleOrDefaultAsync(u => u.UserName == user.UserName);

            if (existingUser != null)
                return BadRequest("Username is already taken");

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == model.Email);
            if (user == null || user.Password != model.Password)
            {
                return BadRequest("Invalid credentials");
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            return Ok(new {Token  = token});
        }

        [HttpGet("role/{role}")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersByRole(string role)
        {
            var users = await _context.Users
                                       .Where(u => u.Role == role)
                                       .ToListAsync();

            if (users == null || !users.Any())
            {
                return NotFound($"No users found with the role {role}");
            }

            return Ok(users);
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            var user = await _context.Users
                                     .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound($"User with email {email} not found");
            }

            return Ok(user);
        }

        [HttpPost("check")]
        public async Task<ActionResult> CheckEmailOrPhone([FromBody] CheckEmailOrPhoneModel model)
        {

            var emailExists = await _context.Users.AnyAsync(u => u.Email == model.Email);

            var phoneExists = await _context.Users.AnyAsync(u => u.Phone == model.Phone);

            return Ok(new
            {
                emailExists,
                phoneExists
            });
        }

    }
}
