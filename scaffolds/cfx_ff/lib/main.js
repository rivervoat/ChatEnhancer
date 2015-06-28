var pageMod = require('sdk/page-mod'),
    self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
//var { MatchPattern } = require("sdk/util/match-pattern");

pageMod.PageMod({
    include:"*.voat.co",
//    contentScript: 'document.body.innerHTML="<h1>testing</h1"'
    contentScriptFile: self.data.url('content-script.js')
//    contentScriptFile: self.data.url('ChatEnhancer.js')    
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
