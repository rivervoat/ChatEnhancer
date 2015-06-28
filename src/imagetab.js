
var TabDescript=function(macroText, icon, title, subtitle) {
    this.macroText = macroText;
    this.icon = icon;
    this.title = title;
    this.subtitle = subtitle;
};

var Tab=function(tabDescript) {
    this.tabDescript = tabDescript;
    var design = [
        ['tabframe', 'div'],
        ['usable', 'div', 'frame'],
        ['header', 'div', 'usable'],
        ['headerText', 'div', 'header'],
        ['title', 'div', 'headerText'],
        ['subtitle', 'div', 'headerText'],
        ['inner', 'div', 'usable'],
    ];
    this.els = Tab.genEls(design);
    var frame = this.els.tabframe;
    frame.style="height:100%;width:100%;background:orange;position:absolute; z-index:20;visibility:hidden;";
    this.els.usable.style="height: 90%; width: 90%; padding: 4%;";
    // this is going to be much easier
    // when the firefox ext. scaffold is done
    // and we can move all the styling to css (appropriate
    // classname assignment is already added)
    if (tabDescript.title || tabDescript.subtitle) {
        var header = this.els.header;
        this.els.header.classList.add('needed');
        this.els.inner.classList.add('hasHeader');
        this.els.header.style='height: 9%; width: 100%';
        this.els.headerText.style='margin-left: 5%;';
        this.els.inner.style='height: 90%; width: 100%';
        if (tabDescript.title) {
            this.els.title.style='font-size:150% !important;';
            this.els.title.textContent = tabDescript.title;
        }
        if (tabDescript.subtitle) {
            this.els.subtitle.style='font-size:120% !important;';
            this.els.subtitle.textContent = tabDescript.subtitle;
        }
    } else {
        this.els.header.style='display: None;';
        this.els.inner.style='height: 100%; width: 100%';
    }
    this.closeCallback=null;
};
Tab.genEls = function(design) {
    els = {};
    design.map(function(x) {
        els[x[0]] = document.createElement(x[1]);
        els[x[0]].className = "ce-"+x[0];
        if (x.length > 2) {
            els[x[2]].appendChild(els[x[0]]);
        }
    });
    return els;
};
Tab.prototype = {
    open : function(closeCallback) {
        var frame = this.rootEl();
        frame.style.visibility="visible";
        frame.classList.add("ce-open");
    },
    close : function(newval) {
        var frame = this.rootEl();
        frame.style.visibility="hidden";
        frame.classList.remove("ce-open");


        this.closeCallback(
            (newval===null)? '':newval
        );
        this.closeCallback = null;
    },
    rootEl : function() {
        return this.els.tabframe;
    },
    hasMacro : function() {
        return (! (this.tabDescript.macroText === null));
    },
    genMacro : function() {
        var context=this,
            action = function(closeCallback) {
                context.open(closeCallback);
            },
            macro = factoryMacroSimple(
                this.tabDescript.macroText,
                action
            );        
    }
};

var Discoverable = function(addr, el) {
    this.addr = addr;
    this.el = el;
};
var DiscoverTab=function(tabDescript,
                         searchCallback,
                         itemtype) {
    this.tab = new Tab(tabDescript);
    this.model = {
        searchText: '',
        searchStatus: 0,
        selected: -1,
        discoverableList: []
    };
    this.icon = icon;
    this.itemtype = itemtype;
    this.description = description;
    var design = [
        ['discover', 'div'],
        ['discover-box', 'div', 'discover'],
        ['discover-list', 'div', 'discover-box'],
        ['dock-box', 'div'],
        ['dock', 'div', 'dock-box', 'discover'],
        ['statusMessage', 'p', 'dock'],
        ['search', 'input', 'dock'],
        ['select', 'input', 'dock'],
        ['okay', 'button', 'dock'],
        ['cancel', 'button', 'dock']
    ];
    this.els = Tab.genEls(design);
    this.tab.inner.append(this.els.discover);
    this.els['image-list'].style = "width: 100%; height: 80%; border-bottom: 1px solid gray; overflow-y: auto";
    this.els.search.setAttribute('placeholder', 'search string');
    this.els.select.setAttribute('placeholder', 'select '+this.itemtype);

    var context = this,
        okay = this.els.okay,
        cancel = this.els.cancel,
        onOkayClick = function() { context.onOkay(); };
        onCancelClick = function() { context.onCancel(); };
    okay.textContent = 'ok';
    cancel.textContent = 'cancel';
    okay.addEventListener('click',onOkayClick);
    cancel.addEventListener('click', onCancelClick);

    var onSearchChange=function(e)
    { context.onSearchChange(e); };
    this.els.search.addEventListener('click',
                                     onSearchChange);
};

