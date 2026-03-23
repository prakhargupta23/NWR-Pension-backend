import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { expenditureService } from "../src/service/expenditure.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    console.log("finance note data updating1");
    const { noteType, row } = req.body;
    console.log("noteType", noteType)
    console.log("updating finance note data from here", row)

    const result = await expenditureService.putNoteData(noteType, row);

    // Return success response
    context.res = {
      status: 200,
      body: {
        success: true,
        message: "note data retrieved successfully",
        data: result,
      },
    };
  } catch (error) {
    console.error("Error retrieving note data:", error);
    // Handle errors and return response
    context.res = {
      status: 500,
      body: {
        success: false,
        message: `Error retrieving note data: ${error.message}`
      },
    };
  }
};

export default httpTrigger; 