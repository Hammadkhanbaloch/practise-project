import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/task")
      .then((res) => {
        setTasks(res.data);
      })
      .catch((error) => {
        const task = {
          _id: (tasks.length + 1).toString(),
          name: "default task",
          status: "default status",
        };
        setTasks([task]);
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const task = {
      name: e.target.name.value,
      status: e.target.status.value,
    };

    if (editingTask) {
      // If editing a task, send a PUT request to update it
      axios
        .patch(`http://localhost:4000/task/${editingTask._id}`, task)
        .then(async () => {
          const taskList = await axios.get("http://localhost:4000/task");
          setTasks(taskList.data);
          setEditingTask(null); // Reset editing state
        })
        .catch((error) => {
          // Handle errors (optional)
        });
    } else {
      // If adding a new task, send a POST request
      axios
        .post("http://localhost:4000/task", task)
        .then(async () => {
          const taskList = await axios.get("http://localhost:4000/task");
          setTasks(taskList.data);
        })
        .catch((error) => {
          task._id = (tasks.length + 1).toString();
          const tempTasks = [...tasks, task];
          setTasks(tempTasks);
        });
    }

    e.target.name.value = "";
    e.target.status.value = "";
  };

  const deleteTask = async (id) => {
    axios
      .delete(`http://localhost:4000/task/${id}`)
      .then(async () => {
        const taskList = await axios.get("http://localhost:4000/task");
        setTasks(taskList.data);
      })
      .catch(async () => {
        const tempTasks = tasks.filter((task) => task._id !== id);
        setTasks(tempTasks);
      });
  };

  const editTask = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="todo-container">
      <div style={{ width: "500px", height: "40px" }}>
        <h1 style={{ textAlign: "center", fontSize: "20px" }}>Todo Task Management</h1>
      </div>
      <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>
      <form onSubmit={onSubmit}>
        <input
          className="Box"
          type="text"
          name="name"
          placeholder="Name"
          defaultValue={editingTask ? editingTask.name : ""}
        />
        <input
          className="Box"
          type="text"
          name="status"
          placeholder="Status"
          defaultValue={editingTask ? editingTask.status : ""}
        />
        <button className="Box" style={{ background: editingTask ? "orange" : "green" }} type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </form>
      <h2>Tasks</h2>
      <table>
        <thead>
          <tr>
            <th className="inputBox">#</th> {/* Column for Task Number */}
            <th className="inputBox">Task Name</th>
            <th className="inputBox">Status</th>
            <th className="inputBox">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td className="dataBox">{index + 1}</td> {/* Display Task Number */}
              <td className="dataBox">{task.name}</td>
              <td className="dataBox">{task.status}</td>
              <td>
                <button className="buttonBox" style={{ background: 'red' }} onClick={() => deleteTask(task._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                </td>
                <td>
                <button className="buttonBox" style={{ background: 'blue',  }} onClick={() => editTask(task)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
