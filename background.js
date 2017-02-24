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


chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if(chrome.runtime.id == sender.id){
        switch(request){
            case "getJson":
                let json = new jsonDataFileLoad("filter.json");
                sendResponse(json)
                break;
        }
    }

});