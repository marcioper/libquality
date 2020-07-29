"use strict";

const axios = require('axios')
const Env = use('Env')

axios.defaults.baseURL = "https://api.github.com/repos";
axios.defaults.headers = {'Authorization': `token ${Env.get('GITHUB_TOKEN')}`};

module.exports = {
  github: axios.create({
    baseURL: "https://api.github.com/repos",
    headers: {'Authorization': `token ${Env.get('GITHUB_TOKEN')}`}
  })
}
