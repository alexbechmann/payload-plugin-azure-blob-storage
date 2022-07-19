import { FileSizes } from 'payload/dist/uploads/types';
import { CollectionConfig } from 'payload/types';
import { AzureBlobStorageMediaPluginOptionsType } from './azure-blob-storage-media-plugin-options';
import { createUploadMediaHooks } from './create-upload-media-hooks';

export function createBlobMediaCollection(options: AzureBlobStorageMediaPluginOptionsType) {
  const hooks = createUploadMediaHooks(options);
  const blobMediaCollection: CollectionConfig = {
    slug: 'az-media',
    admin: {
      useAsTitle: 'name',
      description: 'test',
    },
    labels: {
      singular: 'Media',
      plural: 'Media',
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
        return `/az-media/${squareCrop?.filename}`;
      },
      disableLocalStorage: true,
      staticURL: '/az-media',
      imageSizes: [
        {
          height: 400,
          width: 400,
          crop: 'center',
          name: 'square',
        },
        {
          height: 900,
          width: 450,
          crop: 'center',
          name: 'sixteenByNineMedium',
        },
      ],
    },
    fields: [
      {
        name: 'name',
        type: 'text',
      },
      {
        name: 'alt',
        type: 'text',
      },
      {
        name: 'category',
        type: 'select',
        options: [
          {
            label: 'test',
            value: 'test',
          },
          {
            label: 'test1',
            value: 'test1',
          },
        ],
      },
    ],
  };

  return blobMediaCollection;
}
