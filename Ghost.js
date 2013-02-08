function Action(type, params) {
    'use strict';

    // click target
    // select option in target (select or radio)
    // hover over target
    
    // the delay either before or after the action

    // the condition that must be met for the action to happen

    // the return value if the action is successful
    // the return value if the action is uncesseful
    // the return value if the action can't be classified as successful or unsuccessful


    if (!(this instanceof Action)) {
        return new Action(target, name);
    }

    if (!this[type]) {
        throw 'action ' + type + ' is not a registered action.';
    }

    // used for the array prototype only
    this.ap = [];

    // reverse the params.
    this.params = this.ap.reverse.apply(params, this.ap);

    if (typeof type === "string") {
        // internal function reference
        this.type = this[type];
    } else {
        // type is a function
        this.type = type;
    }

}
Action.prototype = {
    run : function (targetContext) {
        'use strict';
        console.log(targetContext);
        if (this.params.length > 0) {
            var params = this.params.pop();
            this.type.apply(targetContext, [params]);
        } else {
            this.type.apply(targetContext,[]);
        }
    },
    selectIfHasValue : function (value) {
        'use strict';
        // this is a <select> element
        // value is the value attribute of the option.
        // compares the value attribute case insensitivly
        // and igores whitespace.

        var toLowerTrim = function (val) {
            return $.trim(val).toLowerCase();
        }

        value = value.toLowerCase();

        $(this).find('option').each(function (index, element) {

            var optionValue = toLowerTrim( $(element).attr('value') );

            if (optionValue === value) {
                var parent = $(this).parent('select');
                parent.val($(this).attr('value'));
                parent.trigger('change');
            }

        });
    },
    click : function () {
        'use strict';
        // this is a dom element
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', true, true);
        this.dispatchEvent(evt);
    }
}

function Ghost() {
    'use strict';

    if (!(this instanceof Ghost)) {
        return new Ghost();
    }

    this.ap = [];       // used for the array prototype only
    this.delay = 2000;
    this.timer = null;  // keeps track of the timer reference.  May need in the future.
    this.active = true; // used to stop in the middle of a run

}

Ghost.prototype = {
    setDelay : function (delay) {
        this.delay = delay;
    },
    start : function (targets, action) {

        console.log(action);
        if (typeof action === "Action") {
            throw "parameter is not an Action";
        } 

        var targets = $(targets);

        if (targets.length > 0) {

            // Reverse the returned dom elements
            this.ap.reverse.apply(targets);
            return this.triggerAll(targets, action);
        }

    },

    triggerAll : function (targets, action) {
        if( this.active === false) {
             window.clearTimeout(this.timer);
             return "Stopped";
        }

        var that = this;
        var target = this.ap.pop.apply(targets);
        action.run(target);       
        
        if (targets.length) {
            this.timer = window.setTimeout(function() {
                that.triggerAll(targets,action);
            }, this.delay);
        } else {
            window.clearTimeout(this.timer);
        }
    },
    
    toDate : function(month) {
        return DATES[month];    
    },

    month_ago : function(number) {

        var calc = function(difference) {
            if (Math.abs(difference) < 12) {
                return 12 - Math.abs(difference);
            } else {
                return calc (difference % 12);
            }
        }
    
        var d = new Date();
        var nowMonth = d.getMonth();
        return calc( nowMonth - number );
    },
    
    ytts : function() {
        var toDate = this.toDate;
        var month_ago = this.month_ago;
        
        $('.time').map(function() {
            var date = $(this).text();
            $(this).append(toDate(month_ago(date.match(/[0-9]+/)[0])));
        });
    },
    
    DATES : {
        1 : 'jan',
        2 : 'feb',
        3 : 'mar',
        4 : 'apr',
        5 : 'may',
        6 : 'jun',
        7 : 'jul',
        8 : 'aug',
        9 : 'sep',
        10 : 'oct',
        11 : 'nov',
        12 : 'dec'
    }
};

// Works either jQuery or DomAssistant as the global $ variable
var g = new Ghost();

var choices = ['one', 'two', 'three'];
var hideButtons = $('.flat-list .hide-button a');

//var selectValue = new Action('selectIfHasValue', choices);
var doClick = new Action('click', []);
g.start(hideButtons, doClick);
