import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI , {
        dbName: "PORTFOLIO",
    }).then(() => {
        console.log("Successfully connected to database");
    }).catch((err) => {
        console.log(`error while connecting to the database: ${err}`);
    })
}

export default dbConnection;