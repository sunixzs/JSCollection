/**
 * detects, if a section/div is in viewport and updates the active class of links
 */
(function(window) {
    "use strict";

    function ScrollActiveClasses(params) {
        var settings = {
            linkSelector: "nav.main a",
            sectionSelector: "div.page-section",
            cssClass: "active",
            setOnlyFirstOneActive: false,
            viewportTopMargin: 0,
            viewportBottomMargin: 0
        };

        // overwrite default settings
        if (typeof params === "object") {
            for (var key in params) {
                if (params.hasOwnProperty(key) && typeof settings[key] !== "undefined") {
                    settings[key] = params[key];
                }
            }
        }

        /**
         * Reduces the viewport in the top (p.e. the height of a fixed header element)
         * @param {number} n
         */
        this.setViewportTopMargin = function(n) {
            settings.viewportTopMargin = n;
        };

        /**
         * Reduces the viewport in the bottom (p.e. the height of a fixed footer element)
         * @param {number} n
         */
        this.setViewportBottomMargin = function(n) {
            settings.viewportBottomMargin = n;
        };

        // set some vars
        var links = document.querySelectorAll(settings.linkSelector),
            sections = document.querySelectorAll(settings.sectionSelector),
            windowHeight = 0;

        // do nothing if there are no links or sections
        if (links.length === 0 || sections.length === 0) {
            return;
        }

        /**
         * Helper method to determine if a section is visible and get the rectangle data
         * @param {object} element
         */
        var getSectionState = function(element) {
            var coords = element.getBoundingClientRect();

            // top is in viewport
            if (coords.top > settings.viewportTopMargin && coords.top < windowHeight) {
                return {
                    coords: coords,
                    visibility: "top"
                };
            }

            // bottom is in viewport
            if (coords.bottom > settings.viewportTopMargin && coords.bottom < windowHeight) {
                return {
                    coords: coords,
                    visibility: "bottom"
                };
            }

            // top and bottom inside viewport
            if (coords.top > settings.viewportTopMargin && coords.bottom < windowHeight) {
                return {
                    coords: coords,
                    visibility: "inside"
                };
            }

            // top and bottom is larger than the viewport
            if (coords.top < settings.viewportTopMargin && coords.bottom > windowHeight) {
                return {
                    coords: coords,
                    visibility: "full"
                };
            }

            return {
                coords: coords,
                visibility: ""
            };
        };

        /**
         * main method to be called
         */
        var updateClassList = function() {
            windowHeight = window.outerHeight - settings.viewportBottomMargin;

            var activeSection = "", // the name of the active section
                h = 0; // helper to dectect the most visible section

            for (var i = 0; i < sections.length; i++) {
                var section = sections[i];
                if (!(section && section.getAttribute("id"))) {
                    continue;
                }

                var st = getSectionState(section);
                if (st.visibility !== "") {
                    // sectionis visible
                    if (settings.setOnlyFirstOneActive === true) {
                        // just mark the first visible section
                        activeSection = section.getAttribute("id");
                        break;
                    } else {
                        // determine the most important or visible section
                        // if a section is larger than the viewport (full) or complete visible (inside), set it as active
                        if (st.visibility === "full" || st.visibility === "inside") {
                            activeSection = section.getAttribute("id");
                            break;
                        }

                        // top or bottom: get the visible area of the section and set the most visible one as active
                        if (st.visibility === "bottom") {
                            var sh = st.coords.bottom - settings.viewportTopMargin - st.coords.top - (st.coords.top > 0 ? st.coords.top : -st.coords.top);
                            if (sh > h) {
                                h = sh;
                                activeSection = section.getAttribute("id");
                            }
                        } else if (st.visibility === "top") {
                            var sh = st.coords.height - (st.coords.bottom - windowHeight);
                            if (sh > h) {
                                h = sh;
                                activeSection = section.getAttribute("id");
                            }
                        }
                    }
                }
            }

            // mark active links
            var l = 0;
            links = document.querySelectorAll(settings.linkSelector);
            if (activeSection) {
                for (l; l < links.length; l++) {
                    var hash = links[l].getAttribute("href") ? links[l].getAttribute("href").split("#")[1] : "";
                    if (hash && activeSection === hash) {
                        links[l].classList.add(settings.cssClass);
                    } else {
                        links[l].classList.remove(settings.cssClass);
                    }
                }
            } else {
                for (l; l < links.length; l++) {
                    links[l].classList.remove(settings.cssClass);
                }
            }
        };

        var linkData = [];
        for (var l = 0; l < links.length; l++) {
            var hash = links[l].getAttribute("href") ? links[l].getAttribute("href").split("#")[1] : "";
            if (!hash) {
                continue;
            }
            linkData.push({
                element: links[l],
                hash: hash
            });
        }

        // start the magic
        var t = null,
            t2 = null;
        window.addEventListener(
            "scroll",
            function() {
                // update in a maximum of 50ms interval
                if (t === null) {
                    updateClassList();
                    t = window.setTimeout(function() {
                        t = null;
                    }, 50);
                }

                // also update when scroll is finished
                if (t2) {
                    window.clearTimeout(t2);
                }
                t2 = t = window.setTimeout(updateClassList, 50);
            },
            false
        );

        // update on load
        updateClassList();
    }

    if (typeof define === "function" && define.amd) {
        define(function() {
            return ScrollActiveClasses;
        });
    } else {
        window.ScrollActiveClasses = ScrollActiveClasses;
    }
})(window);
