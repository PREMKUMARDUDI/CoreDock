import { useEffect, useState, useContext } from "react";
import { clientServer } from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // --- FETCH ---
  const fetchTasks = async () => {
    try {
      const res = await clientServer.get("/tasks");
      setTasks(res.data.reverse());
      setFilteredTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- FILTER ---
  useEffect(() => {
    let result = tasks;
    if (searchTerm) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (filterStatus !== "all") {
      result = result.filter((task) => task.status === filterStatus);
    }
    setFilteredTasks(result);
  }, [searchTerm, filterStatus, tasks]);

  // --- ACTIONS ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await clientServer.post("/tasks", { title: newTask, status: "pending" });
      setNewTask("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await clientServer.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // --- TOGGLE STATUS (New Logic) ---
  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";

    try {
      // Optimistic UI Update (Instant feedback)
      const updatedTasks = tasks.map((t) =>
        t._id === task._id ? { ...t, status: newStatus } : t,
      );
      setTasks(updatedTasks);

      // API Call
      await clientServer.put(`/tasks/${task._id}`, { status: newStatus });

      // Sync with server
      fetchTasks();
    } catch (err) {
      console.error(err);
      fetchTasks(); // Revert on error
    }
  };

  // --- EDITING ---
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    try {
      await clientServer.put(`/tasks/${id}`, { title: editTitle });
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard - {user?.username}</h1>
        <div className="header-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success">
          Add
        </button>
      </form>

      {filteredTasks.length === 0 && (
        <p className="no-tasks">No tasks available.</p>
      )}
      {filteredTasks.length != 0 && (
        <div className="dashboard-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {filteredTasks.length != 0 && <h2>My Tasks</h2>}

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task._id} className={`task-item ${task.status}`}>
            {/* Status Badge (Clickable Toggle) */}
            <div
              className="task-status-section"
              onClick={() => toggleStatus(task)}
              title="Click to toggle status"
            >
              <span className={`status-badge ${task.status}`}>
                {task.status}
              </span>
            </div>

            {/* Task Content */}
            <div className="task-content">
              {editingTaskId === task._id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    className="edit-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button
                    className="btn-icon save"
                    onClick={() => saveEdit(task._id)}
                  >
                    ✓
                  </button>
                  <button
                    className="btn-icon cancel"
                    onClick={() => setEditingTaskId(null)}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <span className="task-title" onClick={() => toggleStatus(task)}>
                  {task.title}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="task-actions">
              {editingTaskId !== task._id && (
                <button
                  className="btn-action edit"
                  onClick={() => startEditing(task)}
                >
                  ✎
                </button>
              )}
              <button
                className="btn-action delete"
                onClick={() => handleDelete(task._id)}
              >
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
