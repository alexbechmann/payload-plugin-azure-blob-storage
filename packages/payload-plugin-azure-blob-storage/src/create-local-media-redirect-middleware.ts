import { AzureBlobStorageMediaPluginOptionsType } from "./azure-blob-storage-media-plugin-options";
import express from "express";
import { CollectionConfig } from "payload/types";

export const createLocalMediaRedirectMiddleware: (
  collectionConfig: CollectionConfig,
  options: AzureBlobStorageMediaPluginOptionsType
) => [string, express.RequestHandler] = (collectionConfig, options) => [
  `/${collectionConfig.slug}/*`,
  (req: express.Request, res: express.Response) => {
    const fileName = req.baseUrl.split("/")[2];
    console.log(req.baseUrl, req.url, req.route, `/${collectionConfig.slug}/*`);
    res.redirect(`${options.baseUrl}/${options.containerName}/${fileName}`);
  },
];
