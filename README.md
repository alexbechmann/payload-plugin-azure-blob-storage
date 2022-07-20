# payload-plugin-azure-blob-storage

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=rounded-square)](https://github.com/prettier/prettier)
[![CI](https://github.com/alexbechmann/payload-plugin-azure-blob-storage/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alexbechmann/payload-plugin-azure-blob-storage/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/payload-plugin-azure-blob-storage.svg)](https://www.npmjs.com/package/payload-plugin-azure-blob-storage)

Azure blob storage plugin for Payload CMS <https://payloadcms.com/>

## Prerequisites

- A Payload CMS project

## Installation

```bash
npm install payload-plugin-azure-blob-storage
```

## Usage

### Optionally run blob storage emulator with docker-compose

```yaml
version: "3"

services:
  azure-storage:
    image: mcr.microsoft.com/azure-storage/azurite:3.18.0
    restart: always
    command: "azurite --loose --blobHost 0.0.0.0 --tableHost 0.0.0.0 --queueHost 0.0.0.0"
    ports:
      - "10000:10000"
      - "10001:10001"
      - "10002:10002"
    volumes:
      - azurestoragedata:/data"

  # Uncomment to use mongo in docker for payload database
  # Connection string is: mongodb://localhost:27017/mydb
  # mongo:
  #   image: mongo
  #   ports:
  #     - "27017:27017"
  #   volumes:
  #     - mongodata:/data/db

  # mongoexpress:
  #   image: mongo-express
  #   ports:
  #     - "8081:8081"
  #   restart: always
  #   environment:
  #     - ME_CONFIG_MONGODB_ENABLE_ADMIN=true
  #     - ME_CONFIG_MONGODB_URL=mongodb://mongo:27017
  #   links:
  #     - mongo

volumes:
  azurestoragedata:
  mongodata:
```

### Set environment variables for Azure Blob Storage

```bash
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;QueueEndpoint=http://localhost:10001/devstoreaccount1;
PAYLOAD_PUBLIC_AZURE_STORAGE_CONTAINER_NAME=az-media
AZURE_STORAGE_ALLOW_CONTAINER_CREATE=true
PAYLOAD_PUBLIC_AZURE_STORAGE_ACCOUNT_BASEURL=http://localhost:10000/devstoreaccount1
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:5000
```

### Create options file for azure blob storage config

```typescript
import { azureStoragePluginOptionsType } from "payload-plugin-azure-blob-storage";

export const azureStoragePluginOptions: azureStoragePluginOptionsType = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  containerName: process.env.PAYLOAD_PUBLIC_AZURE_STORAGE_CONTAINER_NAME,
  baseUrl: process.env.PAYLOAD_PUBLIC_AZURE_STORAGE_ACCOUNT_BASEURL,
  allowContainerCreate: process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
};
```

### Create Media collection

File: `src/collections/Media.ts`

```typescript
import { FileSizes } from "payload/dist/uploads/types";
import { CollectionConfig } from "payload/types";
import { createUploadMediaHooks } from "payload-plugin-azure-blob-storage";
import { azureStoragePluginOptions } from "../azure-blob-storage-options"; // path to your options file

const hooks = createUploadMediaHooks(azureStoragePluginOptions);

export const Media: CollectionConfig = {
  slug: "az-media",
  admin: {
    useAsTitle: "name",
    description: "test",
  },
  labels: {
    singular: "Media",
    plural: "Media",
  },
  access: {
    read: () => true,
  },
  hooks,
  upload: {
    adminThumbnail: (args) => {
      const doc = args.doc as Record<string, FileSizes>;
      const sizes: FileSizes = doc.sizes;
      const squareCrop = sizes.square;
      const { baseUrl, containerName } = azureStoragePluginOptions;
      const url = `${baseUrl}/${containerName}/${squareCrop.filename}`;
      return url;
    },
    disableLocalStorage: true,
    staticURL: "/az-media",
    imageSizes: [
      {
        height: 400,
        width: 400,
        crop: "center",
        name: "square",
      },
      {
        height: 900,
        width: 450,
        crop: "center",
        name: "sixteenByNineMedium",
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "alt",
      type: "text",
    },
  ],
};
```

### In your `payload.config.ts` file

```ts
import { buildConfig } from "payload/config";
import path from "path";
import Users from "./collections/Users";
import { createAzureBlobStorageMediaPlugin } from "payload-plugin-azure-blob-storage";
import { azureStoragePluginOptions } from "./azure-blob-storage-options";
import { Media } from "./collections/Media";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  localization: {
    defaultLocale: "en",
    locales: ["en", "da"],
  },
  plugins: [createAzureBlobStorageMediaPlugin(azureStoragePluginOptions)],
});
```

### In server file `src/server.ts`

Add middleware for each collection that uses azure blob storage to redirect requests to the azure blob storage file location

```ts
import { azureStoragePluginOptions } from "./azure-blob-storage-options";

app.use(...createLocalMediaRedirectMiddleware(Media, azureStoragePluginOptions));
```
