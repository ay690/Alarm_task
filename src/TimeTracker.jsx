import React, { useState, useEffect } from 'react';
import "./index.css"

const TimeTracker = () => {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
  
    useEffect(() => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }, []);
  
    useEffect(() => {
      let intervalId;
  
      if (isRunning) {
        intervalId = setInterval(() => {
          setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
      }
  
      return () => {
        clearInterval(intervalId);
      };
    }, [isRunning]);
  
    const formatTime = (time) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;
  
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
  
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };
  
    const handleStart = () => {
      setIsRunning(true);
    };
  
    const handlePause = () => {
      setIsRunning(false);
    };
  
    const handleSave = () => {
      if (editingTaskId) {
        const updatedTasks = tasks.map((task) => {
          if (task.id === editingTaskId) {
            return {
              ...task,
              description,
            };
          }
          return task;
        });
  
        setTasks(updatedTasks);
        setEditingTaskId(null);
      } else {
        const newTask = {
          id: Date.now(),
          time: formatTime(timer),
          title,
          description,
        };
  
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }
  
      setTitle('');
      setDescription('');
      setIsRunning(false);
      setTimer(0);
    };
  
    const handleEdit = (taskId) => {
      const taskToEdit = tasks.find((task) => task.id === taskId);
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setEditingTaskId(taskId);
      }
    };
  
    const handleDelete = (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      if (editingTaskId === taskId) {
        setEditingTaskId(null);
        setTitle('');
        setDescription('');
      }
    };
  
    useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);
  
    return (
      <div className="container">
        <h2 className="header">Time Tracker</h2>
        <div className="actions">
          <div className="timer">{`Time: ${formatTime(timer)}`}</div>
          <button
            className="button"
            onClick={handleStart}
            disabled={isRunning}
          >
            Start
          </button>
          <button
            className="button"
            onClick={handlePause}
            disabled={!isRunning}
          >
            Pause
          </button>
          <button
            className="button"
            onClick={handleSave}
            disabled={!timer || !title}
          >
            {editingTaskId ? 'Update' : 'Save'}
          </button>
        </div>
        <div className="input-section">
          <input
            className="input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="task-list">
          <h3>Tasks</h3>
          {tasks.map((task) => (
            <div className="task" key={task.id}>
                <div className="task-info">
              <span className="task-time">{`Time: ${task.time}`}</span>
              <span className="task-title">{`Title: ${task.title}`}</span>
              <span className="task-description">{`Description: ${task.description}`}</span>
              </div>
              {editingTaskId === task.id ? (
                <>
                  <textarea
                    className="task-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </>
              ) : (
             <></>
      

              )}
              {editingTaskId === task.id ? (
                <button className="update-button" onClick={handleSave}>
                  Save
                </button>
              ) : (
               
                 <div className="button-group">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                  </div>
               
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default TimeTracker;