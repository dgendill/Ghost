function Action (target, name) {

    //if (!(this instanceof Action)) {
    //    return new Action(target, name);
    //}

    this.target = target;   // selector or jQuery object
    this.name = name;     // string

    if (this.target && this.name) {
        this.ready = true;
    }
}

function Ghost() {

    //if (!(this instanceof Ghost)) {
    //    return new Ghost();
    //}

    this.ap = [];       // used for the array prototype only
    this.delay = 2000;
    this.timer = null;  // keeps track of the timer reference.  May need in the future.
    this.active = true;

}

Ghost.prototype = {
    setDelay : function(delay) {
        this.delay = delay;
    },
    start : function(action) {
        console.log(action);
        if (typeof action === "Action") {
            throw "parameter is not an Action";
        } else if (action.ready !== true) {
            throw "action has not been initialized";
        }

        var targets = $(action.target);

        if (targets.length > 0) {

            // Reverse the items in the jQuery object
            this.ap.reverse.call(targets, this.ap);
            this.triggerAll(targets, action);
        }

    },

    triggerAll : function(targets, action) {
        console.log('working...');
        var that = this;
        var target = this.ap.pop.call(targets, this.ap);
        
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(action.name, true, true);
        target.dispatchEvent(evt);
        
        if (targets.length > 0 || this.active !== false) {
            this.timer = window.setTimeout(function() {
                that.triggerAll(targets,action);
            }, this.delay);
        } else {
            window.clearTimeout(this.timer);
        }
    }
}

// Works either jQuery or DomAssistant as the global $ variable
var g = new Ghost();