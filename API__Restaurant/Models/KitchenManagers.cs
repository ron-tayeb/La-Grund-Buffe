using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API__Restaurant.Models
{
    public class KitchenManagers
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int KitchenManagersCode { get; set; }

        public KitchenManagers(string name, string email, string password, int kitchenManagersCode)
        {
            Name = name;
            Email = email;
            Password = password;
            KitchenManagersCode = kitchenManagersCode;
        }
    }
}