export default class Ui {
  constructor(
    allTasksListEl,
    pinnedTasksListEl,
    inputEl,
    messageEl,
    messageTextEl,
    pinnedNoPinnedEl,
    allTasksNotFoundEl,
  ) {
    this.allTasksListEl = allTasksListEl;
    this.pinnedTasksListEl = pinnedTasksListEl;
    this.inputEl = inputEl;
    this.messageEl = messageEl;
    this.messageTextEl = messageTextEl;
    this.messageTimeout = null;
    this.pinnedNoPinnedEl = pinnedNoPinnedEl;
    this.allTasksNotFoundEl = allTasksNotFoundEl;
  }

  closeMessage() {
    this.messageEl.classList.add('display-none');
    clearTimeout(this.messageTimeout);
    this.messageTimeout = null;
  }

  showMessage(text, delay) {
    this.messageTextEl.innerText = text;
    this.messageEl.classList.remove('display-none');
    if (delay) {
      this.messageTimeout = setTimeout(this.closeMessage.bind(this), delay);
    }
  }

  clearInput() {
    this.inputEl.value = '';
  }

  showNoTaskMessage(tasks) {
    const hasPinnedTasks = tasks.find((t) => t.pinned === true);
    const hasRegularTasks = tasks.find((t) => t.pinned === false);

    if (hasPinnedTasks) {
      this.pinnedNoPinnedEl.classList.add('display-none');
    } else {
      this.pinnedNoPinnedEl.classList.remove('display-none');
    }

    if (hasRegularTasks) {
      this.allTasksNotFoundEl.classList.add('display-none');
    } else {
      this.allTasksNotFoundEl.classList.remove('display-none');
    }
  }

  clear() {
    this.allTasksListEl.innerHTML = null;
    this.pinnedTasksListEl.innerHTML = null;
  }

  redraw(tasks) {
    this.clear();
    this.showNoTaskMessage(tasks);

    tasks.forEach((task) => {
      const taskCard = document.createElement('div');
      taskCard.classList.add('task');
      const pintext = task.pinned ? 'pinned' : 'pin';
      taskCard.innerHTML = `
        <div class="task__name">${task.taskName}</div>
        <div class="task__pin">${pintext}</div>
        <div class="task__del"><span class="del__times">&times;</span></div>
      `;
      if (task.pinned) {
        this.pinnedTasksListEl.appendChild(taskCard);
      } else {
        this.allTasksListEl.appendChild(taskCard);
      }
    });
  }
}
