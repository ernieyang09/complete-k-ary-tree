import  util from 'util';
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
    this.TreeArray = this.tree.treeToArray(this.root);
  }
  static async printTest(){
    console.log('MultiNodeTree printTest');
  }

  static async buildTree(arr) {
    const myList = new MyLinkList();

    arr.forEach((i) => {
      myList.insert(i.id);
    });
    arr.forEach((i) => {
      myList.removeNode(i.sub);
    });


    const {
      data,
    } = await myList.getHeadNode();
    // console.log(data);
    // console.log(await myList.getSize());
    // data = await myList.getlist();

    console.log('myTree----------------');
    const myTree = new MultiNodeTree();
    await myTree.setRoot(data);
    const root = await myTree.getRoot();
    // console.log(root);

    const stack = [];
    stack.push(root);
    // console.log('root %j' ,root);

    for (var i = 0; i < arr.length; i++) {
      var {
        id,
        sub,
      } = arr[i];

      if (id === root.key) {
        /*
          console.log('root %j', root);
          console.log('id %j', id);
          console.log('sub %j', sub);
  */
        stack.push(sub);
        await myTree.addChild(id, sub);
      }
    }

    // await myTree.printTree();
    while (stack.length > 0) {
      // console.log('stack.length '+stack.length);
      const node = stack.pop();
      for (var i = 0; i < arr.length; i++) {
        var {
          id,
          sub,
        } = arr[i];
        // console.log('1 node '+util.inspect(node, false, null));
        // console.log(node);
        // console.log('3 id %s node %j',id,node);

        if (id == node) {
          stack.push(sub);
          // console.log('node %j',node);
          // console.log('sub %j',sub);
          await myTree.addChild(node, sub);
        }
      }
    }

    await myTree.caculateIndex();
    // await myTree.printTree();
    return await myTree.getTreeArr();
  }

  async setRoot(key) {
    var root = {
      key: key
    }
    this.root = root;
    //console.log('root %j',root);
    this.myMap.set(root.key, 0);
    //console.log('setRoot '+util.inspect(root, false, null));
    this.tree.prependChild(this.parent, root);
    //console.log('setRoot ok'+util.inspect(root, false, null));       

    //console.log('setRoot ok'+util.inspect(this.arr[{key:key}], false, null));
  }

  async getRoot() {
    return this.tree.firstChild(this.parent);
  }

  async addChild(parent, child) {
    //console.log(typeof parent);
    //console.log(typeof child);
    if (typeof parent != "string") {
      console.log("typeof parent != string");
      console.log(typeof parent);
      return;
    }
    if (typeof child != "string") {
      console.log("typeof child != string");
      console.log(typeof child);
      return;
    }
    var pKey = {
      key: parent
    };
    var cKey = {
      key: child
    };
    //console.log(parent);
    //console.log(child);
    var nodeParent = await this.getNodeByKey(parent);
    if (nodeParent == null) {
      console.log('nodeParent==null');
      return;
    }
    var nodeOldParent = await this.getParentByKey(child);
    //console.log(nodeParent);
    //console.log(nodeOldParent);
    if (nodeOldParent != null && nodeParent != null) {

      var nodeParentDepth = await this.getDepthByKey(nodeParent.key);
      var nodeOldParentDepth = await this.getDepthByKey(nodeOldParent.key);
      if (nodeOldParentDepth >= nodeParentDepth) {
        console.log("nodeOldParentDepth>=nodeParentDepth %d %d", nodeOldParentDepth, nodeParentDepth);
        return;
      } else {
        await this.removeNodeByKey(child);
      }
    }
    //        this.arr[cKey] = cKey;
    //var dep=this.myMap.get(pKey.key)+1;
    var dep = await this.getDepthByKey(pKey.key) + 1;
    this.myMap.set(cKey.key, dep)
    //      this.arrDepth[cKey] = this.arrDepth[pKey] + 1;
    this.tree.appendChild(nodeParent, cKey);
    var parent1 = this.tree.parent(cKey);
  }

  async removeNodeByKey(key) {
    var node = await this.getNodeByKey(key);
    if (node != null) {
      this.tree.remove(node);
    }
  }
  async getNodeByKey(key) {

    if (typeof key != "string") {
      console.log("getNodeByKey typeof key != string");
      console.log(key);
      console.log(typeof key);
      assert.deepEqual(typeof key == "string");
      return null;
    }

    this.TreeArray = this.tree.treeToArray(this.root);
    //console.log('this.TreeArray.length %d' ,this.TreeArray.length); 
    for (var i = 0; i < this.TreeArray.length; i++) {
      //console.log('this.TreeArray[i].key %s' ,this.TreeArray[i].key); 
      //console.log('key %s' ,key); 
      if (this.TreeArray[i].key == key) {
        //console.log('getNodeByKey arr[i] %j , key %s' ,this.TreeArray[i],key); 
        var ppp = this.tree.parent(this.TreeArray[i])
        //console.log('getNodeByKey ppp %j' ,ppp); 
        return this.TreeArray[i];
      }
    }
    return null;
  }
  async getDepthByKey(key) {
    var node = await this.getNodeByKey(key);
    if (node == null) return -1;
    return this.myMap.get(node.key);
  }
  async setDepthByKey(key, d) {
    //var node = await this.getNodeByKey(key);
    //if(node==null) return -1;
    return this.myMap.set(key, d);
  }
  async getIndexByKey(key) {
    var node = await this.getNodeByKey(key);
    if (node == null) return -1;
    return this.indexMap.get(node.key);
  }
  async getParentIndexByKey(key) {
    var node = await this.getParentByKey(key);
    if (node == null) return -1;
    return this.indexMap.get(node.key);
  }
  async setIndexByKey(key, d) {
    //var node = await this.getNodeByKey(key);
    //if(node==null) return -1;
    return this.indexMap.set(key, d);
  }
  async getMaxChildNumber() {
    this.TreeArray = this.tree.treeToArray(this.root);
    var childMax = 0;
    for (var i = 0; i < this.TreeArray.length; i++) {
      var childNum = this.tree.childrenCount(this.TreeArray[i]);
      if (childNum > childMax) childMax = childNum;
    }
    return childMax;
  }
  async caculateIndex() {
    var childMax = await this.getMaxChildNumber();
    this.TreeArray = this.tree.treeToArray(this.root);

    var rootNode = this.TreeArray[0];
    await this.setIndexByKey(rootNode.key, 0);
    for (var j of this.tree.treeIterator(rootNode)) {
      if (await this.getIndexByKey(j.key) == 0) {
        continue;
      }
      var previousSibling = this.tree.previousSibling(j);
      if (previousSibling) {
        var psIndex = await this.getIndexByKey(previousSibling.key)
        await this.setIndexByKey(j.key, psIndex + 1);
        continue;
      }
      var order = 0;

      var parentIndex = await this.getParentIndexByKey(j.key);
      var myIndex = parentIndex * childMax + 1 + order;
      order = order + 1;
      await this.setIndexByKey(j.key, myIndex);
    }
  }

  async getParentByKey(key) {
    var node = await this.getNodeByKey(key);
    if (node == null) return null;
    return this.tree.parent(node)
  }
  async printTree() {
    console.log('printTree');
    this.TreeArray = this.tree.treeToArray(this.root);
    await this.printArr(this.TreeArray);
  }
  async getSize() {
    this.TreeArray = this.tree.treeToArray(this.root);
    return this.TreeArray.length;
  }

  async getTreeArr() {
    const arr2 = [];
    const arr = this.tree.treeToArray(this.root);
    for (let i = 0; i < arr.length; i++) {
      const key = arr[i].key;
      const node = await this.getNodeByKey(key);
      const index = await this.getIndexByKey(key);
      // console.log('node %j',node);
      const parent = await this.getParentByKey(key);
      let pkey = '0';
      if (parent) pkey = parent.key;
      // console.log('parent %j',parent);
      arr2.push({
        parent: pkey,
        key,
        depth: this.myMap.get(key),
        index,
      });
    }
    return arr2;
  }


  async printArr(arr) {
    for (var i = 0; i < arr.length; i++) {
      var key = arr[i].key;
      var node = await this.getNodeByKey(key)
      var index = await this.getIndexByKey(key)
      //console.log('node %j',node);
      var parent = await this.getParentByKey(key);
      var pkey = '0';
      if (parent) pkey = parent.key;
      //console.log('parent %j',parent);
      console.log({
        parent: pkey,
        key: key,
        depth: this.myMap.get(key),
        index: index
      });
    }
  }
}