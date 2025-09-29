import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getfiledata, putfiledatatodb } from '../src/service/expenditure.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const { prompt, fileBase64, documentType, rowId } = req.body;
        
        if (!prompt || !fileBase64) {
            context.res = {
                status: 400,
                body: { error: "Missing required fields: prompt and file" }
            };
            return;
        }
        console.log("document data fetching function reached");
        
        // Convert base64 to buffer
        const fileBuffer = Buffer.from(fileBase64, 'base64');
        const processedData = await getfiledata(prompt, fileBase64);
        const response = await putfiledatatodb(processedData,documentType,rowId);
        console.log("data for document updated",response)
        if(documentType === "GSTInvoice") {
            context.res = {
                status: 200,
                body: {
                    message: "GST Invoice data processed successfully",
                    data: processedData,
                    regno: response.data
                }
            }
        }else {
            context.res = {
                status: 200,
                body: processedData,
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: {
                error: "Failed to process data",
                details: error.message
            }
        };
    }
};
export default httpTrigger; 