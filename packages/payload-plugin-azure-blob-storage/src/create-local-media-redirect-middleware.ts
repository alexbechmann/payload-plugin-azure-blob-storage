import { AzureBlobStorageMediaPluginOptionsType } from './azure-blob-storage-media-plugin-options';
import express from 'express';

export const createLocalMediaRedirectMiddleware: (
  options: AzureBlobStorageMediaPluginOptionsType,
) => [string, express.RequestHandler] = (options) => [
  '/az-media/*',
  (req: express.Request, res: express.Response) => {
    const fileName = req.url.split('/')[2];
    console.log(req.url);
    res.redirect(`${options.baseUrl}/${options.containerName}/${fileName}`);
  },
];
