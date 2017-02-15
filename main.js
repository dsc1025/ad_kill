/**
 * Created by shaochong.ding on 2017/2/7.
 */

class fileLoad {
    constructor(url) {
        this.url = url;
        this.xhr = new XMLHttpRequest();
        this.xhr.addEventListener("progress", this.updateProgress);
        this.xhr.addEventListener("load", this.transferComplete);
        this.xhr.addEventListener("error", this.transferFailed);
        this.init();
    }

    updateProgress(e) {
        console.log('LOADING', e.target.readyState); // readyState will be 3
    }

    transferComplete(e) {
        console.log('DONE', e.target.readyState); // readyState will be 4
    }

    transferFailed(e) {
        console.log(e.detail)
    }

    init() {
        this.xhr.open('GET', this.url, false);
        this.xhr.send(null);
    }

    get data() {
        return this.xhr.response;
    }
}

class jsonDataFileLoad extends fileLoad {
    constructor(url) {
        super(url);
        this.jsonData = JSON.parse(this.xhr.response) || null;
    }

    getKeyList() {
        let keyArray = [];
        if (this.jsonData) {
            for (let k in this.jsonData) {
                keyArray.push(k);
            }
        }
        return keyArray;
    }

    getJsonValue(key) {
        this.key = key || null;
        this.nodeChildren = null;
        if (this.key) {
            this.nodeChildren = this.jsonData[this.key];
        } else {
            if (this.getKeyList().length > 0) {
                let arr = new Array();
                for (let i in this.getKeyList()) {
                    arr.push(this.jsonData[this.getKeyList()[i]]);
                }
                this.nodeChildren = arr;
            }
        }
        return this.nodeChildren;
    }

    done(f) {
        f();
    }
}

class Utils {
    static uniqueArrayProperty(arr) {
        if (arr.length > 0) {
            let tmp = new Array();
            for (let i in arr) {
                if (tmp.indexOf(arr[i]) == -1) {
                    tmp.push(arr[i]);
                }
            }
            return tmp;
        }
    }
}

class adContainer {
    static seekElementClassName(keys) {
        if (keys.length > 0) {
            for (let i in keys) {
                let elements = document.querySelectorAll("." + keys[i]);
                if (elements.length > 0) {
                    elements.forEach(function (e, i) {
                        adContainer.ModiftElementStyle(e);
                    })
                }
            }
        }
    }

    static ModiftElementStyle(el){
        el.style.border = "1px solid red";
    }
}

class Core {
    constructor(key) {
        this.key = key || null;
        this.body = document.querySelector("body").innerHTML;
        this.arr = [];
        this.init();
    }

    init() {
        let json = new jsonDataFileLoad("/test2/filter.json");
        this.keyToHtml(json.getJsonValue(this.key));

        let keys = [];
        if (this.arr.length > 0) {
            for (let i in this.arr) {
                keys = Utils.uniqueArrayProperty(this.arr[i]);
                adContainer.seekElementClassName(keys);
            }
        }
    }

    keyToHtml(keys) {
        if (keys.length > 0) {
            for (let i in keys) {
                if (keys[i] instanceof Array) {
                    this.keyToHtml(keys[i]);
                } else {
                    this.arr.push(this.body.match(new RegExp(keys[i], "g")));
                }
            }
        }
    }
}

var core = new Core();