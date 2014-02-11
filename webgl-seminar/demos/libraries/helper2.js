function rotateY( point, theta ) {
    return [
        point[ 0 ] * Math.cos( theta ) - point[ 2 ] * Math.sin( theta ),
        point[ 1 ],
        point[ 0 ] * Math.sin( theta ) + point[ 2 ] * Math.cos( theta )
    ];
}
function rotateX( point, theta ) {
    return [
        point[ 0 ],
        point[ 1 ] * Math.cos( theta ) - point[ 2 ] * Math.sin( theta ),
        point[ 1 ] * Math.sin( theta ) + point[ 2 ] * Math.cos( theta ),
    ];
}
function clearCanvas() {
    ctx.clearRect( -MAX_Y * W / H, -MAX_Y, 2 * MAX_Y * W / H, 2 * MAX_Y );
}
var canvas = document.querySelector( 'canvas' );
var ctx = canvas.getContext( '2d' );
var W, H;
var MAX_Y = 2;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    W = canvas.width, H = canvas.height;
    var ratio = W / H;
    ctx.scale( W / ratio / 2 / MAX_Y, -H / 2 / MAX_Y );
    ctx.translate( ratio * MAX_Y, -MAX_Y );
}

resize();

window.addEventListener( 'resize', resize );

function drawPoint( x, y, color ) {
    ctx.fillStyle = color || 'white';
    ctx.fillRect( x, y, 0.01, 0.01 );
}

function drawTriangle( x0, y0, x1, y1, x2, y2, color ) {
    ctx.fillStyle = color || 'white';
    ctx.beginPath();
    ctx.moveTo( x0, y0 );
    ctx.lineTo( x1, y1 );
    ctx.lineTo( x2, y2 );
    ctx.fill();
}
