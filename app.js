import MultiNodeTree from './MultiNodeTree';
import serviceProvider from '../serviceProvider';


class LoadDB {
    // constructor({ models, scopeTreeService }) {
  constructor() {
    const container = serviceProvider();
    this.models = container.resolve('models');
        // this.scopeTreeService = scopeTreeService;
        // this.scopeTreeService = container.resolve("scopeTreeService");
    this.stack = [];
    console.log('loadDB loadDB111');
        // this.service=container.resolve("ScopeTreeService");
    console.log('loadDB111234');
        // this.service = new ScopeTreeService();
  }
  async getScopeSet() {
    try {
      await this.models.scopeSet.findAll({
        attributes: ['scopeId', 'subScopeId'],
      }).then((project) => {
        project.forEach((element) => {
          this.stack.push({
            id: element.dataValues.scopeId,
            sub: element.dataValues.subScopeId,
          });
        });
      });
      return this.stack;
    } catch (err) {
      throw err;
    }
  }

  async createScopeByArray(arr) {
        // var service = new ScopeTreeService();
    await this.models.scopeTree.truncate();
        // await ScopeTreeService.truncate();
    arr.forEach((i) => {
      this.createScopeService({
        scopeId: i.key,
        index: i.index,
      });
    });
  }
    // ///

  async createScopeTree({
        scopeId,
        index,
    }, transaction) {
    try {
      const newOrg = await this.models.scopeTree.create({
        scopeId,
        index,
      }, {
        transaction,
      });
      return newOrg;
    } catch (err) {
      throw err;
    }
  }

  async createScopeService({
        scopeId,
        index,
    }) {
    const transaction = await this.models.sequelize.transaction();
    try {
      const newOrg = await this.createScopeTree({
        scopeId,
        index,
      }, transaction);
      await transaction.commit();
      return newOrg;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

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
