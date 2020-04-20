import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { ListService } from './list.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private list:ListService) {}
  title = "demo";
  getList() {
    return this.list.list;
  }
  cgTitle(nval) {
    this.title = nval;
  }
  addItem(name) {
    this.list.addItem(name);
  }
  rmItem(item) {
    this.list.rmItem(item);
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
