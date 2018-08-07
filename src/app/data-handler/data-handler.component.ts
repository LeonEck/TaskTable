import {Component, OnInit} from '@angular/core';
import { TaskService } from '../task/task.service';

@Component({
  selector: 'app-data-handler',
  templateUrl: './data-handler.component.html',
  styleUrls: ['./data-handler.component.css']
})
export class DataHandlerComponent implements OnInit {

  constructor(public taskService: TaskService) { }

  ngOnInit() {
  }

}
