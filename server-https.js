const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;

// عندما يكون التطبيق جاهز، قم بإنشاء الخادم
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // قراءة شهادات SSL
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "cert.key")),
    cert: fs.readFileSync(path.join(__dirname, "cert.crt")),
  };

  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on https://${hostname}:${port}`);
      console.log(`> Local: https://localhost:${port}`);
      console.log(`> Network: https://10.120.250.175:${port}`);
      console.log("");
      console.log("📱 للوصول من الموبايل:");
      console.log("1. تأكد من أن الموبايل متصل بنفس الشبكة");
      console.log("2. افتح المتصفح واذهب إلى: https://10.120.250.175:3000");
      console.log('3. قد تظهر رسالة تحذير أمني - اضغط "Advanced" ثم "Proceed"');
      console.log("");
      console.log("⚠️  إذا لم تعمل الكاميرا، تأكد من:");
      console.log("- استخدام HTTPS");
      console.log("- السماح للكاميرا في إعدادات المتصفح");
      console.log("- استخدام نفس الشبكة المحلية");
    });
});
