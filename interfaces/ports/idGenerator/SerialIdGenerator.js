module.exports = class SerialIdGenerator {
  async generateId(scope) {
    return `${scope}-${nextId++}`;
  }
};

let nextId = 0;
