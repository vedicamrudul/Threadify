const mongoose = require('mongoose');

const connetDB = async () => {
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI, {});
        console.log(`MongoDB connected: ${conn.connection.host}`);
        // conn.connection.host is the host of the connected database
    }catch(err){
        console.log(err);
        process.exit(1);
        // exit with failure
    }
}

module.exports=connetDB;