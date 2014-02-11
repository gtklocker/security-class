var canvas = document.getElementById( 'canvas' );
var ctx = canvas.getContext( '2d' );
var W = canvas.width, H = canvas.height;

ctx.scale( W / 2, -H / 2 );
ctx.translate( 1, -1 );

function drawPoint( x, y ) {
    ctx.fillStyle = 'white';
    ctx.fillRect( x, y, 0.01, 0.01 );
}
