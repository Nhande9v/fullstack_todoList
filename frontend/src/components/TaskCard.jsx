import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2, Bell } from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

const TaskCard = ({ task, index, handleTaskChanged }) => {
    const [isEditing, setIsEditing] = useState(false);
    const timerRef = useRef(null);
    const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");
    const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
    };

const [reminderTime, setReminderTime] = useState(
  task.reminderAt ? formatDateTimeLocal(task.reminderAt) : ""
);

    const playSound = () => {
    const audio = new Audio("/sounds/alert.mp3");
    audio.volume = 1;
    audio.play();
    };

    //trực tiếp kích hoạt một thông báo 
    // đẩy trên màn hình máy tính (Desktop Notification).
    const showDesktopNotification = (title) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification("⏰ Task Reminder", {
      body: title
    });
  }
};

    //Nhắc nhở tự động
    useEffect(() => {
  if (!task.reminderAt) return;

  const delay = new Date(task.reminderAt).getTime() - Date.now();
  if (delay <= 0) return;

  if (timerRef.current) {
    clearTimeout(timerRef.current);
  }

  timerRef.current = setTimeout(() => {
    playSound();

    toast(`⏰ Reminder: ${task.title}`, {
      description: "It's time to get to work!",
    });

    showDesktopNotification(task.title);
  }, delay);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, [task._id, task.reminderAt]);
    const setReminder = async () => {
    if (!reminderTime) return toast.error("Please choose a time");

    const delay = new Date(reminderTime).getTime() - Date.now();
    if (delay <= 0) return toast.error("Please select a future date and time.");

    try {
        await api.put(`/tasks/${task._id}`, {
        reminderAt: new Date(reminderTime).toISOString()
        });

        toast.success("Reminder set successfully!");

        handleTaskChanged();   // reload task → useEffect tự schedule

    } catch (err) {
        toast.error("Error occurred while setting the reminder.");
    }
    };

    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success("Task deleted successfully!");
            handleTaskChanged();
        } catch (error) {
            console.error("Có lỗi xảy ra khi xóa nhiệm vụ:", error);
            toast.error("Could not delete task. Try again later.");
        }
    }

    const toggleTaskCompleteButton = async () => {
        try {
            if (task.status === "active") {
                await api.put(`/tasks/${task._id}`, {
                    status: "completed",
                    completedAt: new Date().toISOString()
                });

                toast.success(`"${task.title}" completed!!!`);
            } else {
                await api.put(`/tasks/${task._id}`, {
                    status: "active",
                    completedAt: null
                });
                toast.success(`"${task.title}" moved back to active!!`);
            }

            handleTaskChanged();
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật nhiệm vụ:", error);
            toast.error("Could not update task. Try again.");
        }
    }

    const updateTask = async () => {
        try {
            setIsEditing(false);
            await api.put(`/tasks/${task._id}`, {
                title: updateTaskTitle
            });
            toast.success(`Title updated to "${updateTaskTitle}"!`);
            handleTaskChanged();
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật nhiệm vụ:", error);
            toast.error("Update failed. Please try again.");
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            updateTask();
        }
    }

    return (
        <Card className={cn(
            "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
            task.status === "completed" && "opacity-75"
        )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center gap-4">
                {/*  nút tròn */}
                <Button variant="ghost"
                    size="icon"
                    className={cn(
                        "flex-shrink-0 size-8 rounded-full transition-all duration-200",
                        task.status === "completed" ? 'text-success hover:text-success/80' :
                            'text-muted-foreground hover:text-primary'
                    )}
                    onClick={toggleTaskCompleteButton}
                >
                    {task.status === 'completed' ? (
                        <CheckCircle2 className="size-5" />
                    ) : (
                        <Circle className="size-5" />
                    )}

                </Button>

                {/*Hiển thị or chỉnh sửa tiêu đề  */}
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <Input placeholder="Cần phải làm gì?"
                            className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            type="text"
                            value={updateTaskTitle}
                            onChange={(e) => setUpdateTaskTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onBlur={() => {
                                setIsEditing(false);
                                setUpdateTaskTitle(task.title || "");
                            }}
                        />
                    ) : (
                        <p className={cn(
                            "text-base transition-all duration-200",
                            task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"
                        )}>
                            {task.title}
                        </p>
                    )}

                    {/* Ngày tạo và ngày hoàn thành */}
                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            {new Date(task.createdAt).toLocaleString()}
                        </span>
                        {task.completedAt && (
                            <>
                                <span className="text-xs text-muted-foreground">-</span>
                                <Calendar className="size-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    {new Date(task.completedAt).toLocaleString()}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">

                    {/* Nhắc nhở */}
                    <Input
                    type="datetime-local"
                    className="h-8 text-xs w-[165px] hidden lg:block"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    />

                    <Button
                    variant="ghost"
                    size="icon"
                    title={task.reminderAt ? "Reminder is set" : "Set reminder"}
                    className={cn(
                        "transition-all",
                        task.reminderAt
                        ? "text-yellow-500 hover:text-yellow-600 animate-pulse"
                        : "text-muted-foreground hover:text-warning"
                    )}
                    onClick={setReminder}
                    >
                    <Bell
                        className={cn(
                        "size-4",
                        task.reminderAt && "fill-yellow-400"
                        )}
                    />
                    </Button>


                    {/* Edit */}
                    <Button
                    variant="ghost"
                    size="icon"
                    title="Chỉnh sửa"
                    className="text-muted-foreground hover:text-info"
                    onClick={() => {
                        setIsEditing(true);
                        setUpdateTaskTitle(task.title || "");
                    }}
                    >
                    <SquarePen className="size-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                    variant="ghost"
                    size="icon"
                    title="Xóa"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTask(task._id)}
                    >
                    <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>

        </Card>
    )
}
export default TaskCard;