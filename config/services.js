"use strict";

const axios = require('axios')
const Env = use('Env')

module.exports = {
  github: axios.create({
    baseURL: "https://api.github.com/repos",
    headers: {'Authorization': `token ${Env.get('GITHUB_TOKEN')}`}
  })
}
