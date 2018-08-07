export interface Task {
  id?: number,
  title: string,
  completed: number // 0: not completed, 1: completed. Can not be boolean, because IndexedDB does not index booleans.
}
