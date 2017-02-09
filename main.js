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

    get keyList() {
        let keyArray = [];
        if (this.jsonData) {
            for (let k in this.jsonData) {
                keyArray.push(k);
            }
        }
        return keyArray
    }

    getJsonValue(key) {
        let nodeChildren = this.jsonData[key];
        return nodeChildren
    }

    done(f) {
        f();
    }
}

class adContainer {
    constructor(keys) {
        this.keys = keys;
        this.seek()
    }

    seek() {
        let str = "", dom = null;
        if (this.keys.length > 0) {
            this.keys.forEach(function (k, i) {
                str = "." + k;
                dom = document.querySelectorAll(str);
                this.modifyStyle(dom);
            })
        }
    }

    modifyStyle(dom) {
        dom.style.border = "1px soild black";
    };
}


var json = new jsonDataFileLoad("/test2/filter.json");
var foo = new adContainer(json.getJsonValue("class"));


class main {
    static init() {
        var json = new jsonDataFileLoad("/test2/filter.json");
        json.keyList.forEach(function (k, i) {
            console.log(json.getJsonValue(k))
        });
    }
}
