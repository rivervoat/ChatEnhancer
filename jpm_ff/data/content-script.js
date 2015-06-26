var salutation = "hello";
function greetme(user) {
    return salutation;
}
var foo = createObjectIn(unsafeWindow, {defineAs: "foo"});
exportFunction(greetme, foo, {defineAs:"greet_me"});

