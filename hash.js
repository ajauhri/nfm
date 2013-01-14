HashMap = function() {
    this.current = undefined;
    this.size = 0;
};

HashMap.prototype.hash = function(value) {
    return (typeof value) + ' ' + value.toString();
}

HashMap.prototype.put = function put(key, value) {
    var hash = this.hash(key);
    if (this[hash] === undefined) {
        var item = {key: key, value: value};
        this[hash] = item;
        this.link(item);
        this.size++;
    }
    else 
        this[hash].value = value;
};

HashMap.prototype.get = function get(key) {
    var item = this[this.hash(key)];
    return item === undefined ? undefined : item.value;
};

HashMap.prototype.remove = function(key) {
    var hash = this.hash(key);
    var item = this[hash];

    if (item !== undefined) {
        this.size--;
        this.unlink(this[hash]);
        delete this[hash];
    }
};

HashMap.prototype.link = function(item) {
    if (this.size == 0) {
        this.current = item;
        item.prev = item;
        item.next = item;
    }
    else {
        item.prev = this.current.prev;
        item.prev.next = item;
        item.next = this.current;
        this.current.prev = item;
    }
};

HashMap.prototype.unlink = function(item) {
    if (this.size == 0)
        this.current = undefiend;
    else {
        item.prev.next = item.next;
        item.next.prev = item.prev;
        if (item === this.current)
            this.current = this.next;
    }
};

HashMap.prototype.remove = function(key) {
    var hash = this.hash(key);
    var item = this[hash];

    if(item !== undefined) {
        this.size--;
        this.unlink(item);

        delete this[hash];
    }
};

HashMap.prototype.next = function() {
    this.current = this.current.next;
};

HashMap.prototype.key = function() {
    return this.current.key;
};

HashMap.prototype.value = function() {
    return this.current.value;
};
