/**
 * Defines namespaced events
 * https://gist.github.com/yairEO/cb60592476a4204b27e83048949dbb45
 * https://stackoverflow.com/questions/21817397/event-handler-namespace-in-vanilla-javascript/21817552
 */
define(function() {
    "use strict";

    var NamespacedEvent = function () {
        var namespaces = {};

        this.on = function (event, cb, opts) {
            namespaces[event] = cb;
            var options = opts || false;

            this.addEventListener(event.split(".")[0], cb, options);
            return this;
        };

        this.off = function (event) {
            this.removeEventListener(event.split(".")[0], namespaces[event]);
            delete namespaces[event];
            return this;
        }
    };

    return NamespacedEvent;
});
