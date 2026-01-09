import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
       path: "./.env"
});   

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8080, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8080}`);
    })
})
.catch((error) => {
    console.log("mongo db connection faild to start !!:", error);
})
