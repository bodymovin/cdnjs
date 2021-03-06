'use strict';

/*
 * SlickLightbox documentation #

Documentation generated by [CoffeeDoc](http://github.com/omarkhan/coffeedoc)
 */
var SlickLightbox, defaults;

SlickLightbox = (function() {

  /*
  	The one and only class used.
   */
  function SlickLightbox(element, options) {
    var that;
    this.options = options;

    /* Binds the plugin. */
    this.element = $(element);
    this.didInit = false;
    that = this;
    this.element.on('click.slickLightbox', this.options.itemSelector, function(e) {
      e.preventDefault();
      return that.init(that.element.find(that.options.itemSelector).index($(this)));
    });
  }

  SlickLightbox.prototype.init = function(index) {

    /* Creates the lightbox, opens it, binds events and calls `slick`. Accepts `index` of the element, that triggered it (so that we know, on which slide to start slick). */
    this.didInit = true;
    this.createModal(index);
    this.bindEvents();
    this.initSlick();
    return this.open();
  };

  SlickLightbox.prototype.createModalItems = function(index) {
    var a, createItem, links;
    if (this.options.images) {
      links = $.map(this.options.images, function(img) {
        return "<div class=\"slick-lightbox-slick-item\"><div class=\"slick-lightbox-slick-item-inner\"><img class=\"slick-lightbox-slick-img\" src=\"" + img + "\" /></div></div>";
      });
    } else {
      createItem = (function(_this) {
        return function(el) {
          var caption;
          caption = _this.getElementCaption(el);
          return "<div class=\"slick-lightbox-slick-item\"><div class=\"slick-lightbox-slick-item-inner\"><img class=\"slick-lightbox-slick-img\" src=\"" + el.href + "\" />" + caption + "</div></div>";
        };
      })(this);
      a = this.element.find(this.options.itemSelector);
      if (index === 0 || index === -1) {
        links = $.map(a, createItem);
      } else {
        links = $.map(a.slice(index), createItem);
        $.each(a.slice(0, index), function(i, el) {
          return links.push(createItem(el));
        });
      }
    }
    return links;
  };

  SlickLightbox.prototype.createModal = function(index) {

    /* Creates a `slick`-friendly modal. Rearranges the items so that the `index`-th item is placed first. */
    var html, links;
    links = this.createModalItems(index);
    html = "<div class=\"slick-lightbox slick-hide-init\" style=\"background: " + this.options.background + ";\">\n	<div class=\"slick-lightbox-inner\">\n		<div class=\"slick-lightbox-slick slick-caption-" + this.options.captionPosition + "\">" + (links.join('')) + "</div>\n		<button type=\"button\" class=\"slick-lightbox-close\"></button>\n	<div>\n<div>";
    this.modalElement = $(html);
    return $('body').append(this.modalElement);
  };

  SlickLightbox.prototype.initSlick = function(index) {

    /* Runs slick by default, using `options.slick` if provided. If `options.slick` is a function, it gets fired instead of us initializing slick. */
    if (this.options.slick != null) {
      if (typeof this.options.slick === 'function') {
        this.options.slick(this.modalElement);
      } else {
        this.slick = this.modalElement.find('.slick-lightbox-slick').slick(this.options.slick);
      }
    } else {
      this.slick = this.modalElement.find('.slick-lightbox-slick').slick();
    }
    return this.modalElement.trigger('init.slickLightbox');
  };

  SlickLightbox.prototype.open = function() {

    /* Opens the lightbox. */
    return this.modalElement.removeClass('slick-hide-init');
  };

  SlickLightbox.prototype.close = function() {

    /* Closes the lightbox and destroys it, maintaining the original element bindings. */
    this.modalElement.addClass('slick-hide');
    return this.destroy();
  };

  SlickLightbox.prototype.bindEvents = function() {

    /* Binds global events. */
    var resizeSlides;
    resizeSlides = (function(_this) {
      return function() {
        var h;
        h = _this.modalElement.find('.slick-lightbox-inner').height();
        _this.modalElement.find('.slick-lightbox-slick-item').height(h);
        return _this.modalElement.find('.slick-lightbox-slick-img').css('max-height', Math.round(0.9 * h));
      };
    })(this);
    $(window).on('orientationchange.slickLightbox resize.slickLightbox', resizeSlides);
    this.modalElement.on('init.slickLightbox', resizeSlides);
    this.modalElement.on('destroy.slickLightbox', (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
    this.modalElement.on('click.slickLightbox touchstart.slickLightbox', '.slick-lightbox-close', (function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.close();
      };
    })(this));
    if (this.options.closeOnEscape || this.options.navigateByKeyboard) {
      return $(document).on('keydown.slickLightbox', (function(_this) {
        return function(e) {
          var code;
          code = e.keyCode ? e.keyCode : e.which;
          if (_this.options.navigateByKeyboard) {
            if (code === 37) {
              _this.slideSlick('left');
            } else if (code === 39) {
              _this.slideSlick('right');
            }
          }
          if (_this.options.closeOnEscape) {
            if (code === 27) {
              return _this.close();
            }
          }
        };
      })(this));
    }
  };

  SlickLightbox.prototype.slideSlick = function(direction) {
    if (direction === 'left') {
      return this.slick.slickPrev();
    } else {
      return this.slick.slickNext();
    }
  };

  SlickLightbox.prototype.getElementCaption = function(el) {
    var c;
    if (!this.options.caption) {
      return '';
    }
    c = (function() {
      switch (typeof this.options.caption) {
        case 'function':
          return this.options.caption(el);
        case 'string':
          return $(el).data(this.options.caption);
      }
    }).call(this);
    return "<span class=\"slick-lightbox-slick-caption\">" + c + "</span>";
  };

  SlickLightbox.prototype.unbindEvents = function() {

    /* Unbinds global events. */
    $(window).off('.slickLightbox');
    $(document).off('.slickLightbox');
    return this.modalElement.off('.slickLightbox');
  };

  SlickLightbox.prototype.destroy = function(unbindAnchors) {
    if (unbindAnchors == null) {
      unbindAnchors = false;
    }

    /* Destroys the lightbox and unbinds global events. If `true` is passed as an argument, unbinds the original element as well. */
    if (this.didInit) {
      this.unbindEvents();
      setTimeout(((function(_this) {
        return function() {
          return _this.modalElement.remove();
        };
      })(this)), this.options.destroyTimeout);
    }
    if (unbindAnchors) {
      return this.element.off('.slickLightbox', this.options.itemSelector);
    }
  };

  SlickLightbox.prototype.destroyPrevious = function() {

    /* Destroys lightboxes currently in DOM. */
    return $('body').children('.slick-lightbox').trigger('destroy.slickLightbox');
  };

  return SlickLightbox;

})();

defaults = {
  background: 'rgba(0,0,0,.8)',
  closeOnEscape: true,
  destroyTimeout: 500,
  itemSelector: 'a',
  navigateByKeyboard: true,
  caption: false,
  captionPosition: 'dynamic',
  images: false,
  slick: {}
};

$.fn.slickLightbox = function(options) {
  options = $.extend({}, defaults, options);
  return this.slickLightbox = new SlickLightbox(this, options);
};

$.fn.unslickLightbox = function() {
  return this.slickLightbox.destroy(true);
};
