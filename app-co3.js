var fs = require('fs');
var co = require('co');
var thunkify = require('thunkify');

(function(callback) {
  fs.readFile('examples/fich1.txt', 'utf8', callback);
})(function(err,result){
  console.log("ej1 "+result);
});

function readFile(filename) {
  return function(callback) {
    fs.readFile(filename, 'utf8', callback);
  };
}

readFile('examples/fich2.txt')(function(err,result){
  console.log("ej2 "+result);
});

readFile('examples/fich3.txt')(function(err,result){
  console.log("ej3 "+result);
});

co(function* () {
  var file1 = yield readFile('examples/fich1.txt');
  var file2 = yield readFile('examples/fich2.txt');
  return [file1,file2]
})(function(err,data){console.log("co result - err:" +err+" - data:"+data)});

function co2(generator) {
  var gen = generator();
  function nextItem(err, result) {
    var item = gen.next(result);
    if (!item.done) {
      item.value(nextItem);
    }
  }
  nextItem();
}

co2(function* () {
  var file1 = yield readFile('examples/fich1.txt');
  var file2 = yield readFile('examples/fich2.txt');
  console.log("co2 - "+file1+"-"+file2);
});

function co3(generator) {
  return function(done){
    var gen = generator();
    function nextItem(err, result) {
      var item = gen.next(result);
      if (!item.done) {
        item.value(nextItem);
      }else{
        if(done){
          return done(null,item.value);
        }
      }
    }
    nextItem();
  }
}

co3(function* () {
  var file1 = yield readFile('examples/fich1.txt');
  var file2 = yield readFile('examples/fich2.txt');
  return [file1,file2];
})(function(err,result){
  console.log("co3-1 - err: "+err + " - result: "+result)
});

var readFileThunkified = thunkify(fs.readFile);

co3(function* () {
  var file1 = yield readFileThunkified('examples/fich1.txt');
  var file2 = yield readFileThunkified('examples/fich2.txt');
  return [file1,file2];
})(function(err,result){
  console.log("co3-2 - err: "+err + " - result: "+result)
});