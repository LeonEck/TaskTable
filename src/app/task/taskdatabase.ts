import Dexie from 'dexie';
import { Task } from './task';

export class TaskDatabase extends Dexie {
  taskTable: Dexie.Table<Task, number>;

  constructor () {
    super('TaskDB');
    this.version(1).stores({
      taskTable: '++id, title, completed'
    });
  }

}
