using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;

namespace API__Restaurant.Models
{
    public class DBservice
    {
        static string conStr; 
        public DBservice()
        {
            bool localWebAPI = false;
            bool sqlLocal = false;

            if (localWebAPI && sqlLocal)
            {
                conStr = ConfigurationManager.ConnectionStrings["localDB"].ConnectionString;
            }
            else if (localWebAPI && !sqlLocal)
            {
                conStr = ConfigurationManager.ConnectionStrings["LIVEDNSfromLocal"].ConnectionString;
            }
            else
            {
                conStr = ConfigurationManager.ConnectionStrings["LIVEDNSfromLivedns"].ConnectionString;
            }
            
        }//ctor
        public SqlConnection connect()
        {
           
            SqlConnection con = new SqlConnection(conStr);
            con.Open();
            return con;
        }// connect to database
        public List<Customers> getUsers() //show all customers
        {
            List<Customers> users = new List<Customers>();
            Customers u = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM dbo.TB_Customers", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                u = new Customers(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]),Convert.ToInt32(reader["CustomersCode"]), Convert.ToString(reader["token"]));
                users.Add(u);
            }
            con.Close();
            return users;
        }
        public List<RestaurantMenu> getMenu(string category) //show all menu
        {
            List<RestaurantMenu> menu = new List<RestaurantMenu>();
            RestaurantMenu u = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM dbo.TB_Restaurant_menu WHERE Category ='{category}'", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                u = new RestaurantMenu(Convert.ToString(reader["Name"]), Convert.ToInt32(reader["Price"]), Convert.ToInt32(reader["Calories"]), Convert.ToString(reader["Image"]), Convert.ToString(reader["Description"]), Convert.ToInt32(reader["ProductCode"]), Convert.ToString(reader["Category"]), Convert.ToString(reader["Rating"]));
                menu.Add(u);
            }
            con.Close();
            return menu;
        }
        public Customers getToken(string id) //show all menu
        {
            Customers u = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM dbo.TB_Customers WHERE CustomersCode ='{id}'", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                u = new Customers(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]), Convert.ToInt32(reader["CustomersCode"]), Convert.ToString(reader["token"]));
            }
            con.Close();
            return u;
        }
        public Object getUser(string email , string pass) // show user by id
        {
            Customers u = null;
            DeliveryPersons d = null;
            KitchenManagers k = null;
            Managers m = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM dbo.TB_Customers WHERE Email ='{email}' and Password ='{pass}' ", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                u = new Customers(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]), Convert.ToInt32(reader["CustomersCode"]), Convert.ToString(reader["token"]));

            }
            con.Close();
            if (u != null)
            {
                return u;
            }
            con.Open();
            SqlCommand comm2 = new SqlCommand($"SELECT * FROM TB_Delivery_persons WHERE Email ='{email}' and Password ='{pass}' ", con);
            reader = comm2.ExecuteReader();
            while (reader.Read())
            {
                d = new DeliveryPersons(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]), Convert.ToInt32(reader["DeliveryPersonCode"]));

            }
            con.Close();
            if (d !=null)
            {
                return d;
            }
            con.Open();
            SqlCommand comm3 = new SqlCommand($"SELECT * FROM TB_Kitchen_Managers WHERE Email ='{email}' and Password ='{pass}' ", con);
            reader = comm3.ExecuteReader();
            while (reader.Read())
            {
                k = new KitchenManagers(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]), Convert.ToInt32(reader["KitchenManagersCode"]));

            }
            con.Close();
            if (k != null)
            {
                return k;
            }
            con.Open();
            SqlCommand comm4 = new SqlCommand($"SELECT * FROM TB_Managers WHERE Email ='{email}' and Password ='{pass}' ", con);
            reader = comm4.ExecuteReader();
            while (reader.Read())
            {
                m = new Managers(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]), Convert.ToInt32(reader["ManagerCode"]));

            }
            con.Close();
            return m;
        }
        public int DetleteUser(int Ccode) //delete user
        {
            int res = 0;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"Delete From dbo.TB_Customers WHERE CustomersCode = '{Ccode}'", con);
            res = comm.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }
        public int CreatNewUser(Customers user) // new user
        {
            user.CustomersCode++;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"INSERT  dbo.TB_Customers (Name,Email, Password,token)" +
               $" SELECT  '{user.Name}','{user.Email}','{user.Password}','{user.token}'" +
               $" WHERE NOT EXISTS" +
               $" (SELECT  1" +
               $" FROM dbo.TB_Customers" +
               $" WHERE Email='{user.Email}');", con);
            int res = comm.ExecuteNonQuery();
            return res;
        }
        public int uploadMenu(FullMenu menu, string img) // new menu with image
        {
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand(
               $" INSERT INTO  dbo.TB_Restaurant_menu (Name,Price, Calories,Image,Description,Category,Rating)" +
               $" VALUES ('{menu.Name}','{menu.Price}','{menu.Calories}','{img}','{menu.Description}','{menu.Category}','{menu.Rating}')"  
               , con);
            int res = comm.ExecuteNonQuery();
            return res;
        }
        public int EditUser(int cCode, Customers user) //edit user
        {
            int res = 0;
            SqlConnection con = connect();
            List<Customers> users = getUsers();
            Customers u = users.SingleOrDefault(us => us.CustomersCode == cCode);
            string qu = $"Update dbo.TB_Customers Set Name='{user.Name}',Email='{user.Email},' Password='{user.Password}', CustomersCode='{user.CustomersCode}', where CustomersCode='{user.CustomersCode}'";
            con.Close();
            SqlCommand updateCom = new SqlCommand(qu, con);
            con.Open();
            res = updateCom.ExecuteNonQuery();
            con.Close();
            return res;
            //throw new Exception("Not Exsit");
        }
        public int CreatNewOrder(OrderDetailsSent order) // new order
        {
            SqlConnection con = connect();
            int res = 0;
            int orderCode;
            SqlCommand comm1 = new SqlCommand($"INSERT INTO site23.TB_Orders(Name, Phone, Address, OrderingProcess, Delivery,id)" +
               $" VALUES ('{order.Name}','{order.Phone}','{order.Address}','{order.OrderingProcess}','{order.Delivery}','{order.id}')", con);
            int res1 = comm1.ExecuteNonQuery();
            if (res1==0)
            {
                return res1;
            }
            SqlCommand getOrderCode = new SqlCommand($"SELECT TOP 1 OrderCode FROM TB_Orders ORDER BY OrderCode DESC;", con);
            SqlDataReader reader = getOrderCode.ExecuteReader();
            if (reader.Read())
            {
                 orderCode = Convert.ToInt32(reader["OrderCode"]);
            }
            else { res = 0; return res; }
            con.Close();
            con.Open();
            for (int i = 0; i < order.ProductsCode.Length; i++)
            {
                SqlCommand comm = new SqlCommand($"INSERT INTO site23.TB_CustomerOrders(OrderCode, ProductsCodes, OrderingProcess)" +
               $" VALUES ('{orderCode}','{order.ProductsCode[i]}','{order.OrderingProcess}')", con);
                res = comm.ExecuteNonQuery();
                if (res==0)
                {
                    return res;
                }
            }
            return res;
        }
        public List<Orders> GetOreders() // show orders
        {
            List<Orders> ordersList = new List<Orders>();
            Orders o = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM TB_Orders where OrderingProcess = 'sendToPreparation'", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                o = new Orders(Convert.ToString(reader["Name"]), Convert.ToString(reader["Phone"]), Convert.ToString(reader["Address"]), Convert.ToString(reader["OrderingProcess"]), Convert.ToInt32(reader["OrderCode"]), Convert.ToBoolean(reader["Delivery"]), Convert.ToInt32(reader["id"]));
                ordersList.Add(o);

            }
            con.Close();
            return ordersList;
        }
        public List<RestaurantMenu> GetOredersD(Orders order) // show orders products
        {

            List<CustomerOrderRes> ordersList = new List<CustomerOrderRes>();
            CustomerOrderRes o = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM TB_CustomerOrders WHERE OrderCode='{order.OrderCode}'", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                o = new CustomerOrderRes(Convert.ToInt32(reader["OrderCode"]), Convert.ToInt32(reader["ProductsCodes"]), Convert.ToString(reader["OrderingProcess"]), Convert.ToInt32(reader["CustomerOrderCode"]));
                ordersList.Add(o);

            }
            con.Close();
            
            List<RestaurantMenu> menu = new List<RestaurantMenu>();
            RestaurantMenu u = null;
            SqlConnection con2 = connect();
            con.Open();
            for (int i = 0; i < ordersList.Count; i++)
            {
                
                SqlCommand com = new SqlCommand($"SELECT * FROM TB_Restaurant_menu WHERE ProductCode='{ordersList[i].ProductsCodes}'", con);
                reader = com.ExecuteReader();
                while (reader.Read())
                {
                    u = new RestaurantMenu(Convert.ToString(reader["Name"]),Convert.ToInt32(reader["Price"]), Convert.ToInt32(reader["Calories"]), Convert.ToString(reader["Image"]), Convert.ToString(reader["Description"]), Convert.ToInt32(reader["ProductCode"]), Convert.ToString(reader["Category"]), Convert.ToString(reader["Rating"]));
                    menu.Add(u);
                }
                con.Close();
                con.Open();
            }
            con.Close();
            return menu;
        }
        public int sendToDelivery(Orders order) // send order to deleviry
        {
            int res = 0;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"UPDATE TB_Orders SET OrderingProcess ='sendToDelivery' WHERE OrderCode='{order.OrderCode}'", con);
            res = comm.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }
        public int DeleteOrder(Orders order)
        {
            int res = 0;
            SqlConnection con = connect();
            SqlCommand comm1 = new SqlCommand($"Delete From TB_CustomerOrders WHERE OrderCode = '{order.OrderCode}'", con);
            res = comm1.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            con.Open();
            SqlCommand comm = new SqlCommand($"Delete From TB_Orders WHERE OrderCode ='{order.OrderCode}'", con);
            res = comm.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }// delete order from all tables
        public int DeleteProduct(string productCode)
        {
            int res = 0;
            SqlConnection con = connect();
            SqlCommand comm1 = new SqlCommand($"Delete From TB_Restaurant_menu WHERE ProductCode = '{productCode}'", con);
            res = comm1.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }// delete product 
        public int UpdateProduct(FullMenu product, string img) // UpdateProduct
        {
            int res = 0;
            SqlCommand comm;
            SqlConnection con = connect();
            if (img=="")
            {
                comm = new SqlCommand($"UPDATE TB_Restaurant_menu SET Name='{product.Name}', Price='{product.Price}', Calories='{product.Calories}', Description='{product.Description}', Category='{product.Category}', Rating='{product.Rating}' WHERE ProductCode ='{product.ProductCode}'", con);
            }
            else
            {
                comm = new SqlCommand($"UPDATE TB_Restaurant_menu SET Name='{product.Name}', Price='{product.Price}', Calories='{product.Calories}', Image='{img}', Description='{product.Description}', Category='{product.Category}', Rating='{product.Rating}' WHERE ProductCode ='{product.ProductCode}'", con);
            }
            res = comm.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }
        public int DeleteDeliveryPerson(string DeliveryPersonCode)
        {
            int res = 0;
            SqlConnection con = connect();
            SqlCommand comm1 = new SqlCommand($"Delete From TB_Delivery_persons WHERE DeliveryPersonCode = '{DeliveryPersonCode}'", con);
            res = comm1.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }// delete DeliveryPerson account
        public int DeleteKitchenManagers(string KitchenManagersCode)
        {
            int res = 0;
            SqlConnection con = connect();
            SqlCommand comm1 = new SqlCommand($"Delete From TB_Kitchen_Managers WHERE DeliveryPersonCode = '{KitchenManagersCode}'", con);
            res = comm1.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }// delete DeleteKitchenManagers account
        public int DeleteCustomers(string CustomersCode)
        {
            int res = 0;
            SqlConnection con = connect();
            SqlCommand comm1 = new SqlCommand($"Delete From TB_Customers WHERE CustomersCode = '{CustomersCode}'", con);
            res = comm1.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }// delete DeleteCustomers account
        public int CreateDeliveryPerson(DeliveryPersons user) // new DeliveryPerson
        {
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"INSERT  TB_Delivery_persons (Name,Email, Password)" +
               $" SELECT  '{user.Name}','{user.Email}','{user.Password}'" +
               $" WHERE NOT EXISTS" +
               $" (SELECT  1" +
               $" FROM TB_Delivery_persons" +
               $" WHERE Email='{user.Email}');", con);
            int res = comm.ExecuteNonQuery();
            return res;
        }
        public int CreateKitchenManagers(KitchenManagers user) // new KitchenManagers
        {
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"INSERT  TB_Kitchen_Managers (Name,Email, Password)" +
               $" SELECT  '{user.Name}','{user.Email}','{user.Password}'" +
               $" WHERE NOT EXISTS" +
               $" (SELECT  1" +
               $" FROM TB_Kitchen_Managers" +
               $" WHERE Email='{user.Email}');", con);
            int res = comm.ExecuteNonQuery();
            return res;
        }
        public int UpdateCustomers(Customers user) // UpdateCustomers
        {
            int res = 0;
            SqlCommand comm;
            SqlConnection con = connect();
            comm = new SqlCommand($"UPDATE TB_Customers SET Name='{user.Name}', Email='{user.Email}', Password='{user.Password}', token='{user.token}' WHERE CustomersCode ='{user.CustomersCode}'", con);
            res = comm.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }
        public int UpdateKitchenManagers(KitchenManagers user) // UpdateKitchenManagers
        {
            int res = 0;
            SqlCommand comm;
            SqlConnection con = connect();
            comm = new SqlCommand($"UPDATE TB_Kitchen_Managers SET Name='{user.Name}', Email='{user.Email}', Password='{user.Password}' WHERE KitchenManagersCode ='{user.KitchenManagersCode}'", con);
            res = comm.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }
        public int UpdateDeliveryPerson(DeliveryPersons user) // UpdateDeliveryPerson
        {
            int res = 0;
            SqlCommand comm;
            SqlConnection con = connect();
            comm = new SqlCommand($"UPDATE TB_Delivery_persons SET Name='{user.Name}', Email='{user.Email}', Password='{user.Password}' WHERE DeliveryPersonCode ='{user.DeliveryPersonCode}'", con);
            res = comm.ExecuteNonQuery();
            con.Close();
            if (res == 0)
            {
                throw new Exception("Not Exist");
            }
            return res;
        }
        public List<DeliveryPersons> getDeliveryPerson() //show all DeliveryPerson
        {
            List<DeliveryPersons> users = new List<DeliveryPersons>();
            DeliveryPersons u = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM TB_Delivery_persons", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                u = new DeliveryPersons(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]), Convert.ToInt32(reader["DeliveryPersonCode"]));
                users.Add(u);
            }
            con.Close();
            return users;
        }
        public List<KitchenManagers> getKitchenManagers() //show all KitchenManagers
        {
            List<KitchenManagers> users = new List<KitchenManagers>();
            KitchenManagers u = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM TB_Kitchen_Managers", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                u = new KitchenManagers(Convert.ToString(reader["Name"]), Convert.ToString(reader["Email"]), Convert.ToString(reader["Password"]), Convert.ToInt32(reader["KitchenManagersCode"]));
                users.Add(u);
            }
            con.Close();
            return users;
        }
        public List<Orders> GetDoneOrders() // show done orders for delivery person
        {
            List<Orders> ordersList = new List<Orders>();
            Orders o = null;
            SqlConnection con = connect();
            SqlCommand comm = new SqlCommand($"SELECT * FROM TB_Orders where OrderingProcess = 'sendToDelivery'", con);
            SqlDataReader reader = comm.ExecuteReader();
            while (reader.Read())
            {
                o = new Orders(Convert.ToString(reader["Name"]), Convert.ToString(reader["Phone"]), Convert.ToString(reader["Address"]), Convert.ToString(reader["OrderingProcess"]), Convert.ToInt32(reader["OrderCode"]), Convert.ToBoolean(reader["Delivery"]), Convert.ToInt32(reader["id"]));
                ordersList.Add(o);

            }
            con.Close();
            return ordersList;
        }

    }
}