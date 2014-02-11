var customHTML = {};

$.get('main.md', function(md) {
    var html = markdown.toHTML(md);
    Object.keys(customHTML).forEach(function (key) {
        html = html.replace(key, customHTML[key]);
    });
    $('.content').html(html);
});
