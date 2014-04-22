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
  console.log("fstat result.size:"+result.size);
});


co(function *(){
  var a = yield foo();
  var b = yield bar();
  var c = yield jose();
  console.log("co0-a:"+a);
  console.log("co0-b:"+b);
  console.log("co0-c:"+c);
})()

// 3 concurrent stat()s at a time
co(function *(){
  console.log("***concurrent1***")
  var a = yield [size('examples/fich1.txt'), size('examples/fich2.txt'), size('examples/fich3.txt')];
  var b = yield [size('examples/fich1.txt'), size('examples/fich2.txt'), size('examples/fich3.txt')];
  var c = yield [size('examples/fich1.txt'), size('examples/fich2.txt'), size('examples/fich3.txt')];
  console.log("c1-a:"+a);
  console.log("c1-a:"+b);
  console.log("c1-a:"+c);
})()

// 9 concurrent stat()s
co(function *(){
  console.log("***concurrent2***")
  var a = [size('examples/fich1.txt'), size('examples/fich2.txt'), size('examples/fich3.txt')];
  var b = [size('examples/fich3.txt'), size('examples/fich2.txt'), size('examples/fich1.txt')];
  var c = [size('examples/fich1.txt'), size('examples/fich1.txt'), size('examples/fich1.txt')];
  var d = yield [a, b, c];
  console.log("c2:"+d);
})()

// 3
co(function *(){
  console.log("***concurrent3***")
  var a = size('examples/fich1.txt');
  var b = size('examples/fich2.txt');
  var c = size('examples/fich3.txt');
  var res = yield [a, b, c];
  console.log("c3:"+res);
})()
