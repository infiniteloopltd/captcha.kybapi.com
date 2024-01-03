using System;
using System.IO;
using System.Net;
using System.Text;

namespace Captcha.KybApi.com
{
    public partial class validate : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var token = Request.QueryString["token"];
            var response = ValidateToken(token);
            Response.Write(response);
        }

        public string ValidateToken(string token)
        {   
            const string secretKey = "6LciI0QpAAAAAEAviIIE7oPx13F0K3NX35evxT5H";
            const string googleVerificationUrl = "https://www.google.com/recaptcha/api/siteverify";

            // Create a request to the Google reCAPTCHA verification endpoint
            var request = (HttpWebRequest)WebRequest.Create(googleVerificationUrl);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            var postData = $"secret={secretKey}&response={token}";
            var byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentLength = byteArray.Length;
            using (var dataStream = request.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
            }
            using (var response = request.GetResponse())
            {
                using (var responseStream = response.GetResponseStream())
                {
                    if (responseStream == null) throw new Exception("null response");
                    using (var reader = new StreamReader(responseStream))
                    {
                        var jsonResponse = reader.ReadToEnd();
                        return jsonResponse;
                    }
                }
            }
        }
    }
}