DiscoverTab.prototype = {
    open : function(closeCallback) {        
        this.tab.open(closeCallback);
    },
    onSearchChange : function(e) {
        var listRoot = this.els['discover-box'];
        this.model.search=e.target.value;
        var context=this;
        this.searchCallback(listRoot)
            .then(
                function(discoverableList) {
                    context.model.selected=-1;
                    context.model.discoverableList=discoverableList;
                    context.model.searchStatus=1;
                    context.els.statusMessage.textContent='success';
                },
                function(err) {
                    //don't replace current results
                    context.model.searchStatus=err;
                    context.els.statusMessage.textContent('no results found');
                }
            );
        
    },
    onCancel : function() {
        this.close('');
    },
    onOkay : function() {
        var selected = this.model.selected;
        if (selected == -1) { this.onCancel(); }
        var addr = this.model.discoverableList[selected].addr;
        this.close(this.addrFormatter(addr));
    },
    addrFormatter : function(instr) {
        //override me.
        return instr;
    },
    close : function(newval) {
        discoverList=this.els['discover-list'];
        while (discoverList.firstChild) {
            discoverList.removeChild(discoverList.firstChild);
        }
        this.els.search.value='';
        this.els.select.value='';
        this.tab.close(newval);
    },
    rootEl : function() {
        return this.tab.rootEl();
    }
};

var Macro = function(fnFind, fnAction, fnReplace) {
    this.fnFind = fnFind;
    this.fnAction = fnAction;
    this.fnReplace = fnReplace;    
};

var factoryMacroRegex=function(findPatternArg,
                               actionArg,
                               replacePatternArg) {
    var findPattern = findPatternArg,
        action = actionArg,
        replacePattern = replacePatternArg;
    var fnFind = function(instr) {
        return instr.match(findPattern);
    },
    fnReplace = function(instr, newval) {
        var rep=replacePattern.replace('newval', newval);
        return instr.replace(findPattern, replacer);
    };
        
    return new Macro(
        fnFind,
        actionArg,
        fnReplace
    );
};

var factoryMacroSimple = function(keyword, action) {
    return factoryMacroRegex(
        new RegExp('( |^)'+sn, 'i'),
        action,
        '$1newval'
    );
};
var MacroChecker = function(input){
    this.inputEl = input;
    this.macros = [];
    var context = this,
        onKeyPress = function(e) {
            context.checkForMacro(e);
        };
    this.inputEl.addEventListener('keypress',
                                  onKeyPress);
};
MacroChecker.prototype = {
    checkForMacro : function(e) {
        //todo abstract away that
        // we'll be dealing with an <input>
        // el callback.
        var field = e.target,
            instr = field.value,
            m,
            inputMatch = null;
        for (var i=0;
             inputMatch === null && i<len;
             i++) {
            inputMatch = m.fnFind(instr);
        }
        if (inputMatch === null) { return; }
        e.target.setAttribute('disabled', true);
        var callbackfn = function(newval) {
            m.fnReplace(instr, newval);
            e.target.removeAttribute('disabled');
        };
        m.action(callbackfn, inputMatch);

    }
};

var googleSearchWarn='FYI: Using this feature for search will trigger search calls to google image search, just like if you went there and searched it.';
var imageFetch=function(parentEl){
    //todo promises
    
};
var tabList=[
    new DiscoverTab(
        new TabDescript('@img',
                        null,
                        'Find an Image',
                        googleSearchWarn
                       ),
        'image'
    )
];



function addTabs(chatbox,
                 macroChecker,
                 tabs) {
    tabs.map(function(tab) {
        chatbox.insertBefore(
            chatbox.firstElementChild,
            tabs.rootEl()
        );
        if (tab.hasMacro()) {
            macroChecker.macros.push(
                tab.genMacro())
            ;
        }
    });
}

var kIn = document.getElementById('blue'),
  chatbox = document.getElementById('chat'),
m_checker = new MacroChecker(kIn);

addTabs(chatbox, m_checker, tabList);
