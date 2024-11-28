import Mongoose from "mongoose";

export const dbConnection = ()=>{
    Mongoose.connect(process.env.MONGO_URL, {
        dbName: "MERN_STACK_JOB_SEEKING_WEBSITE"
    }).then(()=>{
        console.log("connected to the database!");
    })
    .catch((err)=>{
        console.log(`Some error occured while connecting to the database: ${err}`);
    });
}