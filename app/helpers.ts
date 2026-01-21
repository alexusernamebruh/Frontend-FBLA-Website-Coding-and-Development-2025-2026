export const truncate = (str: string, truncateLength: number) => {
  if (str.length > truncateLength) {
    return str.slice(0, truncateLength) + '...';
  } else {
    return str;
  }
};

export const downloadBlob = (blob: Blob | MediaSource, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface BufferObject {
  type: string;
  data: number[];
}

export const bufferToBlob = (
  buffer: BufferObject | string,
  contentType: string = 'application/pdf',
): Blob => {
  if (typeof buffer !== 'string') {
    if (buffer.type === 'Buffer') {
      const uint8Array = new Uint8Array(buffer.data); // Convert Buffer to Uint8Array
      return new Blob([uint8Array], { type: contentType });
    }
  }
  throw new Error('Invalid Buffer Object');
};
