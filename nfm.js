NFM = function() {
    this.states = [];
    this.alphabet = [];
    this.start;
    this.accept = new HashMap();
    this.transition = new HashMap();
    this.input;
    this.root;
};

NFM.prototype.addState = function(name) {
    this.states.push(name);
    this.accept.put(name, false); //not sure whether this is meant to be here. 
};


NFM.prototype.setAcceptState = function(name) {
    this.accept.put(name, true);
};

NFM.prototype.resetAcceptState = function(name) {
    this.accept.put(name, false); 
};

NFM.prototype.isAcceptState = function(state) {
    return this.accept.get(state);
};

NFM.prototype.setInput = function(str) {
    this.input = str;
};

NFM.prototype.evaluate = function() {
    this.root = [this.createPathNode(this.start, undefined)];
    var current = this.root;
    for (var i=0; i<this.input.length; i++)  {
        next = []; 
        for(var j=0; j<current.length; j++) {
            var delta = this.transition.get(current[j].value);
            var size = delta ? delta.size : 0;
            while(size)  {             
                if (delta.value().indexOf(this.input[i]) !== -1) {
                    var pathNode = this.createPathNode(delta.key(), current[j]);
                    next.push(pathNode);
                    current[j].children.push(pathNode);
                }
                /* self-loop has a epsilon, then this will go to infinite, so just omit it */
                if (delta.value().indexOf("\u0190") !== -1 && !(delta.key() === current[j].value)) {
                    var pathNode = this.createPathNode(delta.key(), current[j].parent);
                    current.push(pathNode);
                    if (current[j].parent !== undefined) //if the start state has epsilon-transistion
                        current[j].parent.children.push(pathNode);
                }
                size--;
                delta.next();
            }
        }
        current = next;
    }
    this.drawComputation();
    //console.log(this.root);
};

NFM.prototype.drawComputation = function() {
    /* clear the drawing board */
    computationPlumber.deleteEveryEndpoint(); 
    $("#comp").empty();
    $("#comp").append("<div class='subHead'>Computation Result:</div>");

    var q = this.root.slice(0); //queue for BFS 
    var source;
    var y_pos = 5;
    var delta = getRangeDelta(100, q.length);
    var x_pos = delta/2;
    var accept_div;
    
    for (var i=0; i<q.length; i++, x_pos+=delta) {
        var id = getRandom()+q[i].value;
        q[i].randId = id;
        q[i].delta= delta; 
        q[i].x_pos = x_pos;
        q[i].y_pos = y_pos;
        accept_div = this.isAcceptState(q[i].value) ? "<div class='not-accept'>A</div>" : "<div class='accept'>A</div>"; 
        $("#comp").append("<div id="
                            +id
                            +" class='c_node' style='left:"
                            +q[i].x_pos+"em;top:"
                            +q[i].y_pos+"em;'>#"
                            +q[i].value.split("_")[1]
                            +accept_div
                            +"</div>");
        computationPlumber.draggable(id);
    }
   
    while (q.length) {
        source = q.shift();
        delta = getRangeDelta(source.delta, source.children.length);
        x_pos = delta/2 + source.x_pos - source.delta/2;
        y_pos = source.y_pos+12;
        for (var i=0; i<source.children.length; i++, x_pos+=delta) {
            var id = getRandom()+source.children[i].value;
            source.children[i].delta= delta;
            source.children[i].randId = id;
            source.children[i].x_pos = x_pos;
            source.children[i].y_pos = y_pos;
            accept_div = this.isAcceptState(source.children[i].value) ? "<div class='not-accept'>A</div>": "<div class='accept'>A</div>";
            $("#comp").append("<div id="
                            +id+" class='c_node' style='left:"
                            +source.children[i].x_pos
                            +"em;top:"
                            +source.children[i].y_pos
                            +"em;'>#"
                            +source.children[i].value.split("_")[1]
                            +accept_div
                            +"</div>");
            computationPlumber.draggable(id);
            computationPlumber.connect({source:source.randId, target:source.children[i].randId});
            q.push(source.children[i]);
        }
    }
};

NFM.prototype.createPathNode = function(id, parent) {
    return {value: id, children: [], parent: parent};
};

NFM.prototype.addToPath = function(node, child) {
    node.children.append(child);
};

NFM.prototype.removeTransition = function(source, target) {
    this.transition.get(source).remove(target);
};
