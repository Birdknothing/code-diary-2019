import { Component } from '@angular/core';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';
  constructor(private todos: TodoService) {}
  getList() {
    return this.todos.datas;
  }
  addItem(item) {
    this.todos.addItem(item);
  }
  rmItem(item) {
    console.log(item);
    this.todos.rmItem(item);
  }
}
