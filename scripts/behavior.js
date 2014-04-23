var customHTML = {};

function loadMD(filename) {
    if (filename === '') {
        filename = 'main';
    }
    filename += '.md';
    $('.content').html('Φόρτωση...');
    $.get(filename, function(md) {
        var html = markdown.toHTML(md);
        Object.keys(customHTML).forEach(function (key) {
            html = html.replace(key, customHTML[key]);
        });
        $('.content').html(html);
        contentLoaded();
    });
}

var iframe, lastHash = '';

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

setInterval(function() {
    var currentHash = location.hash.replace('#', '');

    if (lastHash != currentHash) {
        lastHash = currentHash;

        loadMD(currentHash);
    }
}, 100);

loadMD('');
