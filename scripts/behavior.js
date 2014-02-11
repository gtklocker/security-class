var customHTML = {
    '{{cube}}': "<iframe src='webgl-seminar/demos/2-shading/6-companion-cube-shaded.html'></iframe>",
    '{{block}}': '<div class="block">',
    '{{/block}}': '</div>',
    '<p></p>': ''
};
$.get('main.md', function(md) {
    var html = markdown.toHTML(md);
    Object.keys(customHTML).forEach(function (key) {
        html = html.replace(key, customHTML[key]);
    });
    console.log(html);
    $('.content').html(html);
});
