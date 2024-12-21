import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Tasks.css';


const Tasks = () => {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    task_name: '',
    task_value: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    task_name: '',
    task_value: ''
  });

  // pool tasks from the sql
  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`https://israel-navy-test.onrender.com/users/tasks/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else {
        setError(data.error || 'Failed to fetch tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Network error occurred');
    }
  };

  // start edit task
  const handleEdit = (task) => {
    setEditTaskId(task.id);
    setEditedTask({
      task_name: task.task_name,
      task_value: task.task_value
    });
  };

  // update edit
  const handleEditChange = (field, value) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // save edit
  const handleSaveEdit = async (taskId) => {
    try {
      const response = await fetch(`https://israel-navy-test.onrender.com/users/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      setEditTaskId(null);
      setEditedTask({ task_name: '', task_value: '' });

    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.message);
    }
  };

  // cancel edit
  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditedTask({ task_name: '', task_value: '' });
  };

  // delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
      return;
    }

    try {
      const response = await fetch(`https://israel-navy-test.onrender.com/users/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.message);
    }
  };

  // adding new task
  const handleAddTask = async () => {
    try {
      if (!newTask.task_name || !newTask.task_value) {
        setError('יש למלא את כל השדות');
        return;
      }

      const response = await fetch('https://israel-navy-test.onrender.com/users/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          user_id: userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setShowAddModal(false);
      setNewTask({ task_name: '', task_value: '' });

    } catch (error) {
      console.error('Error adding task:', error);
      setError(error.message);
    }
  };

  return (
    <div className="tasks-container">
      <div className="tasks-card">
        <h2 className="tasks-title">רשימת המטלות שלך</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="tasks-list">
          {tasks.map((task) => (
            <div className="task-item" key={task.id}>
              {editTaskId === task.id ? (
                <div className="task-content">
                  <input
                    type="text"
                    value={editedTask.task_name}
                    onChange={(e) => handleEditChange('task_name', e.target.value)}
                    className="edit-input"
                  />
                  <input
                    type="number"
                    value={editedTask.task_value}
                    onChange={(e) => handleEditChange('task_value', e.target.value)}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button
                      className="action-btn save"
                      onClick={() => handleSaveEdit(task.id)}
                    >
                      שמור
                    </button>
                    <button
                      className="action-btn cancel"
                      onClick={handleCancelEdit}
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <div className="task-content">
                  <p className="task-name">{task.task_name}</p>
                  <p className="task-value">ערך: {task.task_value}</p>
                  <div className="task-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(task)}
                    >
                      ערוך
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(task.id)}
                    >
                      מחק
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {tasks.length === 0 && <p className="no-tasks">אין משימות להצגה</p>}
        <button className="add-task-btn" onClick={() => setShowAddModal(true)}>
          הוסף משימה
        </button>
      </div>

      
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>הוספת משימה חדשה</h3>
            <div className="form-group">
              <label>שם המשימה:</label>
              <input
                type="text"
                value={newTask.task_name}
                onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                placeholder="הכנס שם משימה"
              />
            </div>
            <div className="form-group">
              <label>ערך המשימה:</label>
              <input
                type="number"
                value={newTask.task_value}
                onChange={(e) => setNewTask({ ...newTask, task_value: e.target.value })}
                placeholder="הכנס ערך משימה"
              />
            </div>
            <div className="modal-actions">
              <button
                className="action-btn save"
                onClick={handleAddTask}
              >
                הוסף
              </button>
              <button
                className="action-btn cancel"
                onClick={() => {
                  setShowAddModal(false);
                  setNewTask({ task_name: '', task_value: '' });
                  setError(null);
                }}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;