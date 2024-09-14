<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTasksStore } from '../stores/useTaskStore';
import type { ITask, TaskPriority } from '../stores/useTaskStore/models'
import { TaskPriorityEnum, TaskStatusEnum } from '../types/enums'
import { useFieldRules } from '../composables/useFieldRules'

const tasksStore = useTasksStore()
const fieldRules = useFieldRules()

const props = defineProps<{
  show: boolean
  taskToEdit?: ITask;
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'scrollList'): void
}>()

const validForm = ref<boolean>(false)

const title = ref<string>('')
const description = ref<string>('')
const responsiblePerson = ref<string>('')
const responsibleNames = ref<string[]>([
  'Ivan Ivanov',
  'Olena Koval',
  'Anton Sydorenko',
  'Vasyl Popov',
  'Iryna Petrenko',
  'Andriy Boyko',
  'Natalia Sydorenko',
  'Yuriy Tymchenko',
  'Kateryna Sokolova',
  'Vitaliy Zakharenko'
])
const performers = ref<string[]>([])

const performersNames = ref<string[]>([
  'Maria Petrova',
  'Serhiy Horbunov',
  'Dmytro Ivanov',
  'Oleksandr Rudenko',
  'Olena Koval', 
  'Ivan Ivanov',
  'Oleg Lysenko',
  'Andriy Boyko', 
  'Yulia Kravchenko'
])

const priority = ref<TaskPriority>(TaskPriorityEnum.LOW)
const priorityList = ref([
  {label: 'Low', value: TaskPriorityEnum.LOW},
  {label: 'Medium', value: TaskPriorityEnum.MEDIUM},
  {label: 'High', value: TaskPriorityEnum.HIGH}
])

function closeDialog() {
  if (!props.taskToEdit) {
    title.value = ''
    description.value = ''
    responsiblePerson.value = ''
    performers.value = []
    priority.value = TaskPriorityEnum.LOW
  }
  validForm.value = false
  emits('close')
}

function onSubmit() {
  if (!validForm.value) return; 

  const task: ITask = {
    id: props.taskToEdit 
      ? props.taskToEdit.id 
      : Math.floor(Math.random() * (100 - 11 + 1)) + 11,
    title: title.value,
    description: description.value,
    responsiblePerson: responsiblePerson.value,
    performers: performers.value ,
    status: props.taskToEdit 
      ? props.taskToEdit.status 
      : TaskStatusEnum.TODO,
    priority: priority.value
  }

  if (props.taskToEdit) {
    tasksStore.editTask(task)
  } else {
    tasksStore.addNewTask(task)
  }

  closeDialog()

  emits('scrollList')
}

onMounted(() => {
  if (props.taskToEdit) {
    title.value = props.taskToEdit.title
    description.value = props.taskToEdit.description
    responsiblePerson.value = props.taskToEdit.responsiblePerson
    performers.value = props.taskToEdit.performers
    priority.value = props.taskToEdit.priority
  }
})
</script>

<template>
  <v-dialog
    v-if="props.show"
    :model-value="props.show" 
    max-width="500px"
    persistent
  >
  <v-form
    v-model="validForm"
    @submit.prevent="onSubmit()"
  >
    <v-card class="card-form">
      <v-card-title>
        {{ taskToEdit ? 'Edit task' : 'New task' }}
      </v-card-title>
      <v-text-field
        v-model="title"
        label="Title"
        placeholder="Enter title"
        :rules="[fieldRules.required]"
        clearable
      ></v-text-field>
      <v-text-field
        v-model="description"
        label="Description"
        placeholder="Enter description"
        :rules="[fieldRules.required]"
        clearable
      ></v-text-field>
      <v-select
        v-model="responsiblePerson"
        :items="responsibleNames"
        label="Responsible"
        :rules="[fieldRules.required]"
        clearable
      ></v-select>
      <v-select
        v-model="performers"
        label="Performers"
        :items="performersNames"
        :rules="[fieldRules.required]"
        multiple
        clearable
      ></v-select>
      <v-select
        v-model="priority"
        label="Priority"
        item-title="label"
        item-value="value"
        :items="priorityList"
        :rules="[fieldRules.required]"
        clearable
      ></v-select>
      <template v-slot:actions>
        <v-btn :disabled="!validForm" type="submit">
          Add
        </v-btn>

        <v-btn @click="closeDialog" type="button">
          Close
        </v-btn>
        </template>
    </v-card>
  </v-form>

  </v-dialog>
</template>



<style scoped lang="scss">
.card-form {
  padding: 15px;
}
:deep(.v-card) {
  gap: 10px;
}
</style>