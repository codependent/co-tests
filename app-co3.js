var fs = require('fs');
var co = require('co');
var request = require('request')
var thunkify = require('thunkify');

var get = thunkify(request.get);

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

function size(file) {
	return function(fn){
		fs.stat(file, function(err, stat){
			if (err) return fn(err);
			fn(null, stat.size);
		});
	}
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

co2(function* () {
  var file1 = yield size('examples/fich1.txt');
  var file2 = yield size('examples/fich2.txt');
  console.log("co2 - size - "+file1+"-"+file2);
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
});var readFileThunkified = thunkify(fs.readFile);



co3(function* () {
  var file1 = yield readFileThunkified('examples/fich1.txt');
  var file2 = yield readFileThunkified('examples/fich2.txt');
  return [file1,file2];
})(function(err,result){
  console.log("co3-2 - err: "+err + " - result: "+result)
});


var ctx = {};
function foo() {
	console.log("in Foo context?: "+(this == ctx));
}
co(function *(param){
	console.log("starting co. Context?"+(this == ctx));
	console.log("el param: "+param)
	yield foo;
}).call(ctx, 'mi param')



function *fooGen(){
	var a = yield size('examples/fich1.txt');
	var b = yield size('examples/fich1.txt');
	var c = yield size('examples/fich1.txt');
	var d = yield size('examples/fich1.txt');
	console.log("FIN fooGen");
	return [a, b, c, d];
}

function *barGen(){
	var a = yield size('examples/fich2.txt');
	var b = yield size('examples/fich2.txt');
	var c = yield size('examples/fich2.txt');
	console.log("FIN barGen");
	return [a, b, c];
}

co(function *(){
	var results = yield [fooGen(), barGen()];
	return results;
})(function(err, result){
	if(err)console.log("Error en sizes: "+err)
	console.log(result)
});


function *results() {
  var a = get('http://google.es')
  var b = get('http://www.mutua.es')
  var c = get('http://www.mutuainmobiliaria.es')
  return yield [a, b]
}

co(function *(){
  // 3 concurrent requests at a time
  var a = yield results;
  var b = yield results;
  console.log(a, b);

  // 6 concurrent requests
  console.log(yield [results, results]);
})()