using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthRepository _repo;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IConfiguration configuration, IMapper mapper)
        {
            _mapper = mapper;
            _configuration = configuration;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserToRegisterDto userToRegisterDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            userToRegisterDto.Username = userToRegisterDto.Username.ToLower();
            if (await _repo.UserExists(userToRegisterDto.Username))
                return BadRequest("user already exists");
            var userToCreate = new User() { Username = userToRegisterDto.Username };
            var createdUser = await _repo.Register(userToCreate, userToRegisterDto.Password);
            return StatusCode(201);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserToLoginDto userToLoginDto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var userToLog = await _repo.Login(userToLoginDto.Username.ToLower(), userToLoginDto.Password);
            if (userToLog == null)
                return Unauthorized();
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userToLog.Id.ToString()),
                new Claim(ClaimTypes.Name, userToLog.Username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var user = _mapper.Map<UserForListDto>(userToLog);
            return Ok(new
            {
                token = tokenHandler.WriteToken(token), //write out token into the response that we are sending back to the client
                user
            });
        }

    }
}