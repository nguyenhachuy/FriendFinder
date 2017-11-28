var data = require("../data/friends.js");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
// ===============================================================================
// ROUTING
// ===============================================================================
module.exports = function(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/api/friends", function(req, res) {
    res.json(data);
  });
  app.post("/api/friends", function(req, res) {
    var friend = req.body;
    friend.scores = friend['scores[]'];
    delete friend['scores[]'];
    friend.scores.forEach((element,index,array) => array[index] = parseInt(element));
    var scores = friend.scores;
    var findMatch = [];
    data.forEach((element,i,array) => {
      var e = element.scores;
      for(var index = 0; index < e.length; index++) {
        e[index] = Math.abs(scores[index] - e[index]);
      }
      var result = e.reduce((acc, cur) => acc + cur);
      findMatch.push({result:result, index:i});
      console.log('This is result: \t' + result);
    });
    //Now just find the smallest one
    findMatch.sort((a,b) => {
      return a.result - b.result;
    });

    //Now return the person with the smallest
    data.unshift(friend);
    console.log(data);
    res.send(data[findMatch[0].index]);

  });
}; 