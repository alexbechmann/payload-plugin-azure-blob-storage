import { AzureBlobStorageMediaPluginOptionsType } from "payload-plugin-azure-blob-storage";

export const azureBlobStorageMediaPluginOptions: AzureBlobStorageMediaPluginOptionsType = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
  baseUrl: process.env.AZURE_STORAGE_ACCOUNT_BASEURL,
  allowContainerCreate: process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
};
