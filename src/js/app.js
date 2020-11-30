import Task from './task';
import Ui from './ui';

class App {
  constructor() {
    this.inputEl = null;
    this.tasks = [];
    this.MESSAGE_DELAY = 5000;
    this.LOCALSTORAGE_NAME = 'niRastorsTaskManager';
  }

  init() {
    this.inputEl = document.querySelector('.header__input');

    this.messageEl = document.querySelector('.header__message');
    this.messageTextEl = this.messageEl.querySelector('.message__text');
    this.messageCloseEl = this.messageEl.querySelector('.message__close');

    this.pinnedSectionEl = document.querySelector('.pinned');
    this.pinnedListEl = this.pinnedSectionEl.querySelector('.pinned__list');
    this.pinnedNoPinnedEl = this.pinnedSectionEl.querySelector('.pinned__nopinned');

    this.allTasksSectionEl = document.querySelector('.all-tasks');
    this.allTasksListEl = this.allTasksSectionEl.querySelector('.all-tasks__list');
    this.allTasksNotFoundEl = this.allTasksSectionEl.querySelector('.all-tasks__not-found');

    this.ui = new Ui(
      this.allTasksListEl,
      this.pinnedListEl,
      this.inputEl,
      this.messageEl,
      this.messageTextEl,
      this.pinnedNoPinnedEl,
      this.allTasksNotFoundEl,
    );

    this.initListeners();

    this.load();
  }

  initListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.onEnter();
      }
    });

    document.addEventListener('click', (e) => {
      const classList = Array.from(e.target.classList);
      if (classList.includes('task__pin')) {
        this.changePin(e.target);
      } else if (classList.includes('task__del') || classList.includes('del__times')) {
        this.deleteTask(e.target);
      }
    });

    this.messageCloseEl.addEventListener('click', () => {
      this.ui.closeMessage();
    });

    this.inputEl.addEventListener('input', () => {
      this.ui.closeMessage();
      this.filter();
    });
  }

  filter() {
    const text = this.inputEl.value.toLowerCase();
    if (text) {
      const pinnedTasks = this.tasks.filter((t) => t.pinned === true);
      const unpinnedFilteredTasks = this.tasks
        .filter((t) => t.pinned === false && t.taskName.toLowerCase().includes(text));
      this.ui.redraw(pinnedTasks.concat(unpinnedFilteredTasks));
    } else {
      this.ui.redraw(this.tasks);
    }
  }

  createNewTask(TaskName, pinned) {
    const newTask = new Task(TaskName, pinned);
    this.tasks.push(newTask);
  }

  hasTaskWithThisName(taskName) {
    return this.tasks.find((t) => t.taskName === taskName);
  }

  onEnter() {
    const text = this.inputEl.value;
    if (text) {
      if (this.hasTaskWithThisName(text)) {
        this.ui.showMessage('Task already exists', this.MESSAGE_DELAY);
      } else {
        this.createNewTask(text, false);
        this.ui.clearInput();
        this.ui.redraw(this.tasks);
        this.save();
      }
    } else {
      this.ui.showMessage('Enter task name', this.MESSAGE_DELAY);
    }
  }

  searchTaskByTarget(target) {
    const clickedTaskName = target.closest('.task').querySelector('.task__name').innerText;
    const task = this.tasks.find((t) => t.taskName === clickedTaskName);
    const taskIndex = this.tasks.findIndex((t) => t.taskName === clickedTaskName);
    return { task, taskIndex };
  }

  deleteTask(target) {
    const { taskIndex } = this.searchTaskByTarget(target);
    this.tasks.splice(taskIndex, 1);
    this.ui.redraw(this.tasks);
    this.save();
  }

  changePin(target) {
    const { task } = this.searchTaskByTarget(target);
    task.pinned = !task.pinned;
    this.ui.redraw(this.tasks);
    this.save();
  }

  save() {
    localStorage.setItem(this.LOCALSTORAGE_NAME, JSON.stringify(this.tasks));
  }

  load() {
    const loaded = JSON.parse(localStorage.getItem(this.LOCALSTORAGE_NAME));
    loaded.forEach((task) => {
      this.createNewTask(task.taskName, task.pinned);
    });
    this.ui.redraw(this.tasks);
  }
}

const app = new App();
app.init();
