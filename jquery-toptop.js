(function($) {

	var isIE = navigator.appName.indexOf('Microsoft') !== -1;

	var TopTop = function(element, options) {
		this.initialize(element, options);
	}

	TopTop.prototype = {

		constructor: TopTop,

		initialize: function(element, options) {
			this.$element = $(element);
			this.options = $.extend({}, $.fn.toptop.defaults, options);
			this.$element.click($.proxy(this.onTop, this)).hide();
			$(window).scroll($.proxy(this.onScroll, this));
		},

		show: function() {
			this.$element.fadeIn(this.options.fadeSpeed);
		},

		hide: function() {
			this.$element.fadeOut(this.options.fadeSpeed);
		},

		onScroll: function() {
			var o = this.options,
				offset = $(window).scrollTop();

			if (isIE) {
				// workflow for IE
				this.$element.css({
					'position': 'absolute',
					'top': offset + $(window).height() - o.ieOffsetFix
				});
			}

			if (offset >= o.minOffset) {
				this.show();
			} else {
				this.hide();
			}
		},

		onTop: function(e) {
			e && e.preventDefault();
			$('html, body').animate({scrollTop: 0}, this.options.scrollSpeed);
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
		minOffset: 400,
		fadeSpeed: 'normal',
		scrollSpeed: 'normal',
		ieOffsetFix: 50
	};
})(window.jQuery);