require("dotenv").config();
const https = require("https");

const auth = Buffer.from(
  `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`,
).toString("base64");

const options = {
  hostname: "api.cloudinary.com",
  path: `/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/ping`,
  headers: { Authorization: `Basic ${auth}` },
};

https.get(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Body:", data);
  });
});
