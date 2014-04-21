function *bar(){
  var a = yield "jamon";
  console.log("la aaaa "+a);
  var b = yield "pavo";
  console.log("la bbbb "+b);
  var c = yield "pollo";
  console.log("la cccc "+c);
  return [a,b,c];
}

var mibar = bar();
var result = mibar.next();
result = mibar.next(result.value);
result = mibar.next(result.value);
result = mibar.next(result.value);
console.log(result.value);