"use strict";

const api = require('../../config/services');

class GithubUtil {
  async findByProject(owner, repo) {
    const { data } = await api.github.get(`${owner}/${repo}`);
    return data;
  }

  async findIssuesByProject(owner, repo, state, perPage, page) {
    const { data } = await api.github.get(`${owner}/${repo}/issues?state=${state}&per_page=${perPage}&page=${page}`);
    return data;
  }

  async findContributorsByProject(owner, repo) {
    const { data } = await api.github.get(`${owner}/${repo}/contributors`);
    return data;
  }

  async findIssuesSinceByProject(owner, repo, since) {
    const { data } = await api.github.get(`${owner}/${repo}/issues?state=all&since=${since}`);
    return data;
  }
}

module.exports = GithubUtil;
