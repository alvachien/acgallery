/*!
 * Thumbnail helper for fancyBox
 * version: 2.0.0 (Tue, 29 Jan 2013)
 * @requires fancyBox v3.0 or later
 *
 * Usage:
 *     $(".fancybox").fancybox({
 *         helpers : {
 *             thumbs: {
 *                 width  : 50,
 *                 height : 50
 *             }
 *         }
 *     });
 *
 */
(function ($) {
	//Shortcut for fancyBox object
	var F = $.fancybox;

	//Add helper object
	F.helpers.thumbs = {
		defaults : {
			width    : 75,            // thumbnail width
			height   : 50,            // thumbnail height
			position : 'bottom',      // 'top' or 'bottom'
			source : function() {}    // callback for setting cutom thumb url
		},

		list  : null,
		items : null,
		count : 0,

		_create : function( obj ) {
			var opts = this.opts,
				str,
				list;

			str = '';

			$.each(obj.group, function (i) {
				str += '<li><a data-index="' + i + '" href="javascript:jQuery.fancybox.jumpto(' + i + ');"></a></li>';
			});

			this.list  = list = $('<ul>' + str + '</ul>');
			this.items = list.children();
			this.count = this.items.length;

			this.wrap = $('<div id="fancybox-thumbs" class="' + opts.position + '"></div>')
				.append(list)
				.wrapInner('<div class="inner" />')
				.wrapInner('<div class="outer" />')
				.appendTo('body');

			$('<a class="fancybox-thumb-prev" href="javascript:;"><span></span></a>')
				.click( $.proxy(this.prev, this) )
				.prependTo( this.wrap );

			$('<a class="fancybox-thumb-next" href="javascript:;"><span></span></a>')
				.click( $.proxy(this.next, this) )
				.appendTo( this.wrap );

			//Set dimensions and get initial width
			list.find('a').width( opts.width ).height( opts.height );

			this.width  = this.items.outerWidth(true);
			this.height = this.items.outerHeight(true);

			list.width( this.width * this.count ).height( this.height );
		},

		_loadPage : function() {
			var that = this,
				link,
				item,
				src;

			var callback = function( href ) {
				that._setThumb( link, href );
			};

			if (!this.list) {
				return;
			}

			// Find next one that is not already loaded
			link = this.list.find('a').slice( this.start, this.end + 1).not('.ready').first();

			if (link && link.length) {
				link.addClass('ready');

				item = F.group[ link.data('index') ];
				href = this._getThumb( item, callback );

				if ($.type(href) === 'string') {
					callback( href );

				} else if (!href) {
					this._loadPage();
				}
			}
		},

		_getThumb : function( item, callback ) {
			var that = this,
				href,
				rez;

			// First, call callback
			href = this.opts.source( item, callback );

			// Try to find thumbnail image from the link
			if (!href && item.element) {
				href = $(item.element).find('img').attr('src');
			}

			// Try to match youtube or vimeo
			if (!href && (rez = item.href.match(/(youtube\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*)).*/i))) {
				href = 'http://img.youtube.com/vi/' + rez[ 3 ] + '/mqdefault.jpg';
			}

			if (!href && (rez = item.href.match(/(?:vimeo(?:pro)?.com)\/(?:[^\d]+)?(\d+)(?:.*)/))) {
				$.getJSON('http://www.vimeo.com/api/v2/video/' + rez[ 1 ] + '.json?callback=?', {format: "json"}, function(data) {
					callback( data[0].thumbnail_small );
				});

				return true;
			}

			// If not found and item type is image, then use link url instead
			if (!href && item.type === 'image' && item.href) {
				href = item.href;
			}

			return href;
		},

		_setThumb : function( link, thumbUrl ) {
			var that = this;
			var go   = function() {
				// Start loading next thumb
				that._loadPage();
			}

			if (!this.list) {
				return;
			}

			$("<img />")
				.load(function() {
					var width       = this.width,
						height      = this.height,
						thumbWidth  = link.width(),
						thumbHeight = link.height(),
						widthRatio,
						heightRatio;

					if (!that.wrap || !width || !height) {
						go();
						return;
					}

					//Calculate thumbnail width/height and center it
					widthRatio  = width  / thumbWidth;
					heightRatio = height / thumbHeight;

					if (widthRatio >= 1 && heightRatio >= 1) {
						if (widthRatio > heightRatio) {
							width  = width / heightRatio;
							height = thumbHeight;

						} else {
							width  = thumbWidth;
							height = height / widthRatio;
						}
					}

					$(this).css({
						width  : Math.floor(width),
						height : Math.floor(height),
						'margin-top'    : Math.floor(thumbHeight * 0.3 - height * 0.3 ),
						'margin-left'   : Math.floor(thumbWidth  * 0.5 - width  * 0.5 )
					})
					.appendTo( link );

					go();
				})
				.error( go )
				.attr( 'src', thumbUrl );
		},

		_move : function( page ) {
			var left  = 0,
				speed = 400,
				pages,
				start,
				end;

			if (!this.wrap) {
				return;
			}

			pages = Math.ceil( this.count / this.itemsMin );

			if (page === undefined) {
				page = Math.floor( F.current.index / this.itemsMin ) + 1;
			}

			$(".fancybox-thumb-prev, .fancybox-thumb-next").hide();

			if ( pages < 2 ) {
				$.extend(this, {
					pages : pages,
					page  : 1,
					start : 0,
					end   : this.count
				});

				this.list.stop(true).css({
					'margin-left'  : 'auto',
					'margin-right' : 'auto',
					'left'         : 0
				});

				this._loadPage();

				return;
			}

			if (page <= 1) {
				page = 1;

			} else {
				$(".fancybox-thumb-prev").show();
			}

			if (page >= pages) {
				page = pages;

			} else {
				$(".fancybox-thumb-next").show();
			}

			start = (page - 1) * this.itemsMin;
			end   = (start + this.itemsMax) - 1;

			left  = (this.width * this.itemsMin * (page - 1) * -1);

			if (this.left === left) {
				return;
			}

			$.extend(this, {
				pages : pages,
				page  : page,
				start : start,
				end   : end,
				left  : left
			});

			this._loadPage();

			this.list.stop(true).animate({'margin-left' : left + 'px'}, speed);
		},

		prev : function() {
			this._move( this.page - 1 );
		},

		next : function() {
			this._move( this.page + 1 );
		},

		afterLoad : function(opts, obj) {
			var pos  = opts.position === 'bottom' ? 2 : 0;

			//Remove self if gallery does not have at least two items
			if (obj.group.length < 2) {
				obj.helpers.thumbs = false;

				return;
			}

			if (!this.wrap) {
				this._create( obj );
			}

			if (opts.margin !== false) {
				obj.margin[ pos ] = Math.max(((this.height) + 40), obj.margin[ pos ] );
			}
		},

		beforeShow : function(opts, obj) {
			if (this.items) {
				this.items.removeClass('fancybox-thumb-active');

				this.current = this.list.find("a[data-index='" + obj.index + "']").parent().addClass('fancybox-thumb-active');
			}
		},

		onUpdate: function() {
			if (!this.wrap) {
				return;
			}

			this.wrap.width( F.getViewport().w );

			this.view = this.list.parent().innerWidth();

			this.itemsMin = Math.floor( this.view / this.width );
			this.itemsMax = Math.ceil( this.view / this.width );

			this._move();
		},

		beforeClose : function() {
			// Remove thumbnails
			if (this.wrap) {
				this.wrap.stop(true).remove();
			}

			$.extend(this, {
				pages : 0,
				page  : 0,
				start : 0,
				end   : 0,
				count : 0,
				items : null,
				left  : null,
				wrap  : null,
				list  : null
			});
		}
	}
}(jQuery));