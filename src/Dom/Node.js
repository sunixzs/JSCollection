define(function() {
    "use strict";

    var Node = Node || {};

    Node.getClosest = function(node, nodeName) {
        if (typeof nodeName !== "string") {
            return null;
        }
        nodeName = nodeName.toUpperCase();

        var n = 0;
        while (node) {
            n++;
            if (n > 20) break;
            if (node.nodeName === nodeName) {
                return node;
            }
            node = node.parentNode;
        }

        return null;
    };

    Node.getCoords = function(elem) {
        // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    };

    return Node;
});
