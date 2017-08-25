/*
https://www.cs.auckland.ac.nz/software/AlgAnim/n_ary_trees.html
n-ary trees (or n-way trees)
Trees in which each node may have up to n children.
https://www.npmjs.com/package/symbol-tree
https://en.wikipedia.org/wiki/K-ary_tree
IsParent=floor.((i-1)/k)
k-ary trees can also be stored in breadth-first order as an implicit data structure in arrays,
and if the tree is a complete k-ary tree, this method wastes no space. In this compact arrangement,
if a node has an index i, its c-th child in range [1..k] is found at index {\displaystyle k\cdot i+c}
{\displaystyle k\cdot i+c}, while its parent (if any) is found at index
{\displaystyle \left\lfloor {\frac {i-1}{k}}\right\rfloor } \left\lfloor
{\frac  {i-1}{k}}\right\rfloor  (assuming the root has index zero, meaning a 0-based array).
This method benefits from more compact storage and better locality of reference, particularly during a preorder traversal.
*/

import SymbolTree from 'symbol-tree';
import assert from 'assert';
import MyLinkList from './MyLinkList';
import waterfall from 'async/waterfall';
import async from 'async';
import each from 'async/each';
// import forEach from 'async-foreach'.forEach
const forEach = require('async-foreach').forEach;

// const tree = new SymbolTree();
export default class MultiNodeTree {
  constructor() {
    this.tree = new SymbolTree();
    this.parent = {
      key: 'prependChild',
    };
    this.myMap = new Map();
    this.indexMap = new Map();
    this.TreeArray = this.tree.treeToArray(this.root);
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
    const root = {
      key,
    };
    this.root = root;
    // console.log('root %j',root);
    this.myMap.set(root.key, 0);
    // console.log('setRoot '+util.inspect(root, false, null));
    this.tree.prependChild(this.parent, root);
    // console.log('setRoot ok'+util.inspect(root, false, null));

    // console.log('setRoot ok'+util.inspect(this.arr[{key:key}], false, null));
  }
  async getRoot() {
    return this.tree.firstChild(this.parent);
  }
  async addChild(parent, child) {
    // console.log(typeof parent);
    // console.log(typeof child);
    if (typeof parent !== 'string') {
      console.log('typeof parent != string');
      console.log(typeof parent);
      return;
    }
    if (typeof child !== 'string') {
      console.log('typeof child != string');
      console.log(typeof child);
      return;
    }
    const pKey = {
      key: parent,
    };
    const cKey = {
      key: child,
    };
    // console.log(parent);
    // console.log(child);
    const nodeParent = await this.getNodeByKey(parent);
    if (nodeParent == null) {
      console.log('nodeParent==null');
      return;
    }
    const nodeOldParent = await this.getParentByKey(child);
    // console.log(nodeParent);
    // console.log(nodeOldParent);
    if (nodeOldParent != null && nodeParent != null) {
      const nodeParentDepth = await this.getDepthByKey(nodeParent.key);
      const nodeOldParentDepth = await this.getDepthByKey(nodeOldParent.key);
      if (nodeOldParentDepth >= nodeParentDepth) {
        console.log('nodeOldParentDepth>=nodeParentDepth %d %d', nodeOldParentDepth, nodeParentDepth);
        return;
      }
      await this.removeNodeByKey(child);
    }
    //        this.arr[cKey] = cKey;
    // var dep=this.myMap.get(pKey.key)+1;
    const dep = await this.getDepthByKey(pKey.key) + 1;
    this.myMap.set(cKey.key, dep);
    //      this.arrDepth[cKey] = this.arrDepth[pKey] + 1;
    this.tree.appendChild(nodeParent, cKey);
    const parent1 = this.tree.parent(cKey);
  }

