import { Logs } from "../Model/Logs.model";
import sequelize from "../config/sequelize";


export async function getSbiMasterAndUnlinkedJoinDatalog(username: string, status: string) {
    const datetime = formatIndianDateTime(new Date());
    let row = {
        user: username,
        task: `SBI Master and Unlinked Join data downloaded`,
        createdTime: datetime,
    }
    if(status === "Success") {
        row = {
            user: username,
            task: `SBI Master and Unlinked Join data downloaded successfully`,
            createdTime: datetime,
        }
    } else {
        row = {
            user: username,
            task: `SBI Master and Unlinked Join data download failed`,
            createdTime: datetime,
        }
    }
    console.log("starting putting log data");
    
    const transaction = await sequelize.transaction(); 
    try{
      await Logs.sync({ alter: true });
      console.log("Reached here");
                  
      await Logs.create(row, { transaction });
      console.log("Reached here2");
                  
      await transaction.commit();
      console.log("Log entry created successfully");
    }
    catch(error){
      console.error("Error creating log entry:", error);
      await transaction.rollback();
    }
    // end of putting log data
}

export async function dataUploadlog( username: string, month: string, status: string) {
    //inserting the log for this task
    
    const datetime = formatIndianDateTime(new Date());
    
    let row = {
        user: username,
        task: `Bank and Arpan data upload for the month ${month}`,
        createdTime: datetime,
    };
    if(status === "Success") {
        row = {
            user: username,
            task: `Bank and Arpan data upload for the month ${month} was successful`,
            createdTime: datetime,
        }
    } else {
        row = {
            user: username,
            task: `Bank and Arpan data upload for the month ${month} failed`,
            createdTime: datetime,
        }
    }
    console.log("starting putting log data");
    
    const transaction = await sequelize.transaction(); 
    try{
      await Logs.sync({ alter: true });
      console.log("Reached here");
                  
      await Logs.create(row, { transaction });
      console.log("Reached here2");
                  
      await transaction.commit();
      console.log("Log entry created successfully");
    }
    catch(error){
      console.error("Error creating log entry:", error);
      await transaction.rollback();
    }
    // end of putting log data
}


export async function loginlog(username:string, matchedUser: string) {
    const transaction = await sequelize.transaction();
    console.log("eached hee")

    const datetime = formatIndianDateTime(new Date());

    console.log("Current Date and Time:", datetime);


    let row = {
        user: username,
        task: "Login attempt",
        createdTime: datetime,
    }
    if(matchedUser != "Failure") {
      row = {
        user: username,
        task: "Successful login",
        createdTime: datetime,
      };
      console.log("hello")
    }
    else {
      row = {
        user: username,
        task: "Login failed",
        createdTime: datetime,
      };
      console.log("hello2")
      
    }
    try{
        await Logs.sync({ alter: true });
        console.log("Reached here"); 
        await Logs.create(row, { transaction });
        console.log("Reached here2");    
        await transaction.commit();
        console.log("Log entry created successfully");
      }
      catch(error){
        console.error("Error creating log entry:", error);
        await transaction.rollback();
      }
}


export async function insertSbiCsvlog(username: string, status: string) {
  //inserting the log for this task
    const datetime = formatIndianDateTime(new Date());
    console.log("Current Date and Time:", datetime);
    
    const row = {
        user: username,
        task: `SBI data uploaded`,
        createdTime: datetime,
    };
    console.log("starting putting log data",row);
    
    const transaction = await sequelize.transaction(); 
    try{
      await Logs.sync({ alter: true });
      console.log("Reached here");
                  
      await Logs.create(row, { transaction });
      console.log("Reached here2");
                  
      await transaction.commit();
      console.log("Log entry created successfully");
    }
    catch(error){
      console.error("Error creating log entry:", error);
      await transaction.rollback();
    }
    // end of putting log data
}


const formatIndianDateTime = (date: Date): string => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
};