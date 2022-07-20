import { azureStoragePluginOptionsType } from "./azure-blob-storage-media-plugin-options";
import express from "express";
import { CollectionConfig } from "payload/types";

export const createLocalMediaRedirectMiddleware: (
  collectionConfig: CollectionConfig,
  options: azureStoragePluginOptionsType
) => [string, express.RequestHandler] = (collectionConfig, options) => [
  `/${collectionConfig.slug}/*`,
  (req: express.Request, res: express.Response) => {
    const fileName = req.baseUrl.split("/")[2];
    res.redirect(`${options.baseUrl}/${options.containerName}/${fileName}`);
  },
];
