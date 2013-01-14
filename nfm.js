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
    this.accept.put(name, false);
    this.transition.put(name, new HashMap());
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
    this.root = this.createPathNode(this.start, undefined); 
    var current = [this.root];
    for (var i=0; i<this.input.length; i++)  {
        next = []; 
        for(var j=0; j<current.length; j++) {
            var transitions = this.transition.get(current[j].value);
            for(var k=0; k++ < transitions.size; transitions.next()) {
                if (transitions.value().indexOf(this.input[i]) !== -1) {
                    var pathNode = this.createPathNode(transitions.key(), current[j]);
                    next.push(pathNode);
                    current[j].children.push(pathNode);
                }
                if (transitions.value().indexOf("\u0190") !== -1) {
                    var pathNode = this.createPathNode(transitions.key());
                    current.push(pathNode);
                    current[j].parent.children.push(pathNode);
                }
            }
        }
        current = next;
    }
    console.log(this.root);
};

NFM.prototype.createPathNode = function(id, parent) {
    return {value: id, children: [], parent: parent};
};

NFM.prototype.addToPath = function(node, child) {
    node.children.append(child);
};

NFM.prototype.removeTransition = function(source, target) {
    this.transition[source].remove(target);
    this.transition.remove(source);
};
