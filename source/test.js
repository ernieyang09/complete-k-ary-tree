import MultiNodeTree from './index';
import assert from 'assert';

async function testMain() {
  console.log('step 0');
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

async function testMain2() {

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

  
  var temp = await MultiNodeTree.buildTree(arr);

  console.log(temp)
  await MultiNodeTree.printTest();


}

testMain();
testMain2();
