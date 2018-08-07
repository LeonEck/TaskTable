import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  constructor(public taskService: TaskService) { }

  ngOnInit() {
  }

}
