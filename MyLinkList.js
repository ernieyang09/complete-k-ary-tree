

import LinkedList from 'singly-linked-list';

export default class MyLinkList {
  constructor() {
    this.list = new LinkedList();
  }

  async insert(value) {
        // console.log(list.find(value)==-1);
    if (this.list.find(value) === -1) {
      return this.list.insert(value);
    }
  }

  async finish(arr) {
    for (let i = 0; i < arr.length; i += 1) {
      if (!arr[i].use) { return false; }
    }
  }

  async removeNode(value) {
    return this.list.removeNode(value);
  }

  async getHeadNode() {
    return this.list.getHeadNode();
  }

  async getSize() {
    return this.list.getSize();
  }

  async getList() {
    return this.list;
  }
}
