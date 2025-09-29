import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { expenditureService, ExpenditureRowDB } from "../src/service/expenditure.service";
import sequelize from "../src/config/sequelize";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    // Establish database connection
    await sequelize.authenticate();
    console.log('Database connection established');

    const rowData = req.body?.data;
    console.log("final process of uploading rowData", rowData);
    
    if (!rowData) {
      context.res = {
        status: 400,
        body: { error: "Missing request body" },
      };
      return;
    }

    const dbRowData: ExpenditureRowDB = {
      SNo: Number(rowData[0].SNo),
      Status: String(rowData[0].Status || 'pending'),
      // Committee: String(rowData[0].AuthorizationCommittee || ''),
      ReceiptNote: rowData[0].ReceiptNote ? String(rowData[0].ReceiptNote) : null,
      TaxInvoice: rowData[0].TaxInvoice ? String(rowData[0].TaxInvoice) : null,
      GSTInvoice: rowData[0].GSTInvoice ? String(rowData[0].GSTInvoice) : null,
      ModificationAdvice: rowData[0].ModificationAdvice ? String(rowData[0].ModificationAdvice) : null,
      PurchaseOrder: rowData[0].PurchaseOrder ? String(rowData[0].PurchaseOrder) : null,
      InspectionCertificate: rowData[0].InspectionCertificate ? String(rowData[0].InspectionCertificate) : null,
      VerificationTime: rowData[0].VerificationTime ? String(rowData[0].VerificationTime) : null,
      Remark: rowData[0].Remark ? String(rowData[0].Remark) : null,
      AuthorizationCommittee: rowData[0].AuthorizationCommittee ? String(rowData[0].AuthorizationCommittee) : "-",
      NoteGeneration: rowData[0].NoteGeneration ? String(rowData[0].NoteGeneration) : null,
                                                                                    
      ReceiptNoteUploadTime: rowData[0].ReceiptNoteUploadTime ? new Date(rowData[0].ReceiptNoteUploadTime) : null,
      TaxInvoiceUploadTime: rowData[0].TaxInvoiceUploadTime ? new Date(rowData[0].TaxInvoiceUploadTime) : null,
      GSTInvoiceUploadTime: rowData[0].GSTInvoiceUploadTime ? new Date(rowData[0].GSTInvoiceUploadTime) : null,
      ModificationAdviceUploadTime: rowData[0].ModificationAdviceUploadTime ? new Date(rowData[0].ModificationAdviceUploadTime) : null,
      PurchaseOrderUploadTime: rowData[0].PurchaseOrderUploadTime ? new Date(rowData[0].PurchaseOrderUploadTime) : null,
      InspectionCertificateUploadTime: rowData[0].InspectionCertificateUploadTime ? new Date(rowData[0].InspectionCertificateUploadTime) : null,

    };
    console.log("data check before updating",dbRowData)
    const result = await expenditureService.updateExpenditureData(dbRowData);
    
    context.res = {
      status: 200,
      body: result,
    };
  } catch (error) {
    console.error("Error in upload-trend-data:", error);
    context.res = {
      status: 500,
      body: {
        error: "Failed to process data",
        details: error.message,
      },
    };
  }
};

export default httpTrigger;