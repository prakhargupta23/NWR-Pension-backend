import { PFALogs } from "../Model/PFALogs.model";
import sequelize from "../config/sequelize";


export async function pfaloginlog(username:string, matchedUser:string){
    console.log("PFA Login Log creation");
    const transaction = await sequelize.transaction();

    const datetime = formatIndianDateTime(new Date());
    console.log("datetime", typeof datetime);
    let row = {
        user: username,
        task: 'Login Attempt',
        createdTime: datetime,
    }
    if(matchedUser != 'Failure') {
        row = {
            user: username,
            task: 'Successful Login',
            createdTime: datetime,
        }
    }else {
        row = {
            user: username,
            task: 'Successful Login',
            createdTime: datetime,
        }  
    }


    try{
        console.log("Creating log entry");
        await PFALogs.sync({ alter: true});
        await PFALogs.create(row, { transaction });
        await transaction.commit();
    } catch (error){
        console.log("Unable to create log entry");
        await transaction.rollback()
    }

}


export async function downloadReportLog(username: string, status: string, date: string){
    const datetime = formatIndianDateTime(new Date());

    let row = {
        user: username,
        task: `Trying to download Report for ${date}`,
        createdTime: datetime,
    }

    if (status === "Success"){
        row = {
            user: username,
            task: `Report Download Successful for ${date}`,
            createdTime: datetime,
        }
    } else {
        row = {
            user: username,
            task: `Report Download failed for ${date}`,
            createdTime: datetime,
        }
    }

    console.log("starting putting download log data")

    const transaction = await sequelize.transaction();
    try{
        await PFALogs.sync({alter: true});
        await PFALogs.create(row, { transaction });
        await transaction.commit();
    } catch (error){
        await transaction.rollback();
    }
}


export async function UploadDataLog(username: string, status: string, date: string, division: string){
    const datetime = formatIndianDateTime(new Date());

    let row = {
        user: username,
        task: `Trying to Upload data for ${date}`,
        createdTime: datetime,
    }

    if (status === "Success"){
        row = {
            user: username,
            task: `Data Uploaded Successfully for ${date} and ${division}`,
            createdTime: datetime,
        }
    } else {
        row = {
            user: username,
            task: `Data Upload failed for ${date} and ${division}`,
            createdTime: datetime,
        }
    }

    console.log("starting putting download log data")

    const transaction = await sequelize.transaction();
    try{
        await PFALogs.sync({alter: true});
        await PFALogs.create(row, { transaction });
        await transaction.commit();
    } catch (error){
        await transaction.rollback();
    }
}







const formatIndianDateTime = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    })
}