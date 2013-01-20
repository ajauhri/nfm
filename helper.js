;(function() {
    trim = function(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };

    addPlumbProp = function(state_id, state) {
        var ep = $('.ep', state);
        jsPlumb.draggable(state_id); 
        jsPlumb.makeSource(ep, {
            parent:ep.parent(),				
            anchor:"Continuous",
            connector:[ "StateMachine", { curviness:20 } ],
            maxConnections:-1,
        });
           
        jsPlumb.makeTarget(state, {
            dropOptions:{ hoverClass:"dragHover" },
            anchor:"Continuous"
        });
    };

    addAcceptBtListener = function(accept) {
        accept.click(function() {
            var state_id = this.parentElement.id;
            if (nfm.isAcceptState(state_id)) {
                this.style.textDecoration = "line-through";
                nfm.resetAcceptState(state_id);
            }
            else {
                this.style.textDecoration = "none";
                nfm.setAcceptState(state_id);
            }
        });
    };

    addStartBtListener = function(start) {
        start.click(function() {
            var state_id = this.parentElement.id;
            if (nfm.start == state_id) {
                this.style.textDecoration = "line-through";
                nfm.start = undefined;
            }
            else {
                $("#"+nfm.start+" > .start").css('textDecoration', 'line-through');
                nfm.start = state_id;
                this.style.textDecoration = "none";
            }
        });
    };

    validate = function(e) {
        /* check start state exists */
        if (nfm.start === undefined) {
            alert("Start state not defined");
            return false;
        }

        /* accept states empty */
        var count = 0;
        for(var i = 0; i++ < nfm.accept.size; nfm.accept.next()) {
            if (!nfm.accept.value())
                count++;
        }
        if (count === nfm.accept.size) {
            alert("Accept state(s) not defined");
            return false;
        }

        /* check existence of input string */
        if (!nfm.input) {
            alert("Input string is empty");
            return false;
        }

        return true;
    };
    
    getRandom = function () {
        return (Math.floor(Math.random() * (9999999) + 1)).toString();
    };

    getRangeDelta = function(width, nodes) {
        return width/nodes;
    };

    getXPos = function(height, angle) {
        return height/Math.tan(angle);
    };

})();


