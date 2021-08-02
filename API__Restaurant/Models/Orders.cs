using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API__Restaurant.Models
{
    public class Orders
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string OrderingProcess { get; set; }
        public int OrderCode { get; set; }
        public bool Delivery { get; set; }
        public int id { get; set; }
        public Orders( string name, string phone, string address, string orderingProcess, int orderCode, bool delivery,int id)
        {
            
            Name = name;
            Phone = phone;
            Address = address;
            OrderingProcess = orderingProcess;
            OrderCode = orderCode;
            Delivery = delivery;
            this.id = id;

        }
    }

    public class CustomerOrder
    {
        public int OrderCode { get; set; }
        public int[] ProductsCode { get; set; }
        public string OrderingProcess { get; set; }
        public int CustomerOrderCode { get; set; }
        public CustomerOrder(int orderCode, int[] productsCode, string orderingProcess, int customerOrderCode)
        {
            OrderCode = orderCode;
            ProductsCode = productsCode;
            OrderingProcess = orderingProcess;
            CustomerOrderCode = customerOrderCode;
        }
    }

    public class OrderDetailsSent
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int[] ProductsCode { get; set; }
        public string OrderingProcess { get; set; }
        public bool Delivery { get; set; }
        public int id { get; set; }

        public OrderDetailsSent(string name, string phone, string address, int[] productsCode, string orderingProcess, bool delivery,int id)
        {
            Name = name;
            Phone = phone;
            Address = address;
            ProductsCode = productsCode;
            OrderingProcess = orderingProcess;
            Delivery = delivery;
            this.id = id;
        }
    }

    public class CustomerOrderRes
    {
        public int OrderCode { get; set; }
        public int ProductsCodes { get; set; }
        public string OrderingProcess { get; set; }
        public int CustomerOrderCode { get; set; }
        public CustomerOrderRes(int orderCode, int productsCodes, string orderingProcess, int customerOrderCode)
        {
            OrderCode = orderCode;
            ProductsCodes = productsCodes;
            OrderingProcess = orderingProcess;
            CustomerOrderCode = customerOrderCode;
        }
    }
}