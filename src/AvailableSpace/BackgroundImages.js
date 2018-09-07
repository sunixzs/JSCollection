/**
 *
 */

(function(window) {
    "use strict";

    function AvailableSpaceBackgroundImages(params) {
        this.settings = {
            querySelector: '[data-available-space-background-image]',
            onInit: null,

            // onImageLoaded() provides two parameters:
            // (1) the loaded imageSet
            // (2) the value of attribute data-onimageloaded
            // to trigger onImageLoaded() the attribute data-onimageloaded must be set - it still can be empty.
            onImageLoaded: null
        };

        // override settings
        if (typeof params === "object") {
            for (var key in params) {
                if (params.hasOwnProperty(key) && typeof this.settings[key] !== "undefined") {
                    this.settings[key] = params[key];
                }
            }
        }

        this.devicePixelRatio = window.devicePixelRatio || 1; // display pixel depth
        this.imageSets = []; // storage for all image stuff
        this.observer = null; // IntersectionObserver
        this.imageCollection = document.querySelectorAll(this.settings.querySelector); // found images
        // start the magick
        this.init();
    }

    AvailableSpaceBackgroundImages.prototype = {
        /**
         * IE/Edge in iframes have a problem to detect, if an image is in viewport.
         */
        isExplorer: function() {
            return document.documentMode || /Edge/.test(navigator.userAgent);
        },

        isInIframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        init: function() {
            var self = this;

            // build images data
            var iNum = 0;
            for (var i = 0; i < this.imageCollection.length; i++) {
                var img = this.imageCollection[i];

                // build source-set
                var sourceSet = [];

                for (var a = 0; a < img.attributes.length; a++) {
                    var ia = img.attributes[a];
                    if (ia.nodeName.indexOf("data-src-") === 0) {
                        var k = parseInt(ia.nodeName.replace("data-src-", ""));
                        if (k) {
                            sourceSet.push({
                                width: k,
                                src: ia.nodeValue
                            });
                        }
                    }
                }

                // sort narrowest image first
                sourceSet.sort(function(a, b) {
                    var r = 0;
                    if (a.width > b.width) {
                        r = 1;
                    } else if (b.width > a.width) {
                        r = -1;
                    }
                    return r;
                });

                // note the key in array for further reference
                img.setAttribute("data-src-num", iNum);

                // add to set
                this.imageSets[iNum] = {
                    sourceSet: sourceSet,
                    image: img,
                    loadingImage: null
                };
                iNum++;
            }

            // init callback?
            if (typeof this.settings.onInit === "function") {
                this.settings.onInit(this);
            }

            // Without observers load all directly
            // or explorer/edge in iframe
            if (!window.IntersectionObserver || (this.isExplorer() && this.isInIframe())) {
                for (var i = 0; i < this.imageSets.length; i++) {
                    this.loadImage(this.imageSets[i].image);
                }
                return;
            }

            // observe each image
            this.observer = new IntersectionObserver(
                function(entries) {
                    for (var i = 0; i < entries.length; i++) {
                        if (entries[i].intersectionRatio > 0) {
                            self.loadImage(entries[i].target);
                        }
                    }
                },
                {
                    root: null,
                    rootMargin: "0px",
                    threshold: [0]
                }
            );

            for (var i = 0; i < this.imageSets.length; i++) {
                this.observer.observe(this.imageSets[i].image);
            }
        },

        /**
         * @param {object} imageSet
         */
        getBestImageSrc: function(imageSet) {
            var targetWidth = imageSet.image.parentNode.clientWidth * this.devicePixelRatio;
            for (var i = 0; i < imageSet.sourceSet.length; i++) {
                if (targetWidth < imageSet.sourceSet[i].width) {
                    return imageSet.sourceSet[i].src;
                }
            }
            return imageSet.sourceSet[imageSet.sourceSet.length - 1].src; // largest src fallback
        },

        /**
         * @param {oject} image
         */
        loadImage: function(image) {
            var n = parseInt(image.getAttribute("data-src-num")),
                is = this.imageSets[n],
                newSrc = this.getBestImageSrc(is),
                self = this;

            if (newSrc !== image.getAttribute("src")) {
                // load new image before setting it
                is.loadingImage = new Image();
                is.loadingImage.setAttribute("src", newSrc);
                is.loadingImage.setAttribute("data-src-num", n);
                is.loadingImage.addEventListener("load", function(evt) {
                    var m = parseInt(evt.target.getAttribute("data-src-num"));
                    if (self.imageSets[m]) {
                        var imgSet = self.imageSets[m];
                        imgSet.image.style.backgroundImage = "url(" + evt.target.getAttribute("src") + ")";

                        // onImageLoaded callback?
                        if (imgSet.image.hasAttribute("data-onimageloaded") && typeof self.settings.onImageLoaded === "function") {
                            self.settings.onImageLoaded(imgSet, imgSet.image.getAttribute("data-onimageloaded"));
                        }
                    }
                });
            }
        }
    };

    if (typeof define === "function" && define.amd) {
        define(function() {
            return AvailableSpaceBackgroundImages;
        });
    } else {
        window.AvailableSpaceBackgroundImages = AvailableSpaceBackgroundImages;
    }
})(window);
