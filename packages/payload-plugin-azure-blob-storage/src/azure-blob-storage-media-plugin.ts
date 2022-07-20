import { Config } from "payload/config";
import merge from "lodash/merge";
import { azureStoragePluginOptionsType } from "./azure-blob-storage-media-plugin-options";
// import { createBlobMediaCollection } from "./create-blob-media-collection";
import { ensureBlobContainerExists } from "./ensure-blob-container-exists";

export const createAzureBlobStorageMediaPlugin = (options: azureStoragePluginOptionsType) => {
  return (config: Config): Config => {
    // const blobMediaCollection = createBlobMediaCollection(options);
    if (options.allowContainerCreate) {
      ensureBlobContainerExists(options);
    }
    return merge<Config, Partial<Config>>(config, {
      // collections: [...config.collections, blobMediaCollection],
      graphQL: {
        queries: (graphQL, _payload) => {
          return {
            azureBlobInfo: {
              type: graphQL.GraphQLString,
              resolve(_source, _args, _context) {
                return "hi from azure blob storage media plugin!";
              },
            },
          };
        },
      },
    });
  };
};
