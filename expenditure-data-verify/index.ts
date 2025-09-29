import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getfiledata, verifyData } from '../src/service/expenditure.service';
import * as multipart from 'parse-multipart-data'; // Add this package
import { ExpenditureRowDB } from '../src/service/expenditure.service';

export const run: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        // Check if content-type is multipart
        if (!req.headers['content-type']?.includes('multipart/form-data')) {
            context.res = {
                status: 400,
                body: { error: "Content-Type must be multipart/form-data" },
            };
            return;
        }

        // Parse the multipart form data
        const boundary = multipart.getBoundary(req.headers['content-type']);
        const parts = multipart.parse(Buffer.from(req.body), boundary);
        
        // Extract fields and file
        let rowData: Partial<ExpenditureRowDB> = {};
        let fileBuffer = null;

        for (const part of parts) {
            if (part.filename) {
                // This is the file part
                fileBuffer = part.data;
            } else {
                // This is a form field
                const key = part.name as keyof ExpenditureRowDB;
                const value = part.data.toString('utf8');
                if (key === 'SNo') {
                    rowData[key] = Number(value);
                } else {
                    (rowData as any)[key] = value;
                }
            }
        }

        // Validate and cast to required type
        if (!rowData.SNo) {
            context.res = {
                status: 400,
                body: { error: "SNo is required for verification" },
            };
            return;
        }

        const verificationData: ExpenditureRowDB = {
            SNo: Number(rowData.SNo),
            Status: rowData.Status || 'pending',
            // Committee: rowData.Committee || '',
            ReceiptNote: rowData.ReceiptNote || null,
            TaxInvoice: rowData.TaxInvoice || null,
            GSTInvoice: rowData.GSTInvoice || null,
            ModificationAdvice: rowData.ModificationAdvice || null,
            PurchaseOrder: rowData.PurchaseOrder || null,
            InspectionCertificate: rowData.InspectionCertificate || null,
            AuthorizationCommittee: rowData.AuthorizationCommittee || null,
            VerificationTime: rowData.VerificationTime,
            Remark: rowData.Remark || null,
            NoteGeneration: rowData.NoteGeneration || null,
            
            ReceiptNoteUploadTime: rowData.ReceiptNoteUploadTime || null,
            TaxInvoiceUploadTime: rowData.TaxInvoiceUploadTime || null,
            GSTInvoiceUploadTime: rowData.GSTInvoiceUploadTime || null,
            ModificationAdviceUploadTime: rowData.ModificationAdviceUploadTime || null,
            PurchaseOrderUploadTime: rowData.PurchaseOrderUploadTime || null,
            InspectionCertificateUploadTime: rowData.InspectionCertificateUploadTime || null,
        };

        console.log("Verification data sending:", verificationData);
        const response = await verifyData(verificationData);
        
        context.res = {
            status: 200,
            body: response
        };
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