  async removeNodeByKey(key) {
    const node = await this.getNodeByKey(key);
    if (node != null) {
      this.tree.remove(node);
    }
  }
  async getNodeByKey(key) {
    if (typeof key !== 'string') {
      console.log('getNodeByKey typeof key != string');
      console.log(key);
      console.log(typeof key);
      assert.deepEqual(typeof key === 'string');
      return null;
    }

    this.TreeArray = this.tree.treeToArray(this.root);
    // console.log('this.TreeArray.length %d' ,this.TreeArray.length);
    for (let i = 0; i < this.TreeArray.length; i++) {
      // console.log('this.TreeArray[i].key %s' ,this.TreeArray[i].key);
      // console.log('key %s' ,key);
      if (this.TreeArray[i].key == key) {
        // console.log('getNodeByKey arr[i] %j , key %s' ,this.TreeArray[i],key);
        const ppp = this.tree.parent(this.TreeArray[i]);
        // console.log('getNodeByKey ppp %j' ,ppp);
        return this.TreeArray[i];
      }
    }
    return null;
  }
  async getDepthByKey(key) {
    const node = await this.getNodeByKey(key);
    if (node == null) return -1;
    return this.myMap.get(node.key);
  }
  async setDepthByKey(key, d) {
    // var node = await this.getNodeByKey(key);
    // if(node==null) return -1;
    return this.myMap.set(key, d);
  }
  async getIndexByKey(key) {
    const node = await this.getNodeByKey(key);
    if (node == null) return -1;
    return this.indexMap.get(node.key);
  }
  async getParentIndexByKey(key) {
    const node = await this.getParentByKey(key);
    if (node == null) return -1;
    return this.indexMap.get(node.key);
  }
  async setIndexByKey(key, d) {
    // var node = await this.getNodeByKey(key);
    // if(node==null) return -1;
    return this.indexMap.set(key, d);
  }
  async getMaxChildNumber() {
    this.TreeArray = this.tree.treeToArray(this.root);
    let childMax = 0;
    for (let i = 0; i < this.TreeArray.length; i++) {
      const childNum = this.tree.childrenCount(this.TreeArray[i]);
      if (childNum > childMax) childMax = childNum;
    }
    return childMax;
  }
  async caculateIndex() {
    const childMax = await this.getMaxChildNumber();
    this.TreeArray = this.tree.treeToArray(this.root);

    const rootNode = this.TreeArray[0];
    await this.setIndexByKey(rootNode.key, 0);
    for (const j of this.tree.treeIterator(rootNode)) {
      if (await this.getIndexByKey(j.key) === 0) {
        continue;
      }
      const previousSibling = this.tree.previousSibling(j);
      if (previousSibling) {
        const psIndex = await this.getIndexByKey(previousSibling.key);
        await this.setIndexByKey(j.key, psIndex + 1);
        continue;
      }
      let order = 0;

      const parentIndex = await this.getParentIndexByKey(j.key);
      const myIndex = parentIndex * childMax + 1 + order;
      order += 1;
      await this.setIndexByKey(j.key, myIndex);
    }
  }

