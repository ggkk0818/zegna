using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

public partial class image : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        System.Threading.Thread.Sleep(3000);
        string param = Request.QueryString["path"];
        string path = Server.MapPath(param != null && param.Length > 0 ? param :"img/loading.gif");
        Response.Clear();
        if (File.Exists(path))
        {
            Response.ContentType = "image/" + Path.GetExtension(path);
            using (FileStream fs = new FileStream(path, FileMode.Open))
            {
                Response.Headers.Set("Content-Length", fs.Length.ToString());
                Response.Flush();
                byte[] buffer = new byte[1024];
                int c;
                while ((c = fs.Read(buffer, 0, buffer.Length)) > 0)
                {
                    byte[] data = new byte[c];
                    Array.Copy(buffer, data, c);
                    Response.BinaryWrite(data);
                }
            }
            //Response.WriteFile(path);
        }
        Response.Flush();
        Response.End();
    }
}