import imageCompression from "browser-image-compression";

export function readErrorMessageFromError(e) {
  let error_message = e.toString();
  try {
    const { response } = e;
    const { status, data } = response;
    const { message, errors, error_message: _error_message } = data;

    if (typeof errors === "string") {
      return `${errors} (${status})`;
    }

    if (typeof _error_message === "string") {
      return `${_error_message} (${status})`;
    }

    if (typeof message === "string") {
      return `${message} (${status})`;
    }

    const { error_description, error } = message;
    if (error_description) {
      error_message = `${error_description} (${status})`;
    } else if (error) {
      error_message = `${error} (${status})`;
    }
  } catch (_e) {
    // do nothing
  }
  return error_message;
}

export async function compressBase64Image(
  base_64_string,
  maxSizeMB = 0.2,
  maxWidthOrHeight = 1920
) {
  try {
    // Convert Base64 to Blob
    const byteString = atob(base_64_string.split(",")[1]);
    const mimeString = base_64_string.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Compress the image
    const compressedFile = await imageCompression(blob, {
      maxSizeMB, // Maximum size in MB
      maxWidthOrHeight, // Maximum width or height in pixels
      useWebWorker: true, // Use web worker for better performance
    });

    // Convert compressed Blob back to Base64
    const compressedBase64 = await imageCompression.getDataUrlFromFile(
      compressedFile
    );
    return compressedBase64;
  } catch (error) {
    console.error("Error compressing image:", error);
    return base_64_string;
  }
}
