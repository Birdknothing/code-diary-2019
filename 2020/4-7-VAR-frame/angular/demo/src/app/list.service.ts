import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  title = '';
  todo = '';
  list = [{ name: 'eat' }, { name: 'drink' }];
  cgTitle(nval) {
    this.title = nval;
  }
  addItem(name) {
    this.list.push({ name });
  }
  rmItem(item) {
    this.list.splice(this.list.indexOf(item), 1);
  }
}
