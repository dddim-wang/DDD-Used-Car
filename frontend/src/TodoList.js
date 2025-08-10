// Programming Lab 3: Car Maintenance Checklist in React
// This component fulfills Lab 3 by creating a car-themed task list,
// fetching data from a public API, and handling state & events in React.

import React, { useState, useEffect } from 'react';

const CarMaintenanceChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Simulate fetching car maintenance tasks from an API (mocked with JSONPlaceholder)
  useEffect(() => {
    // Replace this with a real car API if available
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((res) => res.json())
      .then((data) => {
        const mockCarTasks = [
          "Check engine oil level",
          "Replace air filter",
          "Inspect brake pads",
          "Rotate tires",
          "Check battery health"
        ];
        setTasks(mockCarTasks); // Overwrite with our car-related tasks
      });
  }, []);

  // Add a new maintenance task
  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  // Delete a task by index
  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <div className="container">
      <h2>Car Maintenance Checklist</h2>
      <div className="todo-input-group">
        <input
          type="text"
          placeholder="Enter a maintenance task (e.g., 'Change spark plugs')"
          className="todo-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="todo-add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <ul className="todo-list">
        {tasks.map((task, index) => (
          <li key={index} className="todo-item">
            {task}
            <button
              className="todo-delete-button"
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarMaintenanceChecklist;










