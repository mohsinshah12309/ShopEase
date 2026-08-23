/**
 * Diagnostic: checks which Cloudinary Admin-API actions the configured
 * API key is allowed to perform. Helps pinpoint restricted-key issues
 * like: Request forbidden due to missing permissions (actions=["create"])
 */
require("dotenv").config();
const crypto = require("crypto");
const https = require("https");

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

function callApi(method, path) {
  return new Promise((resolve) => {
    const auth = Buffer.from(
      `${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`,
    ).toString("base64");
    const options = {
      hostname: "api.cloudinary.com",
      path,
      method,
      headers: { Authorization: `Basic ${auth}` },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () =>
        resolve({ status: res.statusCode, body: data.slice(0, 300) }),
      );
    });
    req.on("error", (e) => resolve({ status: "ERR", body: e.message }));
    req.end();
  });
}

(async () => {
  console.log(`Cloud: ${CLOUDINARY_CLOUD_NAME} | Key: ${CLOUDINARY_API_KEY}\n`);

  // 1. Ping (account-level connectivity)
  const ping = await callApi("GET", `/v1_1/${CLOUDINARY_CLOUD_NAME}/ping`);
  console.log("[ping]           ->", ping.status, ping.body);

  // 2. List resources (read permission)
  const list = await callApi(
    "GET",
    `/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image?max_results=1`,
  );
  console.log("[read resources] ->", list.status, list.body);

  // 2b. List access keys + their permissions/types
  const keys = await callApi(
    "GET",
    `/v1_1/${CLOUDINARY_CLOUD_NAME}/access_keys`,
  );
  console.log("[access keys]    ->", keys.status, keys.body);

  const keysAlt = await callApi(
    "GET",
    `/v1_1/${CLOUDINARY_CLOUD_NAME}/access_keys?page_size=10`,
  );
  console.log(
    "[access keys v2] ->",
    keysAlt.status,
    keysAlt.body.slice(0, 500),
  );

  // 3. Signed upload (create permission)
  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest("hex");

  const boundary = "----diagBoundary";
  const fields = `--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${CLOUDINARY_API_KEY}\r\n--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`;
  const fileHeader = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="pixel.png"\r\nContent-Type: image/png\r\n\r\n`;
  // 1x1 transparent PNG
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const payload = Buffer.concat([
    Buffer.from(fields + fileHeader),
    png,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);

  const uploadResult = await new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.cloudinary.com",
        path: `/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": payload.length,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: data.slice(0, 300) }),
        );
      },
    );
    req.write(payload);
    req.end();
  });
  console.log("[upload/create]  ->", uploadResult.status, uploadResult.body);
})();
