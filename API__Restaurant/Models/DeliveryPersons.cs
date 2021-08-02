using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API__Restaurant.Models
{
    public class DeliveryPersons 
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int DeliveryPersonCode { get; set; }

        public DeliveryPersons(string name, string email, string password, int deliveryPersonCode)
        {
            Name = name;
            Email = email;
            Password = password;
            DeliveryPersonCode = deliveryPersonCode;
        }
    }
}