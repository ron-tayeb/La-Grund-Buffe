using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API__Restaurant.Models
{
    public class RestaurantMenu
    {
        public string Name { get; set; }
        public int Price { get; set; }
        public double Calories { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public int ProductCode { get; set; }
        public string Category { get; set; }
        public string Rating { get; set; }


        public RestaurantMenu(string name, int price, double calories, string image, string description,  int productCode, string category, string rating)
        {
            Name = name;
            Price = price;
            Calories = calories;
            Image = image;
            Description = description;
            ProductCode = productCode;
            Category = category;
            Rating = rating;
        }
    }
    public class FullMenu
    {
        public string base64 { get; set; }
        public string imgType { get; set; }
        public string nameImg { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public double Calories { get; set; }
        public string Description { get; set; }
        public int ProductCode { get; set; }
        public string Category { get; set; }
        public string Rating { get; set; }

        public FullMenu(string base64, string imgType, string nameImg, string name, int price, double calories, string description, int productCode, string category, string rating)
        {
            this.base64 = base64;
            this.imgType = imgType;
            this.nameImg = nameImg;
            Name = name;
            Price = price;
            Calories = calories;
            Description = description;
            ProductCode = productCode;
            Category = category;
            Rating = rating;
        }
    }
}