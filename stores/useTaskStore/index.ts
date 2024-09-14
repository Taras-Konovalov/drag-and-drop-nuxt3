import { defineStore } from 'pinia';
import type { ITask, TaskStatus } from './models';

interface ITasksStore {
  todo: ITask[];
  inProgress: ITask[];
  done: ITask[];
  draggedTask: ITask | null;
  draggedFrom: TaskStatus | null;
  draggedId: number | null;
}

interface ITasksActions {
  onDragStart(task: ITask, from: TaskStatus): void;
  onDragEnter(list: TaskStatus, newIndex: number): void;
  onDrop(to: TaskStatus): void;
  onDragEnd(): void;
  resetDragState(): void;
  addNewTask(newTask: ITask): void
  deleteTask(listName:TaskStatus, taskId: number): void
  editTask(updatedTask: ITask): void;
}

export const useTasksStore = defineStore<
'tasks', ITasksStore, {}, ITasksActions
>({
  id: 'tasks',
  state: (): ITasksStore => ({
    todo: [
        {
          id: 1,
          title: "Homepage Development",
          description: "Design and layout of the homepage.",
          responsiblePerson: "Ivan Ivanov",
          performers: ["Maria Petrova"],
          status: "todo",
          priority: "high"
        },
        {
          id: 2,
          title: "API Testing",
          description: "Testing the user authentication API.",
          responsiblePerson: "Olena Koval",
          performers: ["Serhiy Horbunov"],
          status: "todo",
          priority: "medium"
        },
        {
          id: 3,
          title: "Bug Fixing",
          description: "Fixing bugs found during testing.",
          responsiblePerson: "Anton Sydorenko",
          performers: ["Yulia Kravchenko"],
          status: "todo",
          priority: "high"
        },
        {
          id: 4,
          title: "Payment System Integration",
          description: "Integrating the payment system for transactions.",
          responsiblePerson: "Vasyl Popov",
          performers: ["Dmytro Ivanov", "Oleg Lysenko"],
          status: "todo",
          priority: "high"
        },
        {
          id: 5,
          title: "Speed Optimization",
          description: "Optimizing the website for faster loading times.",
          responsiblePerson: "Iryna Petrenko",
          performers: ["Oleksandr Rudenko"],
          status: "todo",
          priority: "medium"
        },
        {
          id: 6,
          title: "Mobile Version Development",
          description: "Adapting the website for mobile devices.",
          responsiblePerson: "Andriy Boyko",
          performers: ["Olena Koval", "Maria Petrova"],
          status: "todo",
          priority: "high"
        },
        {
          id: 7,
          title: "Technical Documentation Preparation",
          description: "Writing documentation for the new release.",
          responsiblePerson: "Natalia Sydorenko",
          performers: ["Ivan Ivanov"],
          status: "todo",
          priority: "low"
        },
        {
          id: 8,
          title: "Code Refactoring",
          description: "Improving the code structure and quality.",
          responsiblePerson: "Yuriy Tymchenko",
          performers: ["Oleg Lysenko"],
          status: "todo",
          priority: "medium"
        },
        {
          id: 9,
          title: "Database Backup",
          description: "Setting up automatic database backups.",
          responsiblePerson: "Kateryna Sokolova",
          performers: ["Serhiy Horbunov"],
          status: "todo",
          priority: "low"
        },
        {
          id: 10,
          title: "New Module Development",
          description: "Creating new modules to extend website functionality.",
          responsiblePerson: "Vitaliy Zakharenko",
          performers: ["Andriy Boyko", "Yulia Kravchenko"],
          status: "todo",
          priority: "high"
        },
    ],
    inProgress: [],
    done: [],
    draggedTask: null,
    draggedFrom: null,
    draggedId: null,
  }),
  getters: {
    getTodo(state) {
      return state.todo;
    },
    getInProgress(state) {
      return state.inProgress;
    },
    getDone(state) {
      return state.done;
    },
  },
  actions: {
    // Обрабатывает начало перетаскивания задачи
    onDragStart(task: ITask, from: TaskStatus) {
      // Сохраняем текущую перетаскиваемую задачу
      this.draggedTask = task;
      // Сохраняем статус списка, из которого задача была перетащена
      this.draggedFrom = from;
       // Сохраняем ID перетаскиваемой задачи
      this.draggedId = task.id;
    },

    // Обрабатывает событие входа в список при перетаскивании
    onDragEnter(list: TaskStatus, newIndex: number) {
      // Проверяем, что задача была перетащена из того же списка и ID задачи существует
      if (this.draggedFrom === list && this.draggedId) {
        // Получаем текущий список задач
        const tasksList = this[list];
        // Находим индекс перетаскиваемой задачи в текущем списке
        const draggedIndex = tasksList.findIndex(task => task.id === this.draggedId);
        if (draggedIndex !== -1 && draggedIndex !== newIndex) {
          // Получаем перетаскиваемую задачу
          const draggedItem = tasksList[draggedIndex];
          
          // Создаем новый массив без перетаскиваемого элемента
          const updatedList = tasksList.filter((_, index) => index !== draggedIndex);

          // Вставляем перетаскиваемый элемент на новое место
          const newList = [
            ...updatedList.slice(0, newIndex),
            draggedItem,
            ...updatedList.slice(newIndex)
          ];

          // Обновляем состояние
          this[list] = newList;
        }
      }
    },

    // Обрабатывает событие отпускания задачи (дропа) в новый список
    onDrop(to: TaskStatus) {
      // Проверяем, что задача была перетащена в другой список и все необходимые данные присутствуют
      if (this.draggedTask && this.draggedFrom !== to && this.draggedId !== null && this.draggedFrom) {
        // Получаем текущие списки задач для исходного и нового списков
        const fromList = this[this.draggedFrom];
        const toList = this[to];
        // Находим индекс перетаскиваемой задачи в исходном списке
        const draggedIndex = fromList.findIndex(task => task.id === this.draggedId);
        if (draggedIndex !== -1) {
          // Создаем новый массив без перетаскиваемого элемента в исходной доске
          const updatedFromList = fromList.filter((_, index) => index !== draggedIndex);

          // Обновляем статус задачи
          this.draggedTask.status = to;

          // Добавляем задачу в новую доску
          const updatedToList = [...toList, this.draggedTask];

          // Обновляем состояние
          this[this.draggedFrom] = updatedFromList;
          this[to] = updatedToList;
        }
      }
      // Сбрасываем состояние перетаскивания
      this.resetDragState();
    },
    
    // Сбрасывает состояние перетаскивания
    onDragEnd() {
      this.resetDragState();
    },
     // Сбрасывает состояние перетаскивания задачи
    resetDragState(): void {
      this.draggedTask = null;
      this.draggedFrom = null;
      this.draggedId = null;
    },
    // Добавляет новую задачу в список задач "todo"
    addNewTask(newTask: ITask): void {
      this.todo = [...this.todo, newTask]
    },
    // Удаляет задачу из указанного списка по ID
    deleteTask(listName:TaskStatus, taskId: number): void {
      this[listName] = this[listName].filter(task => task.id !== taskId)
    },
    // Обновляет задачу в списке на основе обновленных данных
    editTask(updatedTask: ITask): void {
      // Находим список задач по статусу обновленной задачи
      const list = this[updatedTask.status];
      // Находим индекс задачи в списке
      const taskIndex = list.findIndex(task => task.id === updatedTask.id);
      
      if (taskIndex !== -1) {
        // Заменить найденную задачу на обновленную
        this[updatedTask.status][taskIndex] = updatedTask;
      }
    }
  },
  persist: true,
});