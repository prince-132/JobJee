import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "JOBJEE"
    }).then(()=>{
        console.log("Databse Connected");
    }).catch((err)=>{
        console.log(`Error in database connection: ${err}`);
    })
}

export default dbConnection;