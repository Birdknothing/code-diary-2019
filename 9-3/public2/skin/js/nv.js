
	//µ¼º½Ðü¸¡ÌØÐ§
	$(window).scroll(function() {
		var targetTop = $(this).scrollTop();

		if (targetTop >= 220) {
			$(".header_wrap").addClass("header_scroll");
		} else {
			$(".header_wrap").removeClass("header_scroll");
		}
	});

