import express from "express"

const app=express();
const port=3001;

app.listen(port,()=>{
    console.log(`the server is running on port ${port}`)
})