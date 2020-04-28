using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(x=>x.Username == username);
            if(user == null)
                return null;
            if(VerifyPassword(password, user) == false)
                return null;
            return user;
        }

        private bool VerifyPassword(string password, User user)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(user.PasswordSalt))
            {
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                if(passwordHash.Length != user.PasswordHash.Length)
                    return false;
                for(var i=0;i<passwordHash.Length;i++)
                    if(passwordHash[i] != user.PasswordHash[i])
                    return false;
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordSalt, passwordHash;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UserExists(string username)
        {
            var exists = await _context.Users.AnyAsync(x=>x.Username == username);
            return exists;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}