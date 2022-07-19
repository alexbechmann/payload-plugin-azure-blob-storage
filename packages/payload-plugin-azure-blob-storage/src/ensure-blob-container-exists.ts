import { BlobServiceClient } from '@azure/storage-blob';
import { AzureBlobStorageMediaPluginOptionsType } from './azure-blob-storage-media-plugin-options';
import chalk from 'chalk';

export async function ensureBlobContainerExists(options: AzureBlobStorageMediaPluginOptionsType) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(options.connectionString);
  const containerClient = blobServiceClient.getContainerClient(options.containerName);
  const createContainerResponse = await containerClient.createIfNotExists({ access: 'blob' });
  if (createContainerResponse.succeeded) {
    console.log(
      `${chalk.green('Successfully created storage container')} ${options.containerName}`,
    );
  } else {
    console.log(
      `${chalk.cyan('Skipped storage container creation')} ${options.containerName}`,
      createContainerResponse.errorCode,
    );
  }
}
