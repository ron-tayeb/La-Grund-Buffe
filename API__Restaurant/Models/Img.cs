using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API__Restaurant.Models
{
    public class ImgReq
    {
        public string base64 { get; set; }
        public string imgType { get; set; }
        public string name { get; set; }
    }

    public class ImgRes
    {
        public string message { get; set; }
        public string path { get; set; }
        public bool isOk { get; set; }
    }

    public static class Server
    {
        public static string GetServerUrl()
        {
            var request = HttpContext.Current.Request;

            return request.Url.Scheme + "://" + request.Url.Authority + request.ApplicationPath.TrimEnd('/');
        }
    }
}