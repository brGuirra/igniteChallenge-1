import { useState, useRef } from 'react';

import '../styles/tasklist.scss';

import { FiTrash, FiCheckSquare } from 'react-icons/fi';

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [idTasks, setIdTasks] = useState<number[]>([]);
  const [isTaskTitleEmpty, setIsTaskTitleEmpty] = useState(false);

  const inputEl = useRef<HTMLInputElement>(null);

  function gerenteNewId() {
    // Generate a new random id for the task
    const newId = Math.floor(Math.random() * (99999 - 10000) + 10000);

    return newId;
  }

  function validateId(id: number) {
    // Valitade if the ID doesn't already exist
    if (idTasks.includes(id)) {
      const getNewId = gerenteNewId();
      validateId(getNewId);
    } else {
      return id;
    }
  }

  function handleCreateNewTask() {
    // ✅ Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (newTaskTitle) {
      // Check if the new id doesn't already exists
      const newId = gerenteNewId();
      validateId(newId);

      setIdTasks([...idTasks, newId]);
      setTasks([
        ...tasks,
        {
          id: newId,
          title: newTaskTitle,
          isComplete: false,
        },
      ]);

      setIsTaskTitleEmpty(false);
      setNewTaskTitle('');
    } else {
      setIsTaskTitleEmpty(true);

      if (inputEl && inputEl.current) {
        setNewTaskTitle('');
        inputEl.current.focus();
      }
    }
  }

  function handleToggleTaskCompletion(id: number) {
    // ✅ Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    const updatedTasksStatus = [...tasks];

    tasks.forEach((task: Task, index: number) => {
      if (task.id === id) {
        updatedTasksStatus[index].isComplete =
          !updatedTasksStatus[index].isComplete;
      }
    });

    setTasks(updatedTasksStatus);
  }

  function handleRemoveTask(id: number) {
    // ✅  Remova uma task da listagem pelo ID
    const updatedTasksStatus = [...tasks];

    tasks.forEach((task: Task, index: number) => {
      if (task.id === id) {
        updatedTasksStatus.splice(index, 1);
      }
    });

    setTasks(updatedTasksStatus);
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            ref={inputEl}
            className={isTaskTitleEmpty ? 'empty' : ''}
            type="text"
            placeholder={'Adicionar novo todo'}
            onChange={(e) => {
              setNewTaskTitle(e.target.value);
              setIsTaskTitleEmpty(false);
            }}
            value={newTaskTitle}
          />
          <button
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? 'completed' : ''}
                data-testid="task">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
