import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-thing',
  templateUrl: './thing.component.html',
  styleUrls: ['./thing.component.scss']
})
export class ThingComponent implements OnInit {
  @Input() list: Array<any>;
  @Input() title: string;
  @Output() addItem = new EventEmitter();
  @Output() rmItem = new EventEmitter();
  @Output() newTitle = new EventEmitter();
  todo = '';
  changedTitle = "";
  constructor() {}
  newItem(name) {
    this.addItem.emit(name);
  }
  delItem(item) {
    this.rmItem.emit(item);
  }
  cgTitle(nval) {
    this.newTitle.emit(nval);
  }
  ngOnInit(): void {}
}
