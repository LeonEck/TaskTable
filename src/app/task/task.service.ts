import { Injectable } from '@angular/core';
import { TaskDatabase } from './taskdatabase';
import { Task } from './task';

import { saveAs } from 'file-saver/FileSaver';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskDB: TaskDatabase;
  databaseError = false;
  tasks: Task[];
  completedTasks: Task[];
  currentlyEditedTasks: Set<number>;
  newTaskTitle = '';
  addingInProgress = false;

  private csvHeaderLine = 'completed,title';

  constructor() {
    this.taskDB = new TaskDatabase();
    this.currentlyEditedTasks = new Set<number>();
    this.updateTasks();
  }

  addTask() {
    if (this.newTaskTitle === '') {
      return;
    }
    this.addingInProgress = true;
    this.taskDB.taskTable.add({
      title: this.newTaskTitle,
      completed: 0
    }).then(() => {
      this.updateTasks();
      this.newTaskTitle = '';
      this.addingInProgress = false;
    });
  }

  taskToggle(taskId: number) {
    this.currentlyEditedTasks.delete(taskId);
    this.taskDB.taskTable.get(taskId).then(task => {
      let newCompletedValue = 1;
      if (task.completed === 1) {
        newCompletedValue = 0;
      }
      this.taskDB.taskTable.update(taskId, {
        completed: newCompletedValue
      }).then(() => {
        this.updateTasks();
      });
    });
  }

  startEditTask(taskId: number) {
    this.currentlyEditedTasks.add(taskId);
  }

  saveEditTask(taskId: number, newTitle: string) {
    this.currentlyEditedTasks.delete(taskId);
    this.taskDB.taskTable.update(taskId, {
      title: newTitle
    }).then(() => {
      this.updateTasks();
    });
  }

  deleteTask(taskId: number) {
    this.taskDB.taskTable.delete(taskId).then(() => {
      this.updateTasks();
    });
  }

  deleteCompletedTasks() {
    this.taskDB.taskTable.where({
      completed: 1
    }).delete().then(() => {
      this.updateTasks();
    });
  }

  updateTasks() {
    this.taskDB.taskTable.where({
      completed: 0
    }).toArray().then(result => {
      this.tasks = result;
    }).catch(() => {
      this.databaseError = true;
    });

    this.taskDB.taskTable.where({
      completed: 1
    }).toArray().then(result => {
      this.completedTasks = result;
    }).catch(() => {
      this.databaseError = true;
    });
  }

  importTasks(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);

      reader.onload = () => {
        const csvContent = reader.result;
        const csvLines = csvContent.split('\n');
        if (csvLines[0] !== this.csvHeaderLine) {
          alert('Incompatible file format');
          return;
        }
        if (!confirm('By clicking OK all current data will be overridden by the imported data.')) {
          return;
        }
        csvLines.shift(); // Remove header
        const newTasks = [];
        csvLines.forEach(line => {
          const values = line.split(',');
          newTasks.push({
            completed: parseInt(values[0], 10),
            title: values[1]
          });
        });
        console.log(newTasks);
        this.taskDB.taskTable.clear().then(() => {
          this.taskDB.taskTable.bulkAdd(newTasks).then(() => {
            this.updateTasks();
          });
        });
      };
    }
  }

  exportTasks() {
    const csvLines = [this.csvHeaderLine];
    this.taskDB.taskTable.orderBy('completed').toArray().then(result => {
      result.forEach(task => {
        csvLines.push(`${task.completed},${task.title}`);
      });

      const csvContent = csvLines.join('\n');
      const csvFile = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
      const currentDate = new Date();
      const dateString = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) +
        '-' + ('0' + currentDate.getDate()).slice(-2);
      saveAs(csvFile, `${dateString}_TaskTable.csv`);
    });
  }

}
