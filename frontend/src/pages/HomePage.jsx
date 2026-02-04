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

const Homepage = () => {
    const [taskBuffer, setTaskBuffer] = useState([]);
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [completeTaskCount, setCompleteTaskCount] = useState(0);
    const [filter,setFilter] = useState('all');
    const [dateQuery, setDateQuery] = useState("today");
    const [page,setPage] = useState(1);

    useEffect(() => {
      fetchTasks();
    }, [dateQuery])

    useEffect(()=>{
      setPage(1)
    },[filter,dateQuery]);

    const fetchTasks = async () => {
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
      (page-1)*visibleTaskLimit,
      page * visibleTaskLimit
    );
    if (visibileTasks.length ===0){
      handlePrev();
    }
    const totalPages = Math.ceil(filteredTasks.length/ visibleTaskLimit)

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
                <TaskList fileteredTasks={filteredTasks} filter={filter}
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
                <Footer completed TaskCount={completeTaskCount} activeTaskCount={activeTaskCount} />
            </div>
        </div>
</div>
        
    );
};
export default Homepage;