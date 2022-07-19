import { FileData } from 'payload/dist/uploads/types';
import { PayloadRequest } from 'payload/dist/express/types';

export function getIncomingFiles({ req, data }: { data: FileData; req: PayloadRequest }) {
  const fileData = data;
  const file: {
    data: Buffer;
    encoding: string;
    md5: string;
    mimetype: string;
    mv: () => void; // needs to be described
    name: string;
    size: number;
    tempFilePath: string;
    truncated: boolean;
  } = (req as any).files?.file;

  let files: { buffer: Buffer; filename: string; mimeType: string }[] = [];

  if (file) {
    files = [
      {
        filename: fileData.filename,
        mimeType: fileData.mimeType,
        buffer: file.data,
      },
    ];
    if (fileData?.sizes) {
      Object.entries(fileData.sizes).forEach(([key, resizedFileData]) => {
        files = files.concat({
          filename: `${resizedFileData.filename}`,
          mimeType: data.mimeType,
          buffer: req.payloadUploadSizes[key],
        });
      });
    }
  }

  return {
    hasFile: Boolean(file),
    files,
  };
}
