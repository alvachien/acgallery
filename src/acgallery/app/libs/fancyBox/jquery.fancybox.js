/*!
 * fancyBox - jQuery Plugin
 * version: 3.0.0 Beta 1 (Tue, 29 Jan 2013)
 * @requires jQuery v1.7 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2013 Janis Skarnelis - janis@fancyapps.com
 *
 */

(function (window, document, $, undefined) {
	"use strict";

	var W  = $(window),
		D  = $(document),
		H  = $('html');

	var F = $.fancybox = function () {
		F.open.apply( this, arguments );
	};

	var isTouch = F.isTouch = (document.createTouch !== undefined || window.ontouchstart !== undefined);

	var isQuery = function(object) {
		return object && object.hasOwnProperty && object instanceof $;
	};

	var isString = function(str) {
		return str && $.type(str) === "string";
	};

	var isPercentage = function(str) {
		return isString(str) && str.indexOf('%') > 0;
	};

	var getScalar = function(orig, dim) {
		var value = parseFloat(orig, 10) || 0;

		if (dim && isPercentage(orig)) {
			value = F.getViewport()[ dim ] / 100 * value;
		}

		return Math.ceil(value);
	};

	var getValue = function(value, dim) {
		return getScalar(value, dim) + 'px';
	};

	var getTime = Date.now || function() {
		return +new Date;
	};

	var removeWrap = function(what) {
		var el = isString(what) ? $(what) : what;

		if (el && el.length) {
			el.removeClass('fancybox-wrap').stop(true).trigger('onReset').hide().unbind();

			try {
				el.find('iframe').unbind().attr('src', isTouch ? '' : '//about:blank');

				// Give the document in the iframe to get a chance to unload properly before remove
				setTimeout(function () {
					el.empty().remove();

					// Remove the lock if there are no elements
					if (F.lock && !F.coming && !F.current) {
						var scrollV, scrollH;

						$('.fancybox-margin').removeClass('fancybox-margin');

						scrollV = W.scrollTop();
						scrollH = W.scrollLeft();

						H.removeClass('fancybox-lock');

						F.lock.remove();

						F.lock = null;

						W.scrollTop( scrollV ).scrollLeft( scrollH );
					}
				}, 150);

			} catch(e) {}
		}
	};

	$.extend(F, {
		// The current version of fancyBox
		version: '3.0.0',

		defaults: {
			theme     : 'default',          // 'default', dark', 'light'
			padding   : 15,					// space inside box, around content
			margin    : [30, 55, 30, 55],	// space between viewport and the box
			loop      : true,               // Continuous gallery item loop

			arrows    : true,
			closeBtn  : true,
			expander  : !isTouch,

			caption : {
				type     : 'outside'	// 'float', 'inside', 'outside' or 'over',
			},

			overlay : {
				closeClick : true,      // if true, fancyBox will be closed when user clicks on the overlay
				speedIn    : 0,         // duration of fadeIn animation
				speedOut   : 250,       // duration of fadeOut animation
				showEarly  : true,      // indicates if should be opened immediately or wait until the content is ready
				css        : {}			// custom CSS properties
			},

			helpers : {},				// list of enabled helpers

			// Dimensions
			width       : 800,
			height      : 450,
			minWidth    : 100,
			minHeight   : 100,
			maxWidth    : 99999,
			maxHeight   : 99999,
			aspectRatio : false,
			fitToView   : true,

			autoHeight  : true,
			autoWidth   : true,
			autoResize  : true,

			// Location
			autoCenter  : !isTouch,
			topRatio    : 0.5,
			leftRatio   : 0.5,

			// Opening animation
			openEffect  : 'elastic',		// 'elastic', 'fade', 'drop' or 'none'
			openSpeed   : 350,
			openEasing  : 'easeOutQuad',

			// Closing animation
			closeEffect : 'elastic',		// 'elastic', 'fade', 'drop' or 'none'
			closeSpeed  : 350,
			closeEasing : 'easeOutQuad',

			// Animation for next gallery item
			nextEffect : 'elastic',		// 'elastic', 'fade', 'drop' or 'none'
			nextSpeed  : 350,
			nextEasing : 'easeOutQuad',

			// Animation for previous gallery item
			prevEffect : 'elastic',		// 'elastic', 'fade', 'drop' or 'none'
			prevSpeed  : 350,
			prevEasing : 'easeOutQuad',

			// Slideshow
			autoPlay   : false,
			playSpeed  : 3000,

			/*
				Advanced
			*/

			// Callbacks
			onCancel     : $.noop, // If canceling
			beforeLoad   : $.noop, // Before loading
			afterLoad    : $.noop, // After loading
			beforeShow   : $.noop, // Before changing in current item
			afterShow    : $.noop, // After opening
			beforeClose  : $.noop, // Before closing
			afterClose   : $.noop,  // After closing

			// Properties specific to content type
			ajax  : {
				dataType : 'html',
				headers  : { 'X-fancyBox': true }
			},

			iframe : {
				scrolling : 'auto',
				preload   : true
			},

			swf : {
				wmode             : 'transparent',
				allowfullscreen   : 'true',
				allowscriptaccess : 'always'
			},

			// Default keyboard
			keys  : {
				next : {
					13 : 'left', // enter
					34 : 'up',   // page down
					39 : 'left', // right arrow
					40 : 'up'    // down arrow
				},
				prev : {
					8  : 'right',  // backspace
					33 : 'down',   // page up
					37 : 'right',  // left arrow
					38 : 'down'    // up arrow
				},
				close  : [27], // escape key
				play   : [32], // space - start/stop slideshow
				toggle : [70]  // letter "f" - toggle fullscreen
			},

			// Default direction
			direction : {
				next : 'left',
				prev : 'right'
			},

			// HTML templates
			tpl: {
				wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-inner"></div></div>',
				iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true"></iframe>',
				error    : '<p class="fancybox-error">{{ERROR}}</p>',
				closeBtn : '<a title="{{CLOSE}}" class="fancybox-close" href="javascript:;"></a>',
				next     : '<a title="{{NEXT}}" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
				prev     : '<a title="{{PREV}}" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
			},

			// Localization
			locale  : 'en',
			locales : {
				'en' : {
					CLOSE      : 'Close',
					NEXT       : 'Next',
					PREV       : 'Previous',
					ERROR      : 'The requested content cannot be loaded. <br/> Please try again later.',
					EXPAND     : 'Display actual size',
					SHRINK     : 'Fit to the viewport',
					PLAY_START : 'Start slideshow',
					PLAY_STOP  : 'Pause slideshow'
				},
				'de' : {
					CLOSE      : 'Schliessen',
					NEXT       : 'Vorwärts',
					PREV       : 'Zurück',
					ERROR      : 'Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.',
					EXPAND     : '',
					SHRINK     : '',
					PLAY_START : '',
					PLAY_STOP  : ''
				}
			},

			// Override some properties
			index     : 0,
			content   : null,
			href      : null,

			// Various
			wrapCSS       : '',         // CSS class name for the box
			modal         : false,
			locked        : true,
			preload       : 3,			// Number of gallery images to preload
			mouseWheel    : true,		// Enable or disable mousewheel support
			scrolling     : 'auto',     // 'yes', 'no', any valid value for CSS "overflow" property
			scrollOutside : true		// If trye, fancyBox will try to set scrollbars outside the content
		},

		// Current state
		current  : null,
		coming   : null,
		group    : [],
		index    : 0,
		isActive : false,	// Is activated
		isOpen   : false,	// Is currently open
		isOpened : false,	// Have been fully opened at least once
		isMaximized : false,

		player : {
			timer    : null,
			isActive : false
		},

		// Loaders
		ajaxLoad   : null,
		imgPreload : null,

		// Object containing all helpers
		helpers    : {},

		// Open fancyBox
		open: function( items, options ) {
			if (!items) {
				return;
			}

			// Close if already active
			if (false === F.close(true)) {
				return;
			}

			if (!$.isPlainObject( options )) {
				options = {};
			}

			F.opts = $.extend(true, {}, F.defaults, options);

			F.populate( items );

			if (F.group.length) {
				F._start( F.opts.index );
			}
		},

		// Add new items to the group
		populate : function( items ) {
			var group = [];

			if ( !$.isArray( items )) {
				items = [ items ];
			}

			// Build group array, each item is object containing element
			// and most important attributes - href, title and type
			$.each(items, function(i, element) {
				var defaults = $.extend(true, {}, F.opts),
					item,
					obj,
					type,
					margin,
					padding;

				if ($.isPlainObject(element)) {
					item = element;

				} else if (isString(element)) {
					item = { href : element };

				} else if (isQuery(element) || $.type(element) === 'object' && element.nodeType) {
					obj  = $(element);
					item = $(obj).get(0);

					if (!item.href) {
						item = { href : element };
					}

					item = $.extend({
						href    : obj.data('fancybox-href')  || obj.attr('href')  || item.href,
						title   : obj.data('fancybox-title') || obj.attr('title') || item.title,
						type    : obj.data('fancybox-type'),
						element : obj
					}, obj.data('fancybox-options') );

				} else {
					return;
				}

				// If the type has not specified, then try to guess
				if (!item.type && (item.content || item.href)) {
					item.type = item.content ? "html" : F.guessType( obj, item.href );
				}

				// Adjust some defaults depending on content type
				type = item.type || F.opts.type;

				if (type === 'image' || type === 'swf') {
					defaults.autoWidth = defaults.autoHeight = false;
					defaults.scrolling = 'visible';
				}

				if (type === 'image') {
					defaults.aspectRatio = true;
				}

				if (type === 'iframe') {
					defaults.autoWidth = false;
					defaults.scrolling = isTouch ? 'scroll' : 'visible';
				}

				if (items.length < 2) {
					defaults.margin = 30;
				}

				item = $.extend(true, {}, defaults, item);

				// Recheck some parameters
				margin  = item.margin;
				padding = item.padding;

				// Convert margin and padding properties to array - top, right, bottom, left
				if ($.type(margin) === 'number') {
					item.margin = [margin, margin, margin, margin];
				}

				if ($.type(padding) === 'number') {
					item.padding = [padding, padding, padding, padding];
				}

				// 'modal' propery is just a shortcut
				if (item.modal) {
					$.extend(true, item, {
						closeBtn   : false,
						closeClick : false,
						nextClick  : false,
						arrows     : false,
						mouseWheel : false,
						keys       : null,
						overlay : {
							closeClick : false
						}
					});
				}

				if (item.autoSize !== undefined) {
					item.autoWidth = item.autoHeight = !!item.autoSize;
				}

				if (item.width === 'auto') {
					item.autoWidth = true;
				}

				if (item.height === 'auto') {
					item.autoHeight = true;
				}

				group.push( item );
			});

			F.group = F.group.concat( group );
		},

		// Cancel image loading and abort ajax request
		cancel: function () {
			var coming = F.coming;

			if (!coming || false === F.trigger('onCancel')) {
				return;
			}

			F.hideLoading();

			if (F.ajaxLoad) {
				F.ajaxLoad.abort();
			}

			if (F.imgPreload) {
				F.imgPreload.onload = F.imgPreload.onerror = null;
			}

			if (coming.wrap) {
				removeWrap( coming.wrap );
			}

			F.ajaxLoad = F.imgPreload = F.coming = null;

			// If the first item has been canceled, then clear everything
			if (!F.current) {
				F._afterZoomOut( coming );
			}
		},

		// Start closing or remove immediately if is opening/closing
		close: function (e) {
			if (e && $.type(e) === 'object') {
				e.preventDefault();
			}

			F.cancel();

			// Do not close if:
			//   - the script has not been activated
			//   - cancel event has triggered opening a new item
			//   - "beforeClose" trigger has returned false
			if (!F.isActive || F.coming || false === F.trigger('beforeClose')) {
				return;
			}

			F.unbind();

			F.isClosing = true;

			if (F.lock) {
				F.lock.css('overflow', 'hidden');
			}

			if (!F.isOpen || e === true) {
				F._afterZoomOut();

			} else {
				F.isOpen = F.isOpened = false;

				F.transitions.close();
			}
		},

		prev : function( direction ) {
			var current = F.current;

			if (current) {
				F.jumpto( current.index - 1, (isString(direction) ? direction : current.direction.prev) );
			}
		},

		next : function( direction ) {
			var current = F.current;

			if (current) {
				F.jumpto( current.index + 1, (isString(direction) ? direction : current.direction.next) );
			}
		},

		jumpto : function( index, direction ) {
			var current = F.current;

			if (!(F.coming && F.coming.index === index)) {
				F.cancel();

				if (current.index == index) {
					direction = null;

				} else if (!direction) {
					direction = current.direction[ index > current.index ? 'next' : 'prev' ];
				}

				F.direction = direction;

				F._start( index );
			}
		}
	});

	$.extend(F, {
		guessType : function(item, href) {
			var rez  = item && item.prop('class') ? item.prop('class').match(/fancybox\.(\w+)/) : 0,
				type = false;

			if (rez) {
				return rez[1];
			}

			if (isString(href)) {
				if (href.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i)) {
					type = 'image';

				} else if (href.match(/\.(swf)((\?|#).*)?$/i)) {
					type = 'swf';

				} else if (href.charAt(0) === '#') {
					type = 'inline';
				}

			} else if (isString(item)) {
				type = 'html';
			}

			return type;
		},

		trigger: function (event, o) {
			var ret, obj = o || F.coming || F.current;

			if (!obj) {
				return;
			}

			if ($.isFunction( obj[event] )) {
				ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
			}

			// Cancel further execution if afterClose callback has opened new instance
			if (ret === false || (event === 'afterClose' && F.isActive) ) {
				return false;
			}

			if (obj.helpers) {
				$.each(obj.helpers, function (helper, opts) {
					var helperObject = F.helpers[helper],
						helperOpts;

					if (opts && helperObject && $.isFunction(helperObject[event])) {
						helperOpts = $.extend(true, {}, helperObject.defaults, opts);

						helperObject.opts = helperOpts;

						helperObject[event](helperOpts, obj );
					}
				});
			}

			$.event.trigger(event);
		},

		// Center inside viewport
		reposition: function (e, object) {
			var obj  = object || F.current,
				wrap = obj && obj.wrap,
				pos;

			if (F.isOpen && wrap) {
				pos = F._getPosition( obj );

				if (e === false || (e && e.type === 'scroll')) {
					wrap.stop(true).animate(pos, 200).css('overflow', 'visible');

				} else {
					wrap.css(pos);
				}
			}
		},

		update: function (e) {
			var type    = (e && e.type),
				timeNow = getTime(),
				current = F.current,
				width;

			if (!current || !F.isOpen ) {
				return;
			}

			if (type === 'scroll') {
				if (F.wrap.outerHeight(true) > F.getViewport().h) {
					return;
				}

				if (F.didUpdate) {
					clearTimeout( F.didUpdate );
				}

				F.didUpdate = setTimeout(function() {
					F.reposition(e);

					F.didUpdate = null;
				}, 50);

				return;
			}

			if (F.lock) {
				F.lock.css('overflow', 'hidden');
			}

			F._setDimension();

			F.reposition(e);

			if (F.lock) {
				F.lock.css('overflow', 'auto');
			}

			// Re-center float type caption
			if (current.caption.type === 'float') {
				width = F.getViewport().w - (F.wrap.outerWidth(true)  - F.inner.width() );

				current.caption.wrap.css('width', width).css('marginLeft', (width * 0.5 - F.inner.width() * 0.5) * -1 );
			}

			if (current.expander) {
				if ( current.canShrink) {
					$(".fancybox-expand").show().attr('title', current.locales[ current.locale ].SHRINK  );

				} else if (current.canExpand) {
					$(".fancybox-expand").show().attr('title', current.locales[ current.locale ].EXPAND   );

				} else {
					$(".fancybox-expand").hide();
				}
			}

			F.trigger('onUpdate');
		},

		// Shrink content to fit inside viewport or restore if resized
		toggle: function ( action ) {
			var current = F.current;

			if (current && F.isOpen) {
				F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;

				F.update( true );
			}
		},

		hideLoading: function () {
			$('#fancybox-loading').remove();
		},

		showLoading: function () {
			var el, view;

			F.hideLoading();

			el = $('<div id="fancybox-loading"></div>').click(F.cancel).appendTo('body');

			if (!F.defaults.fixed) {
				view = F.getViewport();

				el.css({
					position : 'absolute',
					top  : (view.h * 0.5) + view.y,
					left : (view.w * 0.5) + view.x
				});
			}
		},

		getViewport: function () {
			var rez;

			if (F.lock) {
				rez = {
					x: F.lock.scrollLeft(),
					y: F.lock.scrollTop(),
					w: F.lock[0].clientWidth,
					h: F.lock[0].clientHeight
				};

			} else {
				rez = {
					x: W.scrollLeft(),
					y: W.scrollTop(),

					// See http://bugs.jquery.com/ticket/6724
					w : isTouch && window.innerWidth  ? window.innerWidth  : W.width(),
					h : isTouch && window.innerHeight ? window.innerHeight : W.height()
				};
			}

			return rez;
		},

		unbind : function() {
			if (isQuery(F.wrap)) {
				F.wrap.unbind('.fb');
			}

			if (isQuery(F.inner)) {
				F.inner.unbind('.fb');
			}

			D.unbind('.fb');
			W.unbind('.fb');
		},

		rebind: function () {
			var current = F.current,
				keys;

			F.unbind();

			if (!current || !F.isOpen) {
				return;
			}

			// Changing document height on iOS devices triggers a 'resize' event,
			// that can change document height... repeating infinitely
			W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);

			keys = current.keys;

			if (keys) {
				D.bind('keydown.fb', function (e) {
					var code   = e.which || e.keyCode,
						target = e.target || e.srcElement;

					// Skip esc key if loading, because showLoading will cancel preloading
					if (code === 27 && F.coming) {
						return false;
					}

					// Ignore key combinations and key events within form elements
					if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
						$.each(keys, function(i, val) {
							//if (current.group.length > 1 && val[ code ] !== undefined) {
							if (val[ code ] !== undefined) {
								e.preventDefault();

								if (current.group.length > 1) {
									F[ i ]( val[ code ] );
								}

								return false;
							}

							if ($.inArray(code, val) > -1) {
								e.preventDefault();

								if (i === 'play') {
									F.slideshow.toggle();
								} else {
									F[ i ] ();
								}

								return false;
							}
						});
					}
				});
			}

			F.lastScroll = getTime();

			if (current.mouseWheel && F.group.length > 1) {
				F.wrap.bind('DOMMouseScroll.fb mousewheel.fb MozMousePixelScroll.fb', function (event) {
					var e       = event.originalEvent,
						el      = e.target || 0,
						delta   = (e.wheelDelta || e.detail || 0),
						deltaX  = e.wheelDeltaX || 0,
						deltaY  = e.wheelDeltaY || 0,
						now     = getTime();

					if (((el && el.style && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)))) ) {
						return;
					}

					if (delta === 0 || (F.current && F.current.canShrink)) {
						return;
					}

					e.stopPropagation();

					if (F.lastScroll && (now - F.lastScroll) < 80) {
						F.lastScroll = now;
						return;
					}

					F.lastScroll = now;

					if (e.axis) {
						if (e.axis === e.HORIZONTAL_AXIS) {
							deltaX = delta * -1;

						} else if (e.axis === e.VERTICAL_AXIS) {
							deltaY = delta * -1;
						}
					}

					if ( deltaX === 0 ) {
						if (deltaY > 0) {
							F.prev( 'down' );

						} else {
							F.next( 'up' );
						}

					} else {
						if (deltaX > 0) {
							F.prev( 'right' );

						} else {
							F.next( 'left' );
						}
					}
				});
			}

			F.touch.init();
		},

		rebuild : function() {
			var current = F.current;

			current.wrap.find('.fancybox-nav, .fancybox-close, .fancybox-expand').remove();

			// Create navigation arrows
			if (current.arrows && F.group.length > 1) {
				if (current.loop || current.index > 0) {
					$( F._translate( current.tpl.prev) ).appendTo(F.inner).bind('click.fb', F.prev);
				}

				if (current.loop || current.index < F.group.length - 1) {
					$( F._translate( current.tpl.next) ).appendTo(F.inner).bind('click.fb', F.next);
				}
			}

			// Create a close button
			if (current.closeBtn) {
				$( F._translate( current.tpl.closeBtn) ).appendTo(F.wrap).bind('click.fb', F.close);
			}

			// Add expand button to image
			if (current.expander && current.type === 'image') {
				$('<a title="Expand image" class="fancybox-expand" href="javascript:;"></a>')
					.appendTo( F.inner )
					.bind('click.fb', F.toggle);

				if ( !current.canShrink && !current.canExpand) {

				}
			}
		},

		// Create upcoming object and prepare for loading the content
		_start: function( index ) {
			var coming,
				type;

			// Check index and get object from the groups
			if (F.opts.loop) {
				if (index < 0) {
					index = F.group.length + (index % F.group.length);
				}

				index = index % F.group.length;
			}

			coming = F.group[ index ];

			if (!coming) {
				return false;
			}

			// Add all properties
			coming = $.extend(true, {}, F.opts, coming);

			/*
			 * Add reference to the group, so it`s possible to access from callbacks, example:
			 * afterLoad : function() {
			 *     this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
			 * }
			 */

			coming.group  = F.group;
			coming.index  = index;

			// Give a chance for callback or helpers to update coming item (type, title, etc)
			F.coming = coming;

			if (false === F.trigger('beforeLoad')) {
				F.coming = null;

				return;
			}

			F.isActive = true;

			// Build the neccessary markup
			F._build();

			// If user will press the escape-button, the request will be canceled
			D.bind('keydown.loading', function(e) {
				if ((e.which || e.keyCode) === 27) {
					D.unbind('.loading');

					e.preventDefault();

					F.cancel();
				}
			});

			// Show overlay
			if (coming.overlay && coming.overlay.showEarly) {
				F.overlay.open( coming.overlay );
			}

			// Load content
			type = coming.type;

			if (type === 'image') {
				F._loadImage();

			} else if (type === 'ajax') {
				F._loadAjax();

			} else if (type === 'iframe') {
				F._loadIframe();

			} else if (type === 'inline') {
				F._loadInline();

			} else if (type === 'html' || type === 'swf') {
				F._afterLoad();

			} else {
				F._error();
			}
		},

		_build : function() {
			var coming  = F.coming,
				captionType = coming.caption.type,
				wrap,
				inner,
				scrollV,
				scrollH;

			coming.wrap  = wrap  = $('<div class="fancybox-wrap"></div>').appendTo( coming.parent || 'body' ).addClass('fancybox-' + coming.theme);
			coming.inner = inner = $('<div class="fancybox-inner"></div>').appendTo( wrap );

			coming[ captionType === 'outside' || captionType === 'float' ? 'inner' : 'wrap' ].addClass('fancybox-skin fancybox-' + coming.theme + '-skin');

			if (coming.locked && coming.overlay && F.defaults.fixed) {
				if (!F.lock) {
					F.lock = $('<div id="fancybox-lock"></div>').appendTo( wrap.parent() );
				}

				F.lock.unbind().append( wrap );

				if (coming.overlay.closeClick) {
					F.lock.click(function(e) {
						if ($(e.target).is(F.lock)) {
							F.close();
						}
					});
				}

				// Compensate missing page scrolling by increasing margin
				if (D.height() > W.height() || H.css('overflow-y') === 'scroll') {
					$('*:visible').filter(function(){
						return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && $(this).attr('id') !== "fancybox-lock");
					}).addClass('fancybox-margin');

					H.addClass('fancybox-margin');
				}

				// Workaround for FF jumping bug
				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				H.addClass('fancybox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			F.trigger('onReady');
		},

		_error: function ( type ) {
			if (!F.coming) {
				return;
			}

			$.extend(F.coming, {
				type       : 'html',
				autoWidth  : true,
				autoHeight : true,
				closeBtn   : true,
				minWidth   : 0,
				minHeight  : 0,
				padding    : [15, 15, 15, 15],
				scrolling  : 'visible',
				hasError   : type,
				content    : F._translate( F.coming.tpl.error )
			});

			F._afterLoad();
		},

		_loadImage: function () {
			// Reset preload image so it is later possible to check "complete" property
			var img = F.imgPreload = new Image();

			img.onload = function () {
				this.onload = this.onerror = null;

				$.extend(F.coming, {
					width   : this.width,
					height  : this.height,
					content : $(this).addClass('fancybox-image')
				});

				F._afterLoad();
			};

			img.onerror = function () {
				this.onload = this.onerror = null;

				F._error( 'image' );
			};

			img.src = F.coming.href;

			if (img.complete !== true || img.width < 1) {
				F.showLoading();
			}
		},

		_loadAjax: function () {
			var coming = F.coming,
				href   = coming.href,
				hrefParts,
				selector;

			hrefParts = href.split(/\s+/, 2);
			href      = hrefParts.shift();
			selector  = hrefParts.shift();

			F.showLoading();

			F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
				url: coming.href,
				error: function (jqXHR, textStatus) {
					if (F.coming && textStatus !== 'abort') {
						F._error( 'ajax', jqXHR );

					} else {
						F.hideLoading();
					}
				},
				success: function (data, textStatus) {
					if (textStatus === 'success') {
						if (selector) {
							data = $('<div>').html(data).find(selector);
						}

						coming.content = data;

						F._afterLoad();
					}
				}
			}));
		},

		_loadIframe: function() {
			var coming = F.coming,
				iframe;

			coming.content = iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
				.attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling);

			if (coming.iframe.preload) {
				F.showLoading();

				F._setDimension( coming );

				coming.wrap.addClass('fancybox-tmp');

				iframe.one('load.fb', function() {
					if (coming.iframe.preload) {
						$(this).data('ready', 1);

						$(this).bind('load.fb', F.update);

						F._afterLoad();
					}
				});
			}

			iframe.attr('src', coming.href).appendTo(coming.inner);

			if (!coming.iframe.preload) {
				F._afterLoad();

			} else if (iframe.data('ready') !== 1) {
				F.showLoading();
			}
		},

		_loadInline : function() {
			var coming = F.coming,
				href   = coming.href;

			coming.content = $( isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href ); //strip for ie7

			if (coming.content.length) {
				F._afterLoad();

			} else {
				F._error();
			}
		},

		_preloadImages: function() {
			var group   = F.group,
				current = F.current,
				len     = group.length,
				cnt     = current.preload ? Math.min(current.preload, len - 1) : 0,
				item,
				i;

			for (i = 1; i <= cnt; i += 1) {
				item = group[ (current.index + i ) % len ];

				if (item && item.type === 'image' && item.href) {
					new Image().src = item.href;
				}
			}
		},

		_afterLoad : function() {
			var current  = F.coming,
				previous = F.current;

			D.unbind('.loading');

			if (!current || F.isActive === false || false === F.trigger('afterLoad', current, previous)) {
				F.hideLoading();

				if (current && current.wrap) {
					removeWrap( current.wrap );
				}

				if (!previous) {
					F._afterZoomOut( current );
				}

				F.coming = null;

				return;
			}

			$.extend(F, {
				wrap     : current.wrap.addClass('fancybox-type-' + current.type + ' fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-' + current.theme + '-' +  (isTouch ? 'mobile' : 'desktop')  + ' ' + current.wrapCSS),
				inner    : current.inner,
				current  : current,
				previous : previous
			});

			// Set content, margin/padding, caption, etc
			F._prepare();

			// Give a chance for helpers or callbacks to update elements
			F.trigger('beforeShow', current, previous);

			F.isOpen = false;
			F.coming = null;

			// Set initial dimension
			F._setDimension();

			F.hideLoading();

			// Open overlay if is not yet open
			if (current.overlay && !F.overlay.el) {
				F.overlay.open( current.overlay );
			}

			F.transitions.open();
		},

		_prepare : function() {
			var current     = F.current,
				content     = current.content || '',
				wrap        = current.wrap,
				inner       = current.inner,
				margin      = current.margin,
				padding     = current.padding,
				href        = current.href,
				type        = current.type,
				scrolling   = current.scrolling,
				caption     = current.caption,
				captionText = current.title,
				captionType = caption.type,
				placeholder = 'fancybox-placeholder',
				display     = 'fancybox-display',
				embed;

			if (type !== 'iframe' && isQuery(content) && content.length) {
				if (!content.data(placeholder)) {
					content.data(display, content.css('display'))
						.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter( content ).hide() );
				}

				content = content.show().detach();

				current.wrap.bind('onReset', function () {
					if ($(this).find(content).length) {
						content.css('display', content.data(display))
							.replaceAll( content.data(placeholder) )
							.data(placeholder, false)
							.data(display, false);
					}
				});
			}

			if (type === 'swf') {
				content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
				embed   = '';

				$.each(current.swf, function(name, val) {
					content += '<param name="' + name + '" value="' + val + '"></param>';
					embed   += ' ' + name + '="' + val + '"';
				});

				content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
			}

			if (!(isQuery(content) && content.parent().is(current.inner))) {
				current.inner.append( content );

				current.content = current.inner.children(':last');
			}

			// Add margin / padding
			$.each(["Top", "Right", "Bottom", "Left"], function(i, v) {
				if (margin[ i ]) {
					wrap.css('margin' + v, getValue(margin[ i ]));
				}

				if (padding[ i ]) {
					if (!(v === 'Bottom' && captionType === 'outside')) {
						wrap.css('padding' + v, getValue(padding[ i ])  );
					}

					if (captionType === 'outside' || captionType === 'float') {

						inner.css('border' + v + 'Width', getValue(padding[ i ]));

						if (v === 'Top' || v === 'Left') {
							inner.css('margin' + v, getValue(padding[ i ] * -1));
						}
					}
				}
			});

			// Add caption
			if ($.isFunction(captionText)) {
				captionText = captionText.call(current.element, current);
			}

			if (isString(captionText) && $.trim(captionText) !== '') {
				current.caption.wrap = $('<div class="fancybox-title fancybox-title-' + captionType + '-wrap">' + captionText + '</div>').appendTo( current[ captionType === 'over' ? 'inner' : 'wrap' ] );

				if (captionType === 'float') {
					current.caption.wrap.width( F.getViewport().w - (F.wrap.outerWidth(true)  - F.inner.width() ) ).wrapInner('<div></div>');
				}
			}
		},

		_setDimension: function( object ) {
			var view      = F.getViewport(),
				current   = object || F.current,
				wrap      = current.wrap,
				inner     = current.inner,
				width     = current.width,
				height    = current.height,
				minWidth  = current.minWidth,
				minHeight = current.minHeight,
				maxWidth  = current.maxWidth,
				maxHeight = current.maxHeight,
				margin    = current.margin,
				scrollOut = current.scrollOutside ? current.scrollbarWidth : 0,
				margin    = current.margin,
				padding   = current.padding,
				scrolling = current.scrolling,
				steps     = 1,
				scrollingX,
				scrollingY,
				hSpace,
				wSpace,
				origWidth,
				origHeight,
				ratio,
				iframe,
				body,
				maxWidth_,
				maxHeight_,
				width_,
				height_,
				canShrink,
				canExpand;

			// Set scrolling
			scrolling  = scrolling.split(',');
			scrollingX = scrolling[0];
			scrollingY = scrolling[1] || scrollingX;

			current.inner
				.css('overflow-x', scrollingX === 'yes' ? 'scroll' : (scrollingX === 'no' ? 'hidden' : scrollingX))
				.css('overflow-y', scrollingY === 'yes' ? 'scroll' : (scrollingY === 'no' ? 'hidden' : scrollingY));

			wSpace = margin[1] + margin[3] + padding[1] + padding[3];
			hSpace = margin[0] + margin[2] + padding[0] + padding[2];

			// Calculations for the content
			minWidth  = getScalar( isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth );
			maxWidth  = getScalar( isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth );

			minHeight = getScalar( isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight );
			maxHeight = getScalar( isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight );

			origWidth  = getScalar( isPercentage(width)  ? getScalar(width,  'w') - wSpace : width  );
			origHeight = getScalar( isPercentage(height) ? getScalar(height, 'h') - hSpace : height );

			if (current.fitToView) {
				maxWidth  = Math.min(maxWidth,  getScalar('100%', 'w') - wSpace );
				maxHeight = Math.min(maxHeight, getScalar('100%', 'h') - hSpace );
			}

			maxWidth_  = view.w;
			maxHeight_ = view.h;

			if (current.type === 'iframe') {
				iframe = current.content;

				wrap.removeClass('fancybox-tmp');

				if ((current.autoWidth || current.autoHeight) && iframe && iframe.data('ready') === 1) {

					try {
						if (iframe[0].contentWindow && iframe[0].contentWindow.document.location) {
							body = iframe.contents().find('body');

							inner.addClass( 'fancybox-tmp' );

							inner.width( screen.width - wSpace ).height( 99999 );

							if (scrollOut) {
								body.css('overflow-x', 'hidden');
							}

							if (current.autoWidth) {
								origWidth = body.outerWidth(true);
							}

							if (current.autoHeight) {
								origHeight = body.outerHeight(true);
							}

							inner.removeClass( 'fancybox-tmp' );
						}

					} catch (e) {}
				}

			} else if ( (current.autoWidth || current.autoHeight) && !(current.type === 'image' || current.type === 'swf') ) {
				inner.addClass( 'fancybox-tmp' );

				// Set width or height in case we need to calculate only one dimension
				if (current.autoWidth) {
					inner.width( 'auto' );

				} else {
					inner.width( maxWidth );
				}

				if (current.autoHeight) {
					inner.height( 'auto' );

				} else {
					inner.height( maxHeight );
				}

				if (current.autoWidth) {
					origWidth = inner[0].scrollWidth || inner.width();
				}

				if (current.autoHeight) {
					origHeight = inner[0].scrollHeight || inner.height();
				}

				inner.removeClass( 'fancybox-tmp' );
			}

			width  = origWidth;
			height = origHeight;
			ratio  = origWidth / origHeight;

			if (!current.autoResize) {
				wrap.css({
					width  : getValue( width ),
					height : 'auto'
				});

				inner.css({
					width  : getValue( width ),
					height : getValue( height )
				});
				return;
			}

			if (current.aspectRatio) {
				if (width > maxWidth) {
					width  = maxWidth;
					height = width / ratio;
				}

				if (height > maxHeight) {
					height = maxHeight;
					width  = height * ratio;
				}

				if (width < minWidth) {
					width  = minWidth;
					height = width / ratio;
				}

				if (height < minHeight) {
					height = minHeight;
					width  = height * ratio;
				}

			} else {
				width = Math.max(minWidth, Math.min(width, maxWidth));

				if (current.autoHeight && current.type !== 'iframe') {
					inner.width( width );

					origHeight = height = inner[0].scrollHeight;
				}

				height = Math.max(minHeight, Math.min(height, maxHeight));
			}

			// Wrap element has to have fixed width, because long title can expand it
			wrap.css({
				width  : getValue( width ),
				height : 'auto'
			});

			inner.css({
				width  : getValue( width ),
				height : getValue( height )
			});

			width_  = getScalar( wrap.outerWidth(true) );
			height_ = getScalar( wrap.outerHeight(true) );

			if (current.fitToView) {
				// Since we do not know how many lines will be at the final, we need to
				// resize box till it fits inside max dimensions
				if (current.aspectRatio) {
					while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
						if (steps++ > 30) {
							break;
						}

						height = Math.max(minHeight, Math.min(maxHeight, height - 10));
						width  = getScalar(height * ratio);

						if (width < minWidth) {
							width  = minWidth;
							height = getScalar(width / ratio);
						}

						if (width > maxWidth) {
							width  = maxWidth;
							height = getScalar(width / ratio);
						}

						wrap.css({
							width  : getValue( width )
						});

						inner.css({
							width  : getValue( width ),
							height : getValue( height )
						});

						width_  = getScalar( wrap.outerWidth(true) );
						height_ = getScalar( wrap.outerHeight(true) );
					}

				} else {
					width  = Math.max(minWidth,  Math.min(width,  width  - (width_  - maxWidth_  )));
					height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_ )));
				}
			}


			if (scrollOut && scrollingX === 'auto' && (height < inner[0].scrollHeight || (isQuery(current.content) && current.content[0] && height < current.content[0].offsetHeight)) && (width + wSpace + scrollOut) < maxWidth) {
				width += scrollOut;
			}

			wrap.css({
				width  : width
			});

			inner.css({
				width  : getValue( width ),
				height : getValue( height )
			});

			width_  = getScalar( wrap.outerWidth(true) );
			height_ = getScalar( wrap.outerHeight(true) );

			canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
			canExpand = (width_ < maxWidth_ || height_ < maxHeight_) && ( current.aspectRatio ? (width < maxWidth && height < maxHeight && width < origWidth && height < origHeight) : ((width < maxWidth || height < maxHeight) && (width < origWidth || height < origHeight)) );

			current.canShrink = canShrink;
			current.canExpand = canExpand;

			if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
				inner.height('auto');
			}
		},

		_getPosition: function( object ) {
			var obj   = object || F.current,
				wrap  = obj.wrap,
				view  = F.getViewport(),
				pos   = {},
				top   = view.y,
				left  = view.x;

			pos = {
				top    : getValue( Math.max(top,  top  + ((view.h - wrap.outerHeight(true)) * obj.topRatio)) ),
				left   : getValue( Math.max(left, left + ((view.w - wrap.outerWidth(true))  * obj.leftRatio)) ),
				width  : getValue( wrap.width() ),
				height : getValue( wrap.height() )
			};

			return pos;
		},

		_afterZoomIn : function() {
			var current   = F.current;

			if (!current) {
				return;
			}

			if (F.lock) {
				F.lock.css('overflow', 'auto');
			}

			F.isOpen = F.isOpened = true;

			F.rebuild();

			F.rebind();

			if (current.caption && current.caption.wrap) {
				current.caption.wrap.show().css({
					'visibility' : 'visible',
					'opacity'    : 0,
					'left'       : 0
				})
				.animate({opacity:1}, "fast");
			}

			F.update();

			F.wrap.css('overflow', 'visible').addClass('fancybox-open').focus();

			F[ F.wrap.hasClass('fancybox-skin') ? 'wrap' : 'inner' ].addClass('fancybox-' + current.theme + '-skin-open');

			if (current.caption && current.caption.wrap) {
				current.caption.wrap.show().css('left', 0).animate({opacity:1}, "fast");
			}

			// Add empty element to simulate bottom margin, this trick helps to avoid extra element
			if (current.margin[2] > 0) {
				$('<div class="fancybox-spacer"></div>').css('height', getValue( current.margin[2] - 2) ).appendTo( F.wrap );
			}

			F.trigger('afterShow');

			F._preloadImages();

			if (current.autoPlay && !F.slideshow.isActive) {
				F.slideshow.start();
			}
		},

		_afterZoomOut : function(obj) {
			var cleanup = function() {
				removeWrap('.fancybox-wrap');
			};

			F.hideLoading();

			obj = obj || F.current;

			if (obj && obj.wrap) {
				obj.wrap.hide();
			}

			$.extend(F, {
				group     : [],
				opts      : {},
				coming    : null,
				current   : null,
				isActive  : false,
				isOpened  : false,
				isOpen    : false,
				isClosing : false,
				wrap      : null,
				skin      : null,
				inner     : null
			});

			F.trigger('afterClose', obj);

			if (!F.coming && !F.current) {
				if (obj.overlay) {
					F.overlay.close( obj.overlay, cleanup );
				} else {
					cleanup();
				}
			}
		},

		_translate : function( str ) {
			var obj = F.coming || F.current,
				arr = obj.locales[ obj.locale ];

			return str.replace(/\{\{(\w+)\}\}/g, function(match, n) {
				var value = arr[n];

				if (value === undefined) {
					return match;
				}

				return value;
			});
		}
	});

	/*
	 *	Transition object
	 */

	F.transitions = {
		_getOrig: function( object ) {
			var obj     = object || F.current,
				wrap    = obj.wrap,
				element = obj.element,
				orig    = obj.orig,
				view    = F.getViewport(),
				pos     = {},
				width   = 50,
				height  = 50;

			if (!orig && element && element.is(':visible')) {
				orig = element.find('img:first:visible');

				if (!orig.length) {
					orig = element;
				}
			}

			// If there is no orig element, maybe only the first thumbnail is visible
			if (!orig && obj.group[0].element) {
				orig = obj.group[0].element.find('img:visible:first');
			}

			if (isQuery(orig) && orig.is(':visible')) {
				pos = orig.offset();

				if (orig.is('img')) {
					width  = orig.outerWidth();
					height = orig.outerHeight();
				}

				if (F.lock) {
					pos.top  -= W.scrollTop();
					pos.left -= W.scrollLeft();
				}

			} else {
				pos.top  = view.y + (view.h - height) * obj.topRatio;
				pos.left = view.x + (view.w - width)  * obj.leftRatio;
			}

			pos = {
				top      : getValue( pos.top  - (wrap.outerHeight(true) - wrap.height() ) * 0.5 ),
				left     : getValue( pos.left - (wrap.outerWidth(true)  - wrap.width() )  * 0.5 ),
				width    : getValue( width ),
				height   : getValue( height )
			};

			return pos;
		},

		_getCenter: function( object ) {
			var obj   = object || F.current,
				wrap  = obj.wrap,
				view  = F.getViewport(),
				pos   = {},
				top   = view.y,
				left  = view.x;

			pos = {
				top    : getValue( Math.max(top,  top  + ((view.h - wrap.outerHeight(true)) * obj.topRatio)) ),
				left   : getValue( Math.max(left, left + ((view.w - wrap.outerWidth(true))  * obj.leftRatio)) ),
				width  : getValue( wrap.width() ),
				height : getValue( wrap.height() )
			};

			return pos;
		},

		_prepare : function( object, forClosing ) {
			var obj   = object || F.current,
				wrap  = obj.wrap,
				inner = obj.inner;

			// Little trick to avoid animating both elements and to improve performance
			wrap.height( wrap.height() );

			inner.css({
				'width'  : (inner.width() *  100 / wrap.width() )  + '%',
				'height' : (Math.floor( (inner.height() * 100 / wrap.height() ) * 100 ) / 100 ) + '%'
			});

			if (forClosing === true) {
				wrap.find('.fancybox-title, .fancybox-spacer, .fancybox-close, .fancybox-nav').remove();
			}

			inner.css('overflow', 'hidden');
		},

		fade : function( object, stage ) {
			var pos = this._getCenter( object ),
				opa = {opacity: 0};

			return ((stage === 'open' || stage === 'changeIn') ? [ $.extend(pos, opa), {opacity: 1} ] : [ {}, opa ]);
		},

		drop : function( object, stage ) {
			var a = $.extend(this._getCenter( object ), {opacity: 1}),
				b = $.extend({}, a, {opacity: 0, top: getValue( Math.max( F.getViewport().y - object.margin[0], getScalar( a.top ) - 200 ) )});

			return ((stage === 'open' || stage === 'changeIn') ? [ b, a ] : [ {}, b ]);
		},

		elastic : function( object, stage ) {
			var wrap      = object.wrap,
				margin    = object.margin,
				view      = F.getViewport(),
				direction = F.direction,
				pos       = this._getCenter( object ),
				from      = $.extend({}, pos),
				to        = $.extend({}, pos),
				prop,
				amount,
				value;

			if (stage === 'open') {
				from = this._getOrig( object );

			} else if (stage === 'close') {
				from = {};
				to   = this._getOrig( object );

			} else if (direction) {
				// Calculate max distance and try to avoid scrollbars
				prop    = (direction === 'up' || direction === 'down') ? 'top' : 'left';
				amount  = (direction === 'up' || direction === 'left') ? 200 : -200;

				if (stage === 'changeIn') {
					value = getScalar(from[ prop ]) + amount;

					if (direction === 'left') {
						// from viewport right to center
						value = Math.min( value, view.x + view.w - margin[3] - wrap.outerWidth() - 1 );

					} else if (direction === 'right') {
						// from viewport left to center
						value = Math.max( value, view.x - margin[1] );

					} else if (direction === 'up') {
						// from viewport bottom to center
						value = Math.min( value, view.y + view.h - margin[0] - wrap.outerHeight() - 1);

					} else {
						// down - from viewport top to center
						value = Math.max( value, view.y - margin[2] );
					}

					from[ prop ] = value;

				} else {
					value = getScalar(wrap.css(prop)) - amount;
					from  = {};

					if (direction === 'left') {
						// from viewport center to left
						value = Math.max( value, view.x - margin[3] );

					} else if (direction === 'right') {
						// from viewport center to right
						value = Math.min( value, view.x + view.w - margin[1]  - wrap.outerWidth() - 1 );

					} else if (direction === 'up') {
						// from viewport center to top
						value = Math.max( value, view.y - margin[0]  );

					} else {
						// down - from center to bottom
						value = Math.min( value, view.y + view.h - margin[2] - wrap.outerHeight() - 1 );
					}

					to[ prop ] = value;
				}
			}

			if (stage === 'open' || stage === 'changeIn') {
				from.opacity = 0;
				to.opacity   = 1;

			} else {
				to.opacity   = 0;
			}

			return [ from, to ];
		},

		open : function() {
			var current   = F.current,
				previous  = F.previous,
				direction = F.direction,
				effect,
				pos,
				speed,
				easing,
				stage;

			if (previous) {
				previous.wrap.stop(true).removeClass('fancybox-opened');
			}

    		if ( F.isOpened ) {
    			effect = current.nextEffect,
				speed  = current.nextSpeed;
				easing = current.nextEasing;
				stage  = 'changeIn';

			} else {
				effect = current.openEffect;
				speed  = current.openSpeed;
				easing = current.openEasing;
				stage  = 'open';
			}

			/*
			 *	Open current item
			 */

			if (effect === 'none') {
				F._afterZoomIn();

			} else {
				pos = this[ effect ]( current, stage );

				if (effect === 'elastic') {
					this._prepare( current );
				}

				current.wrap.css( pos[ 0 ] );

				current.wrap.animate(
					pos[ 1 ],
					speed,
					easing,
					F._afterZoomIn
				);
			}

			/*
			 *	Close previous item
			 */
			if (previous) {
				if (!F.isOpened || previous.prevEffect === 'none') {
					// Remove previous item if it has not fully opened
					removeWrap( $('.fancybox-wrap').not( current.wrap ) );

				} else {
					previous.wrap.stop(true).removeClass('fancybox-opened');

					pos = this[ previous.prevEffect ]( previous, 'changeOut' );

					this._prepare( previous, true );

					previous.wrap.animate(
						pos[ 1 ],
						previous.prevSpeed,
						previous.prevEasing,
						function() {
							removeWrap( previous.wrap );
						}
					);
				}
			}
		},

		close : function() {
			var current  = F.current,
				wrap     = current.wrap.stop(true).removeClass('fancybox-opened'),
				effect   = current.closeEffect,
				pos;

			if (effect === 'none') {
				return F._afterZoomOut();
			}

			this._prepare( current, true );

			pos = this[ effect ]( current, 'close' );

			wrap.addClass('fancybox-animating')
				.animate(
					pos[ 1 ],
					current.closeSpeed,
					current.closeEasing,
					F._afterZoomOut
				);
		}
	};

	/*
	 *	Slideshow object
	 */

	F.slideshow = {
		_clear : function () {
			if (this._timer) {
				clearTimeout(this._timer);
			}
		},
		_set : function () {
			this._clear();

			if (F.current && this.isActive) {
				this._timer = setTimeout(F.next, this._speed);
			}
		},

		_timer   : null,
		_speed   : null,

		isActive : false,

		start : function ( speed ) {
			var current = F.current;

			if (current && (current.loop || current.index < current.group.length - 1)) {
				this.stop();

				this.isActive = true;
				this._speed   = speed || current.playSpeed;

				D.bind({
					'beforeLoad.player' : $.proxy(this._clear, this),
					'onUpdate.player'   : $.proxy(this._set, this),
					'onCancel.player beforeClose.player' : $.proxy(this.stop, this)
				});

				this._set();

				F.trigger('onPlayStart');
			}
		},

		stop : function () {
			this._clear();

			D.unbind('.player');

			this.isActive = false;
			this._timer   = this._speed = null;

			F.trigger('onPlayEnd');
		},

		toggle : function() {
			if (this.isActive) {
				this.stop();

			} else {
				this.start.apply(this, arguments );
			}
		}
	};

	/*
	 *	Overlay object
	 */

	F.overlay = {
		el    : null,  // current handle
		theme : '',    // current theme

		// Public methods
		open : function(opts) {
			var that  = this,
				el    = this.el,
				fixed = F.defaults.fixed,
				opacity,
				theme;

			opts = $.extend({}, F.defaults.overlay, opts);

			if (el) {
				el.stop(true).removeAttr('style').unbind('.overlay');

			} else {
				el = $('<div class="fancybox-overlay' + (fixed ? ' fancybox-overlay-fixed' : '' ) + '"></div>').appendTo( opts.parent || 'body' );
			}

			if (opts.closeClick) {
				el.bind('click.overlay', function(e) {
					// fix Android touch event bubbling issue
					if (F.lastTouch && (getTime() - F.lastTouch) < 300) {
						return false;
					}

					if (F.isActive) {
						F.close();
					} else {
						that.close();
					}

					return false;
				});
			}

			theme = opts.theme || (F.coming ? F.coming.theme : 'default');

			if (theme !== this.theme) {
				el.removeClass('fancybox-' + this.theme + '-overlay')
			}

			this.theme = theme;

			el.addClass('fancybox-' + theme + '-overlay').css( opts.css );

			opacity = el.css('opacity');

			if (!this.el && opacity < 1 && opts.speedIn) {
				el.css({
					opacity : 0,
					filter  : 'alpha(opacity=0)'  // This fixes IE flickering
				})
				.fadeTo( opts.speedIn, opacity );
			}

			this.el = el;

			if (!fixed) {
				W.bind('resize.overlay', $.proxy( this.update, this) );

				this.update();
			}
		},

		close : function(opts, callback) {
			opts = $.extend({}, F.defaults.overlay, opts);

			if (this.el) {
				this.el.stop(true).fadeOut(opts.speedOut, function() {
					W.unbind('resize.overlay');

					$('.fancybox-overlay').remove();

					F.overlay.el = null;

					if ($.isFunction(callback)) {
						callback();
					}
				});
			}
		},

		update : function () {
			// Reset width/height so it will not mess
			this.el.css({width: '100%', height: '100%'});

			this.el.width(D.width()).height(D.height());
		}
	};

	/*
	 *	Touch object - adds swipe left/right events
	 */

	F.touch = {
		startX   : 0,
		wrapX    : 0,
		dx       : 0,
		isMoving : false,

		_start : function(e) {
			var current = F.current,
				data    = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
				now     = getTime();

			if (!F.isOpen || F.wrap.is(':animated')  || !( $(e.target).is(F.inner) || $(e.target).parent().is(F.inner) )) {
				return;
			}

			if (F.lastTouch && (now - F.lastTouch) < 300) {
				e.preventDefault();

				F.lastTouch = now;

				this._cancel(true);

				F.toggle();

				return false;
			}

			F.lastTouch = now;

			if (F.wrap &&  F.wrap.outerWidth() > F.getViewport().w) {
				return;
			}

			e.preventDefault();

			if (data && F.wrap &&  F.wrap.outerWidth() < F.getViewport().w) {
				this.startX   = data.pageX;
				this.wrapX    = F.wrap.position().left;
				this.isMoving = true;

				F.inner
					.bind('touchmove.fb', $.proxy(this._move, this) )
					.one("touchend.fb touchcancel.fb", $.proxy(this._cancel, this) );
			}
		},

		_move : function(e) {
			var data = e.originalEvent.touches ? e.originalEvent.touches[0] : e,
				dx   = this.startX - data.pageX;

			if (!this.isMoving || !F.isOpen) {
				return;
			}

			this.dx = dx;

			if (F.current.wrap.outerWidth(true) <= W.width()) {

				if (Math.abs(dx) >= 50) {
					e.preventDefault();

					this.last = 0;

					this._cancel(true);

					if (dx > 0) {
						F.next('left');

					} else {
						F.prev('right');
					}

				} else if (Math.abs(dx) > 3) {
					e.preventDefault();

					this.last = 0;

					F.wrap.css('left', this.wrapX - dx);
				}
			}
		},

		_clear : function() {
			this.startX   = this.wrapX = this.dx = 0;
			this.isMoving = false;
		},

		_cancel : function( stop ) {
			if (F.inner) {
				F.inner.unbind('touchmove.fb');
			}

			if (F.isOpen && Math.abs(this.dx) > 3) {
				F.reposition(false);
			}

			this._clear();
		},

		init : function() {
			var that = this;

			if (F.inner && F.touch) {
				this._cancel(true);

				F.inner.bind('touchstart.fb', $.proxy(this._start, this));
			}
		}
	};

	/*
	 *	Add default easing
	 */

	if (!$.easing.easeOutQuad) {
		$.easing.easeOutQuad = function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		};
	}

	/*
	 *
	 */

	D.ready(function() {
		var w1, w2, scrollV, scrollH;

		// Tests that need a body at doc ready
		if ( $.scrollbarWidth === undefined ) {
			$.scrollbarWidth = function() {
				var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
					child  = parent.children(),
					width  = child.innerWidth() - child.height( 99 ).innerWidth();

				parent.remove();

				return width;
			};
		}

		if ( $.support.fixedPosition === undefined ) {
			$.support.fixedPosition = (function() {
				var elem  = $('<div style="position:fixed;top:20px;padding:0;margin:0;border:0;"></div>').appendTo('body'),
					fixed = elem.css( 'position' ) === 'fixed' && ((elem[0].offsetTop > 18 && elem[0].offsetTop < 22) || elem[0].offsetTop === 15 );

				elem.remove();

				return fixed;
			}());
		}

		$.extend(F.defaults, {
			scrollbarWidth : $.scrollbarWidth(),
			fixed  : $.support.fixedPosition,
			parent : $('body')
		});

		// Quick and dirty code to get page scroll-bar width and create CSS style
		// Workaround for FF jumping bug
		scrollV = W.scrollTop();
		scrollH = W.scrollLeft();

		w1 = $(window).width();

		H.addClass('fancybox-lock-test');

		w2 = $(window).width();

		H.removeClass('fancybox-lock-test');

		W.scrollTop( scrollV ).scrollLeft( scrollH );

		F.lockMargin = (w2 - w1);

		$("<style type='text/css'>.fancybox-margin{margin-right:" + F.lockMargin + "px;}</style>").appendTo("head");

		// Auto start
		if ($("script[src*='jquery.fancybox.js']").attr('src').match(/autorun/) ){
			$("a[href$='.jpg'],a[href$='.png'],a[href$='.gif'],.fancybox").attr('data-fancybox-group', 'gallery').fancybox();
		}
	});

	// jQuery plugin initialization
	$.fn.fancybox = function (options) {
		var that     = this,
			selector = this.length ? this.selector : false,
			live     = (selector && selector.indexOf('()') < 0 && !(options && options.live === false));

		var handler  = function(e) {
			var collection = live ? $(selector) : that,
				group  = $(this).blur(),
				param  = options.groupAttr || 'data-fancybox-group',
				value  = group.attr( param ),
				tmp    = this.rel;

			if (!value && tmp && tmp !== 'nofollow') {
				param = 'rel';
				value = tmp;
			}

			if (value) {
				group = collection.filter('[' + param + '="' + value + '"]');

				options.index = group.index( this );
			}

			if (group.length) {
				e.preventDefault();

				F.open(group.get(), options);
			}
		};

		options = options || {};

		if (live) {
			D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-close,.fancybox-nav,.fancybox-wrap')", 'click.fb-start', handler);

		} else {
			that.unbind('click.fb-start').bind('click.fb-start', handler);
		}

		return this;
	};

}(window, document, jQuery));