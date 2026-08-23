require("dotenv").config();
const crypto = require("crypto");
const https = require("https");

const timestamp = Math.round(Date.now() / 1000);
const paramsToSign = `timestamp=${timestamp}`;
const signature = crypto
  .createHash("sha1")
  .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
  .digest("hex");

const boundary = "----testBoundary123";
const imageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

https.get(imageUrl, (imgRes) => {
  const chunks = [];
  imgRes.on("data", (c) => chunks.push(c));
  imgRes.on("end", () => {
    const imageBuffer = Buffer.concat(chunks);

    const fields = {
      timestamp: timestamp.toString(),
      api_key: process.env.CLOUDINARY_API_KEY,
      signature,
    };

    let body = "";
    for (const [key, value] of Object.entries(fields)) {
      body += `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
    }
    body += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="sample.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`;

    const payload = Buffer.concat([
      Buffer.from(body, "utf8"),
      imageBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`, "utf8"),
    ]);

    const options = {
      hostname: "api.cloudinary.com",
      path: `/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": payload.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log("Status:", res.statusCode);
        console.log("Body:", data);
      });
    });

    req.write(payload);
    req.end();
  });
});
