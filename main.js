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
        let obj = new Object();
        let b = [];

        if (arr.length > 0) {
            for (let i in arr) {
                if (arr[i] instanceof Array) {
                    Utils.uniqueArrayProperty(arr[i]);
                } else {
                    obj[arr[i]] = 0;
                }
            }
            console.log(obj)
        }

    }

}

class adContainer {
    constructor(keys) {
        this.keys = keys;
        this.elements = null;
        this.seek()
    }

    seek() {
        let str = "";
        /*if (this.keys) {
         if (this.keys.length > 0) {
         }
         }*/
        console.log(this.keys)
    }

    static fromElementClassName(keys) {
        if (keys.length > 0) {
            for (var k in keys) {
                let arr = keys[k];
                for (var a in arr) {
                    let elements = document.querySelectorAll("." + arr[a]);
                    console.log(elements)
                }
            }
        }
    };
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
        Utils.uniqueArrayProperty(this.arr);
        //adContainer.fromElementClassName(this.arr);
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

var core = new Core("Regexp");