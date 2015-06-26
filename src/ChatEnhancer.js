// Voat Chat Enhancer v.0.1.8
// if you were linked directly here, 
// please go to https://voat.co/v/riverstechstuff/comments/171279
// for the latest version and usage instruction.

var my_username=document.getElementsByClassName('user')[0].firstElementChild.textContent;
var std_blocklist=['billajong9', 'caffeine_pills_', 'campsont29', 'bpiniggiger', 'mkwarmansBRODAWG', 'GreatRedditMigration'];

var ChatImprover = function() {
    //default options.
    this.blocked_users=std_blocklist;
    this.mentions=[my_username, 'yo!'];
    this.images=true;
    this.video=true;
    this.mediaSize='150px';    
    this.csshide = { att: 'display', val:'none'};   
    this.cssmentioned = { att: 'color', val: 'red'};
    this.color_whole_message=false;
    
    this.checked_up_to=0;
    this.stop=false;
    // A global incremented lock (forgive the loose
    // use of term) for being able to easily
    // hotswap an older version of this class for a newer one.
    this.lockname='chatImproverLock';    
    if (! window.hasOwnProperty(this.lockname)) {
        this.locknum=0;        
    } else { this.locknum = window[this.lockname]+=1; }
    window[this.lockname] = this.locknum;
};
ChatImprover.prototype.update = function() {
    this.checked_up_to = 0;
};

//convenience functions
ChatImprover.prototype.block = function(username) {
    this.blocked_users.push(username);
};

ChatImprover.prototype.ment = function(searchterm) {
    this.mentions.push(searchterm);
};

ChatImprover.prototype.stringToColour = function(str) {
    //this particular stringToColor function is credit
    //to Joe Freeman, yckart and CDSanchez at stack overflow
    //stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript

    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

    return colour;
};
ChatImprover.prototype.loop = function() {
    // if manually instructed to stop
    // or newer version added end.
    if (this.stop || window[this.lockname] != this.locknum) {
        this.stop=false;
        return 0;
    }
    //find chatbox element
    chatbox = document.getElementById('subverseChatRoom');
    if (chatbox === null) {
        console.log("err, couldn't find chatbox. ChatImprover is stopping");
        return 1;
    }
    //create array of all messages
    // (obvious O(linear) improvements could be made here
    // TODO: instead just iterate back to find the last marked
    // element then nextElementSibling fwd and apply changes)
    var i,j, el=chatbox.firstElementChild, arr=[el];
    while (el=el.nextElementSibling) { arr.push(el); }
    
    //assuming no options change, so only start checking
    //at last element.
    i=this.checked_up_to;
    this.checked_up_to=arr.length;
    for(; i<arr.length; i++) {
        //for each message
        el=arr[i];
        // if it has a child element assume first one
        // is a username.
        if (el.firstElementChild == undefined) {
            continue;
        }
        if (! ('original' in el.attributes)) {
            el.attributes['original'] = el.innerHTML;
        }
        x = document.createElement('div');
        x.innerHTML=el.attributes['original'];
        speaker = x.firstElementChild.textContent;
        // expect an exact match.
        if (this.blocked_users.indexOf(speaker) != -1) {
            x.style[this.csshide.att] = this.csshide.val;
        }
	if (this.color_whole_message) {
	    x.style['color']=this.stringToColour(speaker);
        } else {
	    x.firstElementChild.style['color']=this.stringToColour(speaker);
        }
        // for every highlight term, do a search
        // of the textContent - you can
        // use a regex if you want.
        var text = x.textContent;
        for (j=0; j<this.mentions.length; j++) {
            if (text.search(this.mentions[j]) != -1){
                x.style[this.cssmentioned.att] = this.cssmentioned.val;
                break;
            }	
        }
        
        //yes this section needs to be cleaned up.
        if (this.images) {
            //check for images and tag em.
            //blocking question mark so people can't
            //post CSRF links, but really CSRF
            //is on the 3rd party server to solve. Even if
            //we didn't display images automatically, 
            //like voat or other site people click lots of
            //unknown links all the time.
            x.innerHTML = (x.innerHTML+' ').replace(new RegExp('([^">])(https?://[^ ?$]*\.(jpg|png)) ', 'gi'), '$1<a href="$2"><img src="$2" style="max-height:' + this.mediaSize +'; vertical-align: top"></img></a> ').slice(0,-1);
        }
        if (this.video) {
            //check for videos and tag em.
            x.innerHTML = (x.innerHTML+' ').replace(new RegExp('([^">])(https?://[^ ?$]*\.(webm)) ', 'gi'), '$1<video src="$2" style="max-height:' + this.mediaSize +'; vertical-align: bottom" controls>$2</video> ').slice(0,-1);
        }
        //the way we avoid re-adding images and videos
        //for now is to just not add tags to links
        //which begin with a quote or tagend.
        x.innerHTML = x.innerHTML.replace(new RegExp('([^">])(https?://[^ $]*)', 'gi'), '$1<a href="$2">$2</a>');
        
        el.innerHTML=x.innerHTML;
        
        el.style.cssText=x.style.cssText;
    };
    // run this function again in 30ms after end
    // we use timeOut to put a damper on potential scaling
    // delays / whatever browser scheduling for now,
    // and aspire to 30ms so spammers messages are
    // barely a visual disruption. (most humans can notice
    // differences that last about 10ms)
    var context = this;
    var reloop=function() { context.loop(); };
    window.setTimeout(reloop, 20);
    return 0;
};

window.chat = chat = new ChatImprover();
chat.loop();

//begin options
//these are the default options, modify them as you see fit.
//after you set one or more of these, to apply them retroactively run
//chat.update(); 
//if you have a long chatlog this may take a little time

//chat.blocked_users=std_blocklist;
//chat.block('annoying_person');
//chat.mentions=[my_username, 'yo!'];
//chat.ment('cool_person');
//chat.images=true;
//chat.video=true;
//chat.mediaSize='150px';

//end options