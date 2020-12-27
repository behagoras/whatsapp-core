const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;
console.log('MONGO_URI: ', MONGO_URI);

// const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }
          console.log('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then((db) => db
      .collection(collection)
      .find(query)
      .toArray());
  }

  get(collection, id) {
    return this.connect().then((db) => db.collection(collection).findOne({ _id: ObjectId(id) }));
  }

  getFrom(collection, query) {
    return this.connect().then((db) => db.collection(collection)
      .findOne(query));
  }

  create(collection, data) {
    return this.connect()
      .then((db) => db.collection(collection).insertOne(data))
      .then((result) => result.insertedId);
  }

  update(collection, id, data, push) {
    return this.connect()
      .then((db) => db
        .collection(collection)
        .updateOne(
          { _id: ObjectId(id) },
          {
            ...data && { $push: data },
            ...push && { $push: push },
          },
          { upsert: false },
        ))
      .then((result) => result.upsertedId || id);
  }

  updateFromPhone(collection, phone, set, unset) {
    const updateQuery = [];
    if (set) updateQuery.push({ $set: set });
    if (unset) updateQuery.push({ $unset: unset });
    return this.connect()
      .then((db) => db
        .collection(collection)
        .updateMany(
          { phone },
          updateQuery,
          {
            upsert: false,
          },
        ))
      .then((result) => result.upsertedId || phone)
      .catch((error) => console.log(error));
  }

  delete(collection, id) {
    return this.connect()
      .then((db) => db.collection(collection).deleteOne({ _id: ObjectId(id) }))
      .then(() => id);
  }
}

module.exports = MongoLib;
