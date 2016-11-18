import { getJSON } from './fetch';

export default class Store {
  constructor() {
    this._cache = {};
  }
  async users() {
    return await this.fetch('api/users');
  }
  async currentUser() {
    return await this.fetch('api/users/me');
  }
  async findUser(id) {
    var users = await this.users();
    return users.find(user => user.id === id);
  }
  async fetch(url) {
    return this.cache(url,
      async () => await getJSON(url)
    );
  }
  async cache(attr, factory) {
    var cached = this._cache[attr];
    if (!cached) {
      cached = await factory();
      this._cache[attr] = cached;
    }
    return cached;
  }
}
