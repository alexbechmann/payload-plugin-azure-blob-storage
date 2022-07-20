# payload-plugin-azure-blob-storage

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=rounded-square)](https://github.com/prettier/prettier)
[![CI](https://github.com/alexbechmann/payload-plugin-azure-blob-storage/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alexbechmann/payload-plugin-azure-blob-storage/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/payload-plugin-azure-blob-storage.svg)](https://www.npmjs.com/package/payload-plugin-azure-blob-storage)

Azure blob storage plugin for Payload CMS <https://payloadcms.com/>.

Store uploads for a payload collection in Azure blob storage.

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
AZURE_STORAGE_CONTAINER_NAME=az-media
AZURE_STORAGE_ALLOW_CONTAINER_CREATE=true
AZURE_STORAGE_ACCOUNT_BASEURL=http://localhost:10000/devstoreaccount1
# Rest of your environment variables
```

### Create Media collection

Create file: `src/collections/Media.ts`

```typescript
import { CollectionConfig } from "payload/types";
import { createUploadMediaHooks } from "payload-plugin-azure-blob-storage";

const hooks = createUploadMediaHooks({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
  baseUrl: process.env.AZURE_STORAGE_ACCOUNT_BASEURL,
  allowContainerCreate: process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === "true",
});

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
    disableLocalStorage: true,
    adminThumbnail: "square",
    imageSizes: [
      {
        height: 400,
        width: 400,
        crop: "center",
        name: "square",
      },
      {
        width: 900,
        height: 450,
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

### Add collection to payload config

Update file: `payload.config.ts`

```ts
import { buildConfig } from "payload/config";
import { Media } from "./collections/Media";

export default buildConfig({
  collections: [
    // Rest of your collections
    Media,
  ],
  // ... Rest of your config
});
```
