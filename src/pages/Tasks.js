import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Tasks.css';

const API_URL = 'https://israel-navy-test.onrender.com';

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

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'שגיאת רשת');
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task.id);
    setEditedTask({
      task_name: task.task_name,
      task_value: task.task_value
    });
  };

  const handleEditChange = (field, value) => {
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_name: editedTask.task_name,
          task_value: Number(editedTask.task_value),
          user_id: Number(userId)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      setEditTaskId(null);
      setEditedTask({ task_name: '', task_value: '' });
      setError(null);

    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.message || 'שגיאה בעדכון המשימה');
    }
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditedTask({ task_name: '', task_value: '' });
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setError(null);

    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.message || 'שגיאה במחיקת המשימה');
    }
  };

  const handleAddTask = async () => {
    try {
      if (!newTask.task_name || !newTask.task_value) {
        setError('יש למלא את כל השדות');
        return;
      }

      const response = await fetch(`${API_URL}/users/${userId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_name: newTask.task_name,
          task_value: Number(newTask.task_value),
          user_id: Number(userId)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
      }

      const addedTask = await response.json();
      setTasks(prevTasks => [...prevTasks, addedTask]);
      setShowAddModal(false);
      setNewTask({ task_name: '', task_value: '' });
      setError(null);

    } catch (error) {
      console.error('Error adding task:', error);
      setError(error.message || 'שגיאה בהוספת המשימה');
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