  async getParentByKey(key) {
    const node = await this.getNodeByKey(key);
    if (node == null) return null;
    return this.tree.parent(node);
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
  async printArr(arr) {
    forEach(arr, (i, index1, arr1) => {
      console.log('each', i, index1, arr1);
      const key = i.key;
      // const node = await this.getNodeByKey(key);
      const index = this.getIndexByKey(key);
      // console.log('node %j',node);
      const parent = this.getParentByKey(key);
      let pkey = '0';
      if (parent) pkey = parent.key;
      // console.log('parent %j',parent);
      console.log({
        parent: pkey,
        key,
        depth: this.myMap.get(key),
        index,
      });
    });
  }


  async getTreeArr() {
    const stack = [];
    const openFiles = this.tree.treeToArray(this.root);

    const object = this;
    async.each(openFiles, (file, callback3) => {
      // Perform operation on file here.
      // console.log(`Processing file ${file}`);
      async.waterfall([
        (callback) => {
          console.log('step1');
          return callback(null, 'one', 'two', file.key);
        },
        async function (arg1, arg2, key, callback) {
          // arg1 now equals 'one' and arg2 now equals 'two'

          const node = object.getNodeByKey(key);
          const index = await object.getIndexByKey(key);
          // console.log('node %j',node);
          const parent = object.getParentByKey(key);
          console.log('step2', key, node, index, parent);
          callback(null, 'three', key, node, index, parent);
        },
        function (arg1, node, key, index, parent, callback) {
          // arg1 now equals 'three'
          // console.log(arg1, file);
          console.log('step3');
          return callback(null, key, node, index, parent);
        },
      ], (err, key, node, index, parent) => {
        // console.log(err, result);
        // result now equals 'done'
        let pkey = '0';
        if (parent) pkey = parent.key;
        // console.log('parent %j',parent);
        stack.push({
          parent: pkey,
          key,
          depth: object.myMap.get(key),
          index,
        });
        console.log(`step 4 ${stack.length}`);
        callback3(err, stack);
      });
    }, (err, stack3) => {
      // console.log(`step 5 ${stack2.length}`);
      // if any of the file processing produced an error, err would equal that error
      if (err) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A file failed to process');
        return stack3;
      }

      console.log('All files have been processed successfully %j', stack3);
      return stack3;
    });

    return stack;
  }


  async getTreeArr4() {
    const stack = [];
    const openFiles = this.tree.treeToArray(this.root);

    const object = this;
    async.each(openFiles, (file, callback3) => {
      // Perform operation on file here.
      // console.log(`Processing file ${file}`);
      async.waterfall([
        (callback) => {
          console.log('step1');
          return callback(null, 'one', 'two', file.key);
        },
        function (arg1, arg2, key, callback) {
          // arg1 now equals 'one' and arg2 now equals 'two'

          let node = null;
          let index = null;
          let parent = null;
          object.getNodeByKey(key).then((n) => {
            node = n;
            return object.getIndexByKey(key);
          }).then((i) => {
            index = i;
            return object.getParentByKey(key);
          }).then((p) => {
            parent = p;
            // return callback(null, key, node, index, parent);
            console.log('step2');
            console.log(arg1, arg2, key, index, parent.key);
            // callback(null, 'three', key, node, index, parent);
          });
          callback(null, 'three', key, node, index, parent);
        },
        function (arg1, node, key, index, parent, callback) {
          // arg1 now equals 'three'
          // console.log(arg1, file);
          console.log('step3');
          return callback(null, key, node, index, parent);
        },
      ], (err, key, node, index, parent) => {
        // console.log(err, result);
        // result now equals 'done'
        let pkey = '0';
        if (parent) pkey = parent.key;
        // console.log('parent %j',parent);
        stack.push({
          parent: pkey,
          key,
          depth: object.myMap.get(key),
          index,
        });
        console.log(`step 4 ${stack.length}`);
        return callback3(err, stack);
      });
    }, (err) => {
      // console.log(`step 5 ${stack2.length}`);
      // if any of the file processing produced an error, err would equal that error
      if (err) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A file failed to process');
      } else {
        console.log('All files have been processed successfully %j', stack);
        return stack;
      }
      return stack;
    });

