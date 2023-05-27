import mongoose from "mongoose";

const CONNECT_DB = () => {
    const DB_NAME = "CodersHouse"
    const DB_URL = `${process.env.DB_URL}/${DB_NAME}`

    mongoose.connect(DB_URL).then(()=>console.log("DB CONNECTED..")).catch((err)=>{
        console.log(`Error While Connecting to Database`)
    })
}

export default CONNECT_DB