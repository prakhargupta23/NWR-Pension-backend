const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
import * as zlib from "zlib";

const accountName = process.env.azureStorageAccountName;
const accountKey = process.env.storageKey;
const containerName = "reshape-public";
///// Function for updating the prompt ---------------------------------------------------/
export async function updateAiPrompt(promptData: any) {
  const blobName = "railway.json"; // ✅ Updated blob name for prompts
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);

  try {
    // ✅ Step 1: Compress the prompt data
    const promptString = JSON.stringify(promptData);
    const compressedData = zlib.gzipSync(promptString);

    // ✅ Step 2: Upload the data with gzip headers
    await blobClient.upload(compressedData, compressedData.length, {
      blobHTTPHeaders: {
        blobContentEncoding: "gzip", // ✅ Indicate gzip encoding
        blobContentType: "application/json", // ✅ Indicate JSON content
      },
    });

    return {
      message: "Prompt data has been updated successfully.",
      status: true,
      updatedData: promptData,
    };
  } catch (error) {
    console.error("❌ Error occurred during prompt upload:", error);
    return {
      message: "Failed to update prompt data.",
      status: false,
      updatedData: {},
      error: error.message || error, // ✅ Return error message for debugging
    };
  }
}
