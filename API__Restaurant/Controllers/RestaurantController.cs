using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using API__Restaurant.Models;


namespace API__Restaurant.Controllers
{

    
    public class RestaurantController : ApiController
    {
        
        private static DBservice db = new DBservice();//אובייקט צד דתא בייס

        [Route("api/getAllUser")] //שליפת כל היוזרים מטבלת לקוחות
        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {
                return Ok(db.getUsers());
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        [Route("api/createNewuser")]// יצירת משתמש חדש
        [HttpPost]
        public IHttpActionResult Post([FromBody] Customers user)
        {
            try
            {
                
                return Created(new Uri(Request.RequestUri.AbsoluteUri + user.Name), db.CreatNewUser(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("api/login")]//כניסת משתמש למערכת
        [HttpPost]
        public IHttpActionResult GetU([FromBody] Customers user)
        {
            try
            {
                Object u = db.getUser(user.Email, user.Password);
                if (u == null)
                {
                    return Content(HttpStatusCode.NotFound, false);
                }
                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Route("api/uploadMenu")]//העלאת מנה חדשה 
        [HttpPost]
        public IHttpActionResult Upload([FromBody] FullMenu menu)
        {
            ImgRes res = new ImgRes();
            try
            {
                var src = DateTime.Now;
                var hm = new DateTime(src.Year, src.Month, src.Day, src.Hour, src.Minute, src.Second);
                string folder = $"{menu.nameImg}_{hm.Day}_{hm.Month}_{hm.Year}_{hm.Hour}_{hm.Minute}_{hm.Second}_{hm.Millisecond}";

                //get the path
                string path = HttpContext.Current.Server.MapPath($@"~/MenuImages/{folder}");

                //create the folder if not exists
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                //create the full path for the image
                string imageName = $"{menu.nameImg}.{menu.imgType}";
                string imagePath = Path.Combine(path, imageName);

                //create the res object
                res.path = $"{Server.GetServerUrl()}/MenuImages/{folder}/{imageName}";
                db.uploadMenu(menu, res.path);

                //save the image data
                byte[] imgBytes = Convert.FromBase64String(menu.base64);
                File.WriteAllBytes(imagePath, imgBytes);


                res.isOk = true;
                return Ok(res);
            }
            catch (Exception e)
            {
                res.message = e.Message;
                res.isOk = false;
                return Content(HttpStatusCode.BadRequest, res);
            }

        }

        [Route("api/getMenu")]//שליפת מנות
        [HttpPost]
        public IHttpActionResult GetMenu([FromBody] string category)
        {
            try
            {
                return Ok(db.getMenu(category));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        [Route("api/getToken")]//שליפת טוקן
        [HttpPost]
        public IHttpActionResult GetToken([FromBody] string id)
        {
            try
            {
                return Ok(db.getToken(id));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        [Route("api/createNewOrder")]//יצירת הזמנה חדשה
        [HttpPost]
        public IHttpActionResult NewOrfer([FromBody] OrderDetailsSent CustomerOrder)
        {
            try
            {

                return Created(new Uri(Request.RequestUri.AbsoluteUri + CustomerOrder.Name), db.CreatNewOrder(CustomerOrder));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("api/orders")]//שליפת כל ההזמנות
        [HttpGet]
        public IHttpActionResult GetOrders()
        {
            try
            {
                List<Orders> u = db.GetOreders();
                if (u == null)
                {
                    return Content(HttpStatusCode.NotFound, false);
                }
                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Route("api/ordersD")]//שליפת כל המנות לפי הזמנה
        [HttpPost]
        public IHttpActionResult GetOrdersD([FromBody] Orders order)
        {
            try
            {
                List<RestaurantMenu> u = db.GetOredersD(order);
                if (u == null)
                {
                    return Content(HttpStatusCode.NotFound, false);
                }
                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Route("api/sendToDelivery")]//שליפת כל המנות לפי הזמנה
        [HttpPost]
        public IHttpActionResult sendToDelivery([FromBody] Orders order) // עדכון המנה למוכנה למשלוח
        {
            try
            {
                int res = db.sendToDelivery(order);
                return Ok("order update");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, "error");
            }

        }

        [Route("api/deleteorder")]// מחיקת ההזמנה מכל הטבלאות הקשורות לה
        [HttpPost]
        public IHttpActionResult DeleteOrder([FromBody] Orders order)
        {
            try
            {
                int res = db.DeleteOrder(order);
                return Ok("order deleted");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, $"error");
            }
        }

        [Route("api/deletProduct")]// מחיקת ההזמנה מכל הטבלאות הקשורות לה
        [HttpPost]
        public IHttpActionResult DeleteOrder([FromBody] string productCode)
        {
            try
            {
                int res = db.DeleteProduct(productCode);
                return Ok("order deleted");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, $"error");
            }
        } // מחיקת מנה מהתפריט

        [Route("api/UpdateProduct")]//שליפת כל המנות לפי הזמנה
        [HttpPost]
        public IHttpActionResult UpdateProduct([FromBody] FullMenu menu) // עדכון המנה 
        {
            if (menu.base64=="not")
            {
                try
                {
                    int res = db.UpdateProduct(menu, "");
                    return Ok("order update");
                }
                catch (Exception ex)
                {
                    return Content(HttpStatusCode.NotFound, "error");
                }
                

            }
            else
            {
                ImgRes res = new ImgRes();
                try
                {
                    var src = DateTime.Now;
                    var hm = new DateTime(src.Year, src.Month, src.Day, src.Hour, src.Minute, src.Second);
                    string folder = $"{menu.nameImg}_{hm.Day}_{hm.Month}_{hm.Year}_{hm.Hour}_{hm.Minute}_{hm.Second}_{hm.Millisecond}";

                    //get the path
                    string path = HttpContext.Current.Server.MapPath($@"~/MenuImages/{folder}");

                    //create the folder if not exists
                    if (!Directory.Exists(path))
                        Directory.CreateDirectory(path);

                    //create the full path for the image
                    string imageName = $"{menu.nameImg}.{menu.imgType}";
                    string imagePath = Path.Combine(path, imageName);

                    //create the res object
                    res.path = $"{Server.GetServerUrl()}/MenuImages/{folder}/{imageName}";
                    db.UpdateProduct(menu, res.path);

                    //save the image data
                    byte[] imgBytes = Convert.FromBase64String(menu.base64);
                    File.WriteAllBytes(imagePath, imgBytes);


                    res.isOk = true;
                    return Ok(res);
                }
                catch (Exception e)
                {
                    res.message = e.Message;
                    res.isOk = false;
                    return Content(HttpStatusCode.BadRequest, res);
                }

            }
           
        }


        [Route("api/DelDeliveryPerson")]// מחיקת שליח מטבלת שליחית
        [HttpPost]
        public IHttpActionResult DeleteDeliveryPerson([FromBody] string DeliveryPersonCode)
        {
            try
            {
                int res = db.DeleteDeliveryPerson(DeliveryPersonCode);
                return Ok("deleted");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, $"error");
            }
        } 


        [Route("api/DelKitchenManagers")]// מחיקת מנהל מטבח מטבלת מנהלי מטבח
        [HttpPost]
        public IHttpActionResult DeleteKitchenManagers([FromBody] string KitchenManagersCode)
        {
            try
            {
                int res = db.DeleteKitchenManagers(KitchenManagersCode);
                return Ok("deleted");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, $"error");
            }
        } 


        [Route("api/DelCustomers")]// מחיקת לקוח מטבלת לקוחות
        [HttpPost]
        public IHttpActionResult DeleteCustomers([FromBody] string CustomersCode)
        {
            try
            {
                int res = db.DeleteCustomers(CustomersCode);
                return Ok("deleted");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, $"error");
            }
        } 

        [Route("api/createKitchenManagers")]// יצירת מנהל מטבח חדש
        [HttpPost]
        public IHttpActionResult createKitchenManagers([FromBody] KitchenManagers user)
        {
            try
            {

                return Created(new Uri(Request.RequestUri.AbsoluteUri + user.Name), db.CreateKitchenManagers(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("api/createDeliveryPerson")]// יצירת שליח חדש
        [HttpPost]
        public IHttpActionResult createDeliveryPerson([FromBody] DeliveryPersons user)
        {
            try
            {

                return Created(new Uri(Request.RequestUri.AbsoluteUri + user.Name), db.CreateDeliveryPerson(user));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("api/UpdateCustomers")]//עדכון פרטי לקוח
        [HttpPost]
        public IHttpActionResult UpdateCustomers([FromBody] Customers user)  
        {
                try
                {
                    int res = db.UpdateCustomers(user);
                    return Ok("user update");
                }
                catch (Exception ex)
                {
                    return Content(HttpStatusCode.NotFound, "error");
                }
        }

        [Route("api/UpdateKitchenManagers")]//עדכון פרטי מנהל מטבח
        [HttpPost]
        public IHttpActionResult UpdateKitchenManagers([FromBody] KitchenManagers user)  
        {
            try
            {
                int res = db.UpdateKitchenManagers(user);
                return Ok("user update");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, "error");
            }
        }

        [Route("api/UpdateDeliveryPerson")]//עדכון פרטי שליח
        [HttpPost]
        public IHttpActionResult UpdateDeliveryPerson([FromBody] DeliveryPersons user) 
        {
            try
            {
                int res = db.UpdateDeliveryPerson(user);
                return Ok("user update");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.NotFound, "error");
            }
        }


        [Route("api/getDeliveryPerson")] //שליפת כל השליחים 
        [HttpGet]
        public IHttpActionResult getDeliveryPerson()
        {
            try
            {
                return Ok(db.getDeliveryPerson());
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }


        [Route("api/getKitchenManagers")] //שליפת כל מנהלי המבטבח
        [HttpGet]
        public IHttpActionResult getKitchenManagers()
        {
            try
            {
                return Ok(db.getKitchenManagers());
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        [Route("api/doneOrders")]//שליפת כל ההזמנות
        [HttpGet]
        public IHttpActionResult GetDoneOrders()
        {
            try
            {
                List<Orders> u = db.GetDoneOrders();
                if (u == null)
                {
                    return Content(HttpStatusCode.NotFound, false);
                }
                return Ok(u);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }





    }
}
