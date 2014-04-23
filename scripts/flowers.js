$.get('http://sophron.latthi.com/wall_of_shame.html', function(html) {
	var list = $('<ul class="faces flowerfaces"/>');
	var fragment = $(html);
	$('li', fragment).each(function (index, e) {
		email = $('h2', e).text().replace(' [at] ', '@')
		$('<img/>').attr('src', 'http://www.gravatar.com/avatar/' + md5(email)).appendTo($('h2', e))
		list.append(e)
	});
	$('.content').html(list);
});
