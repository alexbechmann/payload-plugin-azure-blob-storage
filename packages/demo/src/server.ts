import express from "express";
import payload from "payload";
import { createLocalMediaRedirectMiddleware } from "payload-plugin-azure-blob-storage";
import { azureStoragePluginOptions } from "./azure-blob-storage-options";
import { Media } from "./collections/Media";

const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

app.use(...createLocalMediaRedirectMiddleware(Media, azureStoragePluginOptions));

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
});

// Add your own express routes here

app.listen(3000);
