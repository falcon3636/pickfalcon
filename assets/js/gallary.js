/* =========================================================
 * bs-gallery.js
 * =========================================================
 * Copyright 2015 Spectrum Inc
 *
 * version 2.0
 * ========================================================= */


(function($) {
    "use strict"

    var bsGallery = function(element, options) {
        this.element = $(element);
        this.gallerymodal = this.element.find(".modal");
        $(document).on("keyup.bsgallery", this.element, $.proxy(this.keyup, this));
        this.initialize();
        this.options = options;
        this.gallerydata = new Array();
        this.gallerysourceurl = options.gallerysourceurl;
        this.galleryidx = -1;
        this.galleryid = "";
        this.galleryname = "";
        this.gallerycount = 0;
        this.preloader = "<i class=\"preloader text-muted fas fa-5x fa-circle-notch fa-spin\"></i>";
        this.thumbpreloader = "<i class=\"preloader text-muted fas fa-5x fa-circle-notch fa-spin\"></i>";
    }

    var galleryitem = function() {
        this.itemid = "";
        this.itemthumb = "";
        this.itemurl = "";
        this.itemtype = "";
        this.itemtitle = "";
        this.itemdescription = "";
        this.itemimagealttext = "";
    };

    function isElementInViewport(el, container) {
        if (el.position().left + el.width() > 0 && el.position().left < container.width()) {
            return true;
        }
        return false;
    }

    bsGallery.prototype = {
        constructor: bsGallery,
        initialize: function() {
            var gallery = this;
            var gallerymodal = this.gallerymodal;

            $(document).on("click", "a[data-bsgallery]", function (evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var galleryid = $(this).attr("data-galleryid");
                var galleryname = $(this).attr("data-bsgallery");
                var $this = this;
                var idx = $('a[data-galleryid="' + galleryid + '"]').index($this);
                gallery.galleryidx = idx;
                gallery.galleryid = galleryid;
                gallery.galleryname = galleryname;

                function callback() {
                    gallery.display(idx);
                    gallery.loadThumbs();
                }

                gallery.loadData(galleryid, callback);
            });

            gallerymodal.find(".btn-prev").on("click", function(evt) {
                evt.preventDefault();
                gallery.prev();
            });

            gallerymodal.find(".btn-next").on("click", function(evt) {
                evt.preventDefault();
                gallery.next();
            });

            $(document).on("click", "a.modal-thumbnail", function(evt) {
                evt.preventDefault();
                var idx = $(this).index();
                gallery.display(idx);
                $("a.modal-thumbnail.active").removeClass("active");
                $(this).addClass("active");
                gallerymodal.find(".modal-dock").collapse('hide');
            });

            gallerymodal.on("hidden.bs.modal", function(event) {
                $("html").removeClass("bs-modal-open");
                $(this).find(".modal-media iframe").remove();
            });

            gallerymodal.find(".modal-dock").on('show.bs.collapse', function() {
                gallerymodal.addClass("modal-overlay");
            });

            gallerymodal.find(".modal-dock").on('shown.bs.collapse', function () {
                gallery.loadVisibleThumbs();
            });

            gallerymodal.find(".modal-dock").on('hidden.bs.collapse', function() {
                gallerymodal.removeClass("modal-overlay");
            });

            $(window).on("resize.bsgallery", function(evt) {
                if ($("html").hasClass("bs-modal-open")) {
                    var modalCanvasWidth = $(".modal-canvas").innerWidth();
                    $(".modal-media").css("width", (modalCanvasWidth * 0.7) + 'px');
                    if ($(window).innerHeight() > $(window).innerWidth()) {
                        $(".modal-col-canvas").css("height", '80%');
                    } else {
                        $(".modal-col-canvas").css("height", '100%');
                    }
                }
            });

            $(".modal-thumbnails").on('scroll', function () {
                gallery.loadVisibleThumbs();
            });

            this.element.attr("tabindex", "1");
        },
        loadData: function(galleryid, callback) {
            var gallery = this;
            if (!gallery.gallerydata[galleryid]) {
                gallery.gallerydata[galleryid] = new Array();
                if (gallery.gallerysourceurl) {
                    $("body").prepend("<div class='preloader-backdrop'><i class='preloader fas fa-5x fa-circle-notch fa-spin'></i>");
                    $.ajax({
                        type: "POST",
                        cache: false,
                        dataType: "json",
                        url: gallery.gallerysourceurl,
                        data: "galleryid=" + galleryid + serializeSecToken(),
                        success: function(data) {
                            $("body").find(".preloader-backdrop").remove();
                            if (data.IsValid) {
                                var galleryitems = data.Data.galleryitems;
                                if (galleryitems) {
                                    $.each(galleryitems, function(i, e) {
                                        var item = new galleryitem();
                                        item.itemid = e.itemid;
                                        item.itemtitle = e.itemtitle;
                                        item.itemdescription = e.itemdescription;
                                        item.itemtype = e.itemtype;
                                        item.itemthumb = e.itemthumb;
                                        item.itemurl = e.itemurl;
                                        item.itemimagealttext = !e.itemimagealttext ? "" : e.itemimagealttext;
                                        gallery.gallerydata[galleryid].push(item);
                                    });
                                }
                                callback();
                            }
                        },
                        error: function(resp) {
                            $("body").find(".preloader-backdrop").remove();
                            alert("Error Loading Gallery");
                        }
                    });
                } else {
                    $("a[data-galleryid='" + galleryid + "']").each(function(i, e) {
                        var item = new galleryitem();
                        item.itemid = $(this).attr("data-itemid");
                        item.itemtitle = $(this).attr("title");
                        item.itemdescription = $(this).attr("data-description");
                        item.itemtype = $(this).attr("data-gallerytype");
                        item.itemthumb = $(this).attr("data-thumb-src");
                        item.itemurl = $(this).attr("href");
                        item.itemimagealttext = $(this).attr("alt");
                        gallery.gallerydata[galleryid].push(item);
                    });
                    callback();
                }
            } else {
                callback();
            }

        },
        prev: function() {
            var galleryid = this.galleryid;
            var idx = parseInt(this.galleryidx);
            var gallerycount = this.gallerydata[galleryid].length;
            if (gallerycount > 1) {
                var newIdx = idx - 1;
                newIdx = (newIdx < 0) ? (gallerycount - 1) : newIdx;
                this.display(newIdx);
            }
        },
        next: function() {
            var galleryid = this.galleryid;
            var idx = parseInt(this.galleryidx);
            var gallerycount = this.gallerydata[galleryid].length;
            if (gallerycount > 1) {
                var newIdx = idx + 1;
                newIdx = (newIdx >= gallerycount) ? 0 : newIdx;
                this.display(newIdx);
            }
        },
        displayModal: function(media, galleryitem) {
            var content = "";
            var gallery = this;
            var gallerymodal = gallery.gallerymodal;
            var galleryname = gallery.galleryname;

            var description = galleryitem.itemdescription;
            var title = galleryitem.itemtitle;
            var itemurl = galleryitem.itemurl;


            if ($.trim(description).length > 0) {
                content += description;
            }

            if ($.trim(title).length > 0) {
                gallerymodal.find(".modal-content .modal-title").show();
            } else {
                gallerymodal.find(".modal-content .modal-title").hide();
            }

            if ($.trim(content).length > 0) {
                gallerymodal.find(".modal-content .modal-caption").show();
            } else {
                gallerymodal.find(".modal-content .modal-caption").hide();
            }

            gallerymodal.find(".gallery-title").text(galleryname);
            gallerymodal.find(".modal-content .modal-title").text(title || String.fromCharCode(160));
            gallerymodal.find(".modal-media").html(media);
            gallerymodal.find(".modal-caption").html(content);
            gallerymodal.find(".original-img-link").attr("href", itemurl);

            var facebookShareUrl = "//www.facebook.com/sharer/sharer.php?s=100&p[url]={0}&p[images][0]={1}&p[title]={2}";
            facebookShareUrl = facebookShareUrl.replace("{0}", encodeURIComponent(document.location.href));
            facebookShareUrl = facebookShareUrl.replace("{1}", encodeURIComponent(itemurl));
            facebookShareUrl = facebookShareUrl.replace("{2}", encodeURIComponent(galleryname));

            var pinterestShareUrl = "//pinterest.com/pin/create/button/?url={0}&media={1}&description={2}";
            pinterestShareUrl = pinterestShareUrl.replace("{0}", encodeURIComponent(document.location.href));
            pinterestShareUrl = pinterestShareUrl.replace("{1}", encodeURIComponent(itemurl));
            pinterestShareUrl = pinterestShareUrl.replace("{2}", encodeURIComponent(galleryname));

            gallerymodal.find(".btn-facebook-share-link").attr("href", facebookShareUrl);
            gallerymodal.find(".btn-pinterest-share-link").attr("href", pinterestShareUrl);

            var galleryimage = gallerymodal.find("img")[0];
            if (!(itemurl.includes('youtube') || itemurl.includes('vimeo'))) {
                var hammer = new Hammer(galleryimage);
                hammer.on('swipeleft', function (e) {
                    gallerymodal.find(".btn-next").trigger("click");
                });
                hammer.on('swiperight', function (e) {
                    gallerymodal.find(".btn-prev").trigger("click");
                });
            }

            setTimeout(function() {
                gallery.show();
            }, 100);
        },
        loadThumbs: function () {
            var gallery = this;
            var thumbContainer = $(".modal-thumbnails");
            if (thumbContainer.attr("data-galleryid") != gallery.galleryid) {
                thumbContainer.children().remove();
                $.each(gallery.gallerydata[gallery.galleryid], function (i, e) {
                    var galleryitem = this;
                    var active = (i == gallery.galleryidx) ? " active" : "";
                    galleryitem.icon = (galleryitem.itemtype == "video") ? "<span class=\"video-icon\"><i class=\"fas fa-play-circle fa-2x\"></i></span>" : "";
                    var thumb = "<a id='thumb-" + i + "' href=\"#\" class=\"modal-thumbnail notloaded" + active + "\">" +
                        gallery.thumbpreloader +
                        "</a>";
                    thumbContainer.append($(thumb).data("galleryitem", galleryitem));
                });
                thumbContainer.attr("data-galleryid", gallery.galleryid);
            }
        },
        loadVisibleThumbs: function() {
            var container = $(".modal-thumbnails");
            $(".modal-thumbnail.notloaded").each(function () {
                var thumb = $(this);
                if (isElementInViewport(thumb, container)) {
                    var galleryitem = thumb.data("galleryitem");
                    $("<img>").attr({ src: galleryitem.itemthumb }).load(function () {
                        thumb.html("<img title='" + galleryitem.itemtitle + "' alt='" + galleryitem.itemimagealttext + "' class=\"img-responsive\" src=\"" + galleryitem.itemthumb + "\" />" + galleryitem.icon);
                    });
                    thumb.removeClass("notloaded").data("galleryitem", null);
                }
            });
        },
        display: function(idx) {
            var mediahelper = "<span class=\"modal-media-helper\"></span>";
            var gallery = this;
            var gallerymodal = gallery.gallerymodal;
            var galleryid = gallery.galleryid;
            idx = parseInt(idx);
            var gallerycount = this.gallerydata[galleryid].length;
            if (gallerycount > 1) {
                gallerymodal.find(".btn-next,.btn-prev").css({ display: "" });
            } else {
                gallerymodal.find(".btn-next,.btn-prev").css({ display: "none" });
            }

            if (idx > -1 && idx <= gallerycount) {
                var galleryitem = gallery.gallerydata[galleryid][idx];
                gallery.galleryidx = idx;
                gallery.gallerycount = gallery.gallerydata[galleryid].length;

                var href = galleryitem.itemurl;
                var title = galleryitem.itemtitle;
                var gallerytype = galleryitem.itemtype;

                $(".media-count .current-count").text((parseInt(gallery.galleryidx) + 1));
                $(".media-count .total-count").text(gallery.gallerycount);

                //PreLoading a Image Before Displaying in Modal
                gallerymodal.find(".modal-media").html(mediahelper + gallery.preloader);

                if (gallerytype == "video") {
                    var media = "<div class='embed-responsive embed-responsive-16by9'><iframe src=\"" + href + "\" height=\"315\" width=\"560\" allowfullscreen=\"\" frameborder=\"0\"></iframe></div>";
                    gallery.displayModal(media, galleryitem);
                    gallerymodal.find(".original-img-link").hide();
                } else {
                    $("<img>").attr({ src: href }).load(function() {
                        var imgWidth = this.width;
                        var imgHeight = this.height;
                        var media = mediahelper + "<img class=\"img-responsive\" alt=\"" + galleryitem.itemimagealttext + "\" title=\"" + title + "\" src=\"" + href + "\" data-src-width='" + imgWidth + "' data-src-height='" + imgHeight + "' />";
                        gallery.displayModal(media, galleryitem);
                        gallerymodal.find(".original-img-link").show();
                    });
                }

            }
        },
        show: function() {
            $("html").addClass("bs-modal-open");
            this.gallerymodal.modal("show");
            $(window).resize();
        },
        hide: function() {
            this.gallerymodal.modal('hide');
        },
        keyup: function(evt) {
            if (evt.keyCode == 37) {
                this.prev();
            } else if (evt.keyCode == 39) {
                this.next();
            }
        }
    }

    $.fn.bsgallery = function(option, val) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('bsgallery'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('bsgallery', (data = new bsGallery(this, $.extend({}, $.fn.bsgallery.defaults, options))));
            }
            if (typeof option === 'string') data[option](val);
        });
    }

    $.fn.bsgallery.defaults = {

    };

    $.fn.bsgallery.Constructor = bsGallery;


}(window.jQuery));
