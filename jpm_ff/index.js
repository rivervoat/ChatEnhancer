var pageMod = require('sdk/page-mod');
var buttons = require('sdk/ui/button/action');

pageMod.PageMod({
    include:"voat.co",
    contentScriptFile: './lib/ChatEnhancer.js'
});

var exampleCallback = function() {
    console.log('hello world!');
};

var button = buttons.ActionButton({
    id: 'chat-enhancer-btn',
    label: 'Voat ChatEnhancer',
    icon : {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onClick : exampleCallback
});
