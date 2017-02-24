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

    static ModiftElementStyle(el) {
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
        let json = new jsonDataFileLoad("filter.json");
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

//var core = new Core();

chrome.extension.sendRequest("getJson", function(response){
    console.log(response)
})