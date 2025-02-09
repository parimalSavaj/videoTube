export function getPublicIdFromUrl(url) {
  if (!url) {
    throw new Error("URL is required to extract public ID");
  }

  // Extract the path after '/upload/' in the Cloudinary URL
  const match = url.match(/\/upload\/(?:[^/]+\/)?([^/.]+)/);

  if (!match || !match[1]) {
    throw new Error("Invalid Cloudinary URL");
  }

  return match[1];
}
