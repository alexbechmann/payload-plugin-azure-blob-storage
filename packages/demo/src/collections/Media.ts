import { CollectionConfig } from "payload/types";
import { createUploadMediaHooks } from "payload-plugin-azure-blob-storage";

const hooks = createUploadMediaHooks();

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
    {
      name: "category",
      type: "select",
      options: [
        {
          label: "test",
          value: "test",
        },
        {
          label: "test1",
          value: "test1",
        },
      ],
    },
  ],
};
