import LinkedList from 'singly-linked-list';

export default class MyLinkList {
  constructor() {
    this.list = new LinkedList();
  }

   insert(value) {
    if (this.list.find(value) == -1) {
      return this.list.insert(value);
    }
  }

   finish(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].use) {
        return false;
      }
    }
  }

   removeNode(value) {
    return this.list.removeNode(value);
  }

   getHeadNode() {
    return this.list.getHeadNode();
  }

   getSize() {
    return this.list.getSize();
  }

   getList() {
    return this.list;
  }
}