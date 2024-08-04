import React from 'react'
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');
  const [showNewTaskInput, setShowNewTaskInput] = useState(true);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const newInputRef = useRef<HTMLInputElement>(null);

  const addTask = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id?: string,
    text?: string
  ) => {
    if (e.key === "Enter") {
      const newId = crypto.randomUUID();
      const newTaskItem: TaskItem = {
        id: newId,
        text: newTask,
        completed: false,
      };

      if (currentTask) {
        const index = tasks.findIndex(task => task.id === currentTask);
        if (index >= 0) {
          setTasks([...tasks.slice(0, index + 1), newTaskItem, ...tasks.slice(index + 1)]);
        }
        setCurrentTask(newId);
      } else {
        setTasks([...tasks, newTaskItem]);
        setCurrentTask(null);
      }
      setNewTask('');
    } else if (e.key === "Backspace" && text === "" && tasks.length > 1 && id) {
      removeTask(id);
    } else if (e.key === "Backspace" && tasks.length !== 0 && !id) {
      removeInput();
    }
  };

  const updateTask = (
    id: string,
    text: string,
  ) => {
    const updatedTasks = tasks.map(task => task.id === id ? {...task, text} : task);
    setTasks(updatedTasks);
  };

  const toggleComplete = (
    id: string,
    text: string,
    completed: boolean,
  ) => {
    if (text !== '' ) {
      const updatedTasks = tasks.map(task => task.id === id ? {...task, completed} : task);
      setTasks(updatedTasks);
    }
  };

  const removeTask = (
    id: string
  ) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const removeInput = () => {
    setShowNewTaskInput(false);
  };

  useEffect(() => {
    if (currentTask && inputRefs.current[currentTask]) {
      inputRefs.current[currentTask]?.focus();
    }
  }, [currentTask]);

  useEffect(() => {
    if (currentTask === null && newInputRef.current) {
      newInputRef.current.focus()
    }
  }, [currentTask]);

  return (
    <div>
      <h1>tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => toggleComplete(task.id, task.text, e.target.checked)}
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) => updateTask(task.id, e.target.value)}
              onKeyDown={(e) => addTask(e, task.id, task.text)}
              onFocus={() => setCurrentTask(task.id)}
              placeholder="new"
              ref={el => inputRefs.current[task.id] = el}
            />
            <button onClick={() => removeTask(task.id)} disabled={tasks.length === 1 && !showNewTaskInput}>
              <FontAwesomeIcon icon={faXmark as IconProp} />
            </button>
          </li>
        ))}
      </ul>
      {showNewTaskInput && (
        <li>
          <input type="checkbox" disabled={!newTask}/>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => addTask(e)}
            placeholder="new"
            ref={newInputRef}
          />
          <button 
            onClick={() => removeInput()}
            disabled={tasks.length === 0}>
            <FontAwesomeIcon icon={faXmark as IconProp} />
          </button>
        </li>
      )}
      <h1> </h1> { /* for aq bottom margin LOL */ }
    </div>
  );
};

export default Tasks;

/*  
    features to add:
    - title
    - reorder
    - arrow up/down
    - light mode
    - scrollbar
*/