    return stack;
  }

  async getTreeArr1() {
    const arr2 = [];
    const arr = this.tree.treeToArray(this.root);
    async.each(arr, (item, callback2) => {
      async.waterfall([
        function (callback) {
          const key = item.key;
          callback(null, key);
        },
        (key, callback) => {
          // arg1 now equals 'one' and arg2 now equals 'two'
          let node = null;
          let index = null;
          let parent = null;

          this.getNodeByKey(key).then((n) => {
            node = n;
            return this.getNodeByKey(key);
          }).then((i) => {
            index = i;
            return this.getParentByKey(key);
          }).then((p) => {
            parent = p;
            return callback(null, key, node, index, parent);
          });
        },
        (key, node, index, parent, callback) => {
          // console.log('!!!!!!!!!!!!!!', key, index, parent);
          // arg1 now equals 'three'
          let pkey = '0';
          if (parent) pkey = parent.key;
          // console.log('parent %j',parent);
          arr2.push({
            parent: pkey,
            key,
            depth: this.myMap.get(key),
            index,
          });
          // console.log('123121312', arr2);
          return callback(null, arr2, callback);
        },
      ], (arr3, callback) => {
        console.log('arr3', arr3);
        callback(arr3, callback);
      });
      callback2(null, arr2);
    }, (err, arr3) => {
      console.log(err);
      console.log(`arr3${arr3}`);
      return arr3;
    });
  }

  async getTreeArr2() {
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

}

async function testMain() {
  const myTree = new MultiNodeTree();
  const root = 'root';
  const child1 = 'child1';
  const child2 = 'child2';
  const grandChild11 = 'grandChild11';
  const grandChild12 = 'grandChild12';
  const grandChild21 = 'grandChild21';
  const grandChild22 = 'grandChild22';
  await myTree.setRoot(root);
  assert.deepEqual(await myTree.getSize(), 1);
  await myTree.addChild(root, child1);
  assert.deepEqual(await myTree.getSize(), 2);
  await myTree.addChild(root, child2);
  assert.deepEqual(await myTree.getSize(), 3);

  console.log('step1');
  await myTree.addChild(child1, grandChild11);
  await myTree.addChild(child1, grandChild12);
  const ParentOfgrandChild11 = await myTree.getParentByKey(grandChild11);
  const ParentOfgrandChild12 = await myTree.getParentByKey(grandChild12);
  assert.deepEqual(ParentOfgrandChild11.key, child1);
  assert.deepEqual(ParentOfgrandChild12.key, child1);
  assert.deepEqual(await myTree.getDepthByKey(root), 0);
  assert.deepEqual(await myTree.getDepthByKey(child1), 1);
  assert.deepEqual(await myTree.getDepthByKey(child2), 1);
  assert.deepEqual(await myTree.getSize(), 5);
  console.log('step2');
  await myTree.addChild(child2, grandChild21);
  await myTree.addChild(child2, grandChild22);
  const ParentOfgrandChild21 = await myTree.getParentByKey(grandChild21);
  const ParentOfgrandChild22 = await myTree.getParentByKey(grandChild22);
  assert.deepEqual(ParentOfgrandChild21.key, child2);
  assert.deepEqual(await myTree.getDepthByKey(ParentOfgrandChild21.key), 1);
  assert.deepEqual(await myTree.getDepthByKey(grandChild21), 2);
  assert.deepEqual(ParentOfgrandChild22.key, child2);
  assert.deepEqual(await myTree.getDepthByKey(ParentOfgrandChild22.key), 1);
  assert.deepEqual(await myTree.getDepthByKey(grandChild22), 2);
  assert.deepEqual(await myTree.getSize(), 7);
  console.log('step3');

  assert.deepEqual(await myTree.getDepthByKey('undefind'), -1);
  // await myTree.printTree()

  console.log('test remove');
  await myTree.removeNodeByKey(grandChild22);
  assert.deepEqual(await myTree.getSize(), 6);
  // await myTree.printTree()

  await myTree.removeNodeByKey(child1);
  assert.deepEqual(await myTree.getSize(), 3);
  // await myTree.printTree()

  console.log('test add child failed due to parent not found');
  await myTree.addChild(child1, grandChild11);
  assert.deepEqual(await myTree.getSize(), 3);

  console.log('test add child failed due to depth');

  await myTree.addChild(root, grandChild22);
  assert.deepEqual(await myTree.getSize(), 4);
  await myTree.addChild(root, grandChild21);
  // await myTree.printTree()
  assert.deepEqual(await myTree.getSize(), 4);

  console.log('test add child depth deeper');
  const oldDepth = await myTree.getDepthByKey(child2);
  assert.deepEqual(oldDepth, 1);
  await myTree.addChild(grandChild22, child2);
  const newDepth = await myTree.getDepthByKey(child2);
  assert.deepEqual(newDepth, 2);

  console.log('test getMaxChildNumber');

  assert.deepEqual(await myTree.getMaxChildNumber(), 1);
  await myTree.addChild(grandChild22, child1);
  assert.deepEqual(await myTree.getMaxChildNumber(), 2);

  console.log('test caculateIndex');
  await myTree.caculateIndex();
  await myTree.printTree();
}

