define(function() {
    "use strict";

    /**
     * Small class for simple DIV-elements
     */
    function DomElement(node) {
        var settings = {
            svg: {
                arrowRight:
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.5876 320.1"><path d="M199.55,177.05l-136,136a23.901,23.901,0,0,1-33.9,0l-22.6-22.6a23.901,23.901,0,0,1,0-33.9l96.4-96.4L7.05,63.75a23.901,23.901,0,0,1,0-33.9l22.5-22.8a23.901,23.901,0,0,1,33.9,0l136,136A23.932,23.932,0,0,1,199.55,177.05Z"/></svg>',
                arrowLeft:
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.5876 320.1"><path d="M7.0375,143.05l136-136a23.901,23.901,0,0,1,33.9,0l22.6,22.6a23.901,23.901,0,0,1,0,33.9l-96.4,96.4,96.4,96.4a23.901,23.901,0,0,1,0,33.9l-22.5,22.8a23.9009,23.9009,0,0,1-33.9,0l-136-136A23.9321,23.9321,0,0,1,7.0375,143.05Z"/></svg>',
                spinner:
                    '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="28" cy="75" r="11" fill="#c31514"><animate attributeName="fill-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="2" begin="0s" repeatCount="indefinite"></animate></circle><path d="M28 47A28 28 0 0 1 56 75" fill="none" stroke-width="10" stroke="#c31514"><animate attributeName="stroke-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="2" begin="0.2s" repeatCount="indefinite"></animate></path><path d="M28 25A50 50 0 0 1 78 75" fill="none" stroke-width="10" stroke="#c31514"><animate attributeName="stroke-opacity" calcMode="linear" values="0;1;1" keyTimes="0;0.2;1" dur="2" begin="0.4s" repeatCount="indefinite"></animate></path></svg>'
            },
            classes: {
                btnLeft: "jsc-button-left",
                btnRight: "jsc-button-right",
                btnIcon: "jsc-button-icon",
                spinner: "jsc-spinner-icon"
            }
        };
        if (typeof DomElementSettings === "object") {
            settings = DomElementSettings;
        }

        // create element
        this.elem = null;
        if (typeof node === "object") {
            this.elem = node;
        } else if (typeof node === "string") {
            this.elem = document.createElement(node);
        } else {
            this.elem = document.createElement("DIV");
        }

        if (!this.elem) {
            console.warn("could not create DomElement()");
            return;
        }

        /**
         * Shortcut to set an attribute.
         * @param {string} attr
         * @param {string} val
         */
        this.attr = function(attr, val) {
            this.elem.setAttribute(attr, val);
            return this;
        };

        /**
         * Shortcut to add ONE class to the class-attribute.
         * @param {string} cls
         */
        this.addClass = function(cls) {
            this.elem.classList.add(cls);
            return this;
        };

        /**
         * Shortcut to remove ONE class from the class-attribute.
         * @param {string} cls
         */
        this.removeClass = function(cls) {
            this.elem.classList.remove(cls);
            return this;
        };

        /**
         * Appends the element to another element
         * @param {object} elem
         */
        this.appendTo = function(elem) {
            elem.appendChild(this.elem);
            return this;
        };

        /**
         * Shows the element.
         */
        this.show = function() {
            this.elem.style.display = "block";
            return this;
        };

        /**
         * Hides the element.
         */
        this.hide = function() {
            this.elem.style.display = "none";
            return this;
        };

        /**
         * Sets innerHTML
         * @param {string} html
         */
        this.html = function(html) {
            this.elem.innerHTML = html;
            return this;
        };

        /**
         * Adds an click eventHandler.
         * @param {function} cb
         */
        this.onclick = function(cb) {
            this.elem.addEventListener(
                "click",
                function(evt) {
                    cb(evt);
                },
                "false"
            );
            return this;
        };

        /**
         * Sets predefined stuff to the element.
         * @param {string} type
         * @param {object} params
         * @returns {object}
         */
        this.setType = function(type, params) {
            if (type === "button-left") {
                this.addClass(settings.classes.btnLeft);
                var icon = new DomElement();
                icon.html(settings.svg.arrowLeft)
                    .attr("class", settings.classes.btnIcon)
                    .appendTo(this.elem);
            }

            if (type === "button-right") {
                this.addClass(settings.classes.btnRight);
                var icon = new DomElement();
                icon.html(settings.svg.arrowRight)
                    .attr("class", settings.classes.btnIcon)
                    .appendTo(this.elem);
            }

            if (type === "spinner") {
                var icon = new DomElement();
                icon.html(settings.svg.spinner)
                    .attr("class", settings.classes.spinner)
                    .appendTo(this.elem);
            }

            if (params.onclick && typeof params.onclick === "function") {
                this.onclick(params.onclick);
            }

            if (params.appendTo && typeof params.appendTo === "object") {
                this.appendTo(params.appendTo);
            }

            return this;
        };
        return this;
    }

    return DomElement;
});
