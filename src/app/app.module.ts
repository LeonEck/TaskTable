import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { DataHandlerComponent } from './data-handler/data-handler.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskTableComponent,
    NewTaskComponent,
    DataHandlerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
