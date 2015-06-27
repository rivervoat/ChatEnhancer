var salutation = "hello";
function greetme(user) {
    return salutation;
}
var foo = createObjectIn(unsafeWindow, {defineAs: "foo"});
exportFunction(greetme, foo, {defineAs:"greet_me"});


console.log('-------------------123-------------------------');
console.log('--------------------------------------------');
console.log(unsafeWindow);
console.log('--------------------------------------------');
console.log(unsafeWindow.foo.greet_me());
console.log('--------------------------------------------');
console.log('-------------------abc-------------------------');
