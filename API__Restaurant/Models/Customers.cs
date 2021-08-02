using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API__Restaurant.Models
{
    public class Customers
    {

        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int CustomersCode { get; set; }
        public string token { get; set; }

        public Customers(string name, string email, string password, int customersCode,string token)
        {
            Name = name;
            Email = email;
            Password = password;
            CustomersCode = customersCode;
            this.token = token;
        }
    }
}