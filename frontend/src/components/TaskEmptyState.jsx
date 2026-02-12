import React from "react";
import { Card } from "./ui/card";
import { Circle } from "lucide-react";

const TaskEmptyState = ({filter}) => {
    return <div>
        <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
            <div className=" space-y-3">
                <Circle className="size-12 mx-auto text-muted-foreground"/>
                <div>
                    <h3 className="font-medium text-foreground">
                        {
                            filter === "active"?'No active tasks found.': filter ==="completed" ? 'No completed tasks yet.': 'No tasks available.'
                        }
                    </h3>
                    <p className="text-sm text-muted-foreground">{filter ==='all'? "Add a new task to get started!": `Switch to "All" to see your ${filter === "active" ? "completed tasks" : "tasks"}`}</p>
                </div>
            </div>
        </Card>
    </div>
}

export default TaskEmptyState;