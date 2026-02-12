const KEY = "guest_tasks";

export const getGuestTasks = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const setGuestTasks = (tasks) => {
  localStorage.setItem(KEY, JSON.stringify(tasks));
};

export const addGuestTask = (task) => {
  const tasks = getGuestTasks();
  tasks.unshift(task);
  setGuestTasks(tasks);
};

export const updateGuestTask = (id, updates) => {
  const tasks = getGuestTasks().map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  setGuestTasks(tasks);
};

export const deleteGuestTask = (id) => {
  const tasks = getGuestTasks().filter((t) => t.id !== id);
  setGuestTasks(tasks);
};