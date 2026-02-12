import Task from "../models/Task.js";
import mongoose from "mongoose";
export const getAllTasks =async (req,res)=>{
    const {filter="today"} = req.query;
    const now = new Date();
    let startDate;

    switch (filter) {
        case "today":{
            // startDate = new Date(now.getFullYear(), now. getMonth(),now.getDate()); //2025-8-24 00:00
            startDate = new Date();
            startDate.setHours(0,0,0,0);
            break;
        }
        case "week":{
            const mondayDate = now.getDate()-(now.getDate()-1 )- (now.getDate()=== 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(),now.getMonth(),mondayDate);
            break;
        }
        case "month":{
            startDate = new Date(now.getFullYear(),now.getMonth(),1);
            break;
        }
        case "all":
            default:{
                startDate = null;
            }
    }

    // const query =startDate?{createdAt : { $gte: startDate }}:{};
        const query = {
    ...(startDate && { createdAt: { $gte: startDate }}),
    user: new mongoose.Types.ObjectId(req.user.id)     // LỌC THEO USER
};
    try {   
        const result = await Task.aggregate([
            {$match:query},
            {
                //facet là một nhánh cho ta chạy song song nhiều pipeline
                $facet:{
                    tasks: [{$sort:{createdAt:-1}}], //nhánh tasks sắp xếp theo createdAt giảm dần
                    activeCount: [{$match:{status:'active'}},{$count:'count'}], //nhánh activeCount đếm số lượng task có status là active
                    completeCount: [{$match:{status:'completed'}},{$count:'count'}] //nhánh completedCount đếm số lượng task có status là completed
                }
            }
        ]);

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count||0;
        const completeCount = result[0].completeCount[0]?.count||0;
        res.status(200).json({tasks,activeCount,completeCount});
    } catch (error) {
        console.error("Lỗi khi gọi getalltasks", error);
        res.status(500).json({message:"Lỗi server"});
    }
};
export const createTask = async (req,res)=>{
   try {
    const {title, reminderAt} = req.body;
    const task = new Task({
        title,
        reminderAt: reminderAt || null, 
        user :req.user.id   //gắn user
    });
    
    const newTask = await task.save();
    res.status(201).json(newTask);
   } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
        res.status(500).json({message:"Lỗi server"});
   }
};
export const updateTask = async (req,res)=>{
    try {
        const {title, status, completedAt, reminderAt} = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            { _id: req.params.id, user: req.user.id },
            {title, status, completedAt, reminderAt},
            {new:true}
        );
        if(!updatedTask){
            return res.status(404).json({message:"Không tìm thấy công việc"});
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Lỗi khi gọi updateTask", error);
        res.status(500).json({message:"Lỗi server"});
    }
};
export const deleteTask = async (req,res)=>{
    try {
        const deletedTask = await Task.findByIdAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if(!deletedTask){
            return res.status(404).json({message:"nhiệm vụ không tồn tại"});
        }
        res.status(200).json({message:"Xóa nhiệm vụ thành công"});
    } catch (error) {
        console.error("Lỗi khi gọi deleteTask", error);
        res.status(500).json({message:"Lỗi server"});
    }
};