import { buildConfig } from "payload/config";
import path from "path";
import Examples from "./collections/Examples";
import Users from "./collections/Users";
import { createAzureBlobStorageMediaPlugin } from "payload-plugin-azure-blob-storage";
import { azureStoragePluginOptions } from "./azure-blob-storage-options";
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
  plugins: [createAzureBlobStorageMediaPlugin(azureStoragePluginOptions)],
});
