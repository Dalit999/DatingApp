using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(u=>u.Photos).FirstOrDefaultAsync(u=>u.Id == id);
            return user;
        }
        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p=>p.Id == id);
            return photo;
        }
public async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
{
    var users = await _context.Users
    .Include(u => u.Likers)
    .Include(u => u.Likees)
    .FirstOrDefaultAsync(u => u.Id == id);
    if(likers)
    {
        return users.Likers.Where(l => l.LikeeId == id).Select(l => l.LikerId);
    }
    else
    {
        return users.Likees.Where(l => l.LikerId == id).Select(l => l.LikeeId);
    }
}
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            //var users = await _context.Users.Include(u=>u.Photos).ToListAsync();
            var users = _context.Users.Include(u=>u.Photos).OrderByDescending(u=>u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            if(userParams.Gender != null)
                users = users.Where(u => u.Gender == userParams.Gender);
            // //the following is my attempt:
            // if(userParams.Likers)
            // {
            //     var likers = await _context.Likes.Where(l => l.LikeeId == userParams.UserId).Select(l => l.LikerId).ToListAsync();
            //     users = users.Where(u => likers.Contains(u.Id));
            // }
            // else if (userParams.Likees)
            // {
            //     var likees = await _context.Likes.Where(l => l.LikerId == userParams.UserId).Select(l => l.LikeeId).ToListAsync();
            //     users = users.Where(u => likees.Contains(u.Id));
            // }
            //but he does it more sofisticated:
            if(userParams.Likers)
            {
                var likers = await GetUserLikes(userParams.UserId, true);
                users = users.Where(u => likers.Contains(u.Id));
            }
            if(userParams.Likees)
            {
                var likees = await GetUserLikes(userParams.UserId, false);
                users = users.Where(u => likees.Contains(u.Id));
            }

            if(userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Now.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Now.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth>=minDob && u.DateOfBirth<=maxDob);
            }
            if(!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch(userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0; //commit and return number of changes
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p=>p.UserId == userId && p.IsMain);
            return photo;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            var like = await _context.Likes.FirstOrDefaultAsync(l => l.LikerId==userId && l.LikeeId==recipientId);
            return like;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m =>m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
           var messages = _context.Messages
                .Include(m => m.Sender).ThenInclude(u => u.Photos)
                .Include(m => m.Recipient).ThenInclude(u => u.Photos)
                .AsQueryable();
           switch(messageParams.MessageContainer)
           {
               case "Inbox":
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId);
                    break;
               case "Outbox":
                    messages = messages.Where(m => m.SenderId == messageParams.UserId);
                    break;
                default:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.IsRead == false);
                    break;
           }
           messages = messages.OrderByDescending(m => m.MessageSent);
           return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
            .Include(m => m.Sender).ThenInclude(u => u.Photos)
            .Include(m => m.Recipient).ThenInclude(u => u.Photos)
            .Where(m => (m.SenderId == userId && m.RecipientId == recipientId) || (m.SenderId == recipientId && m.RecipientId == userId))
            .OrderByDescending(m => m.MessageSent)
            .ToListAsync();
           return messages;
        }
    }
}