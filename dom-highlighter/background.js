/**
 * @desc DOM HIGHLIGHTER
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-11-25
 */

var storage = chrome.storage.local;

// page init
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.action == "init"){
            storage.get({
                item_list: ''
            }, function(data){

                var item_list = data.item_list;

                port.postMessage({
                    status: "ok",
                    item_list: item_list
                });
            });
        }
    });
});

// popup init
function init(callback){
    storage.get({
        item_list: ''
    }, function(data){
        if (callback && typeof callback == 'function'){
            callback(data);
        }
    });
}

function add(item, callback){

    storage.get({
        item_list: ''
    }, function(data){

        var item_list = data.item_list;

        if(item_list == ''){
            item_list = [];
        }
        item_list.push(item);

        storage.set({
            item_list: item_list
        }, function(){

            chrome.tabs.query({active:true,windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {

                var port = chrome.tabs.connect(tab[0].id, {name: "dom_highlighter"});
                port.onMessage.addListener(function(data) {

                    if (data.status == "ok" && typeof callback == 'function'){
                        callback(data);
                    }
                });
                port.postMessage({
                    action: "add",
                    selector: item.selector,
                    color: item.color
                });
            });
        });
    });
}

function remove(item, callback){

    storage.get({
        item_list: ''
    }, function(data){

        var item_list = data.item_list;

        for(var i = 0, j = item_list.length; i<j; i++){
            if(item_list[i].selector == item.selector){
                item_list.splice(i, 1);
                break;
            }
        }

        storage.set({
            item_list: item_list
        }, function(){

            chrome.tabs.query({active:true,windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {

                var port = chrome.tabs.connect(tab[0].id, {name: "dom_highlighter"});
                port.onMessage.addListener(function(data) {

                    if (data.status == "ok" && typeof callback == 'function'){
                        callback(data);
                    }
                });

                port.postMessage({
                    action: "remove",
                    selector: item.selector,
                    color: item.color
                });
            });
        });
    });

}







