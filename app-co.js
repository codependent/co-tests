var co = require('co');
var thunkify = require('thunkify');
var request = require('request');
var get = thunkify(request.get);

console.log("weeeee");

co(function *(){
  var a = yield get('http://www.google.es');
  var b = yield get('http://www.mutua.es');
  var c = yield get('http://www.fundacionmutua.es');
  console.log(a);
  console.log(b.statusCode);
  console.log(c.status);
})()

co(function *(){
  var a = yield get('http://www.google.es');
  var b = yield get('http://www.mutua.es');
  var c = yield get('http://www.fundacionmutua.es');
  //var res = yield [a, b, c];
  //console.log(res);
})()