// testMain();

// testCase array
const arr = [{
  id: 'BkWxPhMHF_b',
  sub: 'HyelwhMBY_-',
},
{
  id: 'BkWxPhMHF_b',
  sub: 'ryyev3fSt_-',
},
{
  id: 'Byow3GBFdb',
  sub: 'BJcDhzrt_-',
},
{
  id: 'HyCwnMSYdb',
  sub: 'B16w3GSF_Z',
},
{
  id: 'HyelwhMBY_-',
  sub: 'ryyev3fSt_-',
},
{
  id: 'HyxD3frFd-',
  sub: 'SyD2zHYdW',
},
{
  id: 'r1zD3GSFOb',
  sub: 'SJ-w3GSY_Z',
},
{
  id: 'rJdP3zHt_b',
  sub: 'SJPw3zBYuW',
},
{
  id: 'rkhDhMHYdZ',
  sub: 'BJcDhzrt_-',
},
{
  id: 'rkhDhMHYdZ',
  sub: 'Byow3GBFdb',
},
{
  id: 'ry8wnMBFu-',
  sub: 'ByEPnMBtu-',
},
{
  id: 'ry8wnMBFu-',
  sub: 'SJHPhzHYd-',
},
{
  id: 'SJHPhzHYd-',
  sub: 'ByEPnMBtu-',
},
{
  id: 'SytD2MBKuZ',
  sub: 'rJdP3zHt_b',
},
{
  id: 'SytD2MBKuZ',
  sub: 'SJPw3zBYuW',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'B16w3GSF_Z',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'BJcDhzrt_-',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'BkmD3MHKuZ',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'BkWxPhMHF_b',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'ByEPnMBtu-',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'Byow3GBFdb',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'HyCwnMSYdb',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'HyelwhMBY_-',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'HyxD3frFd-',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'r1zD3GSFOb',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'rJdP3zHt_b',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'rkhDhMHYdZ',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'ry8wnMBFu-',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'ryyev3fSt_-',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'SJ-w3GSY_Z',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'SJHPhzHYd-',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'SJPw3zBYuW',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'SyD2zHYdW',
},
{
  id: 'SyzeD3MHK_Z',
  sub: 'SytD2MBKuZ',
},
];

const openFiles = [1, 2, 3];
// assuming openFiles is an array of file names
const stack = [];

async.each(openFiles, (file, callback2) => {
  // Perform operation on file here.
  console.log(`Processing file ${file}`);
  async.waterfall([
    function (callback) {
      callback(null, 'one', 'two', file + 1);
    },
    function (arg1, arg2, file, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      console.log(arg1, arg2, file);
      callback(null, 'three', file + 1);
    },
    function (arg1, file, callback) {
      // arg1 now equals 'three'
      console.log(arg1, file);
      callback(null, `done${file}${1}`);
    },
  ], (err, result) => {
    console.log(err, result);
    // result now equals 'done'
    stack.push(result);
    callback2(err, result);
  });
}, (err, result) => {
  // if any of the file processing produced an error, err would equal that error
  if (err) {
    // One of the iterations produced an error.
    // All processing will now stop.
    console.log('A file failed to process');
  } else {
    console.log(`All files have been processed successfully ${stack}`);
  }
});
