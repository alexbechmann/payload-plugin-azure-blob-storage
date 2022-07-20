import { BeforeChangeHook } from "payload/dist/globals/config/types";
import { CollectionConfig } from "payload/types";
import { AzureStoragePluginOptionsType } from "./azure-blob-storage-media-plugin-options";
import { BlobServiceClient } from "@azure/storage-blob";
import chalk from "chalk";
import { getIncomingFiles } from "./get-incoming-files";
import { AfterDeleteHook, AfterReadHook } from "payload/dist/collections/config/types";
import { FileData } from "payload/dist/uploads/types";

export function createUploadMediaHooks(): CollectionConfig["hooks"] {
  const afterRead: AfterReadHook[] = [
    ({ doc }) => {
      const options = global["PAYLOAD_AZURE_CONFIG"] as AzureStoragePluginOptionsType;
      doc.url = `${options.baseUrl}/${options.containerName}/${doc.filename}`;
      Object.keys(doc.sizes).forEach((k) => {
        doc.sizes[k].url = `${options.baseUrl}/${options.containerName}/${doc.sizes[k].filename}`;
      });
    },
  ];
  const beforeChange: BeforeChangeHook[] = [
    async ({ data, req, originalDoc }) => {
      const options = global["PAYLOAD_AZURE_CONFIG"] as AzureStoragePluginOptionsType;
      const { hasFile, files } = getIncomingFiles({ data, req });
      if (hasFile) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(options.connectionString);
        const containerClient = blobServiceClient.getContainerClient(options.containerName);
        for (const file of files) {
          const blobName = file.filename;
          const blockBlobClient = containerClient.getBlockBlobClient(blobName);

          await blockBlobClient.upload(file.buffer, file.buffer.byteLength, {
            blobHTTPHeaders: { blobContentType: file.mimeType },
          });

          console.log(`${chalk.green("Successfully uploaded")} ${blobName}`);
        }
      } else {
        console.log(`${chalk.cyan("Skipped upload")} ${originalDoc?.id}`);
      }
    },
  ];
  const afterDelete: AfterDeleteHook[] = [
    async ({ req: _req, id: _id, doc }) => {
      const options = global["PAYLOAD_AZURE_CONFIG"] as AzureStoragePluginOptionsType;
      const fileData = doc as FileData;
      const blobServiceClient = BlobServiceClient.fromConnectionString(options.connectionString);
      const containerClient = blobServiceClient.getContainerClient(options.containerName);

      const filesToDelete: string[] = [
        fileData.filename,
        ...Object.entries(fileData.sizes).map(([_key, resizedFileData]) => resizedFileData.filename),
      ];

      for (const fileName of filesToDelete) {
        const blobName = fileName;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const deleteBlobResponse = await blockBlobClient.deleteIfExists();
        if (deleteBlobResponse.succeeded) {
          console.log(`${chalk.green("Successfully deleted")} ${blobName}`);
        } else {
          console.log(`${chalk.red("Delete failed")} ${blobName}`);
        }
      }
    },
  ];
  return {
    beforeChange,
    afterDelete,
    afterRead,
  };
}
