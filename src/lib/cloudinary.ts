import { createHmac } from "crypto";

/**
 * Generate a signed Cloudinary upload URL for browser-direct uploads.
 *
 * Flow:
 * 1. Browser calls POST /api/upload with { folder, timestamp }
 * 2. Server signs the params with CLOUDINARY_API_SECRET
 * 3. Returns { signature, timestamp, api_key, cloud_name, folder }
 * 4. Browser POSTs directly to Cloudinary with those params + the file
 *
 * This avoids routing the file through our server — saves bandwidth.
 */

export interface SignedUploadParams {
  timestamp: number;
  folder: string;
  signature: string;
  api_key: string;
  cloud_name: string;
}

export function generateSignedUpload(
  folder: string = "blog"
): SignedUploadParams {
  const timestamp = Math.round(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

  // Cloudinary signs: params_to_sign + api_secret (sorted, excluding signature itself)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHmac("sha256", apiSecret)
    .update(paramsToSign)
    .digest("hex");

  return {
    timestamp,
    folder,
    signature,
    api_key: apiKey,
    cloud_name: cloudName,
  };
}
