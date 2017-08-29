//import util from 'util';
import SymbolTree from 'symbol-tree';
import assert from 'assert';
import MyLinkList from './MyLinkList';


export default class MultiNodeTree {
  constructor(key) {
    this.tree = new SymbolTree();
    this.root = { key };
    this.depMap = new Map();
    this.depMap.set(key, 0);
    this.objMap = new Map();
    this.objMap.set(key, this.root);
  }
  static printTest() {
    console.log('MultiNodeTree printTest');
  }

  // buildTree(arr) {
  //   const myList = new MyLinkList();
  //
  //   Promise.all(arr.map((e) => {
  //     myList.insert(e.id);
  //   }));
  //   Promise.all(arr.map((e) => {
  //     myList.removeNode(e.sub);
  //   }));
  //
  //
  //   const {
  //     data,
  //   } = myList.getHeadNode();
  //
  //   const myTree = new MultiNodeTree();
  //   this.setRoot(data);
  //   const root = this.getRoot();
  //
  //   const stack = [];
  //   stack.push(root);
  //
  //   Promise.all(arr.map((e) => {
  //     let {
  //       id,
  //       sub,
  //     } = e;
  //     if (id === root.key) {
  //       stack.push(sub);
  //       this.addChild(id, sub);
  //     }
  //   }));
  //
  //
  //   //  this.printTree();
  //   while (stack.length > 0) {
  //     // console.log('stack.length '+stack.length);
  //     const node = stack.pop();
  //     Promise.all(arr.map((e) => {
  //       let {
  //         id,
  //         sub,
  //       } = e;
  //       if (id === node) {
  //         stack.push(sub);
  //         this.addChild(node, sub);
  //       }
  //     }));
  //
  //   }
  //   this.caculateIndex();
  //   //  this.printTree();
  //   return this.getTreeArr();
  // }
  //
  // getRoot() {
  //   return this.tree.firstChild(this.parent);
  // }

  addChild(parent, child) {

    const nodeParent = this.objMap.get(parent);
    let nodeChild = this.objMap.get(child);

    if (typeof parent != "string") {
      throw new TypeError('getNodeByKey typeof parent != string')
    } else if (!nodeParent) {
      throw new Error('no parent found!!');
    }
    if (typeof child != "string") {
      throw new TypeError('getNodeByKey typeof child != string')
    } else if (nodeChild) {
      throw new Error('duplicated child');
    }

    nodeChild = {
      key: child,
    };

    const dep = this.depMap.get(parent) + 1;
    this.depMap.set(child, dep);
    this.tree.appendChild(nodeParent, nodeChild);
    this.objMap.set(child, nodeChild);
  }

  // removeNodeByKey(key) {
  //   let node = this.getNodeByKey(key);
  //   if (node != null) {
  //     this.tree.remove(node);
  //   }
  // }
  // getNodeByKey(key) {
  //   let result = null;
  //   if (typeof key != "string") {
  //     throw new TypeError('getNodeByKey typeof key != string')
  //   }
  //
  //   this.TreeArray = this.tree.treeToArray(this.root);
  //   for (let i = 0; i < this.TreeArray.length; i++) {
  //     if (this.TreeArray[i].key == key) {
  //       result = this.TreeArray[i];
  //       break;
  //     }
  //   }
  //   return result;
  // }
  //
  // getIndexByKey(key) {
  //   let node = this.getNodeByKey(key);
  //   if (node == null) return -1;
  //   return this.indexMap.get(node.key);
  // }

  // getMyOrderByKey(key) {
  //   let node = this.getParentByKey(key);
  //
  //   if (node == null) {
  //     return -1;
  //   }
  //   const childrenArray = this.tree.childrenToArray(node);
  //   let myOrder = 0;
  //   let counter = 0;
  //   childrenArray.forEach(j => {
  //
  //     if (j.key == key) {
  //       myOrder = counter;
  //     }
  //     counter++;
  //   })
  //   return myOrder;
  // }

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
    const indexMap = new Map();

    const TreeArray = this.tree.treeToArray(this.root);

    const rootNode = this.TreeArray[0];
    indexMap.set(rootNode.key, 0);

    for (var j of this.tree.treeIterator(rootNode)) {
      if (indexMap.get(j.key) == 0) {
        continue;
      }
      var previousSibling = this.tree.previousSibling(j);
      if (previousSibling) {
        var psIndex = indexMap.get(previousSibling.key);
        indexMap.set(j.key, psIndex + 1);
        continue;
      }

      const parent = this.tree.parent(j);
      const parentIndex = indexMap.get(parent.key);
      const myIndex = parentIndex * childMax + 1;

      indexMap.set(j.key, myIndex);
    }
    console.log(indexMap)
  }

  getParentNode(key) {
    const {tree, objMap} = this;
    return tree.parent(objMap.get(key));
  }

  getSize() {
    return this.tree.treeToArray(this.root).length;
  }




  // getTreeArr() {
  //   const arr2 = [];
  //   const arr = this.tree.treeToArray(this.root);
  //   for (let i = 0; i < arr.length; i++) {
  //     const key = arr[i].key;
  //     const node = this.getNodeByKey(key);
  //     const index = this.getIndexByKey(key);
  //     const parent = this.getParentByKey(key);
  //     let pkey = '0';
  //     if (parent) pkey = parent.key;
  //     arr2.push({
  //       parent: pkey,
  //       key,
  //       depth: this.depMap.get(key),
  //       index,
  //     });
  //   }
  //   return arr2;
  // }

  printTree() {
    console.log('printTree');
    this.TreeArray = this.tree.treeToArray(this.root);
    this.printArr(this.TreeArray);
  }

  // printArr(arr) {
  //   for (let i = 0; i < arr.length; i++) {
  //     let key = arr[i].key;
  //     let node = this.getNodeByKey(key)
  //     let index = this.getIndexByKey(key)
  //     let parent = this.getParentByKey(key);
  //     let pkey = '0';
  //     if (parent) pkey = parent.key;
  //     console.log({
  //       parent: pkey,
  //       key: key,
  //       depth: this.depMap.get(key),
  //       index: index
  //     });
  //   }
  // }
}
