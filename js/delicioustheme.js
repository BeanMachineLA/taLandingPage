$(document).ready(function(){
	var top = $("#topContainer");
	var getApp = $("#getappContainer").offset().top;
	var contentWrapper = $("#contentWrapper");
	var naviWrap = $("#navigationWrap");
	var windowH = $(window);
	var headerHeight = 0;
	var folMenu = $("#followMenu");
	var revWrap = $(".revWrap");
	var revContain = $("#reviewContainer");
	var resMenuToggle = $("#responsiveMenuToggle");
	
	//generate responsive menu
	$( ".mainMenu" ).clone().prependTo( "#followMenu" );

	var lastId,
	    topMenu = $("#followMenu .mainMenu"),
	    topMenuHeight = 76,
	    // All list items
	    menuItems = topMenu.find("a"),
	    // Anchors corresponding to menu items
	    scrollItems = menuItems.map(function(){
	      var item = $($(this).attr("href"));
	      if (item.length) { return item; }
	    });

	//init style of header
	window.setTimeout(initDelicious, 1000);

	/**
	 * 
	 * scroll funciton
	 * 
	 */
	$(window).scroll(function() {
		bgPos = $(window).scrollTop() * 1.2;
		//$('.textureBgSection').css('background-position', '0px '+bgPos+'px');


	   // Get container scroll position
	   var fromTop = $(this).scrollTop() + topMenuHeight;
	   
	   // Get id of current scroll item
	   var cur = scrollItems.map(function(){
	     if ($(this).offset().top <= (fromTop+5))
	       return this;
	   });
	   // Get the id of the current element
	   cur = cur[cur.length-1];
	   var id = cur && cur.length ? cur[0].id : "";
	   
	   if (lastId !== id) {
	       lastId = id;
	       // Set/remove active class
	       menuItems
	         .parent().removeClass("menuActive")
	         .end().filter("[href=#"+id+"]").parent().addClass("menuActive");
	   }      

		if (headerHeight !== 0 && ($(window).scrollTop()+50) > headerHeight) {
			if (!folMenu.hasClass("fmshown")) {
				folMenu.addClass("fmshown");
				//folMenu.stop().fadeIn(300); 
			}

		}
		else {
			if (folMenu.hasClass("fmshown")) {
				folMenu.removeClass("fmshown");
				//folMenu.stop().fadeOut(300);
			}
		}

	});

	$(".mainMenu a, #layerslider a").click(function(e) {
		e.preventDefault();
		var target = $(this).attr("href");
		//alert();

     $('html,body').animate({
         scrollTop: ($(target).offset().top - topMenuHeight)
    }, 800);
	});

	//reviews section
	var revCount = $('.revWrap').length;
	var naviWrap = $("#revsNavi");

	$(".revWrap").eq(0).addClass("revWrapActive");

	for (var i = 0; i < revCount; i++) {
		var revBullet = document.createElement("span");
		revBullet.className = "revBullet";

		revBullet.onclick = function() {
			if (this.className == "revBullet revBulletActive")
				return;

			var thindex = $("#revsNavi span").index( this );

			var mv = $(".revWrap").eq(0).width();
			$(".revViewport").css({
		        transform: 'translate('+(mv * thindex * (-1))+'px, 0px)',
		        '-webkit-transform' : 'translate('+(mv * thindex * (-1))+'px, 0px)'
		    });

		    $(".revWrapActive").removeClass("revWrapActive");
		    $(".revWrap").eq(thindex).addClass("revWrapActive");

		    $(".revBulletActive").removeClass('revBulletActive');
		    $(".revBullet").eq(thindex).addClass("revBulletActive");
		};

		if (i == 0) {
			revBullet.className = "revBullet revBulletActive";
			naviWrap.append(revBullet);
		}
		else
			naviWrap.append(revBullet);
	}


	//	ramotion swipe.js
	+function() {
		function vector(A, B) {
			return {
				x: B.x - A.x,
				y: B.y - A.y
			};
		}
		function module(vector) {
			return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
		}

		function Swipe(node, options) {
			var swipe = this;

			swipe.data = {};
			swipe.node = $(node);
			swipe.options = options || {};

			//  MOUSE EVENTS
			function mousePoint(event) {
				return {
					x: event.clientX,
					y: event.clientY
				};
			}
			swipe.node.on('mousedown', function(event) {
				swipe.start(event, mousePoint(event));
			});
			swipe.node.on('mousemove', function(event) {
				swipe.move(event, mousePoint(event));
			});
			$(window).on('mouseup', function(event) {
				swipe.end(event, mousePoint(event));
			});

			//  TOUCH EVENTS
			function touchPoint(event) {
				return {
					x: event.originalEvent.touches[0].clientX,
					y: event.originalEvent.touches[0].clientY
				};
			}
			swipe.node.on('touchstart', function(event) {
				swipe.start(event, touchPoint(event));
			});
			swipe.node.on('touchmove', function(event) {
				swipe.move(event, touchPoint(event));
			});
			$(window).on('touchend', function(event) {
				swipe.end(event);
			});
		}
		Swipe.prototype = {
			constructor: Swipe,

			swipeStart: false,
			swiping: false,
			startCondition: false,
			startConditionFlag: false,
			data: null,
			node: null,

			setCurrentData: function(event, position) {
				this.data.eventType = event.originalEvent instanceof window.MouseEvent ? 'mouse' : event.originalEvent instanceof window.TouchEvent ? 'touch' : null;

				this.data.current = position || this.data.current;
				this.data.currentTime = Date.now();

				var pointA = this.data.start;
				var pointB = this.data.current;

				var vectorA0 = vector(pointA, {
					x: this.data.start.x,
					y: 0
				});
				var vectorAB = vector(pointA, pointB);
				var vectorBA = vector(pointB, pointA);

				var scalarProduct = vectorA0.x * vectorAB.x + vectorA0.y * vectorAB.y;
				var moduleA0 = module(vectorA0);
				var moduleAB = module(vectorAB);

				var deg = Math.acos(scalarProduct / (moduleA0 * moduleAB)) * (180 / Math.PI);

				this.data.degree = pointA.x > pointB.x ? 360 - deg : deg;

				this.data.delta = vectorBA;
				this.data.length = module(vectorBA);
			},
			start: function(event, position) {
				this.swipeStart = true;
				this.data.start = position;
			},
			move: function(event, position) {
				if(!this.swipeStart || !this.data.start) {
					return;
				}

				this.setCurrentData(event, position);

				if(!this.swiping) {
					if($.isFunction(this.options.startWhen) ? this.options.startWhen.call(this.node[0], this.data) : true) {
						if(!this.startConditionFlag) {
							this.startCondition = $.isFunction(this.options.startIf) ? this.options.startIf.call(this.node[0], this.data) : true;
						}
						this.startConditionFlag = true;

						if(!this.startCondition) {
							return;
						}

						this.data.startTime = Date.now();
						this.node.trigger('swipestart', this.data);
					} else {
						return;
					}
				}
				this.swiping = true;

				this.node.trigger('swipe', this.data);
			},
			end: function(event) {
				if(this.swiping) {
					this.setCurrentData(event);
					this.node.trigger('swipeend', this.data);
				}

				this.swipeStart = false;
				this.swiping = false;
				this.startCondition = false;
				this.startConditionFlag = false;
				this.data = {};
			}
		};
		$.fn.swipe = function(options) {
			return this.each(function() {
				if(!($(this).data('swipe') instanceof Swipe)) {
					$(this).data('swipe', new Swipe(this, options));
				}
			});
		};
	}();



	$('#reviewContainer')
		.swipe({
			startIf: function(data) {
				return (20 <= data.degree && data.degree <= 160) || (200 <= data.degree && data.degree <= 340);
			}
		})
		.on('mousemove touchmove', function(event) {
			!!$(this).data('swipe').swiping && event.preventDefault();
		})
		.on('swipeend', function(event, data) {
			var revs = $(".revWrap");
			var thindex = revs.index($(".revWrap.revWrapActive")[0]) + (data.degree > 180 ? 1 : -1);

			if(thindex < 0 || revs.length <= thindex) {
				return;
			}

			var mv = revs.eq(0).width();

			$(".revViewport").css({
				transform: 'translate('+(mv * thindex * (-1))+'px, 0px)',
				'-webkit-transform' : 'translate('+(mv * thindex * (-1))+'px, 0px)'
			});

			$(".revWrapActive").removeClass("revWrapActive");
			revs.eq(thindex).addClass("revWrapActive");

			$(".revBulletActive").removeClass('revBulletActive');
			$(".revBullet").eq(thindex).addClass("revBulletActive");
		});



	function getBrowserScrollSize(){
		var css = {
			"border":  "none",
			"height":  "200px",
			"margin":  "0",
			"padding": "0",
			"width":   "200px"
		};

		var inner = $("<div>").css($.extend({}, css));
		var outer = $("<div>").css($.extend({
			"left":       "-1000px",
			"overflow":   "scroll",
			"position":   "absolute",
			"top":        "-1000px"
		}, css)).append(inner).appendTo("body")
			.scrollLeft(1000)
			.scrollTop(1000);

		var scrollSize = {
			"height": (outer.offset().top - inner.offset().top) || 0,
			"width": (outer.offset().left - inner.offset().left) || 0
		};

		outer.remove();
		return scrollSize;
	}

	var scrollBarOffset = getBrowserScrollSize();

	var screensContainer = $('#screensContainer');
	var screensContent = screensContainer.find('.screens .screens-content');
	var screens = screensContent.find('.item');
	var screensNavi = $('#screensNavi');

	var activeScreen = 0;

	function scrollToScreen(index) {
		var bullets = screensNavi.find('.scrBullet');

		if(index < 0 || index >= bullets.length) {
			return;
		}

		var vw = $(window).width() + scrollBarOffset.width;
		var screenWidth = vw <= 767 ? 100 : vw <= 1169 ? 50 : 25;
		screensContent.css('transform', 'translateX(' + (-screenWidth * Math.min(index, screens.length - (vw <= 767 ? 1 : vw <= 1169 ? 2 : 4))) + '%)');
		screensNavi.find('.srcBulletActive').removeClass('srcBulletActive');
		bullets.eq(index).addClass('srcBulletActive');

		activeScreen = index;
	}

	screens.each(function(index) {
		var bullet = $('<span class="scrBullet"></span>');

		if(!index) {
			bullet.addClass('srcBulletActive');
		}

		bullet.click(function() {
			scrollToScreen(index);
		});

		screensNavi.append(bullet);
	});

	screensContainer
		.swipe({
			startIf: function(data) {
				return (20 <= data.degree && data.degree <= 160) || (200 <= data.degree && data.degree <= 340);
			}
		})
		.on('mousemove touchmove', function(event) {
			!!$(this).data('swipe').swiping && event.preventDefault();
		})
		.on('swipeend', function(event, data) {
			scrollToScreen(activeScreen + (data.degree > 180 ? 1 : -1));
		});

	function setBullet() {
		var bullets = screensNavi.find('.scrBullet').show();
		var vw = $(window).width() + scrollBarOffset.width;
		var lastActiveBullet = screens.length - (vw <= 767 ? 1 : vw <= 1169 ? 2 : 4);
		bullets.filter(':gt(' + lastActiveBullet + ')').hide();
		scrollToScreen(Math.min(activeScreen, lastActiveBullet));
	}
	setBullet(0);
	$(window).resize(setBullet);






	/**
	 * 
	 * screens config
	 * 
	 */
	//var scrnItem = $("#screensWrap .filtered"),
	//	arrowRight = $("#screensRightAr"),
	//	arrowLeft = $("#screensLeftAr"),
	//	nrOfSlides = 0,
	//	currSlide = 1;
    //
	//if ($(window).width() < 768) {
	//	nrOfSlides = $("#screensWrap .filtered").length;
    //
	//	if (scrnItem.length < 1) {
	//		$(".screensArrows").hide();
	//	}
	//	else {
	//		arrowRight.addClass("screensArrowsActive");
	//		arrowLeft.removeClass("screensArrowsActive");
	//	}
	//}
	//else if ($(window).width() >= 768 && $(window).width() <= 1070) {
	//	nrOfSlides = Math.ceil(scrnItem.length / 2);
    //
	//	if (scrnItem.length < 3) {
	//		$(".screensArrows").hide();
	//	}
	//	else {
	//		arrowRight.addClass("screensArrowsActive");
	//		arrowLeft.removeClass("screensArrowsActive");
	//	}
	//}
	//else {
	//	nrOfSlides = Math.ceil(scrnItem.length / 4);
    //
	//	if (scrnItem.length < 5) {
	//		$(".screensArrows").hide();
	//	}
	//	else {
	//		arrowRight.addClass("screensArrowsActive");
	//		arrowLeft.removeClass("screensArrowsActive");
	//	}
	//}
    //
	//arrowRight.click(function() {
	//	if (!arrowRight.hasClass("screensArrowsActive"))
	//		return;
    //
	//	var currentWitdh = $("#screensOfHide").width()+18;
	//	$("#screensWrapOuter").css({
	//        transform: 'translate(-'+((currentWitdh*currSlide))+'px, 0px)',
	//        '-webkit-transform' : 'translate(-'+((currentWitdh*currSlide))+'px, 0px)'
	//    });
	//    currSlide++;
    //
	//    if (currSlide == nrOfSlides)
	//    	arrowRight.removeClass("screensArrowsActive");
	//	if (!arrowLeft.hasClass("screensArrowsActive"))
	//		arrowLeft.addClass("screensArrowsActive");
	//});
    //
	//arrowLeft.click(function() {
	//	if (!arrowLeft.hasClass("screensArrowsActive"))
	//		return;
    //
	//	currSlide--;
	//	var addPX = 18
	//	if (currSlide == 1)
	//		addPX = 0;
    //
	//	var currentWitdh = $("#screensOfHide").width()+addPX;
	//	$("#screensWrapOuter").css({
	//        transform: 'translate(-'+((currentWitdh*(currSlide-1)))+'px, 0px)',
	//        '-webkit-transform' : 'translate(-'+((currentWitdh*(currSlide-1)))+'px, 0px)'
	//    });
    //
	//    if (currSlide == 1)
	//    	arrowLeft.removeClass("screensArrowsActive");
	//	if (!arrowRight.hasClass("screensArrowsActive"))
	//		arrowRight.addClass("screensArrowsActive");
	//});


	/**
	 * 
	 * reconfigure screens on filter
	 * 
	 */
	/*$grid.on('filterer.shuffle', function() {

	    //arrowLeft.removeClass("screensArrowsActive");

	});

	$grid.on('filtered.shuffle', function() { 
	    currSlide = 1;

		$("#screensWrapOuter").css({
	        transform: 'translate(0px, 0px)',
	        '-webkit-transform' : 'translate(0px, 0px)'
	    });

		scrnItem = $("#screensWrap .filtered");
		if ($(window).width() < 768) {
			nrOfSlides = scrnItem.length;

			if (scrnItem.length < 1) {
				arrowRight.removeClass("screensArrowsActive");
				arrowLeft.removeClass("screensArrowsActive");
			}
			else {
				$(".screensArrows").show();
				arrowRight.addClass("screensArrowsActive");
				arrowLeft.removeClass("screensArrowsActive");
			}
		}
		else if ($(window).width() >= 768 && $(window).width() <= 1070) {
			nrOfSlides = Math.ceil(scrnItem.length / 2);

			if (scrnItem.length < 3) {
				arrowRight.removeClass("screensArrowsActive");
				arrowLeft.removeClass("screensArrowsActive");
			}
			else {
				$(".screensArrows").show();
				arrowRight.addClass("screensArrowsActive");
				arrowLeft.removeClass("screensArrowsActive");
			}
		}
		else {
			nrOfSlides = Math.ceil(scrnItem.length / 4);
			console.log(scrnItem.length);
			if (scrnItem.length < 5) {
				//$(".screensArrows").hide();
				arrowRight.removeClass("screensArrowsActive");
				arrowLeft.removeClass("screensArrowsActive");
			}
			else {
				$(".screensArrows").show();
				arrowRight.addClass("screensArrowsActive");
				arrowLeft.removeClass("screensArrowsActive");
			}
		}
	});*/

	/**
	 * responsive menu show on click
	 * 
	 */
	resMenuToggle.click(function(){
		if (!folMenu.hasClass("fmToggled")) {
			folMenu.addClass("fmToggled");
			//folMenu.stop().fadeIn(300); 
		} else if (folMenu.hasClass("fmToggled")) {
			folMenu.removeClass("fmToggled");
			//folMenu.stop().fadeOut(300);
		}
	});

	/**
	 * 
	 * change styles on resize
	 * 
	 */
	function resizeesizedw() {
		initDelicious();
    //
	//	$(".revViewport").css({
	//        transform: 'translate(0px, 0px)',
	//        '-webkit-transform' : 'translate(0px, 0px)'
	//    });
    //
	//    $(".revBulletActive").removeClass('revBulletActive');
	//    $(".revBullet").eq(0).addClass("revBullet revBulletActive");
	//    $(".revWrapActive").removeClass("revWrapActive");
	//    $(".revWrap").eq(0).addClass("revWrapActive");
    //
	//	//screens resizer
	//	scrnItem = $("#screensWrap .filtered");
	//	currSlide = 1;
	//	if ($(window).width() < 768) {
	//		nrOfSlides = scrnItem.length;
    //
	//		if (scrnItem.length < 1) {
	//			$(".screensArrows").hide();
	//		}
	//		else {
	//			$(".screensArrows").show();
	//			arrowRight.addClass("screensArrowsActive");
	//			arrowLeft.removeClass("screensArrowsActive");
	//		}
	//	}
	//	else if ($(window).width() >= 768 && $(window).width() <= 1070) {
	//		nrOfSlides = Math.ceil(scrnItem.length / 2);
    //
	//		if (scrnItem.length < 3) {
	//			$(".screensArrows").hide();
	//		}
	//		else {
	//			$(".screensArrows").show();
	//			arrowRight.addClass("screensArrowsActive");
	//			arrowLeft.removeClass("screensArrowsActive");
	//		}
	//	}
	//	else {
	//		nrOfSlides = Math.ceil(scrnItem.length / 4);
    //
	//		if (scrnItem.length < 5) {
	//			$(".screensArrows").hide();
	//		}
	//		else {
	//			$(".screensArrows").show();
	//			arrowRight.addClass("screensArrowsActive");
	//			arrowLeft.removeClass("screensArrowsActive");
	//		}
	//	}
    //
	//	$("#screensWrapOuter").css({
	//        transform: 'translate(0px, 0px)',
	//        '-webkit-transform' : 'translate(0px, 0px)'
	//    });
	};
    //
    var doit;
	window.onresize = function(){
	  clearTimeout(doit);
	  doit = setTimeout(resizeesizedw, 300);
	};

	/**
	 * 
	 * set header slider dimensions and stuff
	 * 
	 */
	function initDelicious() {
		headerHeight = top.height();
		contentWrapper.css('top', headerHeight);
		revWrap.css('max-width', revWrap.parent().parent().width());

		//adjust on small screens
		if ((headerHeight-100) > $(window).height())
			top.css('position', 'absolute');
		else
			top.css('position', 'fixed');
	}
});


