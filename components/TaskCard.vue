<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ITask, TaskStatus } from '../stores/useTaskStore/models';
import { TaskStatusEnum, TaskPriorityEnum } from '../types/enums';
import { useTasksStore } from '../stores/useTaskStore';

const props = defineProps<{
  task: ITask
}>()

const emits = defineEmits<{
  (e: 'onDragStart'): void
  (e: 'onDragEnter'): void
  (e: 'onDragEnd'): void
}>()

const tasksStore = useTasksStore()

const isOpenDeleteDialog = ref<boolean>(false)
const isOpenEditDialog = ref<boolean>(false)

const statusChipColor = computed(() => {
  switch (props.task.status) {
    case TaskStatusEnum.TODO:
      return '#87909E'
    case TaskStatusEnum.IN_PROGRESS:
      return '#1090E0'
    case TaskStatusEnum.DONE:
      return '#008844';
  }
})

const priorityChipColor = computed(() => {
  switch (props.task.priority) {
    case TaskPriorityEnum.LOW:
      return '#008844'
    case TaskPriorityEnum.MEDIUM:
      return '#F4CA16'
    case TaskPriorityEnum.HIGH:
      return 'red';
  }
})

function deleteTask(listName:TaskStatus, taskId: number) {
  tasksStore.deleteTask(listName, taskId)
  isOpenDeleteDialog.value = false
}
</script>

<template>
  <div
    class="task-card"
    draggable="true"
    @dragstart="emits('onDragStart')"
    @dragenter="emits('onDragEnter')"
    @dragend="emits('onDragEnd')"
    @dragover.prevent
    :title="task.title"
  >
    <p>
      {{ `Title: ${task.title}`}}
    </p>
    <p>
      {{ `Description:  ${task.description}`}}
    </p>
    <p>
      {{ `Responsible person:  ${task.responsiblePerson}`}}
    </p>
    <p>
      {{ `Performers: ${task.performers.join(', ')}`}}
    </p>
    <div class="task-card__chips">
      <v-chip :color="statusChipColor">
        <span>{{ task.status.toUpperCase() }}</span>
      </v-chip>
      <v-chip :color="priorityChipColor">
        <span>{{ task.priority.toUpperCase() }}</span>
      </v-chip>
    </div>
    <div class="task-card__actions">
      <v-btn
        class="edit-btn"
        prepend-icon="mdi mdi-pencil" 
        color="green"
        @click="isOpenEditDialog = true"
      >
        Edit task
      </v-btn>
      <v-btn 
        class="delete-btn"
        prepend-icon="mdi mdi-trash-can-outline" 
        color="red"
        @click="isOpenDeleteDialog = true"
      >
        Delete task
      </v-btn>
    </div>
    <v-dialog 
      v-model="isOpenDeleteDialog"
      width="auto"
      persistent
    >
      <v-card
        title="Are you sure you want to delete this task?"
      >
        <template v-slot:actions>
          <v-btn
            color="red"
            variant="tonal"
            @click="deleteTask(task.status, task.id)"
          >
            Yes
          </v-btn>
          <v-btn
            color="#1090E0"
            variant="tonal"
            @click="isOpenDeleteDialog = false"
          >
            No
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
    <AddNewTaskDialog 
      :show="isOpenEditDialog" 
      @close="isOpenEditDialog = false"
      :taskToEdit="task"
    />
  </div>
</template>



<style scoped lang="scss">
.task-card {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__chips {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  &__actions {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

:deep(.v-btn.edit-btn) {
  width: 50% !important;
}

:deep(.v-btn.delete-btn) {
  width: 50% !important;
}
</style>