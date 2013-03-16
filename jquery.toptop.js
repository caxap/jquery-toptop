(function($) {

    var isIE = navigator.appName.indexOf('Microsoft') !== -1;

    var TopTop = function(element, options) {
        this.initialize(element, options);
    }

    TopTop.prototype = {

        constructor: TopTop,

        initialize: function(element, options) {
            var me = this, scroll = $.proxy(this.scroll, this);

            this.$element = $(element);
            this.options = $.extend({}, $.fn.toptop.defaults, options);
            this.scrolling = false;

            this.$element.bind('click.toptop', $.proxy(this.onTop, this)).hide();
            $(window).bind('scroll.toptop,click.toptop,resize.toptop', scroll);
        },

        show: function() {
            this.$element.fadeIn(this.options.fadeSpeed);
        },

        hide: function(force) {
            if (force) {
                this.$element.hide();
            } else {
                this.$element.fadeOut(this.options.fadeSpeed);
            }
        },

        stickify: function(bottomOffset) {
            var stickOffset = this.options.stickOffset
                , bottom = (bottomOffset >= 0)? stickOffset - bottomOffset: stickOffset;

            if (bottom >= 0) {
                this.$element.addClass('toptop-stick');
                this.$element.css('bottom', bottom);
            } else {
                this.unstick();
            }
        },

        unstick: function(resetBottom) {
            resetBottom = (resetBottom == null)? 0: resetBottom;
            this.$element.removeClass('toptop-stick');
            this.$element.css('bottom', resetBottom);
        },

        scroll: function() {
            var o = this.options
                , offset = $(window).scrollTop()
                , height = $(window).height()
                , total = $(document).height();

            if (this.scrolling) return;

            if (isIE) {
                // workflow for IE
                this.$element.css({
                    'position': 'absolute',
                    'top': offset + height - o.ieFixOffset
                });
            }

            if (offset >= o.minOffset) {
                this.show();
                this.stickify(total - (offset + height));
            } else {
                this.hide();
            }
        },

        onTop: function(e) {
            var o = this.options,
                done = $.proxy(function() { this.scrolling = false; }, this);
            e && e.preventDefault();
            if (this.scrolling) return;
            this.scrolling = true;
            this.hide(true);
            this.unstick();
            $('html, body').animate({scrollTop: 0}, o.scrollSpeed, done);
            return false;
        }
    };

    $.fn.toptop = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('toptop'),
                options = typeof option == 'object' && option;
            if (!data) $this.data('toptop', (data = new TopTop(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };

    $.fn.toptop.Constructor = TopTop;

    $.fn.toptop.defaults = {
        minOffset: 300,
        fadeSpeed: 'normal',
        scrollSpeed: 'fast',
        ieFixOffset: 50,
        stickOffset: 0
    };
})(window.jQuery);
