//import util from 'util';
import SymbolTree from 'symbol-tree';
import assert from 'assert';
import MyLinkList from './MyLinkList';


export default class MultiNodeTree {
  constructor() {
    this.tree = new SymbolTree();
    this.parent = {
      key: 'prependChild'
    };
    this.myMap = new Map();
    this.indexMap = new Map();
    //this.TreeArray = this.tree.treeToArray(this.root);
  }
  static printTest() {
    console.log('MultiNodeTree printTest');
  }

  buildTree(arr) {
    const myList = new MyLinkList();

    Promise.all(arr.map((e) => {
      myList.insert(e.id);
    }));
    Promise.all(arr.map((e) => {
      myList.removeNode(e.sub);
    }));


    const {
      data,
    } = myList.getHeadNode();

    const myTree = new MultiNodeTree();
    this.setRoot(data);
    const root = this.getRoot();

    const stack = [];
    stack.push(root);

    Promise.all(arr.map((e) => {
      let {
        id,
        sub,
      } = e;
      if (id === root.key) {
        stack.push(sub);
        this.addChild(id, sub);
      }
    }));


    //  this.printTree();
    while (stack.length > 0) {
      // console.log('stack.length '+stack.length);
      const node = stack.pop();
      Promise.all(arr.map((e) => {
        let {
          id,
          sub,
        } = e;
        if (id === node) {
          stack.push(sub);
          this.addChild(node, sub);
        }
      }));

    }
    this.caculateIndex();
    //  this.printTree();
    return this.getTreeArr();
  }


  setRoot(key) {
    let root = {
      key: key
    }
    this.root = root;
    this.myMap.set(root.key, 0);
    this.tree.prependChild(this.parent, root);
  }

  getRoot() {
    return this.tree.firstChild(this.parent);
  }

  addChild(parent, child) {

    if (typeof parent != "string") {
      throw new TypeError('getNodeByKey typeof parent != string')
    }
    if (typeof child != "string") {
      throw new TypeError('getNodeByKey typeof child != string')
    }
    let pKey = {
      key: parent
    };
    let cKey = {
      key: child
    };
    let nodeParent = this.getNodeByKey(parent);
    if (nodeParent == null) {
      console.log('nodeParent==null');
      return;
    }

    let nodeOldParent = this.getParentByKey(child);
    if (nodeOldParent != null && nodeParent != null) {

      let nodeParentDepth = this.getDepthByKey(nodeParent.key);
      let nodeOldParentDepth = this.getDepthByKey(nodeOldParent.key);
      if (nodeOldParentDepth >= nodeParentDepth) {
        return;
      } else {
        this.removeNodeByKey(child);
      }
    }
    let dep = this.getDepthByKey(pKey.key) + 1;
    this.myMap.set(cKey.key, dep)
    this.tree.appendChild(nodeParent, cKey);
    let parent1 = this.tree.parent(cKey);
  }

  removeNodeByKey(key) {
    let node = this.getNodeByKey(key);
    if (node != null) {
      this.tree.remove(node);
    }
  }
  getNodeByKey(key) {
    let result = null;
    if (typeof key != "string") {
      throw new TypeError('getNodeByKey typeof key != string')
    }

    this.TreeArray = this.tree.treeToArray(this.root);
    for (let i = 0; i < this.TreeArray.length; i++) {
      if (this.TreeArray[i].key == key) {
        result = this.TreeArray[i];
        break;
      }
    }
    return result;
  }

  getDepthByKey(key) {
    let node = this.getNodeByKey(key);
    if (node == null) return -1;
    return this.myMap.get(node.key);
  }
  setDepthByKey(key, d) {
    //let node =  this.getNodeByKey(key);
    //if(node==null) return -1;
    return this.myMap.set(key, d);
  }

  getIndexByKey(key) {
    let node = this.getNodeByKey(key);
    if (node == null) return -1;
    return this.indexMap.get(node.key);
  }

  getParentIndexByKey(key) {
    let node = this.getParentByKey(key);
    if (node == null) {
      //runtime error
      return -1;
    }
    const indexOfParent = this.indexMap.get(node.key)
    return indexOfParent;
  }

  getMyOrderByKey(key) {
    let node = this.getParentByKey(key);

    if (node == null) {
      return -1;
    }
    const childrenArray = this.tree.childrenToArray(node);
    let myOrder = 0;
    let counter = 0;
    childrenArray.forEach(j => {

      if (j.key == key) {
        myOrder = counter;
      }
      counter++;
    })
    return myOrder;
  }

  setIndexByKey(key, d) {
    this.indexMap.set(key, d);
  }

  getMaxChildNumber() {
    this.TreeArray = this.tree.treeToArray(this.root);
    let childMax = 0;
    for (let i = 0; i < this.TreeArray.length; i++) {
      let childNum = this.tree.childrenCount(this.TreeArray[i]);
      if (childNum > childMax) childMax = childNum;
    }
    return childMax;
  }

  caculateIndex() {
    var childMax = this.getMaxChildNumber();
    this.TreeArray = this.tree.treeToArray(this.root);

    var rootNode = this.TreeArray[0];
    this.setIndexByKey(rootNode.key, 0);
    for (var j of this.tree.treeIterator(rootNode)) {
      if (this.getIndexByKey(j.key) == 0) {
        continue;
      }
      var previousSibling = this.tree.previousSibling(j);
      if (previousSibling) {
        var psIndex = this.getIndexByKey(previousSibling.key)
        this.setIndexByKey(j.key, psIndex + 1);
        continue;
      }
      var order = 0;

      var parentIndex = this.getParentIndexByKey(j.key);
      var myIndex = parentIndex * childMax + 1 + order;
      order = order + 1;
      this.setIndexByKey(j.key, myIndex);
    }
  }

  getParentByKey(key) {
    let node = this.getNodeByKey(key);


    if (node == null) return null;
    return this.tree.parent(node)
  }
  printTree() {
    console.log('printTree');
    this.TreeArray = this.tree.treeToArray(this.root);
    this.printArr(this.TreeArray);
  }
  getSize() {
    this.TreeArray = this.tree.treeToArray(this.root);
    return this.TreeArray.length;
  }

  getTreeArr() {
    const arr2 = [];
    const arr = this.tree.treeToArray(this.root);
    for (let i = 0; i < arr.length; i++) {
      const key = arr[i].key;
      const node = this.getNodeByKey(key);
      const index = this.getIndexByKey(key);
      const parent = this.getParentByKey(key);
      let pkey = '0';
      if (parent) pkey = parent.key;
      arr2.push({
        parent: pkey,
        key,
        depth: this.myMap.get(key),
        index,
      });
    }
    return arr2;
  }


  printArr(arr) {
    for (let i = 0; i < arr.length; i++) {
      let key = arr[i].key;
      let node = this.getNodeByKey(key)
      let index = this.getIndexByKey(key)
      let parent = this.getParentByKey(key);
      let pkey = '0';
      if (parent) pkey = parent.key;
      console.log({
        parent: pkey,
        key: key,
        depth: this.myMap.get(key),
        index: index
      });
    }
  }
}
