import { useState, useEffect } from "react";
import "./style.css";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState(() => {
    // Retrieve todos from localStorage when the app loads
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [filter, setFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");

  // Save todos to localStorage whenever the todos array changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newItem.trim() === "") return;

    setTodos(currentTodos => [
      ...currentTodos,
      { id: crypto.randomUUID(), title: newItem, completed: false },
    ]);
    setNewItem("");
  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(currentTodos =>
      currentTodos.filter(todo => todo.id !== id)
    );
  }

  function startEditTodo(id, title) {
    setIsEditing(id);
    setCurrentTitle(title);
  }

  function saveEditTodo(id) {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, title: currentTitle } : todo
      )
    );
    setIsEditing(null);
    setCurrentTitle("");
  }

  function filteredTodos() {
    if (filter === "all") return todos;
    if (filter === "completed") return todos.filter(todo => todo.completed);
    if (filter === "active") return todos.filter(todo => !todo.completed);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New Item</label>
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            type="text"
            id="item"
          />
        </div>
        <button className="btn">Add</button>
      </form>
      <div className="form-row2">
        <h1 className="header">Todo List</h1>

        <div className="filters">
          <button onClick={() => setFilter("all")} className="filter-btn">
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className="filter-btn"
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className="filter-btn"
          >
            Completed
          </button>
        </div>

        <ul className="list">
          {filteredTodos().length === 0 && "No Todos"}
          {filteredTodos().map(todo => (
            <li key={todo.id} className={todo.completed ? "completed" : ""}>
              {isEditing === todo.id ? (
                <>
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={e => setCurrentTitle(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    onClick={() => saveEditTodo(todo.id)}
                    className="btn btn-save"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <label>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={e => toggleTodo(todo.id, e.target.checked)}
                    />
                    {todo.title}
                  </label>
                  <div className="buttons">
                    <button
                      onClick={() => startEditTodo(todo.id, todo.title)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}