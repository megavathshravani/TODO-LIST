import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoDashboard.css";
import { FaTrash, FaSort, FaSun, FaMoon } from "react-icons/fa";

const API_KEY = "Your_Api KEy"; // Replace with your valid API Key
const CITY = "Hyderabad";

export default function TodoDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

  const getWeatherAdvice = (weatherData) => {
    const description = weatherData.weather[0].main.toLowerCase();
    const temperature = weatherData.main.temp - 273.15; 
    const currentTime = weatherData.dt; 
    const sunsetTime = weatherData.sys.sunset;
    const sunriseTime = weatherData.sys.sunrise;

    const isNight = currentTime >= sunsetTime || currentTime < sunriseTime;

    if (isNight) {
      return "🌙 It's night time! Be cautious if going out.";
    }

    if (description.includes("rain") || description.includes("storm")) {
      return "☔ It's rainy! Better stay indoors.";
    } else if (temperature > 35) {
      return "🌡️ It's too hot! Avoid going out.";
    } else if (description.includes("clear") || description.includes("sunny")) {
      return "☀️ The weather is clear! You can go out.";
    } else {
      return "🌤️ Weather is moderate, stay safe!";
    }
  };

  const addTask = async () => {
    if (!newTask.trim() || !deadline) {
      return alert("Task & deadline required!");
    }

    let weatherAdvice = null;
    if (newTask.toLowerCase().includes("outdoor") || newTask.toLowerCase().includes("cricket")) {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}`
        );
        weatherAdvice = getWeatherAdvice(res.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherAdvice = "⚠️ Unable to fetch weather data.";
      }
    }

    const task = {
      id: Date.now(),
      text: newTask,
      priority,
      deadline,
      weatherAdvice,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setDeadline("");
  };
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const sortTasks = () => {
    const sorted = [...tasks].sort((a, b) => {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    setTasks(sorted);
  };

  return (
    <div className={`dashboard ${theme}`}>
      <div className="header">
        <h2>📌 To-Do List</h2>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <button onClick={addTask}>Add</button>
        <button onClick={sortTasks}><FaSort /></button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.priority.toLowerCase()}`}>
            <span>{task.text} - <b>{task.priority}</b></span>
            <span>📅 {task.deadline}</span>
            {task.weatherAdvice && <span>⚠️ {task.weatherAdvice}</span>}
            <button onClick={() => deleteTask(task.id)}><FaTrash /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
