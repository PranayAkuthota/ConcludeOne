class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  async invoke(prompt, schema = null) {
    throw new Error("Method invoke() must be implemented");
  }
}

module.exports = { BaseProvider };
