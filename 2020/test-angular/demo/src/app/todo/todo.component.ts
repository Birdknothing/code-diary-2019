import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  itemToAdd = 'demo';
  constructor() {}
  @Input() datas: Array<any>;
  @Output() rmItem = new EventEmitter();
  @Output() addItem = new EventEmitter();
  delItem(item) {
    this.rmItem.emit(item);
  }
  newItem(item) {
    this.addItem.emit(item);
  }
  ngOnInit(): void {}
}
