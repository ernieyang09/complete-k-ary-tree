import MultiNodeTree from './MultiNodeTree';

export default async function () {
  console.log('scopeTreeManager loadDB');
  const lldb = new LoadDB();
  console.log('LoadDB');
  const arr = await lldb.getScopeSet();
  console.log('getScopeSet');
  const arr2 = await MultiNodeTree.buildTree(arr);
  // const arr2 = [];
  console.log('MultiNodeTree.buildTree arr2');
  console.log(arr2);
  // await lldb.createScopeByArray(arr2);
};
