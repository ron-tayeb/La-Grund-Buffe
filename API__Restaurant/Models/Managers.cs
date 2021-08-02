using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API__Restaurant.Models
{
    public class Managers
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int ManagerCode { get; set; }

        public Managers(string name, string email, string password ,int managerCode)
        {
            Name = name;
            Email = email;
            Password = password;
            ManagerCode = managerCode;
        }
    }
}