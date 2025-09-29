import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const storageAccountName = process.env["storageAccountName"];
  const sasToken = process.env["sasToken"];

  if (!storageAccountName || !sasToken) {
    context.res = {
      status: 500,
      body: {
        success: false,
        message: "Missing storage configuration.",
      },
    };
    return;
  }

  context.res = {
    status: 200,
    body: {
      success: true,
      storageAccount: storageAccountName,
      sasToken: sasToken,
      message: "SAS token and account name fetched successfully.",
    },
  };
};

export default httpTrigger;
