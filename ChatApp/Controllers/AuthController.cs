using ChatApp.Data;
using ChatApp.Dtos;
using ChatApp.Models;
using ChatApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MyApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    AppDbContext db,
    IPasswordHasher<User> hasher,
    ITokenService tokens) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();

        if (await db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "Email already registered." });

        var user = new User { Email = email, FullName = req.FullName.Trim() };
        user.PasswordHash = hasher.HashPassword(user, req.Password);

        db.Users.Add(user);

        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Email already registered." });
        }

        return Ok(new AuthResponse(tokens.Create(user), user.Email, user.FullName));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(u => u.Email == email);

        if (user is null)
            return Unauthorized(new { message = "Invalid email or password." });

        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized(new { message = "Invalid email or password." });

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = hasher.HashPassword(user, req.Password);
            await db.SaveChangesAsync();
        }

        return Ok(new AuthResponse(tokens.Create(user), user.Email, user.FullName));
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new
    {
        Email = User.FindFirstValue(ClaimTypes.Email),
        FullName = User.FindFirstValue(ClaimTypes.Name)
    });
}