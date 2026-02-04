import mongoose from 'mongoose';
import dns from 'dns';

// Force Node to use public DNS servers (helpful when local resolver blocks SRV queries)
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Kết nối DB thành công");
    } catch (error) {
        console.error("Kết nối DB thất bại", error);
        process.exit(1); //exit with error    
    }
}