#! /usr/bin/env node
let process = require('child_process');
let fs = require('fs');
let http = require('http');

fs.readFileSync('versions.json', 'utf8');

http.get('http://element.eleme.io/versions.json', (res) => {
  const { statusCode } = res;
  let error;
  if (statusCode !== 200) {
    error = new Error(`Request failure, status code: ${statusCode}`);
  }
  if (error) {
    console.log(error.message);
    res.resume();
    return;
  }
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`error: ${e.message}`);
})

process.exec('npm version patch && npm publish', (code, stderr, stdout) => {
  if (code) {
    console.log(stderr);
    return;
  }
});

function isSame(local, online) {
  for (let key in online) {
    if (!local[key]) {
      return false;
    }
  }
  return true;
}