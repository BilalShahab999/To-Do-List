// ---- State ----
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ---- DOM refs ----
const taskInput    = document.getElementById('taskInput');
const addBtn       = document.getElementById('addBtn');
const taskList     = document.getElementById('taskList');
const totalCount   = document.getElementById('totalCount');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// ---- Storage helpers ----
function saveToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearStorage() {
  localStorage.removeItem('tasks');
}

// ---- Render ----
function render() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-slate-500 py-16">
        <span class="text-5xl mb-3">📭</span>
        <p class="font-medium">No tasks yet</p>
        <p class="text-sm text-slate-600">Add one above to get started</p>
      </div>
    `;
  } else {
    tasks.forEach((task) => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2 group animate-[fadeIn_0.15s_ease-out]';

      // CHANGED: data-id instead of data-index
      item.innerHTML = `
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <input type="checkbox" ${task.done ? 'checked' : ''}
            class="w-4 h-4 accent-indigo-600 cursor-pointer" data-id="${task.id}" data-action="toggle">
          <span class="truncate text-white ${task.done ? 'line-through text-slate-500' : ''}">
            ${task.text}
          </span>
        </div>
        <button data-id="${task.id}" data-action="delete"
          class="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition ml-2">
          ✕
        </button>
      `;
      taskList.appendChild(item);
    });
  }

  totalCount.textContent = tasks.length;
}

// ---- Actions ----

// ADD: give every new task a unique id
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: crypto.randomUUID(),   // <-- unique id generated here
    text: text,
    done: false
  };

  tasks.push(newTask);
  taskInput.value = '';
  saveToStorage();
  render();
}

// TOGGLE: find the task by id, not by position
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;
  saveToStorage();
  render();
}

// DELETE ONE: filter out the task matching this id
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveToStorage();
  render();
}

// DELETE ALL: unchanged, still wipes everything
function deleteAll() {
  if (tasks.length === 0) return;
  tasks = [];
  clearStorage();
  render();
}

// ---- Event listeners ----
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});
deleteAllBtn.addEventListener('click', deleteAll);

// CHANGED: read data-id instead of data-index
taskList.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;
  if (action === 'toggle') toggleTask(id);
  if (action === 'delete') deleteTask(id);
});

// ---- Init ----
render();