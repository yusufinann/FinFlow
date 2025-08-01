import {createClient} from "redis";

const redisClient=createClient();

redisClient.on('error',(err)=>{
    console.error("Error Redis Client : ",err)
});

redisClient.on('connect',()=>{
    console.log('Redis Client Connected Successfully!');
})

const connectRedis=async ()=>{
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
}

connectRedis();

export default redisClient;