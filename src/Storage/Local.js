(function(window, document) {
    "use strict";

    /**
     * @return {object} this
     */
    function StorageLocal() {
        this.hasStorage = "localStorage" in window && window.localStorage;

        /**
         * stores a value
         * @param {string} storageName
         * @param {mixed} mixedValue
         * @param {number} storageLifetime in seconds
         */
        this.set = function(storageName, mixedValue, storageLifetime) {
            var expirationDate = null;

            // try to set an expiration date when lifetime is set
            if (storageLifetime && typeof storageLifetime === "number") {
                try {
                    expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + storageLifetime * 1000);
                } catch (e) {
                    console.warn("Could not set LocalStorage expiration date! Try to set a very long lifetime.", e.message);
                    expirationDate = new Date("2099-12-31 23:59:59");
                }
            }

            // set an very long expiration date, if there is no date given
            if (!expirationDate) {
                expirationDate = new Date("2099-12-31 23:59:59");
            }

            var useCookie = !this.hasStorage;
            if (!useCookie) {
                try {
                    // store value and expiration date in object
                    var o = {
                        value: mixedValue,
                        expires: expirationDate.toUTCString(),
                        set: 1
                    };
                    localStorage.setItem(storageName, JSON.stringify(o));
                } catch (e) {
                    console.warn("Could not set localStorage! Try to use Cookie instead.", e.message);
                    useCookie = true;
                }
            }

            if (useCookie) {
                document.cookie = storageName + "=" + JSON.stringify(mixedValue) + "; expires=" + expirationDate.toUTCString() + "; path=/";
            }
        };

        /**
         * Finds a stored value
         * @param {string} storageName
         * @return {mixed}
         */
        this.get = function(storageName) {
            var useCookie = !this.hasStorage;

            if (!useCookie) {
                try {
                    // check, if item is set
                    if (localStorage.getItem(storageName) === null) {
                        console.warn("Try to get localStorage with key '" + storageName + "', but no item was set.");
                        return null;
                    }

                    // get the object from storage
                    var obj = JSON.parse(localStorage.getItem(storageName));

                    // check the expiration date
                    if (obj.expires) {
                        var expirationDate = new Date(obj.expires);
                        var now = new Date();
                        if (now.getTime() > expirationDate.getTime()) {
                            return null; // return undefined, if expiration is done
                        }
                    }

                    return obj.value;
                } catch (e) {
                    console.warn("Could not get localStorage! Try to use Cookie instead.", e.message);
                    useCookie = true;
                }
            }

            if (useCookie) {
                var nameEQ = storageName + "=";
                var ca = document.cookie.split(";");
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === " ") {
                        c = c.substring(1, c.length);
                    }
                    if (c.indexOf(nameEQ) === 0) {
                        return JSON.parse(c.substring(nameEQ.length, c.length));
                    }
                }
            }

            return null; // return undefined, if cookie was not found
        };

        return this;
    }

    if (typeof define === "function" && define.amd) {
        define(function() {
            return StorageLocal;
        });
    } else {
        window.StorageLocal = StorageLocal;
    }
})(window, document);
