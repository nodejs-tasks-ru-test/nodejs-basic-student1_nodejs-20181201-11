const request = require('request-promise').defaults({
  json: true
});
const run_tests = require('./run_tests');

const GITHUB_BASE = 'https://api.github.com';
const GITHUB_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'learn.javascript.ru taskbook app'
};

process.env.CI = 'true';
process.env.TRAVIS_EVENT_TYPE = 'pull_request';

// number of PR
process.env.TRAVIS_PULL_REQUEST = 3;
// repo url (owner/repo)
process.env.TRAVIS_REPO_SLUG = 'nodejs-tasks-ru-test/nodejs-basic-student1_nodejs-20181201-9';

if (!process.env.CI)
  throw new Error('run_tests_ci can be run only on CI');

if (process.env.TRAVIS_EVENT_TYPE !== 'pull_request') return;


async function retrievePRInfo() {
  const repo_slug = process.env.TRAVIS_REPO_SLUG;
  const number = process.env.TRAVIS_PULL_REQUEST;
  
  const pr = await request({
    uri: `${GITHUB_BASE}/repos/${repo_slug}/pulls/${number}`,
    headers: GITHUB_HEADERS,
    method: 'GET'
  });
  
  const moduleName = pr.title.match(/\d+-module/i) || [];
  const taskName = pr.title.match(/\d+-task/i) || [];
  
  return [moduleName[0], taskName[0]];
}

retrievePRInfo()
  .then(([moduleName, taskName]) => {
    run_tests(moduleName, taskName, { reporter: 'json', useColors: false, });
  });