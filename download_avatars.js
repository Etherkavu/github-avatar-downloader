var request = require('request');
var fs = require('fs');
var counter = 1;
var autho = require('./secret.js');
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
  url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : autho.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    var exit = '';
    data.forEach(function(urls){
      exit += urls.avatar_url + '\n';
    });
    cb(err, exit);
    console.log("Done pulling avatars");
  });
}

function downloadImageByURL(url, filePath) {

  request.get(url)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .on('response', function (response) {                           // Note
       })
       .pipe(fs.createWriteStream(filePath+counter+'.jpg'));
       counter++;

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  var tokens = result.split('\n');
  tokens.pop();
  tokens.forEach(function(entry) {
    var path = './avatar';
    downloadImageByURL(entry, path);
  });
});