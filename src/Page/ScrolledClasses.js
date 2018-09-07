/**
 * Detects the scroll value of a page and sets classes in state of scroll position.
 */
(function(window) {
    "use strict";

    function PageScrolledClasses(params) {
        var settings = {
            selector: "html",
            cssClass: "page-scrolled",
            cssClassDown: "page-scrolled-down",
            cssClassUp: "page-scrolled-up",
            cssClassTopOffset: "page-scrolled-top-offset",
            cssClassTopOffset2: "page-scrolled-top-offset2",
            topOffset: 0, // either a number or a query-selector of type id
            topOffset2: 0,
            onTopOffsetOn: function() {},
            onTopOffsetOff: function() {},
            onScrollStop: null, // callback function
            timer: 50
        };

        if (typeof params === "object") {
            for (var key in params) {
                if (params.hasOwnProperty(key) && typeof settings[key] !== "undefined") {
                    settings[key] = params[key];
                }
            }
        }

        var element = document.querySelector(settings.selector),
            oldPageYOffset = 0,
            topOffsetElement = typeof settings.topOffset === "string" ? document.querySelector(settings.topOffset) : null;

        var updateClassList = function() {
            if (window.pageYOffset > oldPageYOffset) {
                element.classList.add(settings.cssClassDown);
                element.classList.remove(settings.cssClassUp);
            } else if (window.pageYOffset < oldPageYOffset) {
                element.classList.add(settings.cssClassUp);
                element.classList.remove(settings.cssClassDown);
            } else {
                element.classList.remove(settings.cssClassDown);
                element.classList.remove(settings.cssClassUp);
            }
            oldPageYOffset = window.pageYOffset;

            if (window.pageYOffset > 0) {
                element.classList.add(settings.cssClass);
            } else {
                element.classList.remove(settings.cssClass);
            }

            if (topOffsetElement) {
                var topOffset = topOffsetElement.clientHeight + topOffsetElement.offsetTop;
                if (window.pageYOffset > topOffset) {
                    element.classList.add(settings.cssClassTopOffset);
                    if (typeof settings.onTopOffsetOn === "function") {
                        settings.onTopOffsetOn();
                    }
                } else {
                    element.classList.remove(settings.cssClassTopOffset);
                    if (typeof settings.onTopOffsetOff === "function") {
                        settings.onTopOffsetOff();
                    }
                }
            } else if (typeof settings.topOffset === "number" && settings.topOffset) {
                if (window.pageYOffset > settings.topOffset) {
                    element.classList.add(settings.cssClassTopOffset);
                    if (typeof settings.onTopOffsetOn === "function") {
                        settings.onTopOffsetOn();
                    }
                } else {
                    element.classList.remove(settings.cssClassTopOffset);
                    if (typeof settings.onTopOffsetOff === "function") {
                        settings.onTopOffsetOff();
                    }
                }
            }

            if (typeof settings.topOffset2 === "number" && settings.topOffset2) {
                if (window.pageYOffset > settings.topOffset2) {
                    element.classList.add(settings.cssClassTopOffset2);
                } else {
                    element.classList.remove(settings.cssClassTopOffset2);
                }
            }
        };

        var sstOn = typeof settings.onScrollStop === "function";
        var sst = null;
        var onScrollTopHandler = function() {
            if (sst) {
                window.clearTimeout(sst);
            }

            sst = window.setTimeout(settings.onScrollStop, 50);
        };

        if (settings.timer) {
            var t = null;
            window.addEventListener(
                "scroll",
                function() {
                    if (t === null) {
                        updateClassList();
                        t = window.setTimeout(function() {
                            t = null;
                        }, settings.timer);
                    }
                    if (sstOn) {
                        onScrollTopHandler();
                    }
                },
                false
            );
        } else {
            window.addEventListener(
                "scroll",
                function() {
                    updateClassList();
                    if (sstOn) {
                        onScrollTopHandler();
                    }
                },
                false
            );
        }

        updateClassList();
    }

    if (typeof define === "function" && define.amd) {
        define(function() {
            return PageScrolledClasses;
        });
    } else {
        window.PageScrolledClasses = PageScrolledClasses;
    }
})(window);
