/**
 * @desc DOM HIGHLIGHTER
 * @author jiguang
 * @mail jiguang1984#gmail.com
 * @date 2013-11-25
 */

var port = chrome.runtime.connect({name: "dom_highlighter"});
port.postMessage({action: "init"});
port.onMessage.addListener(function(msg) {
    if (msg.status == "ok"){

        var item_list = msg.item_list;

        if(item_list.length > 0){
            for(var i = 0, j = item_list.length; i<j; i++){
                $(item_list[i].selector).css('background-color', item_list[i].color);
            }
        }
    }
});

chrome.runtime.onConnect.addListener(function(port) {

    port.onMessage.addListener(function(msg) {

        // init dom highlight in current page
        if (msg.action == "add"){
            $(msg.selector).css('background-color', msg.color);
        }

        if (msg.action == "remove"){
            location.reload();
        }

        port.postMessage({
            status: "ok"
        });

    });
});







