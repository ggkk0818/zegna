(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var ImageZoom = function (settings, e) {
        this.settings = settings;
        this.element = e;
        this.$container = $(this.settings.container);
        this.initElement();
    };
    ImageZoom.prototype.initElement = function () {
        if (this.$container.find("> .imagezoom").length == 0)
            this.$container.append(this.settings.template);
        this.$element = this.$container.find("> .imagezoom");
        this.$imgZoomCtn = this.$element.find("> .imagezoom-container");
        this.$image = this.$imgZoomCtn.find("> .image");
    };
    ImageZoom.prototype.initHandler = function () {
        var thiz = this;
        this.$element.unbind().bind("click", function () {
            thiz.hide();
        });
        this.$imgZoomCtn.find("> .arrow-left").unbind().bind("click", function (e) {
            if (thiz.element) {
                $(thiz.element).trigger("prev", thiz);
            }
            else if (typeof thiz.settings.onPrev === "function")
                thiz.settings.onPrev.call(thiz);
            //取消冒泡
            e.stopPropagation();
        });
        this.$imgZoomCtn.find("> .arrow-right").unbind().bind("click", function (e) {
            if (thiz.element) {
                $(thiz.element).trigger("next", thiz);
            }
            else if (typeof thiz.settings.onNext === "function")
                thiz.settings.onNext.call(thiz);
            //取消冒泡
            e.stopPropagation();
        });
        this.$image.find(".text").unbind().bind("click", function (e) {
            //取消冒泡
            e.stopPropagation();
        });
        $(window).scroll(function () {
            thiz.$imgZoomCtn.css({ top: $(window).scrollTop() });
        });
        $(window).resize(function () {
            if (thiz.$element.hasClass("active") && thiz.$image.children().length > 0) {
                if (thiz.$element.hasClass("loading"))
                    thiz.$element.data("isdirty", true);
                else {
                    thiz.$element.data("isdirty", false);
                    var imgWidth = thiz.$image.children("img").data("imgWidth"),
                        imgHeight = thiz.$image.children("img").data("imgHeight");
                    var size = thiz.calcSize(imgWidth, imgHeight);
                    thiz.$image.width(size.width).height(size.height());
                }
            }
        });
        if ($.fn.mousewheel && this.settings.enableMousewheel) {
            this.$element.unmousewheel().mousewheel(function (e, delta) {
                if (delta < 0)
                    thiz.$imgZoomCtn.find("> .arrow-right").click();
                else if (delta > 0)
                    thiz.$imgZoomCtn.find("> .arrow-left").click();
                e.preventDefault();
            });
        }
    };
    ImageZoom.prototype.calcSize = function (imgWidth, imgHeight) {
        var maxWidth = this.$element.width() - this.settings.imgPadding * 2,
            maxHeight = $(window).height() - $("body > .header").height() - this.settings.imgPadding * 2,
            scaleH = imgWidth / maxWidth,
            scaleV = imgHeight / maxHeight,
            width = imgWidth,
            height = imgHeight;
        if (scaleH >= scaleV) {
            width = maxWidth;
            height = imgHeight / imgWidth * maxWidth;
        }
        else if (scaleV > scaleH) {
            width = imgWidth / imgHeight * maxHeight;
            height = maxHeight;
        }
        return { width: Math.round(width), height: Math.round(height) };
    };
    ImageZoom.prototype.show = function (arg) {
        if (this.$element.hasClass("loading"))
            return;
        else
            this.$element.addClass("loading");
        this.initHandler();
        var src, title, desc;
        if (typeof arg === "string")
            src = arg;
        else if (typeof arg === "object") {
            src = arg.src;
            title = arg.title;
            desc = arg.desc;
        }
        var thiz = this;
        if (src) {
            thiz.$image.stop(true, false).addClass("loading");
            if (!thiz.$element.hasClass("active")) {
                thiz.$image.children("img").remove();
                thiz.$imgZoomCtn.css({ top: $(window).scrollTop() });
            }
            $("<img />").load(function () {
                var imgWidth = Math.max($(this).width(), this.width),
                    imgHeight = Math.max($(this).height(), this.height),
                    size = thiz.calcSize(imgWidth, imgHeight);
                $(this).data("imgWidth", imgWidth).data("imgHeight", imgHeight);
                thiz.$image.removeClass("loading").animate({
                    width: size.width,
                    height: size.height
                });
                if (thiz.$image.children("img").length > 0 && thiz.$element.hasClass("active")) {
                    //浮层已经显示，替换原有图片
                    var img = $(this);
                    thiz.$image.children("img").first().fadeOut("normal", thiz.settings.easing, function () {
                        var old = $(this).hide().before(img);
                        img.fadeOut(0).fadeIn("normal", thiz.settings.easing, function () {
                            //动画结束删除旧图片防止chrome闪动
                            old.remove();
                            //动画过程中调整窗口大小，动画结束后重设图片宽度
                            if (thiz.$element.data("isdirty")) {
                                thiz.$element.data("isdirty", false);
                                var size = thiz.calcSize(imgWidth, imgHeight);
                                thiz.$image.width(size.width).height(size.height);
                            }
                            thiz.$element.removeClass("loading");
                        });
                    }).addClass("removing");
                    if (title || desc) {
                        thiz.$image.children(".text").fadeOut("normal", thiz.settings.easing, function () {
                            $(this).children("h3").text(title ? title : "");
                            $(this).children("p").text(desc ? desc : "");
                            $(this).fadeIn("normal", thiz.settings.easing);
                        });
                    }
                }
                else {
                    //浮层还未显示
                    $(this).appendTo(thiz.$image.children("img").remove().end()).hide().fadeIn("normal", thiz.settings.easing, function () {
                        //动画过程中调整窗口大小，动画结束后重设图片宽度
                        if (thiz.$element.data("isdirty")) {
                            thiz.$element.data("isdirty", false);
                            var size = thiz.calcSize(imgWidth, imgHeight);
                            thiz.$image.width(size.width).height(size.height);
                        }
                        thiz.$element.removeClass("loading");
                    });
                    if (title || desc) {
                        thiz.$image.children(".text").children("h3").text(title ? title : "");
                        thiz.$image.children(".text").children("p").text(desc ? desc : "");
                        thiz.$image.children(".text").stop(true, false).hide().fadeIn("normal", thiz.settings.easing);
                    }
                }
            }).attr("src", src);
        }
        else {
            this.$element.removeClass("loading");
        }
        if (!this.$element.hasClass("active")) {
            this.$element.stop(true, false).addClass("active").fadeIn("normal", this.settings.easing);
        }
    };
    ImageZoom.prototype.hide = function () {
        this.$element.removeClass("active loading").fadeOut("normal", this.settings.easing, function () { $(this).hide(); });
    };
    $.fn.imageZoom = function (settings) {
        settings = $.extend({}, $.fn.imageZoom.defaults, settings);
        return this.each(
            function () {
                var elem = $(this), imgZoom = elem.data('imgZoom');
                if (!imgZoom) {
                    imgZoom = new ImageZoom(settings, elem);
                    elem.data('imgZoom', imgZoom);
                }
            }
        );
    };
    $.fn.imageZoom.defaults = {
        template: '<div class="imagezoom"><div class="imagezoom-container"><div class="image"><div class="text"><h3></h3><p></p></div></div><a href="javascript:void(0);" class="arrow-left"></a><a href="javascript:void(0);" class="arrow-right"></a>',
        container: "body",
        showNext: true,
        showPrev: true,
        enableMousewheel: true,
        easing: "easeInOutCubic",
        imgPadding: 0
    };
}));
