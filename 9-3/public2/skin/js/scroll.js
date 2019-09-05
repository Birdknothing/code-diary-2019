$(window).scroll(function() {
	if (($(window).scrollTop()) <= 50) {
		$(".header").removeClass("scrolled");
		$(".sidebar").fadeOut()
	} else {
		$(".header").addClass("scrolled");
		$(".sidebar").fadeIn()
	}
});

$(".wxkf").hover(function() {
	$(this).next(".wxkfcode").show()
});







