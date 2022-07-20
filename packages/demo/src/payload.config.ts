import { buildConfig } from "payload/config";
import path from "path";
import Examples from "./collections/Examples";
import Users from "./collections/Users";
import { createAzureBlobStorageMediaPlugin } from "payload-plugin-azure-blob-storage";
import { Media } from "./collections/Media";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  collections: [Users, Examples, Media],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  localization: {
    defaultLocale: "en",
    locales: ["en", "da"],
  },
  plugins: [
    createAzureBlobStorageMediaPlugin({
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
      baseUrl: process.env.AZURE_STORAGE_ACCOUNT_BASEURL,
      allowContainerCreate: process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
    }),
  ],
});
