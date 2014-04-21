var co = require('co');
var fs = require('fs');
var thunkify = require('thunkify');

var fstat = thunkify(fs.stat);

function size(file) {
  return function(fn){
    fs.stat(file, function(err, stat){
      if (err) return fn(err);
      fn(null, stat.size);
    });
  }
}

function *foo(){
  var a = yield size('examples/fich1.txt');
  var b = yield size('examples/fich2.txt');
  var c = yield size('examples/fich3.txt');
  return [a, b, c];
}

function *bar(){
  var a = yield size('examples/nested/arch1.txt');
  var b = yield size('examples/nested/arch2.txt');
  var c = yield size('examples/nested/arch3.txt');
  return [a, b, c];
}

function *jose(){
  var a = yield fstat('examples/fich1.txt');
  var b = yield fstat('examples/fich2.txt');
  var c = yield fstat('examples/fich3.txt');
  return [a.size, b.size, c.size];
}


fstat('examples/fich1.txt')(function(err,result){
  console.log(result.size);
});


co(function *(){
  var a = yield foo();
  var b = yield bar();
  var c = yield jose();
  console.log(a);
  console.log(b);
  console.log(c);
})()
