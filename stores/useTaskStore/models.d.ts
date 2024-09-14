export type TaskStatus = 'todo' | 'inProgress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface ITask {
  id: number
  title: string
  description :string
  responsiblePerson: string
  performers: string[]
  status: TaskStatus
  priority: TaskPriority
}

export interface IBoard {
  todo: ITask[]
  inProgress: ITask[]
  done: ITask[]
}