function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();
    //console.log(rect.top)
    return (
        rect.top == 0
    );
}


function animate(options) {
	var start = performance.now();

	requestAnimationFrame(function animate(time) {
		var timeFraction = (time - start) / options.duration;
		if (timeFraction > 1) timeFraction = 1;

		var progress = options.timing(timeFraction);

		options.draw(progress);

		if(timeFraction < 1) {
			requestAnimationFrame(animate);
		}
	});
}

function calculate(node, duration) {
	$(node || '[data-anim]').each(function() {
		var node = $(this);
		var type = node.data('anim');
		var from = 0;
		var to;

		switch(type) {
			case 'int':
				to = parseInt(node.text());
				break;
			case 'float':
				to = parseFloat(node.text());
				break;
		}

		if(!to) {
			return;
		}

		animate({
			duration: duration,
			timing: function(timeFraction) {
				return timeFraction;
			},
			draw: function(progress) {
				var number = (to - from) * progress + from;

				switch(type) {
					case 'int':
						number = parseInt(number);
						break;
					case 'float':
						number = number.toFixed(1);
						break;
				}

				node.text(number < 0 ? 0 : number);
			}
		});
	});
}

function nodeAtViewPort(node) {
	var rect = node[0].getBoundingClientRect();
	return rect.top >= 0 && rect.bottom <= document.documentElement.clientHeight;
}
function visibleBlocks() {
	$('.counter-row .counter-cell:not(.counted)').each(function() {
		var node = $(this);
		if(nodeAtViewPort(node)) {
			node.addClass('counted visible');
			calculate(node.find('[data-anim]'), parseFloat(node.css('transition-duration')) * 1000);
		}
	});
	$('#aboutContainer .iconColWrap:not(.visible)').each(function() {
		var node = $(this);
		if(nodeAtViewPort(node)) {
			node.addClass('visible animated');
			setTimeout(function() {
				node.removeClass('animated');
			}, 1000);
		}
	});
	$('#featureContainer .iconRightColWrap:not(.visible), #featureContainer .iconLeftColWrap:not(.visible)').each(function() {
		var node = $(this);
		if(nodeAtViewPort(node)) {
			node.addClass('visible animated');
			setTimeout(function() {
				node.removeClass('animated');
			}, 1000);
		}
	});


	var topContainer = $('#topContainer');
	topContainer.css('opacity', +!($(window).scrollTop() > topContainer[0].offsetHeight));
}
visibleBlocks();
$(window).on('scroll', visibleBlocks);



$('.download-app').click(function(event) {
	event.preventDefault();

	if(/Android/i.test(navigator.userAgent)) {
		location.href = 'https://play.google.com/store/apps/details?id=com.talnts.app.android';
	} else
	if(/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		location.href = 'https://itunes.apple.com/app/id984655233';
	} else {
		$('html, body').animate({
			scrollTop: $('#getappContainer').offset().top
		});
	}
});