import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status:{
        type: String,
        enum: ["active","completed"],
        default: "active",
    },
    reminderAt: {
    type: Date,
    default: null
    },
    completedAt:{
        type: Date,
        default: null,  
    }
    
},{
    timestamps: true, //tự động tạo createdAt và updatedAt
});

const Task = mongoose.model("Task", taskSchema);
export default Task;