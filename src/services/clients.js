const MongoLib = require('../lib/mongo');

class ClientsService {
  constructor() {
    this.collection = 'clients';
    this.mongoDB = new MongoLib();
  }

  async getClients() {
    // const query = tags && { tags: { $in: tags } };
    const query = {};
    const clients = await this.mongoDB.getAll(this.collection, query);
    return clients || [];
  }

  async getClient({ clientUid }) {
    const client = await this.mongoDB.get(this.collection, clientUid);
    return client || {};
  }

  async createClient({ client }) {
    const createClientId = await this.mongoDB.create(this.collection, client);
    return createClientId;
  }

  async updateClient({ clientUid, client } = {}) {
    const updatedClientUid = await this.mongoDB.update(
      this.collection,
      clientUid,
      client,
    );
    return updatedClientUid;
  }

  async deleteClient({ clientUid }) {
    const deletedClientUid = await this.mongoDB.delete(this.collection, clientUid);
    return deletedClientUid;
  }
}

module.exports = ClientsService;
