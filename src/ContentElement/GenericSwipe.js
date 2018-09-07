/**
 * A content element to provide the swipe-functionality
 * 
 * Default Markup:
 * <div class="ce-generic-swipe" id="c1234">
 *      <div class="contentelements-wrap">
 *          <div class="contentelements">
 *              <div class="contentelement"></div>
 *              <div class="contentelement"></div>
 *              <div class="contentelement"></div>
 *          </div>
 *      </div>
 * </div>
 * <script>
 * GenericSwipe(document.querySelector("#c1234"), {
 *      wrapper: {string} query-selector or {object} dom-element,
 *      contentelementWrapper: {string} query-selector or {object} dom-element,
 *      contentelements: {string} query-selector or {object} dom-elements,
 *      large: {
 *          columns: {number},
 *          arrowNavigation: {boolean},
 *          min: {number},
 *          max: {number}
 *      },
        middle: {
 *          columns: {number},
 *          arrowNavigation: {boolean},
 *          min: {number},
 *          max: {number}
 *      },
        small: {
 *          columns: {number},
 *          arrowNavigation: {boolean},
 *          min: {number},
 *          max: {number}
 *      }
 * });
 * </script>
 * 
 * @param {object} container HTML-Dom-Element
 * @param {object} params
 */

define(["JSCollection/Dom/Element", "Dragdealer"], function(DomElement, Dragdealer) {
    "use strict";

    function GenericSwipe(container, params) {
        if (typeof container !== "object") {
            console.warn("ERROR: missing param", this, container);
        }
        var _container = container;
        var _params = typeof params === "object" ? params : {};
        var _state = {
            device: "",
            width: 0,
            columns: 0,
            arrowNavigation: true
        };
        var _dragdealer = null;
        var _wrapper = null;
        var _contentelementWrapper = null;
        var _contentelements = null;
        var _queries = {
            large: {
                columns: 3,
                arrowNavigation: true,
                min: 800,
                max: 10000
            },
            middle: {
                columns: 2,
                arrowNavigation: true,
                min: 481,
                max: 799
            },
            small: {
                columns: 1,
                arrowNavigation: true,
                min: 0,
                max: 480
            }
        };

        // try to set parameters from _params
        var _defineDomElementParam = function(key, containerElement, defaultSelector, singleElement) {
            if (typeof _params[key] === "object") {
                return _params[key];
            } else if (typeof _params[key] === "string") {
                return singleElement ? containerElement.querySelector(_params[key]) : containerElement.querySelectorAll(_params[key]);
            } else {
                return singleElement ? containerElement.querySelector(defaultSelector) : containerElement.querySelectorAll(defaultSelector);
            }
        };

        var _defineQueryParam = function(device, key, type) {
            var value = undefined;
            if (type === "number" && _params[device] && typeof _params[device][key] !== undefined && typeof _params[device][key] === "number") {
                value = parseInt(_params[device][key]);
            } else if (type === "boolean") {
                if (_params[device] && _params[device][key] && typeof _params[device][key] === "boolean") {
                    value = _params[device][key];
                } else if (_params[device] && _params[device][key] && typeof _params[device][key] === "number") {
                    value = _params[device][key] === 1 ? true : false;
                }
            }

            if (typeof value !== "undefined") {
                _queries[device][key] = value;
            }
        };

        // try to define dom-elements
        _wrapper = _defineDomElementParam("wrapper", _container, ".contentelements-wrap", true);
        _contentelementWrapper = _defineDomElementParam("contentelementWrapper", _wrapper, ".contentelements", true);
        _contentelements = _defineDomElementParam("contentelements", _contentelementWrapper, ".contentelements > .contentelement", false);

        // try to set the device stuff
        for (var device in _queries) {
            if (_queries.hasOwnProperty(device)) {
                _defineQueryParam(device, "columns", "number");
                _defineQueryParam(device, "min", "number");
                _defineQueryParam(device, "max", "number");
                _defineQueryParam(device, "arrowNavigation", "boolean");
            }
        }

        if (_contentelements.length === 0) {
            return;
        }

        _dragdealer = new Dragdealer(_wrapper, {
            handleClass: "contentelements",
            vertical: false,
            callback: function() {
                _handleButtons();
            }
        });

        // create buttons
        var _btnLeft = new DomElement();
        _btnLeft.setType("button-left", {
            onclick: function(evt) {
                var x = _dragdealer.getValue()[0];
                var w = _state.columns === 0 ? _wrapper.clientWidth / (_getTotalWidth() - _wrapper.clientWidth) : _state.columns / (_contentelements.length - _state.columns);
                _dragdealer.setValue(x - w > 0 ? x - w : 0);
            },
            appendTo: _container
        });

        var _btnRight = new DomElement();
        _btnRight.setType("button-right", {
            onclick: function(evt) {
                var x = _dragdealer.getValue()[0];
                var w = _state.columns === 0 ? _wrapper.clientWidth / (_getTotalWidth() - _wrapper.clientWidth) : _state.columns / (_contentelements.length - _state.columns);
                _dragdealer.setValue(x + w < 1 ? x + w : 1);
            },
            appendTo: _container
        });

        /**
         * Sets the visibility of the buttons
         */
        var _handleButtons = function() {
            if (!_state.arrowNavigation || _contentelements.length <= _state.columns) {
                _btnLeft.hide();
                _btnRight.hide();
                return;
            }

            var x = _dragdealer.getValue()[0];
            if (x > 0) {
                _btnLeft.show();
            } else {
                _btnLeft.hide();
            }

            if (x < 1) {
                _btnRight.show();
            } else {
                _btnRight.hide();
            }
        };

        /**
         * Sets the min-height of wrap to make contentelements equalHeight
         */
        var setMinHeightTimer = null;
        var _setMinHeight = function() {
            // recalculate the min-height after some time.
            if (setMinHeightTimer) {
                clearTimeout(setMinHeightTimer);
            }
            setMinHeightTimer = setTimeout(function() {
                _setMinHeight();
            }, 100);

            // Get the heighest contentelement and set min-height to ddWrapper.
            // Inner elements, the handle and contentelements, inherit it with css.
            _wrapper.style.minHeight = "0px";
            var minHeight = 0;
            for (var c = 0; c < _contentelements.length; c++) {
                if (_contentelements[c].clientHeight > minHeight) {
                    minHeight = _contentelements[c].clientHeight;
                }
            }
            _wrapper.style.minHeight = minHeight + "px";
        };

        /**
         *
         */
        var _getTotalWidth = function() {
            var w = 0;
            for (var c = 0; c < _contentelements.length; c++) {
                _contentelements[c].style.width = "auto";
                w += _contentelements[c].offsetWidth;
            }
            return w;
        };

        /**
         *
         */
        var _setBehaviour = function() {
            var w = _container.clientWidth;
            if (w === _state.width) {
                return;
            }
            _state.width = w;

            // determine device
            var newDevice = "";
            for (var device in _queries) {
                if (_queries.hasOwnProperty(device)) {
                    var c = _queries[device];
                    if (w >= c.min && w <= c.max) {
                        newDevice = device;
                        break;
                    }
                }
            }

            // regenerate on a new device
            if (newDevice !== _state.device) {
                _state.device = newDevice;
                var c = _queries[_state.device];
                _state.columns = c.columns;
                _state.arrowNavigation = c.arrowNavigation;

                if (_state.columns === 0) {
                    // there are no columnes. make the elements as wide as they are
                    // we have to wait some time bc clientWidth is 0
                    setTimeout(function() {
                        _contentelementWrapper.style.width = _getTotalWidth() + "px";
                        _dragdealer.reflow();
                        _handleButtons();
                        _setMinHeight();
                    }, 1000);
                } else {
                    // the elements should have columne character
                    var percentCEWidth = 100;
                    var widthFix = 0;
                    if (!_state.arrowNavigation) {
                        switch (_state.columns) {
                            case 6:
                                percentCEWidth = 98;
                                break;
                            case 5:
                                percentCEWidth = 98;
                                break;
                            case 4:
                                percentCEWidth = 98;
                                break;
                            case 3:
                                percentCEWidth = 97;
                                break;
                            case 2:
                                percentCEWidth = 96;
                                break;
                            case 1:
                                percentCEWidth = 90;
                                break;
                        }
                        widthFix = Math.abs((_state.columns * _contentelements.length) / 100);
                    }

                    _contentelementWrapper.setAttribute("style", "width:" + (_contentelements.length * percentCEWidth) / _state.columns + "%;");
                    for (var c = 0; c < _contentelements.length; c++) {
                        _contentelements[c].setAttribute("style", "width:" + (100 - widthFix) / _contentelements.length + "%;");
                    }

                    _dragdealer.reflow();
                    _handleButtons();
                    _setMinHeight();
                }
            }
        };

        _setBehaviour();

        var t = null;
        window.addEventListener("resize", function() {
            t = setTimeout(function() {
                _setBehaviour();
            }, 50);
        });
    }

    return GenericSwipe;
});
