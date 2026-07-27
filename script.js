// ---- State ----
let tasks = [];

// ---- DOM refs ----
const taskInput    = document.getElementById('taskInput');
const addBtn       = document.getElementById('addBtn');
const taskList     = document.getElementById('taskList');
const totalCount   = document.getElementById('totalCount');
const deleteAllBtn = document.getElementById('deleteAllBtn');

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
    tasks.forEach((task, index) => {
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2 group animate-[fadeIn_0.15s_ease-out]';

      item.innerHTML = `
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <input type="checkbox" ${task.done ? 'checked' : ''}
            class="w-4 h-4 accent-indigo-600 cursor-pointer" data-index="${index}" data-action="toggle">
          <span class="truncate text-white ${task.done ? 'line-through text-slate-500' : ''}">
            ${task.text}
          </span>
        </div>
        <button data-index="${index}" data-action="delete"
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
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({
     text, 
     done: false
     });
  taskInput.value = '';
  render();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  render();
}

function deleteAll() {
  if (tasks.length === 0) return;
  tasks = [];
  render();
}

// ---- Event listeners ----
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});
deleteAllBtn.addEventListener('click', deleteAll);

taskList.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  const index = e.target.dataset.index;
  if (action === 'toggle') toggleTask(Number(index));
  if (action === 'delete') deleteTask(Number(index));
});

// ---- Init ----
render();