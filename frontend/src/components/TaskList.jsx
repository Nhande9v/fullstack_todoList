import React from "react";
import TaskEmptyState from "./TaskEmptyState";
import TaskCard from "./TaskCard";

export const TaskList = ({fileteredTasks, filter, handleTaskChanged}) => {
    
    if (!fileteredTasks|| fileteredTasks.length===0){
        return <TaskEmptyState filter = {filter} />;
    }
    return (
        <div className="space-y-3">
            {fileteredTasks.map((task,index)=>(
                <TaskCard
                key={task._id?? index}
                task={task}
                index={index}
                handleTaskChanged={handleTaskChanged}
                />
            ))}
        </div>
    )
};

export default TaskList;