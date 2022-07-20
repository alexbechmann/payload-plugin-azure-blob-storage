import { Config } from "payload/config";
import merge from "lodash/merge";
import { AzureStoragePluginOptionsType } from "./azure-blob-storage-media-plugin-options";
import { ensureBlobContainerExists } from "./ensure-blob-container-exists";

export const createAzureBlobStorageMediaPlugin = (options: AzureStoragePluginOptionsType) => {
  return (config: Config): Config => {
    if (options.allowContainerCreate) {
      ensureBlobContainerExists(options);
    }
    global["PAYLOAD_AZURE_CONFIG"] = options;
    return merge<Config, Partial<Config>>(config, {
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
