var customHTML = {};

$.get('main.md', function(md) {
    var html = markdown.toHTML(md);
    Object.keys(customHTML).forEach(function (key) {
        html = html.replace(key, customHTML[key]);
    });
    $('.content').html(html);
    contentLoaded();
});
var iframe;
function contentLoaded() {
    iframe = document.getElementsByTagName('iframe')[0];
};
var cube = {
    over: function() {
    },
    out: function() {
    },
    click: function() {
        iframe.style.display = 'none';
    }
};
