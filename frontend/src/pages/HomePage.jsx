import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { getGuestTasks } from "@/lib/guestTasks";

const Homepage = () => {
    const [taskBuffer, setTaskBuffer] = useState([]);
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [completeTaskCount, setCompleteTaskCount] = useState(0);
    const [filter,setFilter] = useState('all');
    const [dateQuery, setDateQuery] = useState("today");
    const [page,setPage] = useState(1);
    const navigate = useNavigate();

  //nhắc nhở khi bạn dùng tap ngoài 
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const unlock = () => {
      const audio = new Audio("/sounds/alert.mp3");
      audio.volume = 0;
      audio.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) return;

  if (!localStorage.getItem("guest_start")) {
    localStorage.setItem("guest_start", Date.now());
  }

  const timer = setInterval(() => {
    const start = localStorage.getItem("guest_start");
    if (!start) return;

    const diff = Date.now() - start;
    const FIVE_MIN = 5* 60 * 1000;

    if (diff > FIVE_MIN) {
      localStorage.removeItem("guest_start");
      localStorage.removeItem("guest_tasks");

      toast.info("Guest session expired. Please sign up to save your data!");
      window.location.reload();
    }
  }, 5000); // check mỗi 5s

  return () => clearInterval(timer);
}, []);

    useEffect(() => {
      fetchTasks();
    }, [dateQuery])

    useEffect(()=>{
      setPage(1)
    },[filter,dateQuery]);

    const fetchTasks = async () => {
  const token = localStorage.getItem("token");

  // 👉 GUEST MODE
  if (!token) {
    const tasks = getGuestTasks();
    setTaskBuffer(tasks);
    setActiveTaskCount(tasks.filter(t => t.status === "active").length);
    setCompleteTaskCount(tasks.filter(t => t.status === "completed").length);
    return;
  }

  // 👉 LOGIN MODE
  try {
    const res = await api.get(`/tasks?filter=${dateQuery}`);
    setTaskBuffer(res.data.tasks);
    setActiveTaskCount(res.data.activeCount);
    setCompleteTaskCount(res.data.completeCount);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Failed to fetch tasks.");
  }
};

    const handleTaskChanged = () => {
      fetchTasks();
    }

    //tạo để di chuyển trang
    const handleNext = ()=>{
      if(page < totalPages){
        setPage((prev)=>prev+1);
      }
    };

    const handlePrev=()=>{
      if(page>1){
        setPage((prev)=>prev-1);
      }
    };

    const handlePageChange = (newPage)=>{
      setPage(newPage);
    }

    const filteredTasks = taskBuffer.filter((task) => {
        switch (filter) {
          case 'active':
            return task.status === 'active';
          case 'completed':
            return task.status === 'completed';
          default:
            return true;
        }
    });

    const visibileTasks = filteredTasks.slice(
      (page - 1)*visibleTaskLimit,
      page * visibleTaskLimit
    );
    const totalPages = Math.ceil(filteredTasks.length/ visibleTaskLimit )

    return (
        <div className="min-h-screen w-full bg-[#f8fafc] relative">
  {/* Soft Morning Mist Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(135deg, 
          rgba(248,250,252,1) 0%, 
          rgba(219,234,254,0.7) 30%, 
          rgba(165,180,252,0.5) 60%, 
          rgba(129,140,248,0.6) 100%
        ),
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(199,210,254,0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(224,231,255,0.3) 0%, transparent 60%)
      `,
    }}
  />
  {/* Your Content/Components */}
  <div className=" container mx-auto pt-8 relative z-10">
            <div className=" w-full max-w-2xl p-6 mx-auto space-y-6">
                {/* Header */}
                <Header />

                {/* Tạo nhiệm vụ */}
                <AddTask handleNewTaskAdded={handleTaskChanged} />

                {/* thống kê và bộ lọc */}
                <StatsAndFilters
                filter = {filter}
                setFilter={setFilter}
                activeTaskCount={activeTaskCount}
                completedTaskCount={completeTaskCount}
                />

                {/* Danh sách nhiệm vụ */}
                <TaskList filteredTasks={visibileTasks} filter={filter}
                handleTaskChanged={handleTaskChanged}
                />

                {/* Phân trang lọc theo ngày */}
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <TaskListPagination 
                    handleNext = {handleNext}
                    handlePrev = {handlePrev}
                    handlePageChange = {handlePageChange}
                    page = {page}
                    totalPages = {totalPages}
                    />
                    <DateTimeFilter dateQuery = {dateQuery} setDateQuery={setDateQuery} />
                </div>

                {/* Chân trang */}
                <Footer completedTaskCount={completeTaskCount} activeTaskCount={activeTaskCount} />
            </div>
        </div>
</div>
        
    );
};
export default Homepage;