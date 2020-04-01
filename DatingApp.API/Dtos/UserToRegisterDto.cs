using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserToRegisterDto
    {
        [Required]
         public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength=4, ErrorMessage="password  must be between 4 and 8 characters long")]
        public string Password { get; set; }
    }
    public class UserToLoginDto
    {
        [Required]
         public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }

}