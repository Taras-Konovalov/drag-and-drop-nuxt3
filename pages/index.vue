<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeMount } from 'vue';
import { useTasksStore } from '../stores/useTaskStore';
import { TaskStatusEnum } from '../types/enums'

const tasksStore = useTasksStore()

const isOpenDialog = ref<boolean>(false)
const taskListRef = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (taskListRef.value) {
    taskListRef.value.scrollTo({
      top: taskListRef.value.scrollHeight,
      behavior: 'smooth',
    });
  }
};

const handleScrollTaslList = () => {
  nextTick(() => {
    scrollToBottom();
  });
};

</script>

<template>
  <div class="board-container">
    <div 
      class="board" 
      @dragover.prevent 
      @drop="tasksStore.onDrop('todo')"
    >
      <div class="board__title">
        <v-icon size="18" color="#87909E">
          mdi mdi-circle-slice-8
        </v-icon>
        <h4>TODO</h4>
      </div>
      <div
        class="task-list-container"
        ref="taskListRef"
        v-cloak
      >
        <transition-group 
          name="list" 
        >
          <TaskCard 
            v-for="(task, index) in tasksStore.todo"
            :key="task.id"
            :task="task"
            @onDragStart="tasksStore.onDragStart(task, TaskStatusEnum.TODO)"
            @onDragEnter="tasksStore.onDragEnter(TaskStatusEnum.TODO, index)"
            @onDragEnd="tasksStore.onDragEnd()"
          />
        </transition-group>
      </div>

      <v-btn @click="isOpenDialog = true" class="add-btn">
        <v-icon size="20">
          mdi mdi-plus
        </v-icon>
        Add task
      </v-btn>
    </div>

    <div 
      class="board board__progress" 
      @dragover.prevent 
      @drop="tasksStore.onDrop('inProgress')"
    >
      <div class="board__title title-progress">
        <v-icon size="18" color="white">
          mdi mdi-circle-slice-8
        </v-icon>
        <h4>In progress</h4>
      </div>
      <transition-group name="list" tag="div" class="task-list-container">
        <TaskCard 
          v-for="(task, index) in tasksStore.inProgress"
          :key="task.id"
          :task="task"
          @onDragStart="tasksStore.onDragStart(task, TaskStatusEnum.IN_PROGRESS)"
          @onDragEnter="tasksStore.onDragEnter(TaskStatusEnum.IN_PROGRESS, index)"
          @onDragEnd="tasksStore.onDragEnd()"
        />
      </transition-group>
    </div>

    <div 
      class="board board__done" 
      @dragover.prevent 
      @drop="tasksStore.onDrop('done')"
    >
      <div class="board__title title-done">
        <v-icon size="18" color="white">
          mdi mdi-check-circle
        </v-icon>
        <h4>Done</h4>
      </div>
      <transition-group name="list" tag="div" class="task-list-container">
        <TaskCard 
          v-for="(task, index) in tasksStore.done"
          :key="task.id"
          :task="task"
          @onDragStart="tasksStore.onDragStart(task, TaskStatusEnum.DONE)"
          @onDragEnter="tasksStore.onDragEnter(TaskStatusEnum.DONE, index)"
          @onDragEnd="tasksStore.onDragEnd()"
        />
      </transition-group>
    </div>
  </div>
  <AddNewTaskDialog 
    :show="isOpenDialog" 
    @close="isOpenDialog = false"
    @scroll-list="handleScrollTaslList"
  />
</template>

<style scoped lang="scss">

.board-container {
  padding: 20px;
  width: 100%;
  justify-content: space-between;
  display: flex;
  gap: 20px;
  height: 100vh;
  overflow-x: auto;
}

.board {
  width: 100%;
  max-height: 100%;
  height: 100%;
  padding: 10px;
  background-color: #F3F3F5;
  border-radius: 8px;
  border: 1px solid #ccc;

  & :first-child {
    margin-top: 0;
  }

  & :last-child {
    margin-bottom: 0;
  }

  &__progress {
    background-color: #F3F9FD;
  }

  &__done {
    background-color: #F2F9F5;
  }

  &__title {
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px;
    color: #4F5762;
    background-color: #E8EAED;
    border-radius: 5px;
    margin-bottom: 5px;
    text-transform: uppercase;
  }

  & .title-progress {
    background-color: #1090E0;
    color: white;
  }

  & .title-done {
    background-color: #008844;
    color: white;
  }
}

.task-list-container {
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 85px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5px;

  &::-webkit-scrollbar {
      width: 7px;
    }

    &::-webkit-scrollbar-track {
      background: #cccccc50;
      width: 7px;
      border-radius: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ADB3BD;
      border-radius: 5px;
      border: 2px solid #ADB3BD;
    }
}

.task-card {
  margin: 10px 0;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: grab;
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}

.list-enter-from, .list-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.add-btn {
  margin-top: 10px;
}
:deep(.v-btn.add-btn) {
  margin-top: 10px;
  width: 100% !important;
}
</style>