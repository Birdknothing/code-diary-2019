import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  datas = [{ name: 'eat' }, { name: 'drink' }];
  addItem(item = '') {
    this.datas.push({ name: item });
  }
  rmItem(item) {
    this.datas.splice(this.datas.indexOf(item), 1);
  }
  constructor() {}
}
