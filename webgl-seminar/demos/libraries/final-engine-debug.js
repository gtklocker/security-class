/**
 * Emulate FormData for some browsers
 * MIT License
 * (c) 2010 François de Metz
 */
( function(w) {
    if ( w.FormData ) {
        return;
    }

    function FormData() {
        this.fake = true;
        this.boundary = "--------FormData" + Math.random();
        this._fields = [];
    }

    FormData.prototype.append = function(key, value) {
        this._fields.push( [ key, value ] );
    };

    FormData.prototype.toString = function() {
        var boundary = this.boundary;
        var body = "";
        this._fields.forEach( function( field ) {
            body += "--" + boundary + "\r\n";
//            // file upload
//            if (field[1].name) {
//                var file = field[1];
//                body += "Content-Disposition: form-data; name=\""+ field[0] +"\"; filename=\""+ file.name +"\"\r\n";
//                body += "Content-Type: "+ file.type +"\r\n\r\n";
//                body += file.getAsBinary() + "\r\n";
//            } else {
                body += "Content-Disposition: form-data; name=\""+ field[0] +"\";\r\n\r\n";
                body += field[1] + "\r\n";
//            }
        } );
        body += "--" + boundary +"--";
        return body;
    };

    w.FormData = FormData;
}( window ) );
function assert( condition, description ) {
    if ( !condition ) {
        throw description;
    }
}


/**
 * @param {...*} value
 */
function assertIn( value ) {
    for ( var i = 1; i < arguments.length - 1; ++i ) {
        if ( value == arguments[ i ] ) {
            return;
        }
    }
    throw arguments[ arguments.length - 1 ];
}

var debug = {
    TRACE: 0,
    WARNING: 1,
    ERROR: 2,
    log: function( level, message ) {
        console.log( message );
    }
};
Object.defineProperty( Function.prototype, "extend", {
    /**
     * @this {Function}
     *
     * Implementation of classical inheritance. I use the defineProperty method on the
     * Object.prototype in order to make it non-enumerable. If set directly it breaks all
     * the "for( i in obj )" loops
    */
    value: function() {
        var method, l = arguments.length;
        while ( l-- ) {
            var parent = arguments[ l ];

            //Continue with the overriding handling
            for ( method in parent.prototype ) {
                //Every prototype has the property constructor. No need to override.
                if ( method == 'constructor' ) {
                    continue;
                }
                /* If a parent method is overrided provide a way to call it by setting
                 * the ParentClass_overridedMethod method on child's prototype
                 */
                var propertyDescriptor = Object.getOwnPropertyDescriptor( parent.prototype, method );
                if ( propertyDescriptor !== null ) {
                    if ( this.prototype.hasOwnProperty( method ) ) {
                        Object.defineProperty( this.prototype, parent.name + '_' + method, propertyDescriptor  );
                    }
                    else {
                        Object.defineProperty( this.prototype, method, propertyDescriptor );
                    }
                }
            }
        }

        var propertiesObject = {};
        for ( method in this.prototype ) {
            propertiesObject[ method ] = Object.getOwnPropertyDescriptor( this.prototype, method );
        }

        this.prototype = Object.create( arguments[ 0 ].prototype, propertiesObject );
    }
} );
/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

function makeRequestAnimationFrame() {
    if ( typeof window.webkitRequestAnimationFrame !== 'undefined' ) {
        return window.webkitRequestAnimationFrame;
    }
    if ( typeof window.mozRequestAnimationFrame !== 'undefined' ) {
        return window.mozRequestAnimationFrame;
    }
    if ( typeof window.oRequestAnimationFrame !== 'undefined' ) {
        return window.oRequestAnimationFrame;
    }
    if ( typeof window.msRequestAnimationFrame !== 'undefined' ) {
        return window.msRequestAnimationFrame;
    }

    function fallback( callback ) {
       window.setTimeout( callback, 1000 / 60 );
    }

    return fallback;
}

if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = makeRequestAnimationFrame();
}
/* Method so you can call foo.toArray() in any TypedArray and
 * take a copy of it in a javascript Array. Used primarly for
 * serialization of buffers into JSON.
 */
Object.defineProperty( Float32Array.prototype, "toArray", {
    /**
     * @this {Float32Array}
     */
    value: function() {
        var l = this.length;
        var ret = [];
        while ( l-- ) {
            ret[ l ] = this[ l ];
        }
        return ret;
    }
} );

Object.defineProperty( Uint16Array.prototype, "toArray", {
    /**
     * @this {Uint16Array}
     */
    value: function() {
        var l = this.length;
        var ret = [];
        while ( l-- ) {
            ret[ l ] = this[ l ];
        }
        return ret;
    }
} );
Object.defineProperty( Number.prototype, "isPowerOfTwo", {
    value: function() {
         return ( this > 0 ) && ( this & ( this - 1 ) ) === 0;
    }
} );
/**
 * @class
 *
 * Generates Universally Unique IDentifiers compliant to RFC-4112.
 *
 * <p>UUIDs are used for creating identifiers that are (practically) unique throughout a network.</p>
 *
 * <p>This way, network communication, especially for small sized games, can be created without
 * significant coordination from a server.</p>
 *
 * <p>To create a UUID, call the static {@link generate} method.</p>
 *
 * <code>
 * function MyConstructor() {
 *     this.uuid = UUID.generate();
 * }
 </code>
 *
 * <p>The {@link generate} method generates UUID that is in a compressed form,
 * suitable for sending through the network, and so contains unprintable characters too.</p>
 *
 * <p>If you want a printable version, you should generate a UUID in canonical form:</p>
 * <code>
 * this.uuid = UUID.generateCanonicalForm();
 </code>
 *
 * You can also convert between the forms with {@link toCanonicalForm} and {@link fromCanonicalForm}.
 */
function UUID() {
}

/**
 * Generates a compressed 128-bit UUID string.
 * @returns String
 */
UUID.generate = function() {
    var s = "", i, high, low;
    for ( i = 0; i < 16; ++i ) {
        if ( i == 6 ) {
            low = 0x40;
            high = 0x4F;
        }
        else if ( i == 8 ) {
            low = 0x80;
            high = 0xBF;
        }
        else {
            low = 0;
            high = 256;
        }
        s += String.fromCharCode( Math.floor( Math.random() * ( high - low ) + low ) );
    }
    return s;
};

/**
 * Generates a UUID in canonical form.
 * @returns String
 */
UUID.generateCanonicalForm = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function( c ) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : ( r & 0x3 | 0x8 );
        return v.toString(16);
    } );
};

/**
 * Converts UUID to a printable version.
 * @param {String} uuid
 * @returns String
 */
UUID.toCanonicalForm = function( uuid ) {
    var canonical = "", hex;
    for ( var i = 0; i < 16; ++i ) {
        if ( i == 4 || i == 6 || i == 8 || i == 10 ) {
            canonical += "-";
        }
        hex = uuid.charCodeAt( i ).toString( 16 );
        if ( hex.length == 1 ) {
            hex = "0" + hex;
        }
        canonical += hex;
    }
    return canonical;
};
/**
 * Converts printable version back to original (compressed) form.
 * @param {String} canonical The canonical form of a UUID.
 * @returns String UUID as a string.
 */
UUID.fromCanonicalForm = function( canonical ) {
    var s = "", i;
    canonical = canonical.replace( /-/g, '' );
    for ( i = 0; i < 16; ++i ) {
        s += String.fromCharCode( parseInt( canonical[ i * 2 ] + canonical[ i * 2 + 1 ], 16 ) );
    }
    return s;
};
/*global
    Matrix4      :  false,
    Quaternion   :  false,
    Vector3      :  false,
    Matrix3      :  false
*/

/**
 * @class
 *
 * TempVars are preinstantiated objects that can be used for temporary results.
 */
function TempVars() {
}

/**
 * Make sure the tempvars used are not overwritten.
 * Call lock on every method before getting any tempvars.
 */
TempVars.lock = function() {
    TempVars.vector3ReleasePoints.push( TempVars.vector3Counter );
    TempVars.matrix4ReleasePoints.push( TempVars.matrix4Counter );
    TempVars.matrix3ReleasePoints.push( TempVars.matrix3Counter );
    TempVars.quaternionReleasePoints.push( TempVars.quaternionCounter );
};

/**
 * Allow locked tempvars to be overwritten again.
 * Call release after a method is done using its tempvars.
 */
TempVars.release = function() {
    TempVars.vector3Counter = TempVars.vector3ReleasePoints.pop();
    TempVars.matrix4Counter = TempVars.matrix4ReleasePoints.pop();
    TempVars.matrix3Counter = TempVars.matrix3ReleasePoints.pop();
    TempVars.quaternionCounter = TempVars.quaternionReleasePoints.pop();
};

TempVars.vector3ReleasePoints = [];
TempVars.vector3Counter = 0;
TempVars.vector3Stack = [];

/** @public */
TempVars.getVector3 = function() {
    var ret = TempVars.vector3Stack[ TempVars.vector3Counter++ ];
    if ( !ret ) {
        ret = TempVars.vector3Stack[ TempVars.vector3Counter - 1 ] = new Vector3();
    }
    return ret;
};

TempVars.matrix4ReleasePoints = [];
TempVars.matrix4Counter = 0;
TempVars.matrix4Stack = [];

/** @public */
TempVars.getMatrix4 = function() {
    var ret = TempVars.matrix4Stack[ TempVars.matrix4Counter++ ];
    if ( !ret ) {
        ret = TempVars.matrix4Stack[ TempVars.matrix4Counter - 1 ] = new Matrix4();
    }
    return ret;
};

TempVars.matrix3ReleasePoints = [];
TempVars.matrix3Counter = 0;
TempVars.matrix3Stack = [];

/** @public */
TempVars.getMatrix3 = function() {
    var ret = TempVars.matrix3Stack[ TempVars.matrix3Counter++ ];
    if ( !ret ) {
        ret = TempVars.matrix3Stack[ TempVars.matrix3Counter - 1 ] = new Matrix3();
    }
    return ret;
};

TempVars.quaternionReleasePoints = [];
TempVars.quaternionCounter = 0;
TempVars.quaternionStack = [];

/** @public */
TempVars.getQuaternion = function() {
    var ret = TempVars.quaternionStack[ TempVars.quaternionCounter++ ];
    if ( !ret ) {
        ret = TempVars.quaternionStack[ TempVars.quaternionCounter - 1 ] = new Quaternion();
    }
    return ret;
};
/**
 * @class
 *
 * Class for convenient HTTP requests.
 */
function Request() {
}


/**
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 * @param {Function} callback
 */
Request.send = function( method, url, data, callback ) {
    if ( typeof data === 'function' ) {
        callback = data;
        data = null;
    }
    var formData = new FormData();
    if ( data ) {
        for ( var field in data ) {
            formData.append( field, data[ field ] );
        }
    }
    var v = new XMLHttpRequest();
    v.open( method, url );
    if ( callback ) {
        v.onreadystatechange = function() {
            if ( v.readyState == 4 ) {
                callback( v.responseText );
            }
        };
    }
    v.send( formData );
};

/**
 * @param {String} url
 * @param {Object} data
 * @param {Function} callback
 */
Request.get = function( url, data, callback ) {
    Request.send( 'GET', url, data, callback );
};

/**
 * @param {String} url
 * @param {Object} data
 * @param {Function} callback
 */
Request.post = function( url, data, callback ) {
    Request.send( 'POST', url, data, callback );
};
/*global assert: false */

/**
 * @class
 * Abstract class for objects that fire events.
 *
 * Similar API to the node.js EventEmitter.
 *
 * @constructor
 */
function EventEmitter() {
    this._events_ = [];
}

EventEmitter.prototype = {
    constructor: EventEmitter,
    /**
     * Register listener to an event.
     * @param {String} name The name of the event.
     * @param {Function} action
     */
    on: function( name, action ) {
        /*DEBUG*/
            assert( typeof action == "function", 'Tried to add a listener that is not a function' );
        /*DEBUG_END*/
        if ( !( name in this._events_ ) ) {
            this._events_[ name ] = [];
        }
        this._events_[ name ].push( action );
    },
    /**
     * Like method {@link on} but callback is called only the first time.
     * @param {String} name The name of the event
     * @param {Function} action
     * @see EventEmitter.on
     */
    once: function( name, action ) {
        action.once = true;
        this.on( name, action );
    },
    /**
     * Remove all listeners registered to an event.
     * @param {String} name The event name.
     */
    clearListeners: function( name ) {
        this._events_[ name ] = [];
    },
    /**
     * Fires an event.
     *
     * Calls all listeners registered for this event.
     * @param {String} name The event name.
     */
    emit: function( name ) {
        var params = Array.prototype.slice.call( arguments, 1 );
        var events = this._events_[ name ];
        if ( !events ) {
            return;
        }
        // do not change to loop based on length
        // because some indexes of the array are undefined
        // due to the splice on removeListener
        for ( var i in events ) {
            var action = events[ i ];
            action.apply( this, params );
            if ( action.once ) {
                events.splice( i, 1 );
                if ( !events.length ) {
                    break;
                }
                --i;
            }
        }
    },
    /**
     * Remove a specific listener from an event.
     * @param {String} name The event name.
     * @param {Function} callback
     */
    removeListener: function( name, callback ) {
        if ( !this._events_[ name ] ) {
            return false;
        }
        var actionlist = this._events_[ name ];
        for ( var i = 0, l = actionlist.length; i < l; i++ ) {
            if ( actionlist[ i ] === callback ) {
                actionlist.splice( i, 1 );
                return true;
            }
        }
        return false;
    }
};
/*global
    EventEmitter : false
*/

/**
 * @class
 *
 * Handle waiting a group of events to finish.
 *
 * Consider the case that you need two wait for all the files to finish loading:
 * <code>
 * loader.load( 'file1', callback );
 * loader.load( 'file2', callback );
 </code>
 *
 * You can use the EventWaiter to call a function when all files have finished loading.
 * <code>
 * var w = new EventWaiter();
 * loader.load( 'file1', w.callback() );
 * loader.load( 'file2', w.callback() );
 * w.on( 'complete', function() {
 *     console.log( 'finished loading' );
 * } );
 </code>
 * @constructor
 * @extends EventEmitter
 */
function EventWaiter() {
    this._waitingList = [];
    EventEmitter.call( this );
}

EventWaiter.prototype = {
    constructor: EventWaiter,
    /*
     * Check if the events have finished.
     */
    isWaiting: function() {
        return this._waitingList.length;
    },
    /**
     * Wait for an EventEmitter to fire an event.
     * @param {EventEmitter} emitter
     * @param {String} event
     */
	wait: function( emitter, name, title ) {
        this.waitMore( title );
        var that = this;
        emitter.once( name, function() {
            that.waitLess( title );
        } );
    },
    /**
     * Wait for a limited time.
     * @param {EventEmitter} emitter
     * @param {String} event
     * @param {Number} time
     * @param {String} title
     */
	waitTimed: function( obj, name, time, title ) {
        this.waitMore( title );
        var that = this;
        var timeout = setTimeout( function() {
            that.waitLess( title );
        }, time );
        obj.once( name, function() {
            setTimeout( function() {
                that.waitLess( title );
                clearTimeout( timeout );
            }, 0 ); // be sure other callbacks are called first
        } );
    },
    /**
     * Create a callback that will wait to be called.
     * @param {String} title
     */
	callback: function( callback ) {
        this.waitMore();
        var that = this;
        return function() {
            callback.apply( {}, arguments );
            that.waitLess();
        };
    },
    /**
     * @param {String} title
     */
	waitMore: function( title ) {
        title = title || "";
        this._waitingList.push( title );
    },
    /*
     * @param {String} title
     */
	waitLess: function( title ) {
        title = title || "";
        var i = this._waitingList.indexOf( title );
        this._waitingList.splice( i, 1 );
        this.emit( 'one', title );
        if ( !this._waitingList.length ) {
            this.emit( 'complete' );
        }
    },
	isComplete: function() {
        return !!this._waitingList.length;
    },
	getWaitingList: function() {
        return this._waitingList;
    }
};

EventWaiter.extend( EventEmitter );
/*global
    Matrix3  :  false,
    Vector3  :  false
*/

/**
 * @class
 * A fast implementation of 4x4 transformation matrixes.
 *
 * It has a Float32Array .data property that is an array of length 16 in row-major order.
 *
 * @constructor
 * @param {Array} data A Javascript array with the initializing data (optional)
 */
function Matrix4( data ) {
    /**
     * @public
     * @type Float32Array
     * @default Identity matrix
     */
    this.data = new Float32Array( 16 );
    if ( data ) {
        if ( data.data ) {
            this.data.set( data.data );
        }
        else {
            this.data.set( data );
        }
    }
    else {
        Matrix4.identity( this );
    }
}

Matrix4.prototype = {
    constructor: Matrix4,
    /**
     * Copies the values of an other matrix to this matrix.
     * @param {Matrix4} src A Matrix4 object to copy from.
     * @returns Matrix4 this
     */
    set: function( src ) {
        if ( src instanceof Array ) {
            throw 'error';
        }
        if( src instanceof Float32Array ) {
            this.data.set( src );
            return this;
        }
        this.data.set( src.data );
        return this;
    },
    /**
     * Copies the values of this matrix to another matrix.
     * @param {Matrix4} dest A Matrix4 object to copy to.
     * @returns Matrix4 dest
     */
    copyTo: function( dest ) {
        if ( dest instanceof Array ) {
            throw 'error';
        }
        dest.data.set( this.data );
        return dest;
    },
    /** Returns the translation vector of this matrix.
     * @returns Vector3
     */
    getTranslation: function( dest ) {
        if ( !dest ) {
            dest = new Vector3();
        }
        var a = this.data,
            b = dest.data;

        b[ 0 ] = a[ 12 ];
        b[ 1 ] = a[ 13 ];
        b[ 2 ] = a[ 14 ];
        return dest;
    },
    /**
     * Returns the rotation matrix corresponding to this matrix.
     * @returns Matrix3
     */
    getRotationMatrix: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        var a = this.data,
            b = dest.data;

        b[ 0 ] = a[ 0 ];
        b[ 1 ] = a[ 1 ];
        b[ 2 ] = a[ 2 ];

        b[ 3 ] = a[ 4 ];
        b[ 4 ] = a[ 5 ];
        b[ 5 ] = a[ 6 ];

        b[ 6 ] = a[ 8 ];
        b[ 7 ] = a[ 9 ];
        b[ 8 ] = a[ 10 ];
        return dest;
    },
    /**
     * Sets this matrix to its transpose.
     * @returns Matrix4
     */
    transpose: function() {
        var a = this.data;

        var a01 = a[ 1 ],
            a02 = a[ 2 ],
            a03 = a[ 3 ],
            a12 = a[ 6 ],
            a13 = a[ 7 ],
            a23 = a[ 11 ];

        a[ 1 ] = a[ 4 ];
        a[ 2 ] = a[ 8 ];
        a[ 3 ] = a[ 12 ];
        a[ 4 ] = a01;
        a[ 6 ] = a[ 9 ];
        a[ 7 ] = a[ 13 ];
        a[ 8 ] = a02;
        a[ 9 ] = a12;
        a[ 11 ] = a[ 14 ];
        a[ 12 ] = a03;
        a[ 13 ] = a13;
        a[ 14 ] = a23;
        return this;
    },
    /**
     * Get the determinant of this matrix.
     */
    getDeterminant: function() {
        var a = this.data;
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = a[ 0 ], a01 = a[ 1 ], a02 = a[ 2 ], a03 = a[ 3 ],
            a10 = a[ 4 ], a11 = a[ 5 ], a12 = a[ 6 ], a13 = a[ 7 ],
            a20 = a[ 8 ], a21 = a[ 9 ], a22 = a[ 10 ], a23 = a[ 11 ],
            a30 = a[ 12 ], a31 = a[ 13 ], a32 = a[ 14 ], a33 = a[ 15 ];

        return  a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
                        a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
                        a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
                        a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
                        a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
                        a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
    },
    /**
     * Set this matrix to its inverse.
     * @returns Matrix4
     */
    inverse: function() {
        var a = this.data;
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = a[ 0 ], a01 = a[ 1 ], a02 = a[ 2 ], a03 = a[ 3 ],
            a10 = a[ 4 ], a11 = a[ 5 ], a12 = a[ 6 ], a13 = a[ 7 ],
            a20 = a[ 8 ], a21 = a[ 9 ], a22 = a[ 10 ], a23 = a[ 11 ],
            a30 = a[ 12 ], a31 = a[ 13 ], a32 = a[ 14 ], a33 = a[ 15 ];

        var b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant (inlined to avoid double-caching)
        var invDet = 1 / ( b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06 );

        a[ 0 ] = ( a11 * b11 - a12 * b10 + a13 * b09 ) * invDet;
        a[ 1 ] = ( -a01 * b11 + a02 * b10 - a03 * b09 ) * invDet;
        a[ 2 ] = ( a31 * b05 - a32 * b04 + a33 * b03 ) * invDet;
        a[ 3 ] = ( -a21 * b05 + a22 * b04 - a23 * b03 ) * invDet;
        a[ 4 ] = ( -a10 * b11 + a12 * b08 - a13 * b07 ) * invDet;
        a[ 5 ] = ( a00 * b11 - a02 * b08 + a03 * b07 ) * invDet;
        a[ 6 ] = ( -a30 * b05 + a32 * b02 - a33 * b01 ) * invDet;
        a[ 7 ] = ( a20 * b05 - a22 * b02 + a23 * b01 ) * invDet;
        a[ 8 ] = ( a10 * b10 - a11 * b08 + a13 * b06 ) * invDet;
        a[ 9 ] = ( -a00 * b10 + a01 * b08 - a03 * b06 ) * invDet;
        a[ 10 ] = ( a30 * b04 - a31 * b02 + a33 * b00 ) * invDet;
        a[ 11 ] = ( -a20 * b04 + a21 * b02 - a23 * b00 ) * invDet;
        a[ 12 ] = ( -a10 * b09 + a11 * b07 - a12 * b06 ) * invDet;
        a[ 13 ] = ( a00 * b09 - a01 * b07 + a02 * b06 ) * invDet;
        a[ 14 ] = ( -a30 * b03 + a31 * b01 - a32 * b00 ) * invDet;
        a[ 15 ] = ( a20 * b03 - a21 * b01 + a22 * b00 ) * invDet;
        return this;
    },
    /*
     * Sets this matrix to the product of this matrix with the parameter passed.
     * @param {Matrix4} The matrix to multiply with.
     */
    multiply: function( matrix ) {
        var a = this.data,
            b = matrix.data;

        // Cache the matrix values (makes for huge speed increases!)
        var a00 = a[ 0 ], a01 = a[ 1 ], a02 = a[ 2 ], a03 = a[ 3 ],
            a10 = a[ 4 ], a11 = a[ 5 ], a12 = a[ 6 ], a13 = a[ 7 ],
            a20 = a[ 8 ], a21 = a[ 9 ], a22 = a[ 10 ], a23 = a[ 11 ],
            a30 = a[ 12 ], a31 = a[ 13 ], a32 = a[ 14 ], a33 = a[ 15 ];

        var b00 = b[ 0 ], b01 = b[ 1 ], b02 = b[ 2 ], b03 = b[ 3 ],
            b10 = b[ 4 ], b11 = b[ 5 ], b12 = b[ 6 ], b13 = b[ 7 ],
            b20 = b[ 8 ], b21 = b[ 9 ], b22 = b[ 10 ], b23 = b[ 11 ],
            b30 = b[ 12 ], b31 = b[ 13 ], b32 = b[ 14 ], b33 = b[ 15 ];

        a[ 0 ] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        a[ 1 ] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        a[ 2 ] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        a[ 3 ] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        a[ 4 ] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        a[ 5 ] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        a[ 6 ] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        a[ 7 ] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        a[ 8 ] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        a[ 9 ] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        a[ 10 ] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        a[ 11 ] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        a[ 12 ] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        a[ 13 ] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        a[ 14 ] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        a[ 15 ] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

        return this;
    },
    /**
     * Multiply with a Vector3 and store the value to the vector.
     * @param {Vector3} vector A vector or array-like object to multiply with.
     * @returns Vector3 The vector.
     */
    multiplyVector3: function( vector ) {
        var a = this.data,
            b = vector.data;

        var x = b[ 0 ], y = b[ 1 ], z = b[ 2 ];

        b[ 0 ] = a[ 0 ] * x + a[ 4 ] * y + a[ 8 ] * z + a[ 12 ];
        b[ 1 ] = a[ 1 ] * x + a[ 5 ] * y + a[ 9 ] * z + a[ 13 ];
        b[ 2 ] = a[ 2 ] * x + a[ 6 ] * y + a[ 10 ] * z + a[ 14 ];
        return vector;
    },
    /**
     * Returns a clone of this matrix.
     * @returns Matrix4
     */
    clone: function() {
        return new Matrix4( this );
    }
};

/**
 * Generates an identity matrix.
 * @param {Matrix4} [dest] A matrix to reset to the identity matrix.
 * @returns Matrix4 dest if specified, a new Matrix4 otherwise
 */
Matrix4.identity = function( dest ) {
    if ( !dest ) {
        dest = new Matrix4();
    }
    var a = dest.data;

    a[ 0 ] = 1;
    a[ 1 ] = 0;
    a[ 2 ] = 0;
    a[ 3 ] = 0;

    a[ 4 ] = 0;
    a[ 5 ] = 1;
    a[ 6 ] = 0;
    a[ 7 ] = 0;

    a[ 8 ] = 0;
    a[ 9 ] = 0;
    a[ 10 ] = 1;
    a[ 11 ] = 0;

    a[ 12 ] = 0;
    a[ 13 ] = 0;
    a[ 14 ] = 0;
    a[ 15 ] = 1;
    return dest;
};

/**
 * Generates a frustrum matrix with the given bounds.
 * @returns Matrix4 dest if specified, a new Matrix4 otherwise
 */
Matrix4.frustrum = function( left, right, bottom, top, near, far, dest ) {
    if ( !dest ) {
        dest = new Matrix4();
    }

    var a = dest.data;

    var rl = ( right - left );
    var tb = ( top - bottom );
    var fn = ( far - near );
    a[ 0 ] = ( near * 2 ) / rl;
    a[ 1 ] = 0;
    a[ 2 ] = 0;
    a[ 3 ] = 0;
    a[ 4 ] = 0;
    a[ 5 ] = ( near * 2 ) / tb;
    a[ 6 ] = 0;
    a[ 7 ] = 0;
    a[ 8 ] = ( right + left ) / rl;
    a[ 9 ] = ( top + bottom ) / tb;
    a[ 10 ] = -( far + near ) / fn;
    a[ 11 ] = -1;
    a[ 12 ] = 0;
    a[ 13 ] = 0;
    a[ 14 ] = -( far * near * 2 ) / fn;
    a[ 15 ] = 0;
    return dest;
};

/**
 * Generates a perspective projection matrix with the given bounds.
 * @returns Matrix4 dest if specified, a new Matrix4 otherwise
 */
Matrix4.perspective = function( fovy, aspect, near, far, dest ) {
    var top = near * Math.tan( fovy * Math.PI / 360.0 );
    var right = top * aspect;
    return Matrix4.frustrum( -right, right, -top, top, near, far, dest );
};

/**
 * Generates an orthogonal projection matrix with the given bounds
 * @returns Matrix4 dest if specified, a new Matrix4 otherwise
 */
Matrix4.ortho = function( left, right, bottom, top, near, far, dest ) {
    if ( !dest ) {
        dest = new Matrix4();
    }

    var a = dest.data;

    var rl = ( right - left );
    var tb = ( top - bottom );
    var fn = ( far - near );
    a[ 0 ] = 2 / rl;
    a[ 1 ] = 0;
    a[ 2 ] = 0;
    a[ 3 ] = 0;
    a[ 4 ] = 0;
    a[ 5 ] = 2 / tb;
    a[ 6 ] = 0;
    a[ 7 ] = 0;
    a[ 8 ] = 0;
    a[ 9 ] = 0;
    a[ 10 ] = -2 / fn;
    a[ 11 ] = 0;
    a[ 12 ] = -( left + right ) / rl;
    a[ 13 ] = -( top + bottom ) / tb;
    a[ 14 ] = -( far + near ) / fn;
    a[ 15 ] = 1;
    return dest;
};
/*global
    Matrix4      :  false,
    Quaternaion  :  false
*/

/**
 * @class
 * A fast mplementation of 3x3 rotation matrixes.
 *
 * @constructor
 * @param {Array} data A Javascript array with the initializing data (optional)
 */
function Matrix3( data ) {
    /**
     * @public
     * @type Float32Array
     * @default Identity matrix
     */
    this.data = new Float32Array( 9 );
    if ( data ) {
        if ( data.data ) {
            this.data.set( data.data );
        }
        else {
            this.data.set( data );
        }
    }
    else {
        this.setIdentity();
    }
}

Matrix3.prototype = {
    constructor: Matrix3,
    /**
     * Copies the values of an array into this matrix.
     * @param {Matrix3} src A Matrix3 object to copy from.
     */
    set: function( src ) {
        if ( src instanceof Array ) {
            throw 'error';
        }
        this.data.set( src.data );
        return this;
    },
    /**
     * Reset matrix to identity matrix.
     * @returns Matrix3 this
     */
    setIdentity: function() {
        var a = this.data;
        a[ 0 ] = 1;
        a[ 1 ] = 0;
        a[ 2 ] = 0;

        a[ 3 ] = 0;
        a[ 4 ] = 1;
        a[ 5 ] = 0;

        a[ 6 ] = 0;
        a[ 7 ] = 0;
        a[ 8 ] = 1;

        return this;
    },
//    toQuaternion: function() {
//        var ret = new Quaternion();
//        if ( this[ 0 ] > this[ 4 ] && this[ 0 ] > this[ 8 ] ) {
//            var r =
//
//        }
//        else if ( this[ 4 ] > this[ 0 ] && this[ 4 ] > this[ 8 ] ) {
//
//        }
//        else {
//
//        }
//    },
    /**
     * Returns a clone of this matrix.
     * @returns Matrix3
     */
    clone: function() {
        return new Matrix3( this );
    }
};
/**
 * @class
 *
 * A 3-element vector.
 *
 * It's elements are accessed via a .data property that is a Float32Array
 * or with .x .y .z getters (which are slow and not recommended).
 *
 * Most methods alter the object whose method was called for performance reasons.
 * @param {Array|Vector3=} data A Javascript array with the initializing data (optional)
 *
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 *
 * <p>The usual way to instantiate a Vector3 is to pass three numbers:</p>
 *
 * <code>
 * var v = new Vector3( 1, 2, 3 );
 </code>
 *
 * <p>You can also pass an array with 3 elements:</p>
 * <code>
 * var v = new Vector3( [ 1, 2, 3 ] );
 </code>
 *
 * <p>Or another vector that will be copied:</p>
 * <code>
 * var v = new Vector3( [ 1, 2, 3 ] );
 * var v2 = new Vector3( v );
 */
function Vector3( x, y, z ) {
    /**
     * @public
     * A Float32Array with the 3 elements.
     * @type Float32Array
     */
    this.data = new Float32Array( 3 );
    if ( x ) {
        if ( x.data ) {
            this.data.set( x.data );
        }
        else if ( Array.isArray( x ) ) {
            this.data.set( x );
        }
        else {
            this.data[ 0 ] = x;
            this.data[ 1 ] = y;
            this.data[ 2 ] = z;
        }
    }
}

Vector3.prototype = {
    constructor: Vector3,
    /**
     * Set the elements according to another vector.
     * @param {Vector3} src Vector to copy from.
     * @returns Vector3
     */
    set: function( src ) {
        if ( src instanceof Array ) {
            throw 'error';
        }
        this.data.set( src.data );
        return this;
    },
    /**
     * Copies the values of this vector to another vector.
     * @param {Vector3} dest A Vector3 object to copy to.
     * @returns Vector3 dest
     */
    copyTo: function( dest ) {
        if ( dest instanceof Array ) {
            throw 'error';
        }
        dest.data.set( this.data );
        return dest;
    },
    /**
     * Adds the values of a vector to this object.
     * @param {Vector3} vector Array-like object to add.
     * @returns Vector3
     */
    add: function( vector ) {
        var a = this.data,
            b = vector.data;
        a[ 0 ] += b[ 0 ];
        a[ 1 ] += b[ 1 ];
        a[ 2 ] += b[ 2 ];
        return this;
    },
    /**
     * Subtracts the values of a vector from this object.
     * @param {Vector3} vector Array-like object to subtract.
     * @returns Vector3 this
     */
    subtract: function( vector ) {
        var a = this.data,
            b = vector.data;
        a[ 0 ] -= b[ 0 ];
        a[ 1 ] -= b[ 1 ];
        a[ 2 ] -= b[ 2 ];
        return this;
    },
    /**
     * Negates every element of the vector.
     * @returns Vector3
     */
    negate: function() {
        var a = this.data;
        a[ 0 ] = -a[ 0 ];
        a[ 1 ] = -a[ 1 ];
        a[ 2 ] = -a[ 2 ];
        return this;
    },
    /**
     * Scales this vector uniformly.
     * @param {Number} factor
     * @returns Vector3
     */
    scale: function( factor ) {
        var a = this.data;
        a[ 0 ] *= factor;
        a[ 1 ] *= factor;
        a[ 2 ] *= factor;
        return this;
    },
    /**
     * Scales the vector so that it becomes a unit vector, unless it has zero length.
     *
     * @returns Vector3
     */
    normalize: function() {
        var a = this.data;
        var x = a[ 0 ], y = a[ 1 ], z = a[ 2 ];
        var len = Math.sqrt( x * x + y * y + z * z);

        if ( len === 0 ) {
            return this;
        }

        len = 1 / len;
        a[ 0 ] *= len;
        a[ 1 ] *= len;
        a[ 2 ] *= len;
        return this;
    },
    /**
     * Computes the cross product of this vector with another.
     * The value is stored in this object.
     *
     * @param {Vector3} vector
     * @returns Vector3 this
     */
    cross: function( vector ) {
        var a = this.data,
            b = vector.data;
        var x = a[ 0 ], y = a[ 1 ], z = a[ 2 ];
        var x2 = b[ 0 ], y2 = b[ 1 ], z2 = b[ 2 ];

        a[ 0 ] = y * z2 - z * y2;
        a[ 1 ] = z * x2 - x * z2;
        a[ 2 ] = x * y2 - y * x2;
        return this;
    },
    /**
     * Returns the length (norm) of this vector.
     * @returns Number
     */
    length: function() {
        var a = this.data;
        var x = a[ 0 ], y = a[ 1 ], z = a[ 2 ];
        return Math.sqrt( x * x + y * y + z * z );
    },
    /**
     * Returns the length of this vector squared.
     * @returns Number
     */
    length2: function() {
        var a = this.data;
        var x = a[ 0 ], y = a[ 1 ], z = a[ 2 ];
        return x * x + y * y + z * z;
    },
    /**
     * Returns the dot product of this vector with another.
     * @returns Number
     */
    dot: function( vector ) {
        var a = this.data,
            b = vector.data;
        return a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ];
    },
    /**
     * Changes the sign of all negative values.
     * @returns Vector3
     */
    absolute: function() {
        var a = this.data;
        if ( a[ 0 ] < 0 ) {
            a[ 0 ] = -a[ 0 ];
        }
        if ( a[ 1 ] < 0 ) {
            a[ 1 ] = -a[ 1 ];
        }
        if ( a[ 2 ] < 0 ) {
            a[ 2 ] = -a[ 2 ];
        }
        return this;
    },
    clone: function() {
        return new Vector3( this );
    },
    get x () {
        return this.data[ 0 ];
    },
    set x ( value ) {
        this.data[ 0 ] = value;
    },
    get y () {
        return this.data[ 1 ];
    },
    set y ( value ) {
        this.data[ 1 ] = value;
    },
    get z () {
        return this.data[ 2 ];
    },
    set z ( value ) {
        this.data[ 2 ] = value;
    },
    toString: function() {
        return '[' + [ this.data[ 0 ], this.data[ 1 ], this.data[ 2 ] ] + ']';
    }
};
/*global
    Matrix4   :  false,
    TempVars  :  false,
    Vector3   :  false
*/

/**
 * @class
 * Orientation represented as a vector and an angle.
 *
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} theta
 */
function Quaternion( x, z, y, a ) {
    this.data = new Float32Array( 4 );
    if ( x ) {
        if ( x.data ) {
            this.data.set( x.data );
        }
        else if ( Array.isArray( x ) ){
            this.data.set( x );
        }
        else {
            this.data[ 0 ] = x;
            this.data[ 1 ] = y;
            this.data[ 2 ] = z;
            this.data[ 3 ] = a;
        }
    }
    else {
        this.data[ 3 ] = 1;
    }
}

Quaternion.prototype = {
    constructor: Quaternion,
    set: function( data ) {
        if ( data instanceof Array ) {
            throw 'error';
        }
        this.data.set( data.data );
        return this;
    },
    copyTo: function( dest ) {
        if ( dest instanceof Array ) {
            throw 'error';
        }
        dest.data.set( this.data );
        return dest;
    },
    setEuler: function( yaw, pitch, roll ) {
        var a = this.data;
        yaw *= 0.5;
        pitch *= 0.5;
        roll *= 0.5;
        var cos = Math.cos;
        var sin = Math.sin;
        var cosYaw = cos( yaw );
        var sinYaw = sin( yaw );
        var cosPitch = cos( pitch );
        var sinPitch = sin( pitch );
        var cosRoll = cos( roll );
        var sinRoll = sin( roll );
        a[ 0 ] = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
        a[ 1 ] = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
        a[ 2 ] = sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw;
        a[ 3 ] = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
        return this;
    },
    setAxisAngle: function( axis, angle ) {
        angle *= 0.5;
        TempVars.lock();
        var a = this.data,
            temp = TempVars.getVector3();
        temp.set( axis ).normalize().scale( Math.sin( angle ) );
        a[ 0 ] = temp.data[ 0 ];
        a[ 1 ] = temp.data[ 1 ];
        a[ 2 ] = temp.data[ 2 ];
        a[ 3 ] = Math.cos( angle );
        TempVars.release();
        return this;
    },
    getAngle: function() {
        var a = this.data;
        if ( a[ 0 ] || a[ 1 ] || a[ 2 ] ) {
            var acos = Math.acos( a[ 3 ] );
            if ( acos < -1 ) {
                return 2 * Math.PI;
            }
            else if ( acos > 1 ) {
                return 0;
            }
            return 2 * Math.acos( acos );
        }
        return 0;
    },
    getAxis: function( dest ) {
        var a = this.data;
        if ( !dest ) {
            dest = new Vector3();
        }
        if ( a[ 0 ] || a[ 1 ] || a[ 2 ] ) {
            dest.data[ 0 ] = a[ 0 ];
            dest.data[ 1 ] = a[ 1 ];
            dest.data[ 2 ] = a[ 2 ];
            dest.normalize();
        }
        else {
            dest.data[ 0 ] = 0;
            dest.data[ 1 ] = 0;
            dest.data[ 2 ] = 1;
        }
        return dest;
    },
    getAxisAngle: function( dest ) {
        var d = this.data;
        if ( !dest ) {
            dest = new Vector3();
        }
        dest.data[ 0 ] = Math.atan2( 2 * ( d[ 3 ] * d[ 0 ] + d[ 1 ] * d[ 2 ] ), 1 - 2 * (d[ 0 ]*d[ 0 ] + d[ 1 ] * d[ 1 ] ) );
        dest.data[ 1 ] = Math.asin( 2 * ( d[ 3 ] * d[ 1 ] - d[ 2 ] * d[ 0 ] ) );
        dest.data[ 2 ] = Math.atan2( 2 * ( d[ 3 ] * d[ 2 ] + d[ 0 ] * d[ 1 ] ), 1 - 2 * ( d[ 1 ] * d[ 1 ] + d[ 2 ] * d[ 2 ] ) );
        return dest;
    },
    inverse: function() {
        var a = this.data;
        a[ 0 ] = -a[ 0 ];
        a[ 1 ] = -a[ 1 ];
        a[ 2 ] = -a[ 2 ];
        return this;
    },
    multiply: function( quaternion ) {
        var a = this.data,
            b = quaternion.data;
        var qax = a[ 0 ], qay = a[ 1 ], qaz = a[ 2 ], qaw = a[ 3 ];
        var qbx = b[ 0 ], qby = b[ 1 ], qbz = b[ 2 ], qbw = b[ 3 ];

        a[ 0 ] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        a[ 1 ] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        a[ 2 ] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        a[ 3 ] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        return this;
    },
    preMultiply: function( quaternion ) {
        var a = this.data,
            b = quaternion.data;
        var qbx = a[ 0 ], qby = a[ 1 ], qbz = a[ 2 ], qbw = a[ 3 ];
        var qax = b[ 0 ], qay = b[ 1 ], qaz = b[ 2 ], qaw = b[ 3 ];

        a[ 0 ] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        a[ 1 ] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        a[ 2 ] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        a[ 3 ] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        return this;
    },
    multiplyVector3: function( vector ) {
        var a = this.data,
            b = vector.data,

            x = b[ 0 ], y = b[ 1 ], z = b[ 2 ],
            qx = a[ 0 ], qy = a[ 1 ], qz = a[ 2 ], qw = a[ 3 ];

        // calculate this * vector
        var ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse this
        b[ 0 ] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        b[ 1 ] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        b[ 2 ] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return vector;
    },
    fromMatrix3: function( matrix ) {
        var a = this.data,
            b = matrix.data;

        var s, t = b[ 0 ] + b[ 4 ] + b[ 8 ];
        // we protect the division by s by ensuring that s>=1
        if ( t >= 0 ) { // |w| >= .5
            s = Math.sqrt( t + 1 ); // |s|>=1 ...
            a[ 3 ] = 0.5 * s;
            s = 0.5 / s;                 // so this division isn't bad
            a[ 0 ] = ( b[ 5 ] - b[ 7 ] ) * s;
            a[ 1 ] = ( b[ 6 ] - b[ 2 ] ) * s;
            a[ 2 ] = ( b[ 1 ] - b[ 3 ] ) * s;
        } else if ( ( b[ 0 ] > b[ 4 ] ) && ( b[ 0 ] > b[ 8 ] ) ) {
            s = Math.sqrt( 1 + b[ 0 ] - b[ 4 ] - b[ 8 ] ); // |s|>=1
            a[ 0 ] = s * 0.5; // |x| >= .5
            s = 0.5 / s;
            a[ 1 ] = ( b[ 1 ] + b[ 3 ] ) * s;
            a[ 2 ] = ( b[ 6 ] + b[ 2 ] ) * s;
            a[ 3 ] = ( b[ 5 ] - b[ 7 ] ) * s;
        } else if ( b[ 4 ] > b[ 8 ] ) {
            s = Math.sqrt( 1 + b[ 4 ] - b[ 0 ] - b[ 8 ] ); // |s|>=1
            a[ 1 ] = s * 0.5; // |y| >= .5
            s = 0.5 / s;
            a[ 0 ] = ( b[ 1 ] + b[ 3 ] ) * s;
            a[ 2 ] = ( b[ 5 ] + b[ 7 ] ) * s;
            a[ 3 ] = ( b[ 6 ] - b[ 2 ] ) * s;
        } else {
            s = Math.sqrt( 1 + b[ 8 ] - b[ 0 ] - b[ 4 ] ); // |s|>=1
            a[ 2 ] = s * 0.5; // |z| >= .5
            s = 0.5 / s;
            a[ 0 ] = ( b[ 6 ] + b[ 2 ] ) * s;
            a[ 1 ] = ( b[ 5 ] + b[ 7 ] ) * s;
            a[ 3 ] = ( b[ 1 ] - b[ 3 ] ) * s;
        }
        return this;
    },
    toMatrix4: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        var a = this.data,
            b = dest.data;

        var x = a[ 0 ], y = a[ 1 ], z = a[ 2 ], w = a[ 3 ];

        var x2 = x + x,
            y2 = y + y,
            z2 = z + z,

            xx = x * x2,
            xy = x * y2,
            xz = x * z2,

            yy = y * y2,
            yz = y * z2,
            zz = z * z2,

            wx = w * x2,
            wy = w * y2,
            wz = w * z2;

        b[ 0 ] = 1 - ( yy + zz );
        b[ 1 ] = xy + wz;
        b[ 2 ] = xz - wy;
        b[ 3 ] = 0;

        b[ 4 ] = xy - wz;
        b[ 5 ] = 1 - ( xx + zz );
        b[ 6 ] = yz + wx;
        b[ 7 ] = 0;

        b[ 8 ] = xz + wy;
        b[ 9 ] = yz - wx;
        b[ 10 ] = 1 - ( xx + yy );
        b[ 11 ] = 0;

        b[ 12 ] = 0;
        b[ 13 ] = 0;
        b[ 14 ] = 0;
        b[ 15 ] = 1;

        return dest;
    },
    dot: function( quaternion ) {
        return this.data[ 0 ] * quaternion.data[ 0 ] +
               this.data[ 1 ] * quaternion.data[ 1 ] +
               this.data[ 2 ] * quaternion.data[ 2 ] +
               this.data[ 3 ] * quaternion.data[ 3 ];
    },
    slerp: function( to, by ) {
        if ( this.data[ 0 ] == to.data[ 0 ] && this.data[ 1 ] == to.data[ 1 ] && this.data[ 2 ] == to.data[ 2 ] && this.data[ 3 ] == to.data[ 3 ] ) {
            return this;
        }

        var dot = this.dot( to );

        if ( dot < 0 ) {
            to = new Quaternion( [ -to.data[ 0 ], -to.data[ 1 ], -to.data[ 2 ], -to.data[ 3 ] ] );
            dot = -dot;
        }

        if ( 1 - dot < 0.001 ) { // too close
            return this;
        }

        var scale0 = 1 - by;
        var scale1 = by;

        if ( ( 1 - dot ) > 0.1 ) {
            var theta = Math.acos( dot );
            var invSinTheta = 1 / Math.sin( theta );

            scale0 = Math.sin( ( 1 - by ) * theta ) * invSinTheta;
            scale1 = Math.sin( ( by * theta ) ) * invSinTheta;
        }

        this.data[ 0 ] = ( scale0 * this.data[ 0 ] ) + ( scale1 * to.data[ 0 ] );
        this.data[ 1 ] = ( scale0 * this.data[ 1 ] ) + ( scale1 * to.data[ 1 ] );
        this.data[ 2 ] = ( scale0 * this.data[ 2 ] ) + ( scale1 * to.data[ 2 ] );
        this.data[ 3 ] = ( scale0 * this.data[ 3 ] ) + ( scale1 * to.data[ 3 ] );

        return this;
    },
    clone: function() {
        return new Quaternion( this );
    },
    get x () {
        return this.data[ 0 ];
    },
    set x ( value ) {
        this.data[ 0 ] = value;
    },
    get y () {
        return this.data[ 1 ];
    },
    set y ( value ) {
        this.data[ 1 ] = value;
    },
    get z () {
        return this.data[ 2 ];
    },
    set z ( value ) {
        this.data[ 2 ] = value;
    },
    get w () {
        return this.data[ 3 ];
    },
    set w ( value ) {
        this.data[ 3 ] = value;
    },
    toString: function() {
        return '[' + [ this.data[ 0 ], this.data[ 1 ], this.data[ 2 ], this.data[ 3 ] ] + ']';
    }
};
/*global
    Matrix4     :  false,
    SceneNode        :  false,
    Quaternion  :  false,
    TempVars    :  false,
    Vector3     :  false
*/

/**
 * @class
 * Represents a transformation in 3D space (position, orientation, scale).
 *
 * @constructor
 */
function Transform() {
    this.position = new Vector3();
    this.orientation = new Quaternion();
    this.scale = 1;
    this._invalidate();
    this.matrix = new Matrix4();
}

Transform.prototype = {
    constructor: Transform,
    set: function( transform ) {
        this.position.set( transform.position );
        this.orientation.set( transform.orientation );
        this.scale = transform.scale;
        return this._invalidate();
    },
    /**
     * @param {Vector3} position The new position as a vector.
     * @returns Transform
     */
    setPosition: function( position ) {
        this.position.set( position );
        return this._invalidate();
    },
    /**
     * @param {Quaternion} orientation The new orientation as a quaternion.
     * @returns Transform
     */
    setOrientation: function( orientation ) {
        this.orientation.set( orientation );
        return this._invalidate();
    },
    /**
     * Scales the object uniformly.
     * @param {number} scale The new scale as a scalar.
     * @returns Transform
     */
    setScale: function( scale ) {
        this.scale = scale;
        return this._invalidate();
    },
    /**
     * Returns a copy of the position vector.
     * @param {Vector3} [dest] Alter this variable instead of generating a new Vector3.
     * @returns Vector3 dest if specified, a new Vector3 otherwise.
     */
    getPosition: function( dest ) {
        if ( !dest ) {
            dest = new Vector3();
        }
        return dest.set( this.position );
    },
    /**
     * Returns a copy of the orientation quaternion.
     * @param {Quaternion} [dest] Alter this variable instead of generating a new quaternion.
     * @returns Quaternion dest if specified, a new quaternion otherwise.
     */
    getOrientation: function( dest ) {
        if ( !dest ) {
            dest = new Quaternion();
        }
        return dest.set( this.orientation );
    },
    /**
     * @returns number
     */
    getScale: function() {
        return this.scale;
    },
    /**
     * Resets transform to default values.
     * @returns Transform this
     */
    setIdentity: function() {
        this.position.data.set( [ 0, 0, 0 ] );
        this.orientation.data.set( [ 0, 0, 0, 1 ] );
        this.scale = 1;
        return this._invalidate();
    },
    /**
     * Combines this transform with another and stores the result to this transform.
     * @returns this
     */
    // TODO: further documenting
    combineWith: function( transform ) {
        TempVars.lock();
        this.scale *= transform.scale;
        transform.orientation.multiplyVector3( this.position ).scale( transform.scale ).add( transform.position );
        this.orientation.preMultiply( transform.orientation );
        TempVars.release();

        return this._invalidate();
    },
    /**
     * Returns a transformation matrix.
     * @param {Matrix4} [dest] Alter dest object instead of creating a new matrix.
     * @returns Matrix4 dest if specified, a new matrix otherwise.
     */
    getMatrix: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        if ( this._needsUpdate ) {
            this._update();
        }
        return dest.set( this.matrix );
    },
    /**
     * Sets position, orientation and scale to match a transformation matrix.
     * @param {Matrix4} matrix
     * @returns Transform
     */
    setMatrix: function( matrix ) {
        var a = matrix.data;

        var m00 = a[ 0 ], m01 = a[ 1 ], m02 = a[ 2 ];
        this.scale = Math.sqrt( m00 * m00 + m01 * m01 + m02 * m02 );

        var pos = this.position.data;
        pos[ 0 ] = a[ 12 ];
        pos[ 1 ] = a[ 13 ];
        pos[ 2 ] = a[ 14 ];

        TempVars.lock();
        var mat = TempVars.getMatrix4().set( a );
        this.orientation.fromMatrix3( mat.getRotationMatrix( TempVars.getMatrix3() ) );
        TempVars.release();

        return this._invalidate();
    },
    /**
     * @param {Matrix4} [dest] Alter dest instead of creating a new Matrix4
     * @returns Matrix4 dest if specified, a new matrix otherwise.
     */
    getInverseMatrix: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        if ( this._needsUpdate  ) {
            this._update();
        }
        this.orientation.toMatrix4( dest ).transpose();
        //Translation part rotated by the transposed 3x3 matrix
        var pos = this.position.data,
            a = dest.data;

        var x = -pos[ 0 ],
            y = -pos[ 1 ],
            z = -pos[ 2 ];
        a[ 12 ] = x * a[ 0 ] + y * a[ 4 ] + z * a[ 8 ];
        a[ 13 ] = x * a[ 1 ] + y * a[ 5 ] + z * a[ 9 ];
        a[ 14 ] = x * a[ 2 ] + y * a[ 6 ] + z * a[ 10 ];
        return dest;
    },
    _update: function() {
        var mat = this.matrix,
            a = mat.data;
        this.orientation.toMatrix4( mat );
        if ( this.scale != 1 ) {
            var s = this.scale;
            a[ 0 ] *= s;
            a[ 1 ] *= s;
            a[ 2 ] *= s;
            a[ 4 ] *= s;
            a[ 5 ] *= s;
            a[ 6 ] *= s;
            a[ 8 ] *= s;
            a[ 9 ] *= s;
            a[ 10 ] *= s;
        }
        var pos = this.position.data;
        a[ 12 ] = pos[ 0 ];
        a[ 13 ] = pos[ 1 ];
        a[ 14 ] = pos[ 2 ];
        this._needsUpdate = false;
        return this;
    },
    _invalidate: function() {
        this._needsUpdate = true;
        return this;
    }
};
/*global Vector3: true*/

/**
 * @class
 *
 * Color representation as a vector.
 *
 * @extends Vector3
 * @constructor
 * @param {Array} data A Javascript array with the initializing data (optional)
 */
function Color( data ) {
    return Vector3.call( this, data );
}

Color.prototype = {
    constructor: Color,
    /**
     * Makes sure values are valid (e.g. 0 to 1)
     * @returns Color
     */
    clip: function() {
        var a = this.data;
        a[ 0 ] = a[ 0 ] > 1 ? 1 : a[ 0 ] < 0 ? 0 : a[ 0 ];
        a[ 1 ] = a[ 1 ] > 1 ? 1 : a[ 1 ] < 0 ? 0 : a[ 1 ];
        a[ 2 ] = a[ 2 ] > 1 ? 1 : a[ 2 ] < 0 ? 0 : a[ 2 ];
        return this;
    },
    /**
     * @param {Color} color The amount of color to add
     * @returns Color
     */
    add: function( color ) {
        this.Vector3_add( color );
        return this.clip();
    },
    /**
     * Defines the color using a hex string.
     */
    fromHex: function( hex ) {
        var r = parseInt( hex[ 0 ] + hex[ 1 ], 16 );
        var g = parseInt( hex[ 2 ] + hex[ 3 ], 16 );
        var b = parseInt( hex[ 4 ] + hex[ 5 ], 16 );
        return this.fromRGB( r, g, b );
    },
    /**
     * Defines the color using r, g, b in range 0...255.
     */
    fromRGB: function( r, g, b ) {
        var a = this.data;
        a[ 0 ] = r;
        a[ 1 ] = g;
        a[ 2 ] = b;
        return this.scale( 1 / 255 );
    },
    /**
     * Defines the color using h, s, l:
     * @param {Number} h Color hue (0...2 pi)
     * @param {Number} s Color saturation (0...1)
     * @param {Number} l Color lightness (0...1)
     */
    fromHSL: function( h, s, l ) {
        var a = this.data;
        function hueToRgb( m1, m2, hue ) {
            var v;

            if ( hue < 0 ) {
                hue += 1;
            }
            else if ( hue > 1 ) {
                hue -= 1;
            }

            if ( 6 * hue < 1 ) {
                v = m1 + (m2 - m1) * hue * 6;
            }
            else if ( 2 * hue < 1 ) {
                v = m2;
            }
            else if ( 3 * hue < 2 ) {
                v = m1 + ( m2 - m1 ) * ( 2 / 3 - hue ) * 6;
            }
            else {
                v = m1;
            }

            return v;
        }

        var m1, m2, hue;
        var r, g, b;

        if ( s === 0 ) {
            a[ 0 ] = a[ 1 ] = a[ 2 ] = l;
        }
        else {
            if ( l <= 0.5 ) {
                m2 = l * ( s + 1 );
            }
            else {
                m2 = l + s - l * s;
            }
            m1 = l * 2 - m2;
            hue = h / ( 2 * Math.PI );
            a[ 0 ] = hueToRgb( m1, m2, hue + 1 / 3 );
            a[ 1 ] = hueToRgb( m1, m2, hue );
            a[ 2 ] = hueToRgb( m1, m2, hue - 1 / 3 );
        }
    }
};

Color.extend( Vector3 );
/*global
    assert       :  false,
    Framebuffer  :  false,
    Buffer       :  false,
    Mesh         :  false,
    Shader       :  false,
    Texture      :  false,
    debug        :  false
*/

/**
 * @class
 *
 * An abstraction to WebGL calls.
 *
 * <p>Renderer is the central point of the graphics library.
 * It abstracts the underlying API in some simple methods.</p>
 *
 * <p>All the drawing should be made with calls to the renderer
 * and not directly. This is the only place that WebGL
 * calls should exist.</p>
 *
 * @constructor
 * @param {HTMLCanvasElement=} canvas The canvas element to draw to. (optional)
 * @param {number=} width The width of the canvas. (optional)
 * @param {number=} height The height of the canvas. (optional)
 */
var Renderer = function( canvas, width, height ) {
    /*
        As the renderer is running, several objects are copyied to the
        GPU memory for fast rendering. But, as there isn't a way to know
        when the client-side objects are garbage collected we specify a
        decay time. If an object isn't used for this amount of time then
        it is destroyed.
        The decay time is specified in milliseconds.
    */
    this.decayTime = 5 * 1000;
    this.width = width || 640;
    this.height = height || 480;
    this.render = this.dummyRender;

    this.canvas = canvas || document.createElement( 'canvas' );
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    setInterval( this.decay.bind( this ), this.decayTime );

    /*
     * This should change to .getContext( 'webgl' ) at some point.
     */
    var gl = this.gl = this.canvas.getContext( 'experimental-webgl' );
    if ( this.gl === null ) {
        throw 'Could not initialize WebGL';
    }

    /*
     *  According to the OpenGL ES 2.0 reference, the second parameter
     *  of the functions glUniformMatrix*fv must always be false. So
     *  we are overriding the methods so that they are consistent with
     *  the paramerer format of the other uniform upload functions.
     *
     *  See http://www.khronos.org/opengles/sdk/2.0/docs/man/glUniform.xml
     */

    gl.mineUniformMatrix2fv = function( location, value ) {
        this.uniformMatrix2fv( location, false, value );
    }.bind( gl );

    gl.mineUniformMatrix3fv = function( location, value ) {
        this.uniformMatrix3fv( location, false, value );
    }.bind( gl );

    gl.mineUniformMatrix4fv = function( location, value ) {
        this.uniformMatrix4fv( location, false, value );
    }.bind( gl );

    /*
     * Define two custom functions that upload a Texture object to the current shader.
     * These are defined to be consistent to all uniform types, as Textures also need
     * to be bound before their sampler ID is set to the shader uniform.
     */
    gl.mineUniformSampler2D = function( renderer, location, value ) {
        /*DEBUG*/
            assert( value instanceof Texture, 'Tried to set a non-Texture object to a sampler2D uniform' );
            assert( value.type === Texture.IMAGE, 'The Texture object is not of type IMAGE' );
        /*DEBUG_END*/
        this.uniform1i( location, renderer.bindTexture( value ) );
    }.bind( gl, this );

    gl.mineUniformSamplerCube = function( renderer, location, value ) {
        /*DEBUG*/
            assert( value instanceof Texture, 'Tried to set a non-Texture object to a samplerCube uniform' );
            assert( value.type === Texture.CUBEMAP, 'The Texture object is not of type CUBEMAP' );
        /*DEBUG_END*/
        this.uniform1i( location, renderer.bindTexture( value ) );
    }.bind( gl, this );

    /*
     * The two arrays defined bellow will hold the texture positions that are used
     * from the most recently used one the oldest.
     */
    var maxTextures = this.getParameter( Renderer.MAX_FRAGMENT_TEXTURE_UNITS );

    function makeLinkedList( size ) {
        var ret = [];
        for ( var i = 0; i < size; i++ ) {
            ret[ i ] = {
                previous: null,
                next: null,
                index: i,
                texture: {}
            };
        }
        for ( i = 0; i < size; i++ ) {
            ret[ i ].previous = ret[ i - 1 ] || null;
            ret[ i ].next = ret[ i + 1 ] || null;
        }
        return {
            head: ret[ 0 ],
            tail: ret[ size - 1 ]
        };
    }

    var a = makeLinkedList( maxTextures );
    this.firstTexture2DPosition = a.head;
    this.lastTexture2DPosition = a.tail;

    a = makeLinkedList( maxTextures );
    this.firstTextureCubePosition = a.head;
    this.lastTextureCubePosition = a.tail;

    /*These objects will hold references to the underlying API*/
    this.bufferObjects = {};
    this.textureObjects = {};
    this.programObjects = {};
    this.framebufferObjects = {};

    this.currentShader = null;
	this.boundedBuffer = null;
    this.boundedFrameBuffer = null;

    /*
     * This is the default Render state.
     */
    gl.viewport( 0, 0, this.width, this.height );
    gl.clearColor( 1, 1, 1, 1 );
    gl.clearDepth( 1 );
    gl.enable( gl.CULL_FACE );
    gl.enable( gl.DEPTH_TEST );
    gl.depthFunc( gl.LEQUAL );
    gl.disable( gl.BLEND );
    //gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
};


/**
 * @const
 * @static
 */
Renderer.MAX_FRAGMENT_TEXTURE_UNITS = 1;
/**
 * @const
 * @static
 */
Renderer.MAX_VERTEX_TEXTURE_UNITS = 2;
/**
 * @const
 * @static
 */
Renderer.FLOAT_TEXTURE = 3;

Renderer.prototype = {
    constructor: Renderer,
    getParameter: function( query ) {
        switch ( query ) {
            case Renderer.MAX_FRAGMENT_TEXTURE_UNITS:
                return this.gl.getParameter( this.gl.MAX_TEXTURE_IMAGE_UNITS );
            case Renderer.MAX_VERTEX_TEXTURE_UNITS:
                return this.gl.getParameter( this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
            case Renderer.FLOAT_TEXTURE:
                var ext = this.gl.getSupportedExtensions();
                for ( var i = 0; i < ext.length; i++ ) {
                    if ( ext[ i ] == 'OES_texture_float' ) {
                        this.gl.getExtension( ext[ i ] );
                        return true;
                    }
                }
                return false;
        }
    },
    decayArray: function ( array, deleteFunc ) {
        var gl = this.gl;
        for ( var objectName in array ) {
            var object = array[ objectName ];
            if ( !object.used ) {
                deleteFunc.call( gl, object );
                delete array[ objectName ];
            }
            else {
                object.used = false;
            }
        }
    },
    decay: function() {
        var gl = this.gl;
        this.decayArray( this.bufferObjects, gl.deleteBuffer );
        this.decayArray( this.textureObjects, gl.deleteTexture );
        this.decayArray( this.programObjects, gl.deleteProgram );
    },
    /*
     * This method will create a GL buffer containing the data specified.
     * If no type is specified the buffer will be of type ARRAY_BUFFER.
     */
    createBuffer: function( buffer ) {
        /*DEBUG*/
            assert( buffer instanceof Buffer, 'Illegal type. buffer must be a Buffer object.' );
        /*DEBUG_END*/
        var type, usage;
        switch ( buffer.type ) {
            case Buffer.ELEMENT_BUFFER:
                type = this.gl.ELEMENT_ARRAY_BUFFER;
                break;
            case Buffer.DATA_BUFFER:
                type = this.gl.ARRAY_BUFFER;
        }

        switch ( buffer.usage ) {
            case Buffer.DYNAMIC:
                usage = this.gl.DYNAMIC_DRAW;
                break;
            case Buffer.STREAM:
                usage = this.gl.STREAM_DRAW;
                break;
            case Buffer.STATIC:
                usage = this.gl.STATIC_DRAW;
                break;
        }

        var bufferObject = this.gl.createBuffer();
        this.gl.bindBuffer( type, bufferObject );
        this.gl.bufferData( type, buffer.data, usage );
        this.gl.bindBuffer( type, null );

        bufferObject.length = buffer.data.length;
        this.bufferObjects[ buffer.uid ] = bufferObject;
    },
    /*
     * This method will delete a buffer previously made with createBuffer.
     * If the buffer is currently bound to some target it or there are
     * references to it it will be marked for deletion and will be deleted
     * when it is unbound and all the references are destroyed.
     */
    deleteBuffer: function( buffer ) {
        /*DEBUG*/
            assert( this.gl.isBuffer( this.bufferObjects[ buffer ] ), 'Illegal type. buffer must be a GL Buffer object.' );
        /*DEBUG_END*/
        this.gl.deleteBuffer( this.bufferObjects[ buffer.uid ] );
        delete this.bufferObjects[ buffer.uid ];
    },
	updateBuffer: function( buffer ) {
        /*DEBUG*/
            assert( buffer instanceof Buffer, 'Illegal type. buffer must be a Buffer object.' );
        /*DEBUG_END*/
		var bufferObject = this.bufferObjects[ buffer.uid ];
		if ( typeof bufferObject == 'undefined' ) {
			this.createBuffer( buffer );
		}
		else if ( bufferObject.length != buffer.data.length ) {
			this.deleteBuffer( buffer );
			this.createBuffer( buffer );
		}
        else {
            var type;
            switch ( buffer.type ) {
                case Buffer.DATA_BUFFER:
                    type = this.gl.ARRAY_BUFFER;
                    break;
                case Buffer.ELEMENT_BUFFER:
                    type = this.gl.ELEMENT_BUFFER;
                    break;
            }
            this.gl.bindBuffer( type, this.bufferObjects[ buffer.uid ] );
            this.gl.bufferSubData( type, 0, buffer.data );
            this.gl.bindBuffer( type, null );
        }
        buffer.needsUpdate = false;
	},
    /*DEBUG*/
    isBuffer: function( buffer ) {
        try {
            return this.gl.isBuffer( buffer );
        }
        catch ( e ) {
            return false;
        }
    },
    /*DEBUG_END*/
	bindBuffer: function( buffer ) {
        /*DEBUG*/
            assert( buffer instanceof Buffer, 'Illegal type. buffer must be a Buffer object.' );
        /*DEBUG_END*/
        if ( buffer.data === null ) {
            return;
        }
		var bufferObject, type;
		switch ( buffer.type ) {
			case Buffer.DATA_BUFFER:
				type = this.gl.ARRAY_BUFFER;
				break;
			case Buffer.ELEMENT_BUFFER:
				type = this.gl.ELEMENT_ARRAY_BUFFER;
				break;
		}

		if ( !this.bufferObjects[ buffer.uid ] || buffer.needsUpdate ) {
			this.updateBuffer( buffer );
            this.boundedBuffer = null;
        }

        if ( this.boundedBuffer == buffer ) {
            return;
        }
        this.boundedBuffer = buffer;
        bufferObject = this.bufferObjects[ buffer.uid ];
        this.gl.bindBuffer( type, bufferObject );
        bufferObject.used = true;
    },
    /*
     * This method  will create a texture object with the data passed to it.
     * The source of the texture can be a canvas, video or img element or
     * a pixel array. If it is a pixel array then width and height must be
     * specified. In every case they must be a power of 2.
     */
    createTexture: function( texture ) {
        /*DEBUG*/
            assert( texture instanceof Texture, 'Invalid type. texture must be a Texture instance' );
            if ( !texture.width.isPowerOfTwo() || !texture.height.isPowerOfTwo() ) {
                assert( texture.minFilter !== Texture.NEAREST_MIPMAP_NEAREST, 'Cannot use mipmapping with non power of two dimensions texture' );
                assert( texture.minFilter !== Texture.NEAREST_MIPMAP_LINEAR, 'Cannot use mipmapping with non power of two dimensions texture' );
                assert( texture.minFilter !== Texture.LINEAR_MIPMAP_NEAREST, 'Cannot use mipmapping with non power of two dimensions texture' );
                assert( texture.minFilter !== Texture.LINEAR_MIPMAP_LINEAR, 'Cannot use mipmapping with non power of two dimensions texture' );
            }
        /*DEBUG_END*/

        var gl = this.gl;
        var target, format, dataType, previousTexture;
        var textureObject = gl.createTexture();
        textureObject.bindPosition = null;
        textureObject.width = texture.width;
        textureObject.height = texture.height;

        switch ( texture.origin ) {
            case Texture.UPPER_LEFT_CORNER:
                gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
                break;
            case Texture.LOWER_LEFT_CORNER:
                gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false );
                break;
        }

        switch ( texture.dataType ) {
            case Texture.UNSIGNED_BYTE:
                dataType = gl.UNSIGNED_BYTE;
                break;
            case Texture.FLOAT:
                dataType = gl.FLOAT;
                break;
        }

        switch ( texture.format ) {
            case Texture.RGB:
                format = gl.RGB;
                break;
            case Texture.RGBA:
                format = gl.RGBA;
                break;
        }

        switch ( texture.type ) {
            case Texture.IMAGE:
                target = gl.TEXTURE_2D;
                previousTexture = gl.getParameter( gl.TEXTURE_BINDING_2D );
                gl.bindTexture( target, textureObject );
                if ( texture.source === null ) {
                    gl.texImage2D( target, 0, format, texture.width, texture.height, 0, format, dataType, null );
                }
                else {
                    gl.texImage2D( target, 0, format, format, dataType, texture.source );
                }
                break;
            case Texture.CUBEMAP:
                target = gl.TEXTURE_CUBE_MAP;
                previousTexture = gl.getParameter( gl.TEXTURE_BINDING_CUBE_MAP );
                gl.bindTexture( target, textureObject );
                for ( var i = 0; i < 6; ++i ) {
                    gl.texImage2D( gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, format, format, dataType, texture.source[ i ] );
                }
                break;
        }

        switch ( texture.minFilter ) {
            case Texture.NEAREST:
                gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
                break;
            case Texture.LINEAR:
                gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
                break;
            case Texture.NEAREST_MIPMAP_NEAREST:
                gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST );
                gl.generateMipmap( target );
                break;
            case Texture.NEAREST_MIPMAP_LINEAR:
                gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
                gl.generateMipmap( target );
                break;
            case Texture.LINEAR_MIPMAP_NEAREST:
                gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST );
                gl.generateMipmap( target );
                break;
            case Texture.LINEAR_MIPMAP_LINEAR:
                gl.texParameteri( target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
                gl.generateMipmap( target );
                break;
        }

        switch ( texture.magFilter ) {
            case Texture.NEAREST:
                gl.texParameteri( target, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
                break;
            case Texture.LINEAR:
                gl.texParameteri( target, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
                break;
        }

        switch ( texture.wrapS ) {
            case Texture.REPEAT:
                gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.REPEAT );
                break;
            case Texture.MIRROR_REPEAT:
                gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT );
                break;
            case Texture.CLAMP_TO_EDGE:
                gl.texParameteri( target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
                break;
        }

        switch ( texture.wrapT ) {
            case Texture.REPEAT:
                gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.REPEAT );
                break;
            case Texture.MIRROR_REPEAT:
                gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.MIRROR_REPEAT );
                break;
            case Texture.CLAMP_TO_EDGE:
                gl.texParameteri( target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
                break;
        }
        gl.bindTexture( target, previousTexture );

        this.textureObjects[ texture.uid ] = textureObject;
        texture.needsUpdate = false;
    },
    updateTexture: function( texture ) {
        /*DEBUG*/
            assert( texture instanceof Texture, 'Invalid type. texture must be a Texture instance' );
        /*DEBUG_END*/
        
        if ( typeof this.textureObjects[ texture.uid ] === 'undefined' ) {
            this.createTexture( texture );
            return;
        }

        var textureObject = this.textureObjects[ texture.uid ];
        if ( textureObject.bindPosition ) {
            textureObject.bindPosition.texture = {};
            textureObject.bindPosition = null;
        }

        if ( texture.width !== textureObject.width || texture.height !== textureObject.height ) {
            this.deleteTexture( texture );
            this.createTexture( texture );
            return;
        }

        var gl = this.gl;
        var previousTexture;
        switch ( texture.type ) {
            case Texture.IMAGE:
                previousTexture = gl.getParameter( gl.TEXTURE_BINDING_2D );
                gl.bindTexture( gl.TEXTURE_2D, textureObject );
                if ( texture.source === null ) {
                    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, texture.width, texture.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null );
                }
                else {
                    gl.texSubImage2D( gl.TEXTURE_2D, 0, 0, 0, gl.RGB, gl.UNSIGNED_BYTE, texture.source );
                }
                gl.bindTexture( gl.TEXTURE_2D, previousTexture );
                break;
            case Texture.CUBEMAP:
                throw 'Not implemented';
        }
        texture.needsUpdate = false;
    },
    /*
     * This method binds a Texture object to a position determined by an internal algorithm
     * and the position choosed is returned. If the texture needs
     * updating then it is automatically updated.
     */
    bindTexture: function( texture ) {
        /*DEBUG*/
            assert( texture instanceof Texture, 'Invalid type. texture must be a Texture instance' );
        /*DEBUG_END*/
        var type, textureObject, gl, position, firstPosition, lastPosition;

        if ( texture.needsUpdate || typeof this.textureObjects[ texture.uid ] === 'undefined' ) {
            this.updateTexture( texture );
        }

        gl = this.gl;
        textureObject = this.textureObjects[ texture.uid ];
        textureObject.used = true;
        position = textureObject.bindPosition;

        switch ( texture.type ) {
            case Texture.IMAGE:
                firstPosition = this.firstTexture2DPosition;

                if ( !position ) {
                    position = this.lastTexture2DPosition;
                    position.texture.bindPosition = null;
                    position.texture = textureObject;
                    textureObject.bindPosition = position;

                    gl.activeTexture( gl.TEXTURE0 + position.index );
                    gl.bindTexture( gl.TEXTURE_2D, textureObject );
                }
                if ( position.previous ) {
                    if ( position.next ) {
                        position.next.previous = position.previous;
                    }
                    else {
                        this.lastTexture2DPosition = position.previous;
                    }

                    position.previous.next = position.next;

                    position.previous = null;
                    position.next = firstPosition;

                    firstPosition.previous = position;
                    this.firstTexture2DPosition = position;
                }
                break;
            case Texture.CUBEMAP:
                firstPosition = this.firstTextureCubePosition;

                if ( !position ) {
                    position = this.lastTextureCubePosition;
                    position.texture.bindPosition = null;
                    position.texture = textureObject;
                    textureObject.bindPosition = position;

                    gl.activeTexture( gl.TEXTURE0 + position.index );
                    gl.bindTexture( gl.TEXTURE_CUBE_MAP, textureObject );
                }
                if ( position.previous ) {
                    if ( position.next ) {
                        position.next.previous = position.previous;
                    }
                    else {
                        this.lastTexture2DPosition = position.previous;
                    }

                    position.previous.next = position.next;

                    position.previous = null;
                    position.next = firstPosition;

                    firstPosition.previous = position;
                    this.firstTexture2DPosition = position;
                }
                break;
        }
        return position.index;
    },
    deleteTexture: function( texture ) {
        /*DEBUG*/
            assert( texture instanceof Texture, 'Invalid type. texture must be a Texture instance' );
        /*DEBUG_END*/
        var textureObject = this.textureObjects[ texture.uid ];
        if ( textureObject ) {
            this.gl.deleteTexture( textureObject );
            delete this.textureObjects[ texture.uid ];
        }
    },
    deleteFramebuffer: function( framebuffer ) {
        /*DEBUG*/
            assert( framebuffer instanceof Framebuffer, 'Invalid type. framebuffer must be a Framebuffer instance' );
        /*DEBUG_END*/
        var gl = this.gl;
        this.deleteTexture( framebuffer.colorTexture );

        var framebufferObject = this.framebufferObjects[ framebuffer.uid ];
        if ( framebufferObject ) {
            gl.deleteRenderbuffer( framebufferObject.renderbuffer );
            gl.deleteFramebuffer( framebufferObject );
        }
    },
    /*
     * This method creates a framebuffer object with the specified
     * dimensions. The color attachment of the framebuffer created
     * is a texture and can be used as input to a shader. Also, the
     * framebuffer created has a 16bit depth buffer.
     */
    createFramebuffer: function( framebuffer ) {
        /*DEBUG*/
            assert( framebuffer instanceof Framebuffer, 'Tried to update a non-framebuffer object' );
        /*DEBUG_END*/
        var gl = this.gl;

        var framebufferObject = this.framebufferObjects[ framebuffer.uid ] = gl.createFramebuffer();
        gl.bindFramebuffer( gl.FRAMEBUFFER, framebufferObject );

        this.bindTexture( framebuffer.colorTexture );
        framebufferObject.colorTexture = this.textureObjects[ framebuffer.colorTexture.uid ];
        gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebufferObject.colorTexture, 0 );

        var renderbufferObject = framebufferObject.renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer( gl.RENDERBUFFER, renderbufferObject );
        gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height );
        gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbufferObject );
        gl.bindRenderbuffer( gl.RENDERBUFFER, null );

        /*DEBUG*/
            assert( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) === gl.FRAMEBUFFER_COMPLETE, 'Framebuffer was not constructed correctly' );
        /*DEBUG_END*/
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    },
    /*
     * This method updated the dimensions of an already created framebuffer.
     * The contents of the framebuffer immediatelly after this call are
     * undefined.
     */
    updateFramebuffer: function( framebuffer ) {
        /*DEBUG*/
            assert( framebuffer instanceof Framebuffer, 'Tried to update a non-framebuffer object' );
        /*DEBUG_END*/
        if ( this.framebufferObjects[ framebuffer.uid ] ) {
            this.deleteFramebuffer( framebuffer );
        }
        this.createFramebuffer( framebuffer );

        framebuffer.needsUpdate = false;
    },
    /*
     * This method binds the passed framebuffer so that it becomes active.
     * Any drawing calls following a framebuffer bind will cause the result
     * of the calls being writted in the framebuffer. To return to the normal
     * renderering to the screen bindFramebuffer must be called with null as
     * its parameter.
     */
    bindFramebuffer: function( framebuffer ) {
        /*DEBUG*/
            assert( framebuffer instanceof Framebuffer || framebuffer === null, 'Tried to bind a non-framebuffer object' );
        /*DEBUG_END*/
        var gl = this.gl,
            framebufferObject;

        if ( framebuffer !== null ) {
            framebufferObject = this.framebufferObjects[ framebuffer.uid ];

            if ( framebuffer.needsUpdate || !framebufferObject || !this.textureObjects[ framebuffer.colorTexture.uid ] ) {
                this.updateFramebuffer( framebuffer );
                framebufferObject = this.framebufferObjects[ framebuffer.uid ];
            }
            framebufferObject.colorTexture.used = true;
        }
        else {
            framebufferObject = null;
        }

        if ( this.boundedFramebuffer != framebuffer ) {
            gl.bindFramebuffer( gl.FRAMEBUFFER, framebufferObject );
            this.boundedFramebuffer = framebuffer;
        }
    },
    deleteShader: function( shader ) {
        var programObject, gl;
        gl = this.gl;
        programObject = this.programObjects[ shader.uid ];

        if ( this.currentShader == shader ) {
            this.currentShader = null;
        }

        if ( programObject ) {
            gl.deleteShader( programObject.vertexShader );
            gl.deleteShader( programObject.fragmentShader );
            gl.deleteProgram( programObject );
            delete this.programObjects[ shader.uid ];
        }
    },
    /*
     * This method creates a shader object from the two GLSL sources provided.
     * After compiling and linking the shaders it will search for all active
     * uniforms and attributes also finding their type.
     */
    createShader: function( shader ) {
        var gl, program, uniformCount, attributeCount, i, info, vertexShader, fragmentShader;
        gl = this.gl;

        vertexShader = gl.createShader( gl.VERTEX_SHADER );
        gl.shaderSource( vertexShader, shader.vertexSource );
        gl.compileShader( vertexShader );
        if ( !gl.getShaderParameter( vertexShader, gl.COMPILE_STATUS ) ) {
            throw 'Vertex Shader compile error: ' + gl.getShaderInfoLog( vertexShader );
        }

        fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
        gl.shaderSource( fragmentShader, shader.fragmentSource );
        gl.compileShader( fragmentShader );
        if ( !gl.getShaderParameter( fragmentShader, gl.COMPILE_STATUS ) ) {
            throw 'Fragment Shader compile error: ' + gl.getShaderInfoLog( fragmentShader );
        }

        program = gl.createProgram();
        gl.attachShader( program, vertexShader );
        program.vertexShader = vertexShader;

        gl.attachShader( program, fragmentShader );
        program.fragmentShader = fragmentShader;

        gl.linkProgram( program );
        if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
            throw 'Program linking error: ' + gl.getProgramInfoLog( program );
        }


        uniformCount = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );
        program.uniforms = {};
        while ( uniformCount-- ) {
            info = gl.getActiveUniform( program, uniformCount );

            /* If a shader uses a uniform that is an array then the uniform name that we get has "[0]" at the end.
             * For example uniform vec4 foo[ 10 ] will have a name of foo[0]. We remove the brackets so the names are
             * easier to program.
             */
            var name = info.size > 1 ? info.name.slice( 0, -3 ) : info.name;


            program.uniforms[ name ] = {
                location: gl.getUniformLocation( program, info.name ),
                set: null
            };

            switch ( info.type ) {
                case gl.FLOAT:
                    program.uniforms[ name ].set = gl.uniform1f.bind( gl );
                    break;
                case gl.FLOAT_VEC2:
                    program.uniforms[ name ].set = gl.uniform2fv.bind( gl );
                    break;
                case gl.FLOAT_VEC3:
                    program.uniforms[ name ].set = gl.uniform3fv.bind( gl );
                    break;
                case gl.FLOAT_VEC4:
                    program.uniforms[ name ].set = gl.uniform4fv.bind( gl );
                    break;
                case gl.INT:
                case gl.BOOL:
                    program.uniforms[ name ].set = gl.uniform1i.bind( gl );
                    break;
                case gl.INT_VEC2:
                case gl.BOOL_VEC2:
                    program.uniforms[ name ].set = gl.uniform2iv.bind( gl );
                    break;
                case gl.INT_VEC3:
                case gl.BOOL_VEC3:
                    program.uniforms[ name ].set = gl.uniform3iv.bind( gl );
                    break;
                case gl.INT_VEC4:
                case gl.BOOL_VEC4:
                    program.uniforms[ name ].set = gl.uniform4iv.bind( gl );
                    break;
                case gl.FLOAT_MAT2:
                    program.uniforms[ name ].set = gl.mineUniformMatrix2fv;
                    break;
                case gl.FLOAT_MAT3:
                    program.uniforms[ name ].set = gl.mineUniformMatrix3fv;
                    break;
                case gl.FLOAT_MAT4:
                    program.uniforms[ name ].set = gl.mineUniformMatrix4fv;
                    break;
                case gl.SAMPLER_2D:
                    program.uniforms[ name ].set = gl.mineUniformSampler2D;
                    break;
                case gl.SAMPLER_CUBE:
                    program.uniforms[ name ].set = gl.mineUniformSamplerCube;
                    break;
            }
        }

        attributeCount = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );
        program.attributes = {};
        gl.useProgram( program );
        while ( attributeCount-- ) {
            gl.enableVertexAttribArray( attributeCount );
            info = gl.getActiveAttrib( program, attributeCount );
            program.attributes[ info.name ] = {
                /*DEBUG*/
                    type: info.type,
                /*DEBUG_END*/
                location: gl.getAttribLocation( program, info.name )
            };
        }
        gl.useProgram( null );

        program.used = true;
        this.programObjects[ shader.uid ] = program;
        shader.needsUpdate = false;
    },
    /*
     * This method is used to use the specified shader. All the values that are
     * currenly saved in the shader object will be uploaded to the GPU and the
     * appropriate buffers will be bound to the appropriate attributes.
     */
    useShader: function( shader ) {
        if ( shader === null ) {
            this.render = this.dummyRender;
            return;
        }
        this.render = this._render;
        var programObject, u, uniform;
        if ( !this.programObjects[ shader.uid ] || shader.needsUpdate ) {
            this.deleteShader( shader );
            this.createShader( shader );
            this.currentShader = null;
        }

        programObject = this.programObjects[ shader.uid ];

        if ( this.currentShader != shader ) {
            this.gl.useProgram( programObject );
            this.currentShader = shader;
        }

        programObject.used = true;
    },
    uploadShaderUniforms: function() {
        var shader = this.currentShader;

        /*DEBUG*/
            assert( shader, 'No shader to upload uniforms. Call useShader() before rendering anything' );
        /*DEBUG_END*/
        var programObject = this.programObjects[ shader.uid ];
        for ( var uniform in programObject.uniforms ) {
            /*DEBUG*/
                assert( typeof shader.uniforms[ uniform ] != 'undefined', 'Uniform "' + uniform + '" is undefined! You must set a value.' );
            /*DEBUG_END*/
            var u = programObject.uniforms[ uniform ];
            u.set( u.location, shader.uniforms[ uniform ] );
        }

        programObject.used = true;
    },
    /*
     * This method will resize the default framebuffer to the size specified.
     * It will not have any effect to custom framebuffers, if any is bounded.
     */
    setSize: function( width, height ) {
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
        this.gl.viewport( 0, 0, this.width, this.height );
    },
    /*
     * This method is responsible for initializing the rendering buffer with
     * the current clear color and resets the depth buffer. Should be called
     * before drawing objects on the screen.
     */
    clear: function() {
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
    },
    /*
     * This method takes an index buffer as a parameter and renders the indexed
     * vertices from the buffers binded when useShader() was called. An optional
     * paramter is the drawing method which defaults to TRIANGLES.
     */
    _render: function( mesh ) {
		if ( !this.currentShader ) {
			/*DEBUG*/
				debug.log( debug.ERROR, 'Tried to render without a shader. Call useShader() before rendering.' );
			/*DEBUG_END*/
			return;
		}
        var gl = this.gl;
		var mode;

        switch ( mesh.mode ) {
            case Mesh.POINTS:
                mode = gl.POINTS;
                break;
            case Mesh.LINES:
                mode = gl.LINES;
                break;
            case Mesh.LINE_STRIP:
                mode = gl.LINE_STRIP;
                break;
            case Mesh.LINE_LOOP:
                mode = gl.LINE_LOOP;
                break;
            case Mesh.TRIANGLES:
                mode = gl.TRIANGLES;
                break;
            case Mesh.TRIANGLE_STRIP:
                mode = gl.TRIANGLE_STRIP;
                break;
        }

        this.uploadShaderUniforms();
		var shader = this.currentShader;

		var program = this.programObjects[ shader.uid ];

		for ( var attribute in program.attributes ) {
			var vertexAttribute = mesh.vertexAttributes[ attribute ];
            /*DEBUG*/
                assert( typeof vertexAttribute != 'undefined', 'VertexAttribute "' + attribute + '" is missing from the mesh.' );
                switch ( program.attributes[ attribute ].type ) {
                    case gl.FLOAT:
                        assert( vertexAttribute.size === 1, 'VertexAttribute "' + attribute + '" needs a VertexAttribute of size = 1.' );
                        break;
                    case gl.FLOAT_VEC2:
                        assert( vertexAttribute.size === 2, 'VertexAttribute "' + attribute + '" needs a VertexAttribute of size = 2.' );
                        break;
                    case gl.FLOAT_VEC3:
                        assert( vertexAttribute.size === 3, 'VertexAttribute "' + attribute + '" needs a VertexAttribute of size = 3.' );
                        break;
                    case gl.FLOAT_VEC4:
                        assert( vertexAttribute.size === 4, 'VertexAttribute "' + attribute + '" needs a VertexAttribute of size = 4.' );
                        break;
                }
            /*DEBUG_END*/

			this.bindBuffer( vertexAttribute.buffer );
			gl.vertexAttribPointer( program.attributes[ attribute ].location, vertexAttribute.size, gl.FLOAT, false, vertexAttribute.stride * 4, vertexAttribute.offset * 4 );
		}

		this.bindBuffer( mesh.indexBuffer );
        gl.drawElements( mode, mesh.indexBuffer.data.length, gl.UNSIGNED_SHORT, 0 );
    },
    dummyRender: function( mesh ) {
    },
    render: null
};
/*global
    assertIn : false,
    UUID     : false
*/

/**
 * @class
 *
 * A buffer class used for storing vertex attribute data.
 *
 * @constructor
 * @param {Number} type
 * @param {Number} usage
 */
function Buffer( type, usage ) {
    /**
     * @public
     * A UUID generated for this Buffer.
     * @type String
     */
    this.uuid = UUID.generateCanonicalForm();

    this.name = this.uuid;
    this.uid = Buffer.uid++;

    /**
     * The data array. Initially null.
     * @type Array
     */
    this.data = null;

    /**
     * The length of data.
     * @type Number
     */
    this.length = 0;

    /**
     * Buffer.STATIC, Buffer.DYNAMIC, or Buffer.STREAM
     * @type Number
     */
    this.usage = usage || Buffer.STATIC;

    /**
     * Buffer.DATA_BUFFER or Buffer.ELEMENT_BUFFER
     * @type Number
     */
    this.type = type || Buffer.DATA_BUFFER;
    this.needsUpdate = true;
}

Buffer.uid = 0;

/**
 * @const
 * @type Number
 * @static
 */
Buffer.STATIC = 1;
/**
 * @const
 * @type Number
 * @static
 */
Buffer.DYNAMIC = 2;
/**
 * @const
 * @type Number
 * @static
 */
Buffer.STREAM = 3;
/**
 * @const
 * @type Number
 * @static
 */
Buffer.DATA_BUFFER = 4;
/**
 * @const
 * @type Number
 * @static
 */
Buffer.ELEMENT_BUFFER = 5;


Buffer.prototype = {
    constructor: Buffer,

    /**
     * Sets the buffer data and returns the Buffer instance.
     *
     * This alters {@link data} and {@link length} properties.
     *
     * @param {Array} data
     * @returns Buffer
     */
    setData: function( data ) {
        /*DEBUG*/
            assertIn( data.constructor, Array, Float32Array, Uint16Array, 'Invalid type. data must be an Array, Float32Array or Uint16Array' );
            switch ( this.type ) {
                case Buffer.ELEMENT_BUFFER:
                    assertIn( data.constructor, Array, Uint16Array, 'Invalid type. data must be an Array, Float32Array or Uint16Array' );
                    break;
                case Buffer.DATA_BUFFER:
                    assertIn( data.constructor, Array, Float32Array, 'Invalid type. data must be an Array, Float32Array or Uint16Array' );
                    break;
            }
        /*DEBUG_END*/
        if ( data.constructor == Array ) {
            switch ( this.type ) {
                case Buffer.ELEMENT_BUFFER:
                    if ( this.data && this.data.length == data.length ) {
                        this.data.set( data );
                    }
                    else {
                        data = new Uint16Array( data );

                    }
                    break;
                case Buffer.DATA_BUFFER:
                    if ( this.data && this.data.length == data.length ) {
                        this.data.set( data );
                    }
                    else {
                        data = new Float32Array( data );
                    }
                    break;
            }
        }
        this.needsUpdate = true;
        this.data = data;
        this.length = data.length;
        return this;
    },
    Uint16toUTF8: function( array ) {
        var l = array.length,
            s = '', i;
        for ( i = 0; i < l; ++i ) {
            //Shift all code points by 0x20 to avoid json escaping for small values
            var codePoint = ( array[ i ] + 0x20 ) % 0x10000;
            //0x20 is our escaping character to escape surrogate pairs. If we need to encode 0x20 we actually write 0x20, 0x20
            if ( codePoint == 0x20 ) {
                s += String.fromCharCode( 0x20, 0x20 );
            }
            //Handle surrogate pairs by escaping them with 0x20
            else if ( ( codePoint & 0xF800 ) == 0xD800 ) {
                s += String.fromCharCode( 0x20, codePoint - 0xD7D7 );
            }
            //Valid code point
            else {
                s += String.fromCharCode( codePoint );
            }
        }
        return s;
    },
    UTF8toUint16: function( string ) {
        var l = string.length, array = [], i, temp = new Uint16Array( [ 0 ] );
        for ( i = 0; i < l; ++i ) {
            var codePoint = string.charCodeAt( i );
            //Unescape if needed
            if ( codePoint == 0x20 ) {
                var codePoint2 = string.charCodeAt( ++i );
                if ( codePoint2 > 0x20 ) {
                    codePoint = codePoint2 + 0xD7D7;
                }
            }
            //Use the temporary Uint16 buffer to map values back to 65536 when result is negative
            temp[ 0 ] = codePoint - 0x20;
            array.push( temp[ 0 ] );
        }
        return new Uint16Array( array );
    },
    getExportData: function( exporter ) {
        var ret = {
            name: this.name,
            usage: this.usage,
            type: this.type,
            data: this.Uint16toUTF8( new Uint16Array( this.data.buffer ) )
        };
        return ret;
    },
    setImportData: function( importer, data ) {
        this.name = data.name;
        this.usage = data.usage;
        this.type = data.type;
        switch ( this.type ) {
            case Buffer.DATA_BUFFER:
                this.setData( new Float32Array( this.UTF8toUint16( data.data ).buffer ) );
                break;
            case Buffer.ELEMENT_BUFFER:
                this.setData( this.UTF8toUint16( data.data ) );
                break;
        }
        return this;
    }
};
/*global
    assert : false,
    Buffer : false,
    UUID   : false
*/

/**
 * @constructor
 * @param {string=} semantic The semantics of the Vertexattrubute
 */
function VertexAttribute( semantic ) {
    this.uuid = UUID.generateCanonicalForm();
    this.name = this.uuid;

	this.semantic = semantic || '';
	this.stride = 0;
	this.size = 3;
	this.offset = 0;
    this.length = 0;
	this.buffer = null;
}

VertexAttribute.prototype = {
    constructor: VertexAttribute,
    getElement: function( n, dest ) {
        var s = this.size;
        if ( !dest ) {
            dest = new Float32Array( s );
        }
        var d = this.buffer.data;
        var stride = this.stride || this.size;
        for ( var i = 0; i < s; i++ ) {
            dest[ i ] = d[ this.offset + n * stride + i ];
        }
        return dest;
    },
    setElement: function( n, src ) {
        var s = this.size;
        var d = this.buffer.data;
        var stride = this.stride || this.size;
        for ( var i = 0; i < s; ++i ) {
            d[ this.offset + n * stride + i ] = src[ i ];
        }
    },
    scale: function( factor ) {
        var f = new Float32Array( this.size );
        for ( var i = 0; i < this.length; ++i ) {
            this.getElement( i, f );
            for ( var j = 0; j < f.length; ++j ) {
                f[ j ] *= factor;
            }
            this.setElement( i, f );
        }
    },
    setSize: function( size ) {
        this.size = size | 0;
        return this.updateLength();
    },
    setOffset: function( offset ) {
        this.offset = offset | 0;
        return this.updateLength();
    },
    setStride: function( stride ) {
        this.stride = stride | 0;
        return this.updateLength();
    },
    setBuffer: function ( buffer ) {
		/*DEBUG*/
			assert( buffer instanceof Buffer, 'Invalid type. buffer must be an instance of Buffer' );
		/*DEBUG_END*/
		this.buffer = buffer;
        return this.updateLength();
	},
    updateLength: function() {
        if ( this.stride === 0 ) {
            this.length = ( this.buffer.length - this.offset ) / this.size;
        }
        else {
            this.length = ( this.buffer.length - this.offset ) / this.stride;
        }
        return this;
    },
    clone: function() {
        var ret = new VertexAttribute( this.semantic );
        ret.stride = this.stride;
        ret.size = this.size;
        ret.offset = this.offset;
        ret.buffer = this.buffer;
        return ret;
    },
    getExportData: function( exporter ) {
        var ret = {
            stride: this.stride,
            size: this.size,
            offset: this.offset,
            semantic: this.semantic,
            name: this.name,
            buffer: this.buffer.getExportData( exporter )
        };
        return ret;
    },
    setImportData: function( importer, data ) {
        this.name = data.name;
        this.semantic = data.semantic;
        this.stride = data.stride;
        this.size = data.size;
        this.offset = data.offset;
        this.setBuffer( new Buffer().setImportData( importer, data.buffer ) );
        return this;
    }
};
/*globalA
    assertIn : false,
    UUID     : false
*/

/**
 * @constructor
 * @param {number=} type The type of the texture to create (optional)
 */
function Texture( type ) {
    this.uid = Texture.uid++;
    this.uuid = UUID.generateCanonicalForm();
    this.name = this.uuid;

    this.width = 1;
    this.height = 1;
    this.minFilter = Texture.LINEAR;
    this.magFilter = Texture.LINEAR;
    this.type = type || Texture.IMAGE;

    this.setRepeat( true );

    this.format = Texture.RGB;

    this.dataType = Texture.UNSIGNED_BYTE;

    this.origin = Texture.UPPER_LEFT_CORNER;

    this.source = null;

    this.needsUpdate = true;
}

Texture.uid = 0;

/** @const */
Texture.IMAGE = 1;
/** @const */
Texture.CUBEMAP = 2;

/** @const */
Texture.NEAREST = 1;
/** @const */
Texture.LINEAR = 2;

/** @const */
Texture.NEAREST_MIPMAP_NEAREST = 3;
/** @const */
Texture.LINEAR_MIPMAP_NEAREST = 4;

/** @const */
Texture.NEAREST_MIPMAP_LINEAR = 5;
/** @const */
Texture.LINEAR_MIPMAP_LINEAR = 6;

/** @const */
Texture.REPEAT = 1;
/** @const */
Texture.MIRROR_REPEAT = 2;
/** @const */
Texture.CLAMP_TO_EDGE = 3;

/** @const */
Texture.LOWER_LEFT_CORNER = 1;
/** @const */
Texture.UPPER_LEFT_CORNER = 2;

/** @const */
Texture.RGB = 1;
/** @const */
Texture.RGBA = 2;

/** @const */
Texture.UNSIGNED_BYTE = 1;
/** @const */
Texture.FLOAT = 2;

Texture.prototype = {
    constructor: Texture,
    setName: function( name ) {
        this.name = name || 'Texture #' + this.uid;
        return this;
    },
    setMinFilter: function( filter ) {
        /*DEBUG*/
            assertIn( filter, Texture.NEAREST,
                              Texture.LINEAR,
                              Texture.NEAREST_MIPMAP_NEAREST,
                              Texture.NEAREST_MIPMAP_LINEAR,
                              Texture.LINEAR_MIPMAP_NEAREST,
                              Texture.LINEAR_MIPMAP_LINEAR,
                              'Unsupported minification filtering. ' + filter
            );
        /*DEBUG_END*/
        this.minFilter = filter;
        return this;
    },
    setMagFilter: function( filter ) {
        /*DEBUG*/
            assertIn( filter, Texture.NEAREST, Texture.LINEAR, 'Unsupported minification filtering. ' + filter  );
        /*DEBUG_END*/
        this.magFilter = filter;
        return this;
    },
    setRepeat: function( setting ) {
        if ( setting ) {
            this.setWrapS( Texture.REPEAT );
            this.setWrapT( Texture.REPEAT );
        }
        else {
            this.setWrapS( Texture.CLAMP_TO_EDGE );
            this.setWrapT( Texture.CLAMP_TO_EDGE );
        }
        return this;
    },
    setWrapS: function( wrap ) {
        /*DEBUG*/
            assertIn( wrap, Texture.REPEAT, Texture.MIRROR_REPEAT, Texture.CLAMP_TO_EDGE, 'Unsupported wrapping. ' + wrap );
        /*DEBUG_END*/
        this.wrapS = wrap;
        return this;

    },
    setWrapT: function( wrap ) {
        /*DEBUG*/
            assertIn( wrap, Texture.REPEAT, Texture.MIRROR_REPEAT, Texture.CLAMP_TO_EDGE, 'Unsupported wrapping. ' + wrap  );
        /*DEBUG_END*/
        this.wrapT = wrap;
        return this;
    },
    setFormat: function( format ) {
        /*DEBUG*/
            assertIn( format, Texture.RGB, Texture.RGBA, 'Unsupported format. ' + format );
        /*DEBUG_END*/
        this.format = format;
        return this;
    },
    setDataType: function( dataType ) {
        /*DEBUG*/
            assertIn( dataType, Texture.UNSIGNED_BYTE, Texture.FLOAT, 'Unsupported format. ' + dataType );
        /*DEBUG_END*/
        this.dataType = dataType;
        return this;
    },
    setImage: function( source ) {
        /*DEBUG*/
            assertIn( source.constructor, Image, HTMLImageElement, HTMLCanvasElement, HTMLVideoElement, 'Unsupported type of source' );
        /*DEBUG_END*/
        /*TODO Race condition: A non loaded image is set to the texture, then an other loaded image is set.
               Then the previous pending callback must be canceled and only the most recent call should be
               valid.
        */
        if ( ( source.constructor == HTMLImageElement || source.constructor == Image ) && !source.complete ) {
            source.addEventListener( 'load',this.setImage.bind( this, source ) );
            return this;
        }
        this.source = source;
        this.setDimensions( this.source.width, this.source.height );
        if ( !source.width.isPowerOfTwo() || !source.height.isPowerOfTwo() ) {
            this.setRepeat( false );
        }
        this.needsUpdate = true;
        return this;
    },
    setDimensions: function( width, height ) {
        this.width = width;
        this.height = height;
        return this;
    },
    getExportData: function( exporter ) {
        return {
            width: this.width,
            height: this.height,
            minFilter: this.minFilter,
            maxFilter: this.maxFilter,
            type: this.type,
            wrapS: this.wrapS,
            wrapT: this.wrapT,
            origin: this.origin,
            source: this.source !== null ? this.source.getAttribute( 'src' ) : null
        };
    },
    setImportData: function( importer, data ) {
        this.width = data.width;
        this.height = data.height;
        this.minFilter = data.minFilter;
        this.maxFilter = data.maxFilter;
        this.type = data.type;
        this.wrapS = data.wrapS;
        this.wrapT = data.wrapT;
        this.origin = data.origin;

        var img = new Image();
        img.src = data.source;
        this.setImage( img );

        return this;
    }
};
/*global assert:true, assertIn: true, Buffer: true, UUID: true, VertexAttribute: true, TempVars: true*/

/**
 * @class
 *
 * The 3D representation of a {@link Drawable}.
 *
 * <p>This is the representation object that the lower-level {@link Renderer} class can use to render 3D objects.</p>
 *
 * @constructor
 */
function Mesh() {
    /** @public */
    this.uuid = UUID.generate();

    /** @public */
    this.name = this.uuid;

    /** @public */
    this.mode = Mesh.TRIANGLES;

    /** @public */
    this.vertexAttributes = {};

    /** @public */
	this.indexBuffer = null;
}

Mesh.prototype = {
    constructor: Mesh,
    /**
     * @param {VertexAttribute} attribute
     */
    setVertexAttribute: function( attribute ) {
        this.vertexAttributes[ attribute.semantic ] = attribute;
        return this;
    },
    /**
     * @param {Buffer} buffer
     */
    setIndexBuffer: function( buffer ) {
        this.indexBuffer = buffer;
        return this;
    },
    interleave: function() {
        var interleavedBuffer, data, stride, attribute, attr, i, length, start;
        /*DEBUG*/
            var l = 0;
            for ( attribute in this.vertexAttributes ) {
                attr = this.vertexAttributes[ attribute ];
                if ( !l ) {
                    l = attr.length;
                }
                assert( attr.length == l, 'The vertex attributes in this mesh are of unequal lengths' );
            }
        /*DEBUG_END*/

        interleavedBuffer = new Buffer();

        stride = 0;
        for ( attribute in this.vertexAttributes ) {
            stride += attr.size;
            length = attr.length;
        }

        data = new Float32Array( length * stride );

        var offset = 0;
        for ( attribute in this.vertexAttributes ) {
            attr = this.vertexAttributes[ attribute ];

            i = length;
            while ( i-- ) {
                start = stride * i + offset;
                attr.getElement( i, data.subarray( start, start + attr.size ) );
            }

            attr.stride = stride;
            attr.offset = offset;
            offset += attr.size;
            attr.setBuffer( interleavedBuffer );
        }

        interleavedBuffer.setData( data );

        return this;
    },
    /**
     * @param mode
     */
    setMode: function( mode ) {
        /*DEBUG*/
            assertIn( mode, Mesh.POINTS, Mesh.LINES, Mesh.LINE_LOOP, Mesh.LINE_STRIP, Mesh.TRIANGLES, Mesh.TRIANGLE_STRIP, Mesh.TRIANGLE_FAN, 'Illegal value.' );
        /*DEBUG_END*/
        this.mode = mode;
        return this;
    },
    /**
     * Calculates normals and sets the normal buffer vertex attribute.
     */
    calculateNormals: function() {
        var points = this.vertexAttributes.Position;
        var indices = this.indexBuffer.data;

        var a, b, c,
            ax, ay, az,
            bx, by, bz,
            cx, cy, cz,
            AB, BC, N,
            i, j,
            normals = [];

        // default normal
        for ( i = 0; i < points.length; ++i ) {
            normals[ i ] = [];
        }
        TempVars.lock();
        var ta = TempVars.getVector3();
        var tb = TempVars.getVector3();
        var tc = TempVars.getVector3();
        for ( var triangle = 0; triangle < indices.length / 3; ++triangle ) {
            a = indices[ triangle * 3 + 0 ];
            b = indices[ triangle * 3 + 1 ];
            c = indices[ triangle * 3 + 2 ];


            points.getElement( a, ta );
            points.getElement( b, tb );
            points.getElement( c, tc );

            tb.subtract( ta );

            N = tc.subtract( ta ).cross( tb ).normalize().clone();

            normals[ a ].push( N );
            normals[ b ].push( N );
            normals[ c ].push( N );
        }
        TempVars.release();
        var fNormals = [];
        for ( i = 0; i < normals.length; ++i ) {
            if ( normals[ i ].length === 0 ) {
                fNormals.push( 0, 0, 1 );
                continue;
            }
            if ( normals[ i ].length == 1 ) {
                fNormals.push( normals[ i ][ 0 ][ 0 ], normals[ i ][ 0 ][ 1 ], normals[ i ][ 0 ][ 2 ] );
                continue;
            }
            for ( j = 1; j < normals[ i ].length; ++j ) {
                normals[ i ][ 0 ].add( normals[ i ][ j ] );
            }
            normals[ i ][ 0 ].normalize();
            fNormals.push( normals[ i ][ 0 ][ 0 ], normals[ i ][ 0 ][ 1 ], normals[ i ][ 0 ][ 2 ] );
        }

        normals = new Buffer().setData( fNormals );
        normals = new VertexAttribute( 'Normal' ).setBuffer( normals );
        this.setVertexAttribute( normals );
        return this;
    },
    getExportData: function( exporter ) {
        var ret = {
            mode: this.mode,
            indexBuffer: this.indexBuffer.getExportData( exporter ),
            vertexAttributes: {}
        };
        for ( var vertexAttributeName in this.vertexAttributes ) {
            ret.vertexAttributes[ vertexAttributeName ] = this.vertexAttributes[ vertexAttributeName ].getExportData( exporter );
        }
        return ret;
    },
    setImportData: function( importer, data ) {
        this.mode = data.mode;
        this.indexBuffer = new Buffer().setImportData( importer, data.indexBuffer );
        for ( var name in data.vertexAttributes ) {
            this.vertexAttributes[ name ] = new VertexAttribute().setImportData( importer, data.vertexAttributes[ name ] );
        }
        return this;
    }
};

/** @const */
Mesh.POINTS = 1;
/** @const */
Mesh.LINES = 2;
/** @const */
Mesh.LINE_LOOP = 3;
/** @const */
Mesh.LINE_STRIP = 4;
/** @const */
Mesh.TRIANGLES = 5;
/** @const */
Mesh.TRIANGLE_STRIP = 6;
/** @const */
Mesh.TRIANGLE_FAN = 7;
/*global UUID:true*/

/**
 * @class
 * A shader with a fragment and a vertex source.
 * @constructor */
function Shader() {
    this.uid = Shader.uid++;
    this.uuid = UUID.generateCanonicalForm();
    this.name = this.uuid;

    /**
     * @type String
     */
    this.vertexSource = '';

    /**
     * @type String
     */
    this.fragmentSource = '';

    /**
     * @type Object
     */
    this.uniforms = {};

    this.needsUpdate = false;
}

Shader.uid = 0;

Shader.prototype = {
    constructor: Shader,
    /**
     * @public
     * @param String source
     *
     * Sets the {@link vertexSource} attribute.
     */
    setVertexSource: function( source ) {
        this.vertexSource = source;
        this.needsUpdate = true;
    },
    /**
     * @public
     * @param String source
     *
     * Sets the {@link fragmentSource} attribute.
     */
    setFragmentSource: function( source ) {
        this.fragmentSource = source;
        this.needsUpdate = true;
    },
    getExportData: function( exporter ) {
        return {
            vertexSource: this.vertexSource.split( '\n' ),
            fragmentSource: this.fragmentSource.split( '\n' ),
            name: this.name
        };
    },
    setImportData: function( importer, data ) {
        this.vertexSource = data.vertexSource.join( '\n' );
        this.fragmentSource = data.fragmentSource.join( '\n' );
        this.name = data.name;
        this.needsUpdate = true;
        return this;
    }
};
/*global
    assert  : false,
    Texture : false
*/

/**
 * @class
 *
 * Interface to WebGL Frame Buffer Objects
 *
 * @constructor
 * @param Number width
 * @param Number height
 */
function Framebuffer( width, height ) {
    this.uid = Framebuffer.uid++;

    /**
     * @type Number
     */
    this.width = width || 256;

    /**
     * @type Number
     */
    this.height = height || 256;
    this.colorTexture = new Texture().setWrapS( Texture.CLAMP_TO_EDGE ).setWrapT( Texture.CLAMP_TO_EDGE ).setFormat( Texture.RGBA );
    this.needsUpdate = true;
}

Framebuffer.uid = 0;

Framebuffer.prototype = {
    constructor: Framebuffer,
    setColorTexture: function( texture ) {
        /*DEBUG*/
            assert( texture instanceof Texture, 'texture must be an instance of Texture' );
        /*DEBUG_END*/
        this.colorTexture = texture;
        return this;
    },
    setDimensions: function( width, height ) {
        if ( width !== this.width || height !== this.height ) {
            this.needsUpdate = true;
            this.width = width;
            this.height = height;
            this.colorTexture.setDimensions( this.width, this.height );
        }
        return this;
    }
};
/*global
    BoundingVolume  :  false,
    TempVars        :  false
*/

/**
 * @constructor
 */
function BoundingSphere() {
    this.radius = 1;
}

BoundingSphere.prototype = {
    constructor: BoundingSphere,
    calculateFromVertices: function( positionAttribute ) {
        TempVars.lock();
        var temp = TempVars.getVector3();

        var maxRadius = 0;
        var radius;
        var l = positionAttribute.length;
        while ( l-- ) {
            radius = positionAttribute.getElement( l, temp ).length2();
            if ( radius > maxRadius ) {
                maxRadius = radius;
            }
        }
        this.radius = Math.sqrt( maxRadius );
        TempVars.release();
        return this;
    }
};
/*global
    TempVars  :  false,
    Vector3   :  false
*/


/**
 * @constructor
 */
function BoundingBox() {
    this.halfExtent = new Vector3();
}

BoundingBox.prototype = {
    constructor: BoundingBox,
    calculateFromVertices: function( positionAttribute ) {
        TempVars.lock();
        var temp = TempVars.getVector3();
        var halfExtent = this.halfExtent;

        var l = positionAttribute.length;
        while ( l-- ) {
            positionAttribute.getElement( l, temp ).absolute();
            if ( temp[ 0 ] < halfExtent[ 0 ] ) {
                halfExtent[ 0 ] = temp[ 0 ];
            }
            if ( temp[ 1 ] < halfExtent[ 1 ] ) {
                halfExtent[ 1 ] = temp[ 1 ];
            }
            if ( temp[ 2 ] < halfExtent[ 2 ] ) {
                halfExtent[ 2 ] = temp[ 2 ];
            }
        }
        return this;
    }
};
/*global
    BoundingSphere  :  false,
    Matrix4         :  false,
    Quaternion      :  false,
    TempVars        :  false,
    Transform       :  false,
    UUID            :  false,
    Vector3         :  false,
    EventEmitter    :  false
*/

/**
 * @class
 * An abstract 3D object with a tree-like structure.
 *
 * <p>Inherited position, orientation and scale from Transform represent transformations in local coordinates, relative to the parent node. All transformations applied to a node are recursively applied to its children too.</p>
 *
 * @constructor
 * @extends Transform
 */
function SceneNode() {
    /**
     * @public
     * @type String
     * @see UUID
     */
    this.uuid = UUID.generateCanonicalForm();

    /**
     * @public
     * @type SceneNode
     * @default SceneNode.Origin
     */
    this.parent = SceneNode.Origin;

    /**
     * @public
     * @type Array
     * @default []
     */
    this.children = [];

    this.worldTransform = new Transform();
    this.name = this.uuid;
    this.boundingVolume = new BoundingSphere();
    Transform.call( this );
    EventEmitter.call( this );
}

SceneNode.prototype = {
    constructor: SceneNode,
    /**
     * @public
     * @param {Vector3} [dest]
     * @returns Vector3 dest if specfied, a new Vector3 otherwise.
     */
    getAbsolutePosition: function( dest ) {
        if ( !dest ) {
            dest = new Vector3();
        }
        this._update();
        return dest.set( this.worldTransform.position );
    },
    /**
     * @public
     * @param {Vector3} position
     * @returns SceneNode
     */
    setAbsolutePosition: function( position ) {
        TempVars.lock();
        this.worldTransform.setPosition( position );
        position = TempVars.getVector3().set( position );
        var p = this.parent;
        var q = p.getAbsoluteOrientation( TempVars.getQuaternion() );
        var v = p.getAbsolutePosition( TempVars.getVector3() );
        var s = p.getAbsoluteScale();

        this.position.set( q.inverse().multiplyVector3( position.subtract( v ) ) );
        if ( s != 1 ) {
            this.position.scale( 1 / s );
        }
        TempVars.release();
        return this._invalidate();
    },
    /**
     * @public
     * @param {Quaternion} [dest] Alter dest instead of creating new quaternion.
     * @returns Quaternion dest if specified, new quaternion otherwise.
     */
    getAbsoluteOrientation: function( dest ) {
        if ( !dest ) {
            dest = new Quaternion();
        }
        this._update();
        return this.worldTransform.getOrientation( dest );
    },
    /**
     * @public
     * @param {Quaternion} orientation
     * @returns SceneNode
     */
    setAbsoluteOrientation: function( orientation ) {
        TempVars.lock();
        this.worldTransform.setOrientation( orientation );
        this.orientation.set( this.parent.getAbsoluteOrientation( TempVars.getQuaternion() ).inverse().preMultiply( orientation ) );
        TempVars.release();
        return this._invalidate();
    },
    /**
     * @public
     * @returns Number
     */
    getAbsoluteScale: function() {
        this._update();
        return this.worldTransform.getScale();
    },
    /**
     * @public
     * @param Number scale
     * @returns SceneNode
     */
    setAbsoluteScale: function( scale ) {
        this.worldTransform.setScale( scale );
        this.scale = scale / this.parent.getAbsoluteScale();
        return this._invalidate();
    },
    /**
     * Rotates node around itself or another object.
     * @public
     * @param Array axis A 3-element vector representing the axis.
     * @param Number angle Angle to rotate in radians.
     * @param SceneNode node If specified, rotate around this node.
     * @returns SceneNode
     */
    rotate: function( axis, angle, node ) {
        TempVars.lock();

        //Remap angle to the range 0..2 * Math.PI
        angle -= 2 * Math.PI * Math.floor( angle / 2 / Math.PI );

        //Calculate the quaternion that describes the rotation we want to do
        var rot = TempVars.getQuaternion().setAxisAngle( axis, angle );

        /*
         * If node is undefined then we are rotating around ourself and our position
         * remains unchanged. If it is a node a new position is calculated.
         */
        if ( node ) {
            //Get the absolute position of the node being rotated
            var newPos = this.getAbsolutePosition( TempVars.getVector3() );

            //If we are rotating around SceneNode.Origin things are simple
            if ( node === SceneNode.Origin ) {
                //Rotate our absolute position around the origin
                rot.multiplyVector3( newPos );
            }
            /*
             * If we are rotating around an arbitrary node we need to transform the
             * system so that the node we are rotation around becomes the SceneNode.Origin.
             * We then do the rotation and transform the system back to it's original
             * state.
             */
            else {
                //Get the absolute position of the node around which we are rotating
                var pivotPos = node.getAbsolutePosition( TempVars.getVector3() );
                //Get the absolute orientation of the node around which we are rotating
                var pivotRot = node.getAbsoluteOrientation( TempVars.getQuaternion() );

                /*
                 * Move the rotation point at the origin and apply the inverse rotation of the
                 * node we are rotating around.
                 */
                pivotRot.inverse().multiplyVector3( newPos.subtract( pivotPos ) );

                //Do the rotation as if we where rotating around SceneNode.Origin
                rot.multiplyVector3( newPos );

                //Move back to the original rotation and position
                pivotRot.inverse().multiplyVector3( newPos ).add( pivotPos );
            }
            //Set the position calculated to the node
            this.setAbsolutePosition( newPos );
        }

        //The orientation change is always the same whether we rotate around ourselfs or around a node
        this.orientation.preMultiply( rot );

        TempVars.release();
        return this._invalidate();
    },
    rotateToEuler: function( yaw, pitch, roll ) {
        this.setOrientation( new Quaternion().setEuler( yaw, pitch, roll ) );
    },
    /**
     * @public
     * Moves node relative to its current position or the position of another node.
     * @param Vector3 vector The position transformation vector.
     * @param SceneNode [node] Move relatively to node instead of the current position.
     * @returns SceneNode
     */
    move: function( vector, node ) {
        if ( node ) {
            if ( node == SceneNode.Origin ) {
                TempVars.lock();
                var newPos = this.getAbsolutePosition( TempVars.getVector3() ).add( vector );
                this.setAbsolutePosition( newPos );
                TempVars.release();
                //We don't have to invalidate again. setAbsolutePosition just did it.
                return this;
            }
            else {
                throw 'Not yet implemented';
            }
        }
        else {
            this.position.add( vector );
        }
        return this._invalidate();
    },
    /**
     * @public
     * @param SceneNode node
     * @returns SceneNode
     */
    appendChild: function( node ) {
        if ( node.parent !== SceneNode.Origin ) {
            node.parent.removeChild( node );
        }

        node.parent = this;
        this.children.push( node );
        node._invalidate();

        this.onChildAdded( node );
        return this;
    },
    /**
     * Override this method to process the addition of a node anywhere in the tree below this node.
     * @param SceneNode node The node that was added to the tree.
     */
    onChildAdded: function( node ) {
        this.emit( 'childadded', node );
        if ( this !== SceneNode.Origin ) {
            this.parent.onChildAdded( node );
        }
    },
    /**
     * @public
     * Removes child from list of children and reset child's parent reference to SceneNode.Origin
     * @param {SceneNode} node The node to remove.
     * @returns SceneNode
     */
    removeChild: function( node ) {
        var children = this.children;
        var l = children.length;

        node.parent = SceneNode.Origin;
        node._invalidate();
        children.splice( children.indexOf( node ), 1 );
        this.onChildRemoved( node );

        return this;
    },
    /**
     * @public
     * Override this method to process the removal of a node anywhere in the tree below this node.
     * @params {SceneNode} node The node that wars removed from the tree.
     * @params {SceneNode} parentNode The previous parent of the node.
     */
    onChildRemoved: function( node ) {
        this.emit( 'childremoved', node );
        if ( this !== SceneNode.Origin ) {
            this.parent.onChildRemoved( node );
        }
    },
    /**
     * @public
     * Returns world-coordinate transformation matrix.
     * @param {Matrix4} [dest] Alter dest instead of creating a new matrix.
     * @returns Matrix4 dest if specified, a new matrix otherwise.
     */
    getAbsoluteMatrix: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        this._update();
        return dest.set( this.worldTransform.getMatrix() );
    },
    /**
     * @public
     * Returns the inverse of world-coordinate transformation matrix.
     * @param {Matrix4} [dest] Alter dest instead of creating a new matrix.
     * @returns Matrix4 dest if specified, a new matrix otherwise.
     */
    getAbsoluteInverseMatrix: function( dest ) {
        if ( !dest ) {
            dest = new Matrix4();
        }
        this._update();
        return dest.set( this.worldTransform.getInverseMatrix() );
    },
    _update: function() {
        if ( this._needsUpdate ) {
            this.Transform__update();
            var parent = this.parent;
            parent._update();
            this.worldTransform.set( this ).combineWith( parent.worldTransform );
        }
        return this;
    },
    _invalidate: function() {
        this.Transform__invalidate();
        var l = this.children.length;
        while ( l-- ) {
            this.children[ l ]._invalidate();
        }
        return this;
    },
    getExportData: function( exporter ) {
        var ret = {};
        ret.position = this.getPosition() + '';
        ret.orientation = this.getOrientation() + '';
        ret.scale = this.getScale();
        ret.name = this.name;
        ret.children = [];
        var l = this.children.length;
        while ( l-- ) {
            var child = this.children[ l ];
            ret.children.push( child.name );
            exporter.alsoSave( child );
        }
        return ret;
    },
    setImportData: function( importer, data ) {
        this.name = data.name;
        this.setPosition( new Vector3( data.position ) );
        this.setOrientation( new Quaternion( data.orientation ) );
        this.setScale( data.scale );
        var l = data.children.length;
        while( l-- ) {
            importer.load( data.children[ l ], this.appendChild.bind( this ) );
        }
    }
};

SceneNode.extend( Transform );
SceneNode.extend( EventEmitter );

SceneNode.Origin = new SceneNode();
SceneNode.Origin.parent = SceneNode.Origin; // god
/*global
    Matrix4    : false,
    SceneNode  : false
*/

/**
 * @class
 * Basic camera class.
 *
 * Add a camera to a {@link Scene} to render with this camera.
 * The Application scene has a camera added by default.
 *
 * @constructor
 * @extends SceneNode
 */
function Camera() {
    SceneNode.call( this );

    /**
     * @public
     * @type Number
     * @default 1
     */
    this.width = 1;

    /**
     * @public
     * @type Number
     * @default 1
     */
    this.height = 1;

    /**
     * @public
     * @type Number
     * @default 1
     */
    this.ratio = 1;

    /**
     * @public
     * @type Number
     * @default 0.1
     */
    this.zNear = 0.1;

    /**
     * @public
     * @type Number
     * @default 1000
     */
    this.zFar = 1000;

    /**
     * @public
     * @type Number
     * @default 55
     */
    this.fieldOfView = 55;

    this.tanFieldOfView = Math.tan( ( this.fieldOfView / 2 ) * ( Math.PI / 180 ) );
    this.cosFieldOfView = Math.cos( ( this.fieldOfView / 2 ) * ( Math.PI / 180 ) );
    this.horizontalTanFieldOfView = this.tanFieldOfView;
    this.horizontalCosFieldOfview = Math.cos( Math.atan( this.tanFieldOfView ) );

    this.projectionMatrix = new Matrix4();
    this.setPerspective();
}

Camera.prototype = {
    constructor: Camera,
    /**
     * @public
     * <p>Updates perspective projection matrix based on the camera properties.</p>
     * <p>Call this method if you manually change properties.</p>
     */
    setPerspective: function () {
        Matrix4.perspective( this.fieldOfView, this.width / this.height, this.zNear, this.zFar, this.projectionMatrix );
        this.ratio = this.width / this.height;
        this.horizontalCosFielfOfView = Math.cos( Math.atan( this.tanFieldOfView * this.ratio ) );
        this.horizontalTanFieldOfView = this.tanFieldOfView * this.ratio;
    },
    /**
     * @param {Number} zNear
     */
    setZNear: function( zNear ) {
        this.zNear = zNear;
        this.setPerspective();
    },
    /**
     * @param {Number} zFar
     */
    setZFar: function( zFar ) {
        this.zFar = zFar;
        this.setPerspective();
    },
    /**
     * @param {Number} fieldOfView
     */
    setFieldOfView: function( fieldOfView ) {
        this.fieldOfView = fieldOfView;
        this.setPerspective();
    }
};

Camera.extend( SceneNode );
/*global
    assert         :  false,
    BasicMaterial  :  false,
    Material       :  false,
    SceneNode      :  false
*/

/**
 * @class
 * A 3D object with a mesh and a material.
 *
 * @extends SceneNode
 * @constructor
 */
function Drawable() {
    SceneNode.call( this );
    /**
     * @public
     * @type Mesh
     * @default null
     */
    this.mesh = null;

    /**
     * @public
     * @type Material
     * @default Instance of BasicMaterial
     */
    this.material = new BasicMaterial();
}

Drawable.prototype = {
    constructor: Drawable,
    onBeforeRender: function( camera ) {
    },
    /**
     * Set the material to be used for rendering this drawable.
     *
     * @param {Material} material
     */
    setMaterial: function( material ) {
        /*DEBUG*/
            assert( Material.prototype.isPrototypeOf( material ), 'Tried to set a material which is not or does not inherit from Material' );
        /*DEBUG_END*/
        this.material = material;
        return this;
    },
    repeatTexture: function( times ) {
        this.mesh.vertexAttributes.UVCoord.scale( times );
    },
    getExportData: function( exporter ) {
        var ret = {};
        ret.parent = this.SceneNode_getExportData( exporter );
        ret.mesh = this.mesh.name;
        ret.material = this.material.name;
        exporter.alsoSave( this.mesh );
        exporter.alsoSave( this.material );
        return ret;
    },
    setImportData: function( importer, data ) {
        this.SceneNode_setImportData( importer, data.parent );
        var self = this;
        importer.load( data.mesh, function( mesh ) {
            self.mesh = mesh;
        } );
        importer.load( data.material, function( material ) {
            self.material = material;
        } );
    }
};

Drawable.extend( SceneNode );
/*global
    SceneNode : false
*/


/**
 * @constructor
 * @extends SceneNode
 */
function Light(){
    SceneNode.call( this );
}

Light.extend( SceneNode );
/*global
    Drawable  :  false,
    SceneNode      :  false
*/

/**
 * @class
 *
 * The tree of nodes to be rendered.
 *
 * @constructor
 */
function Scene() {
    SceneNode.call( this );
    this.drawableList = [];
}

Scene.prototype = {
    constructor: Scene,
    /**
     * Returns the nodes in the tree below a given node that are instances of theClass.
     * @param {SceneNode} node
     * @param {Function} theClass
     * @returns Array An array of nodes.
     */
    findClass: function( node, theClass ) {
        var bucket = [], bucketIndex = 0,
            stack = [ node ], stackIndex = 1,
            children, l;
        while ( stackIndex ) {
            node = stack[ --stackIndex ];
            if ( node instanceof theClass ) {
                bucket[ bucketIndex++ ] = node;
            }
            children = node.children;
            l = children.length;
            while ( l-- ) {
                stack[ stackIndex++ ] = children[ l ];
            }
        }
        return bucket;
    },
    /**
     * @override
     */
    onChildAdded: function( nodeAdded ) {
        this.SceneNode_onChildAdded( nodeAdded );
        var drawables = this.findClass( nodeAdded, Drawable );
        this.drawableList.push.apply( this.drawableList, drawables );
    },
    /**
     * @override
     */
    onChildRemoved: function( nodeRemoved ) {
        this.SceneNode_onChildRemoved( nodeRemoved );
        var drawables = this.findClass( nodeRemoved, Drawable );
        var l = drawables.length;
        while ( l-- ) {
            this.drawableList.splice( this.drawableList.indexOf( drawables[ l ] ), 1 );
        }
    }
};

Scene.extend( SceneNode );
/*global
    Color       :  false,
    Matrix4     :  false,
    Quaternion  :  false,
    Shader      :  false,
    Texture     :  false,
    UUID        :  false,
    Vector3     :  false
*/

/**
 * @class
 * Material base class.
 *
 * @constructor
 */
function Material() {
    /**
     * @public
     * @type String
     *
     * A UUID generated for this material instance.
     */
    this.uuid = UUID.generateCanonicalForm();

    this.uid = Material.uid++;

    /**
     * @public
     * @type String
     *
     * The name of this Material. The default value is the same as {@link uuid}.
     */
    this.name = this.uuid;

    /*
     * @public
     * @type Shader
     *
     * The shader used for rendering objects with this material.
     */
    this.shader = null;

    /*
     * @public
     * @type Object
     *
     * The values of parameters to be passed to the shader.
     */
    this.parameters = {};
}

Material.uid = 0;

Material.prototype = {
    constructor: Material,
    /**
     * Set the value of a parameter for the shader.
     */
    setParameter: function( name, value ) {
        if ( typeof value === 'object' ) {
            this.parameters[ name ] = value.data;
        }
        else {
            this.parameters[ name ] = value;
        }
        return this;
    },
    /**
     * Get the shader object.
     */
    getShader: function() {
        if ( this.shader !== null ) {
            for ( var parameterName in this.parameters ) {
                this.shader.uniforms[ parameterName ] = this.parameters[ parameterName ];
            }
        }
        return this.shader;
    }
};
/*global
    Importer  :  false,
    Material  :  false,
    Vector3   :  false
*/

/**
 * @class
 * @extends Material
 *
 * A material with a diffuse color.
 *
 * @constructor
 */
function BasicMaterial() {
    Material.call( this );
    this.name = 'BasicMaterial';

    var self = this;
    new Importer( 'resources' ).load( 'system/BasicShader', function( shader ) {
        self.shader = shader;
    } );
    this.setParameter( 'Diffuse', new Vector3( [ 1, 1, 1 ] ) );

    this.engineParameters = {
        WorldViewProjectionMatrix: true
    };
}

BasicMaterial.extend( Material );
/*global
    Importer  :  false,
    Material  :  false,
    Vector3   :  false,
    Texture   :  false
*/

/**
 * @class
 * @extends Material
 *
 * A material for objects with textures.
 *
 * @constructor
 * @param {Texture} texture
 */
function TexturedMaterial( texture ) {
    Material.call( this );
    this.name = 'TexturedMaterial';

    var self = this;
    new Importer( 'resources' ).load( 'system/TexturedShader', function( shader ) {
        self.shader = shader;
    } );

    this.engineParameters = {
        WorldViewProjectionMatrix: true,
        WorldViewMatrix: true
    };

    if ( typeof texture == "string" ) {
        var textureURL = texture;
        var img = new Image();
        img.src = textureURL;
        texture = new Texture().setImage( img );
        this.setParameter( 'texture', { data: texture } );
    }
    else if ( typeof texture != 'undefined' ) {
        // texture is a texture object
        this.setParameter( 'texture', { data: texture } );
    }
}

TexturedMaterial.extend( Material );
/*global
    Importer  :  false,
    Material  :  false,
    Vector3   :  false,
    Texture   :  false
*/

/**
 * @class
 * @extends Material
 *
 * A material for objects with textures.
 *
 * @constructor
 * @param {Texture} texture
 */
function CubemapMaterial( sources ) {
    Material.call( this );
    this.name = 'CubemapMaterial';

    var self = this;
    new Importer( 'resources' ).load( 'system/CubemapShader', function( shader ) {
        self.shader = shader;
    } );

    this.engineParameters = {
        WorldViewProjectionMatrix: true,
        WorldViewMatrix: true
    };

    var texture = new Texture( Texture.CUBEMAP ).setRepeat( false );
    texture.source = [];
    texture.origin = Texture.LOWER_LEFT_CORNER;

    var toLoad = 0;
    sources.forEach( function( source, i ) {
        var textureURL = texture;
        var img = new Image();

        ++toLoad;
        img.onload = function() {
            --toLoad;
            if ( !toLoad ) {
                console.log( 'h ' + img.height + ', w ' + img.width );
                texture.setDimensions( img.width, img.height );
                texture.needsUpdate = true;
            }
        };

        img.src = source;
        texture.source[ i ] = img;
    } );
    this.setParameter( 'texture', { data: texture } );
    this.texture = texture;
}

CubemapMaterial.extend( Material );
/*global
    Buffer           :  false,
    Drawable         :  false,
    Mesh             :  false,
    VertexAttribute  :  false
*/

/**
 * @class
 * @extends Drawable
 *
 * A unit cube.
 *
 * @constructor
 */
function Cube() {
    Drawable.call( this );
    var vertices = [
        // right
        1, 0, 0,
        1, 1, 1,
        1, 0, 1,
        1, 1, 0,
        // left
        0, 1, 0,
        0, 0, 1,
        0, 1, 1,
        0, 0, 0,
        // top
        0, 1, 0,
        1, 1, 1,
        1, 1, 0,
        0, 1, 1,
        // bottom
        0, 0, 1,
        1, 0, 0,
        1, 0, 1,
        0, 0, 0,
        // front
        0, 0, 1,
        1, 1, 1,
        0, 1, 1,
        1, 0, 1,
        // back
        1, 0, 0,
        0, 1, 0,
        1, 1, 0,
        0, 0, 0
    ];
    var uvcoords = [
        0, 0,
        1, 1,
        0, 1,
        1, 0
    ];
    var normals = [
        1, 0, 0,
       -1, 0, 0,
        0, 1, 0,
        0,-1, 0,
        0, 0, 1,
        0, 0,-1
    ];
    var tangents = [
        0, 1, 0,
        0,-1, 0,
        0, 0, 1,
        0, 0,-1,
        1, 0, 0,
       -1, 0, 0
    ];

    // center unit cube around the origin
    for ( var i = 0; i < vertices.length; ++i ) {
        vertices[ i ] -= 0.5;
    }

    var ret = {
        vertices: [],
        indices: [],
        normals: [],
        tangents: [],
        uvcoords: []
    };

    for ( var face = 0; face < 6; ++face ) {
        for ( var vertex = 0; vertex < 6; ++vertex ) { // 6 vertices per face
            ret.normals.push(
                normals[ face * 3 ],
                normals[ face * 3 + 1 ],
                normals[ face * 3 + 2 ]
            );
            ret.tangents.push(
                tangents[ face * 3 ],
                tangents[ face * 3 + 1 ],
                tangents[ face * 3 + 2 ]
            );
            ret.indices.push( face * 6 + vertex );
        }
    }

    function addPoint( face, point ) {
        ret.vertices.push(
            vertices[ face * 3 * 4 + point * 3 ],
            vertices[ face * 3 * 4 + point * 3 + 1 ],
            vertices[ face * 3 * 4 + point * 3 + 2 ]
        );
        ret.uvcoords.push(
            uvcoords[ point * 2 ],
            uvcoords[ point * 2 + 1 ]
        );
    }

    for ( face = 0; face < 6; ++face ) {
        // top triangle
        addPoint( face, 0 );
        addPoint( face, 1 );
        addPoint( face, 2 );
        // bottom triangle
        addPoint( face, 0 );
        addPoint( face, 3 );
        addPoint( face, 1 );
    }

    vertices = new Buffer().setData( ret.vertices );
    uvcoords = new Buffer().setData( ret.uvcoords );
    normals = new Buffer().setData( ret.normals );

    vertices = new VertexAttribute( 'Position' ).setBuffer( vertices );
    uvcoords = new VertexAttribute( 'UVCoord' ).setBuffer( uvcoords ).setSize( 2 );
    normals = new VertexAttribute( 'Normal' ).setBuffer( normals );

    var indices = new Buffer( Buffer.ELEMENT_BUFFER ).setData( ret.indices );

    var m = new Mesh();
    m.setVertexAttribute( vertices );
    m.setVertexAttribute( normals );
    m.setVertexAttribute( uvcoords );
    m.setIndexBuffer( indices );

    this.mesh = m;
}

Cube.extend( Drawable );
/*global
    Buffer           :  false,
    Drawable         :  false,
    Mesh             :  false,
    VertexAttribute  :  false
*/

/**
 * @class
 * A rectangle.
 *
 * @extends Drawable
 *
 * @constructor
 * @param {Number} x0
 * @param {Number} z0
 * @param {Number} x1
 * @param {Number} z1
 */
function Rectangle( x0, z0, x1, z1 ) {
    Drawable.call( this );
    var vertices = [
        x0, 0, z0,
        x1, 0, z0,
        x0, 0, z1,
        x1, 0, z1
    ];

    var uvcoords = [
        0, 0,
        0, 1,
        1, 0,
        1, 1
    ];
    var normals = [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];

    var indices = [ 0, 1, 2, 2, 1, 3 ];

    vertices = new Buffer().setData( vertices );
    uvcoords = new Buffer().setData( uvcoords );
    normals = new Buffer().setData( normals );

    vertices = new VertexAttribute( 'Position' ).setBuffer( vertices );
    uvcoords = new VertexAttribute( 'UVCoord' ).setBuffer( uvcoords ).setSize( 2 );
    normals = new VertexAttribute( 'Normal' ).setBuffer( normals );

    indices = new Buffer( Buffer.ELEMENT_BUFFER ).setData( indices );

    var m = new Mesh();
    m.setVertexAttribute( vertices );
    m.setVertexAttribute( normals );
    m.setVertexAttribute( uvcoords );
    m.setIndexBuffer( indices );

    this.mesh = m;
}

Rectangle.extend( Drawable );

/*global
    Buffer           :  false,
    Drawable         :  false,
    Mesh             :  false,
    VertexAttribute  :  false
*/

/**
 * @class
 * A sphere.
 * @extends Drawable
 * @constructor
 * @param {Number} radius
 * @param {Number} segmentsY
 * @param {Number} segmentsX
 */
function Sphere( radius, segmentsY, segmentsX ) {
    Drawable.call( this );
    radius = radius || 1;

    segmentsY = segmentsY || 10;
    segmentsX = segmentsX || segmentsY;

    var R = radius;
    var p = segmentsY;
    var m = segmentsX;

    var model = {
        vertices: [],
        indices: []
    };

    var prev = function( x, m ) {
        if ( x === 0 ) {
            return ( m - 1 );
        }
        else {
            return ( x -1 );
        }
    };

    var y, x, z, r,cnt = 0, cnt2 = 0;
    for ( var i = 1; i < p-1; i++ ) { // end points are missing
        y = R*Math.sin( -Math.PI/2 + i*Math.PI/( p - 1 ) );
        r = R*Math.cos( -Math.PI/2 + i*Math.PI/( p - 1 ) );
        //console.log( "y , r " ,y, r );
        for ( var k = 0; k < m; k++ ) {
            x = r*Math.cos( 2*Math.PI*k/ m );
            z = r*Math.sin( 2*Math.PI*k/ m );
            //console.log( x, z );
            model.vertices[ cnt ] = x;
            model.vertices[ cnt+1 ] = y;
            model.vertices[ cnt+2 ] = z;
            cnt = cnt+3;
        }
        //make the triangle


        if ( i > 1 ) {
            var st = ( i - 2 )*m;
            for ( x = 0; x < m; x++ ) {
                model.indices[ cnt2 ] = st + x;
                model.indices[ cnt2+1 ] = st + prev( x, m ) + m;
                model.indices[ cnt2+2 ] = st + x + m;
                cnt2  += 3;

                model.indices[ cnt2 ] = st + x;
                model.indices[ cnt2+1 ] = st + prev( x, m );
                model.indices[ cnt2+2 ] = st + prev( x, m ) + m;
                cnt2 += 3;
            }
        }
    }

    model.vertices[ cnt ] = 0;
    model.vertices[ cnt+1 ] = -R;
    model.vertices[ cnt+2 ] = 0;
    var down = cnt/3;
    cnt += 3;
    model.vertices[ cnt ] = 0;
    model.vertices[ cnt+1 ] = R;
    model.vertices[ cnt+2 ] = 0;
    cnt += 3;

    var top = down + 1;
    for ( x = 0; x < m; x++ ) {
        model.indices[ cnt2 ] = down;
        model.indices[ cnt2+1 ] = prev( x, m );
        model.indices[ cnt2+2 ] = x;
        cnt2 += 3;

        model.indices[ cnt2 ] = down - m + x;
        model.indices[ cnt2+1 ] = down - m + prev( x, m );
        model.indices[ cnt2+2 ] = top;
        cnt2 +=3;
    }



    var vertices = new Buffer().setData( model.vertices );
//    uvcoords = new Buffer().setData( ret.uvcoords );
//    normals = new Buffer().setData( ret.normals );

    vertices = new VertexAttribute( 'Position' ).setBuffer( vertices );
//    uvcoords = new VertexAttribute( 'UVCoord' ).setBuffer( uvcoords ).setSize( 2 );
//    normals = new VertexAttribute( 'Normal' ).setBuffer( normals );

    var indices = new Buffer( Buffer.ELEMENT_BUFFER ).setData( model.indices );

    m = new Mesh();
    m.setVertexAttribute( vertices );
//    m.setVertexAttribute( normals );
//    m.setVertexAttribute( uvcoords );
    m.setIndexBuffer( indices );

    this.mesh = m;
}

Sphere.extend( Drawable );
/*global CubemapMaterial: false */

// extern
var Buffer, Drawable, Mesh, VertexAttribute;

/**
 * @class
 * Display background images on a 3D scene.
 *
 * <p>
 * The skybox is a box that has the camera on its center and has a texture on each
 * of its (internal) sides.
 * </p>
 *
 * <p>To instantiate the Skybox, pass an array of 6 textures as a parameter to the constructor.
 * The order is the following: (following the order of the WebGL specification constants):</p>
 * <ul>
 * <li>positive x</li>
 * <li>negative x</li>
 * <li>positive y</li>
 * <li>negative y</li>
 * <li>positive z</li>
 * <li>negative z</li>
 * </ul>
 *
 * After instantiating the skybox, you have to add it to the Scene.
 *
 * <p>Example:</p>
 * <code>
 * var skybox = new Skybox( [
 *  'skybox/posx.jpg',
 *  'skybox/negx.jpg',
 *  'skybox/posy.jpg',
 *  'skybox/negy.jpg',
 *  'skybox/posz.jpg',
 *  'skybox/negz.jpg'
 * ] );
 *
 * scene.appendChild( skybox );
 </code>
 *
 * <p>You can also pass a second parameter to the Skybox to denote the size of skybox (e.g. distance from camera). However, you should be careful that it does not exceed the camera zfar value (by default 1000) or it won't be rendered.</p>
 *
 * @extends Drawable
 *
 * @constructor
 * @param {Array} sources
 * @param {Number} scale
 */
function Skybox( sources, scale ) {
    scale = scale || 500;

    Drawable.call( this );

    console.log( sources );
    this.material = new CubemapMaterial( sources );

    var ret = {
        vertices: [
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,

            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0
        ],
        indices: [
            1, 5, 7, 7, 3, 1,
            2, 6, 4, 4, 0, 2,
            0, 4, 5, 5, 1, 0,
            3, 7, 6, 6, 2, 3,
            4, 6, 7, 7, 5, 4,
            0, 1, 3, 3, 2, 0
        ],
        normals: [
            1.0,  1.0,  -1.0,
            -1.0,  1.0,  -1.0,
            -1.0,  -1.0,  -1.0,
            1.0,  -1.0,  -1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  -1.0,  1.0,
            1.0,  -1.0,  1.0,
        ],
        uvcoords: [
            /*
            1.0, 1.0,  -1.0,
            -1.0, 1.0,  -1.0,
            1.0,  -1.0,  -1.0,
            -1.0,  -1.0,  -1.0,
            1.0, 1.0,  1.0,
            -1.0, 1.0,  1.0,
            1.0,  -1.0,  1.0,
            -1.0,  -1.0,  1.0,
            */
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,

            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0
        ]
    };

    var vertices = new Buffer().setData( ret.vertices );
    var uvcoords = new Buffer().setData( ret.uvcoords );
    // var normals = new Buffer().setData( ret.normals );

    vertices = new VertexAttribute( 'Position' ).setBuffer( vertices );
    uvcoords = new VertexAttribute( 'UVCoord' ).setBuffer( uvcoords );
    // normals = new VertexAttribute( 'Normal' ).setBuffer( normals );

    var indices = new Buffer( Buffer.ELEMENT_BUFFER ).setData( ret.indices );

    var m = new Mesh();
    m.setVertexAttribute( vertices );
    // m.setVertexAttribute( normals );
    m.setVertexAttribute( uvcoords );
    m.setIndexBuffer( indices );

    this.mesh = m;
    this.setScale( scale );
}

Skybox.prototype = {
    constructor: Skybox,
    onBeforeRender: function( camera ) {
        this.setPosition( camera.getPosition() );
    }
};

Skybox.extend( Drawable );
/*global
    Buffer           :  false,
    Drawable         :  false,
    Mesh             :  false,
    VertexAttribute  :  false
*/

/**
 * @class
 * A floor rectangle.
 *
 * @extends Drawable
 *
 * @constructor
 */
function Floor() {
    var x0 = -500;
    var z0 = 500;
    var x1 = 500;
    var z1 = -500;

    Drawable.call( this );
    var vertices = [
        x0, 0, z0,
        x1, 0, z0,
        x0, 0, z1,
        x1, 0, z1
    ];

    var uvcoords = [
        0, 0,
        0, 1,
        1, 0,
        1, 1
    ];
    var normals = [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ];

    var indices = [ 0, 1, 2, 2, 1, 3 ];

    vertices = new Buffer().setData( vertices );
    uvcoords = new Buffer().setData( uvcoords );
    normals = new Buffer().setData( normals );

    vertices = new VertexAttribute( 'Position' ).setBuffer( vertices );
    uvcoords = new VertexAttribute( 'UVCoord' ).setBuffer( uvcoords ).setSize( 2 );
    normals = new VertexAttribute( 'Normal' ).setBuffer( normals );

    indices = new Buffer( Buffer.ELEMENT_BUFFER ).setData( indices );

    var m = new Mesh();
    m.setVertexAttribute( vertices );
    m.setVertexAttribute( normals );
    m.setVertexAttribute( uvcoords );
    m.setIndexBuffer( indices );

    this.mesh = m;
}

Floor.extend( Drawable );
/**
 * @interface
 * Interface for input devices.
 */
function InputDevice() {
}

/**
 * addAction should register an action for an event.
 * @param {number} eventId An identifier for the event. This should be a constant defined by the implemented device class.
 * @param {Object} action An object that defines what action should be done when the event occurs. The action has a callback property, and may have an endCallback property. Custom devices may use other properties too for configuration.
 */
InputDevice.prototype.addAction = function( eventId, action ) {
};
/*global InputDevice:true */

/**
 * @implements InputDevice
 *
 * @constructor
 */
function Keyboard() {
    this.actions = {};
    this.keyData = {};
    this.pressed = {};

    window.addEventListener( 'keydown', Keyboard.prototype.handleKeyDown.bind( this ), false );
    window.addEventListener( 'keyup', Keyboard.prototype.handleKeyUp.bind( this ), false );
    document.addEventListener( 'mouseout', Keyboard.prototype.handleMouseOut.bind( this ), false );
}
Keyboard.prototype = {
    getKeyData: function( keyCode ) {
        if ( !this.keyData[ keyCode ] ) {
            this.keyData[ keyCode ] = {};
        }
        return this.keyData[ keyCode ];
    },
    setPressed: function( key ) {
        if ( this.pressed[ key ] ) {
            return;
        }
        var keyData;
        for ( var k in this.pressed ) { // clear other keyup intervals
            if ( k == key ) {
                continue;
            }
            keyData = this.getKeyData( k );
            clearInterval( keyData.upInterval );
            keyData.upInterval = 0;
        }
        this.pressed[ key ] = true;
    },
    unsetPressed: function( key ) {
        if ( !this.pressed[ key ] ) {
            return;
        }
        delete this.pressed[ key ];
    },
    handleKeyDown: function( e ) {
        var self = this,
            actions = this.actions[ e.keyCode ],
            keyData;

        if ( !actions || !actions.length ) {
            return;
        }

        keyData = this.getKeyData( e.keyCode );
        keyData.lastPress = Date.now();

        if ( this.pressed[ e.keyCode ] ) {
            // we are checking repetition
            return;
        }

        var hasEndCallback = false;

        // call associated actions
        actions.forEach( function( action ) {
            action.callback( e );

            if ( action.endCallback ) {
                hasEndCallback = true;
            }

            if ( action.repeat ) {
                action.repeatInterval = setInterval( action.callback, action.speed );
            }
        } );

        // we believe it is an autorepeat until we get a keyup
        this.setPressed( e.keyCode );

        // auto-repeat takes half a second to start (on chrome for linux at least..)
        /*
        keyData.upCallback = setTimeout( function() {
            self.checkAutoRepeat( e );
        }, 1000 );
        */
    },
    handleKeyUp: function( e ) {
        var actions = this.actions[ e.keyCode ], keyData = this.getKeyData( e.keyCode );
        if ( !actions ) {
            return;
        }

        // console.log( 'clearing upinterval' );

        if ( keyData.upInterval ) {
            clearInterval( keyData.upInterval );
        }

        actions.forEach( function( action ) {
            if ( action.endCallback ) {
                action.endCallback( e );
            }
            if ( action.repeatInterval ) {
                clearInterval( action.repeatInterval );
                action.repeatInterval = false;
            }
        } );

        // clear intervals and set to 0 so that we know we can set them again
        clearInterval( keyData.upInterval );
        keyData.upInterval = 0;

        clearTimeout( keyData.upCallback );
        keyData.upCallback = 0;

        this.unsetPressed( e.keyCode );
    },
    /**
     * @see InputDevice#addAction
     */
    addAction: function ( key, options ) {
        if ( typeof options == "function" ) {
            options = { callback: options };
        }
        if ( typeof options.repeat == "undefined" ) {
            options.repeat = true;
        }
        var action = {
            callback: options.callback || function() {},
            endCallback: options.endCallback || null,
            repeat: options.repeat,
            speed: options.speed || 10
        };
        if ( !this.actions[ key ] ) {
            this.actions[ key ] = [ action ];
        }
        else {
            this.actions[ key ].push( action );
        }
    },
    // for when mouse gets out of window, extra fix
    // (the upInterval does not work when two keys are pressed)
    handleMouseOut: function( e ) {
        var from = e.relatedTarget || e.toElement;
        if ( from && from.nodeName != 'HTML' ) {
            return;
        }
        // console.log( 'left window, clearing all keydowns' );
        for ( var i in this.pressed ) {
            this.handleKeyUp( { keyCode: i } );
        }
    },
    checkAutoRepeat: function( e ) {
        var keyData = this.getKeyData( e.keyCode ),
            self = this;

        if ( !this.pressed[ e.keyCode ] ) {
            // we got a keyup within a second, no keyboard repeat
            return;
        }

        // now check every little time if we get any keydowns from autorepeat
        keyData.upInterval = setInterval( function() {
            if ( Date.now() - keyData.lastPress < self.REPEAT_INTERVAL ) {
                // got a keydown not so long ago, dont send keyup
                return;
            }

            // did not get any keydown, call keyup
            self.handleKeyUp( e );
        }, 100 );
    }
};

Keyboard.extend( InputDevice );

/** @static */
Keyboard.KEY_LEFT_ARROW = 37;
/** @static */
Keyboard.KEY_UP_ARROW = 38;
/** @static */
Keyboard.KEY_RIGHT_ARROW = 39;
/** @static */
Keyboard.KEY_DOWN_ARROW = 40;
/** @static */
Keyboard.KEY_SPACE = 32;
/** @static */
Keyboard.KEY_ENTER = 13;
/** @static */
Keyboard.KEY_ESCAPE = 27;
/** @static */
Keyboard.KEY_A = 65;
/** @static */
Keyboard.KEY_B = 66;
/** @static */
Keyboard.KEY_C = 67;
/** @static */
Keyboard.KEY_D = 68;
/** @static */
Keyboard.KEY_E = 69;
/** @static */
Keyboard.KEY_F = 70;
/** @static */
Keyboard.KEY_G = 71;
/** @static */
Keyboard.KEY_H = 72;
/** @static */
Keyboard.KEY_I = 73;
/** @static */
Keyboard.KEY_J = 74;
/** @static */
Keyboard.KEY_K = 75;
/** @static */
Keyboard.KEY_L = 76;
/** @static */
Keyboard.KEY_M = 77;
/** @static */
Keyboard.KEY_N = 78;
/** @static */
Keyboard.KEY_O = 79;
/** @static */
Keyboard.KEY_P = 80;
/** @static */
Keyboard.KEY_Q = 81;
/** @static */
Keyboard.KEY_R = 82;
/** @static */
Keyboard.KEY_S = 83;
/** @static */
Keyboard.KEY_T = 84;
/** @static */
Keyboard.KEY_U = 85;
/** @static */
Keyboard.KEY_V = 86;
/** @static */
Keyboard.KEY_W = 87;
/** @static */
Keyboard.KEY_X = 88;
/** @static */
Keyboard.KEY_Y = 89;
/** @static */
Keyboard.KEY_Z = 90;
/**
 * @implements InputDevice
 * @constructor
 */
function Mouse() {
    this.down = {};

    this.prevX = 0;
    this.prevY = 0;

    this.actions = {};

    window.addEventListener( 'mousedown', Mouse.prototype.handleMouseDown.bind( this ), false );
    window.addEventListener( 'mouseup', Mouse.prototype.handleMouseUp.bind( this ), false );
    window.addEventListener( 'mousemove', Mouse.prototype.handleMouseMove.bind( this ), false );
    window.addEventListener( 'mousewheel', Mouse.prototype.handleMouseWheel.bind( this ), false );

    // firefox:
    window.addEventListener( 'DOMMouseScroll', Mouse.prototype.handleMouseWheel.bind( this ), false );
}

Mouse.prototype = {
    constructor: Mouse,
    handleMouseDown: function( e ) {
        var i, action, actions = this.actions[ e.button ], l;

        this.down[ e.button ] = true;

        if ( !actions ) {
            return;
        }

        this.addCustomEventData( e );
        l = actions.length;
        for ( i = 0; i < l; ++i ) {
            actions[ i ].callback( e );
        }
    },
    handleMouseUp: function( e ) {
        var i, action, actions = this.actions[ e.button ], l;

        this.down[ e.button ] = false;

        if ( !actions ) {
            return;
        }

        this.addCustomEventData( e );
        l = actions.length;
        for ( i = 0; i < l; ++i ) {
            actions[ i ].endCallback( e );
        }
    },
    handleMouseMove: function( e ) {
        var i, action, actions = this.actions[ Mouse.MOUSE_MOVE ], l;

        this.addCustomEventData( e );

        this.prevX = e.screenX;
        this.prevY = e.screenY;

        if ( !actions ) {
            return;
        }

        l = actions.length;
        for ( i = 0; i < l; ++i ) {
            actions[ i ].callback( e );
        }
    },
    handleMouseWheel: function( e ) {
        var i, action, actions = this.actions[ Mouse.MOUSE_WHEEL ], l;

        if ( !actions ) {
            return;
        }

        if ( e.detail ) { // firefox
            e.wheelDelta = -e.detail / 3;
        }

        this.addCustomEventData( e );

        l = actions.length;
        for ( i = 0; i < l; ++i ) {
            actions[ i ].callback( e );
        }
    },
    /**
     * @see InputDevice#addAction
     */
    addAction: function( eventId, action ) {
        if ( typeof action == 'function' ) {
            action = { callback: action };
        }
        if ( !this.actions[ eventId ] ) {
            this.actions[ eventId ] = [ action ];
        }
        else {
            this.actions[ eventId ].push( action );
        }
    },
    addCustomEventData: function( e ) {
        e.leftButton = !!this.down[ Mouse.BUTTON_LEFT ];
        e.middleButton = !!this.down[ Mouse.BUTTON_MIDDLE ];
        e.rightButton = !!this.down[ Mouse.BUTTON_RIGHT ];
        e.xDelta = e.screenX - this.prevX;
        e.yDelta = e.screenY - this.prevY;
    }
};

/** @static */
Mouse.BUTTON_LEFT = 0;
/** @static */
Mouse.BUTTON_MIDDLE = 1;
/** @static */
Mouse.BUTTON_RIGHT = 2;
/** @static */
Mouse.MOUSE_WHEEL = 3;
/** @static */
Mouse.MOUSE_MOVE = 4;
/*global Keyboard: true, Mouse: true*/

/**
 * @class
 * Handling of input devices and grouping of input actions.
 *
 * <p>It has a keyboard and a mouse device attached by default for convenience.</p>
 * @constructor
 */
function InputHandler() {
    /**
     * Whether actions should be triggered or not
     * @default true
     * @type Boolean
     */
    this.enabled = true;

    this.actions = [];
    this.devices = [];

    this.keyboard = new Keyboard();
    this.addDevice( this.keyboard );

    this.mouse = new Mouse();
    this.addDevice( this.mouse );
}

/**
 * @public
 * Enable handling of input events. This way, input handlers can be used for enabling groups of input events.
 */
InputHandler.prototype.enable = function() {
    var i, l = this.actions.length;
    for ( i = 0; i < l; ++i ) {
        this.actions[ i ].enable();
    }

    this.enabled = true;
};

/**
 * @public
 * Disable handling of input events. This way, input handlers can be used for disabling groups of input events.
 */
InputHandler.prototype.disable = function() {
    var i, l = this.actions.length;
    for ( i = 0; i < l; ++i ) {
        this.actions[ i ].disable();
    }

    this.enabled = false;
};

/**
 * @public
 * Returns a boolean indicating if this input handler is enabled.
 * @returns boolean
 */
InputHandler.prototype.isEnabled = function() {
    return this.enabled;
};

/**
 * @param {InputDevice} device
 * @param {number} eventId
 * @param {Object} action An object describing the action to be called.
 * @see InputDevice#addAction
 */
InputHandler.prototype.addAction = function( device, eventId, action ) {
    var self = this;

    var cbk = action.callback || function() {};
    action.callback = function( e ) {
        if ( self.enabled ) {
            cbk( e );
        }
    };

    this.actions.push( action );
    device.addAction( eventId, action );
    return action;
};

/**
 * Register a keypress.
 * @param {String} key The key name e.g. 'A' or 'ESCAPE'.
 * @param {Object} action
 * @see Keyboard
 */
InputHandler.prototype.onKey = function( key, action ) {
    if ( typeof action != "object" ) {
        action = { callback: action };
    }
    if ( Array.isArray( key ) ) {
        for ( var i in key ) {
            // create copies of objects to avoid multiple references
            var act = {};
            for ( var j in action ) {
                act[ j ] = action[ j ];
            }
            this.onKey( key[ i ], act );
        }
        return;
    }
    return this.addAction( this.keyboard, Keyboard[ 'KEY_' + key ], action );
};

/**
 * Register a keyup.
 * @param {String} key The key name e.g. 'A' or 'ESCAPE'.
 * @param {Object} action
 * @see Keyboard
 */
InputHandler.prototype.onKeyUp = function( key, action ) {
    if ( typeof action != "object" ) {
        action = { callback: function() {}, endCallback: action };
    }
    if ( Array.isArray( key ) ) {
        for ( var i in key ) {
            var act = {};
            for ( var j in action ) {
                act[ j ] = action[ j ];
            }
            this.onKeyUp( key[ i ], act );
        }
        return;
    }

    return this.addAction( this.keyboard, Keyboard[ 'KEY_' + key ], action );
};

/**
 * Register mousemove
 * @see Mouse
 */
InputHandler.prototype.onMouseMove = function( action ) {
    this.addAction( this.mouse, Mouse.MOUSE_MOVE, action );
};

/**
 * Register mousewheel movement
 * @see Mouse
 */
InputHandler.prototype.onMouseWheel = function( action ) {
    this.addAction( this.mouse, Mouse.MOUSE_WHEEL, action );
};

/**
 * Add device.
 */
InputHandler.prototype.addDevice = function( device ) {
    if ( this.devices.indexOf( device ) != -1 ) {
        throw "Device name already in use";
    }

    this.devices.push( device );

    return this;
};

/**
 * Remove devices.
 */
InputHandler.prototype.removeDevice = function( device ) {
    this.devices.splice( this.devices.indexOf( device ), 1 );
    return this;
};
/*global InputHandler: false, Vector3: false */

function FirstPersonHandler( node, camera ) {
    InputHandler.call( this );

    this.node = node;
    this.moveInterval = false;
    this.velocity = 0.3;
    this.angularVelocity = 0.1;

    if ( camera ) {
        node.appendChild( camera );
    }

    this.onKey( 'W', this.moveForward.bind( this ) );
    this.onKey( 'S', this.moveBackward.bind( this ) );
    this.onKey( 'A', this.rotateLeft.bind( this ) );
    this.onKey( 'D', this.rotateRight.bind( this ) );
    this.onKeyUp( [ 'W', 'S' ], this.stopMoving.bind( this ) );
    this.onKeyUp( [ 'A', 'D' ], this.stopRotating.bind( this ) );
}

FirstPersonHandler.prototype = {
    getAngle: function() {
        var a, c = this.node.orientation.data[ 3 ];
        if ( c < -1 ) {
            a = 2 * Math.PI;
        }
        else if ( c > 1 ) {
            a = 0;
        }
        else {
            a = Math.acos( c ) * 2;
        }
        if ( Math.abs( this.node.orientation.data[ 1 ] - 1 ) > 1 ) {
            a = 2 * Math.PI - a;
        }
        if ( isNaN( a ) ) {
            // throw "NaN firstpersonhandler angle";
            return 0;
        }
        return a;
    },
    stopMoving: function() {
        clearInterval( this.walkInterval );
        this.walkInterval = false;
    },
    stopRotating: function() {
        clearInterval( this.rotateInterval );
        this.rotateInterval = false;
    },
    moveForward: function() {
        var self = this;
        this.walkInterval = setInterval( function() {
            var angle = self.getAngle();
            console.log( angle );
            self.node.move( new Vector3( [ self.velocity * Math.sin( angle ), 0, self.velocity * Math.cos( angle ) ] ) );
        }, 17 );
    },
    moveBackward: function() {
        var self = this;
        this.walkInterval = setInterval( function() {
            var angle = self.getAngle();
            self.node.move( new Vector3( [ -self.velocity * Math.sin( angle ), 0, -self.velocity * Math.cos( angle ) ] ) );
        }, 30 );
    },
    rotateLeft: function() {
        var self = this;
        this.rotateInterval = setInterval( function() {
            self.node.rotate( new Vector3( [ 0, 1, 0 ] ), self.angularVelocity );
        }, 30 );
    },
    rotateRight: function() {
        var self = this;
        this.rotateInterval = setInterval( function() {
            self.node.rotate( new Vector3( [ 0, 1, 0 ] ), -self.angularVelocity );
        }, 30 );
    }
};

FirstPersonHandler.extend( InputHandler );
/*global
    UUID: false,
    Request: false
*/

/**
 * @class
 *
 * Class for adding HTML and CSS.
 *
 * @constructor
 */
function UIComponent() {
    this.id = UUID.generateCanonicalForm();
}

UIComponent.prototype = {
    /**
     * Attaches a CSS file to the HTML document.
     * @param {String} href.
     */
    attachCSS: function( href ) {
        var link = document.createElement( 'link' );
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild( link );
    },
    /**
     * Calls callback with a &lt;div&gt; tag containing the HTML defined in the url.
     *
     * The callback is passed a HTMLElement instance, that can be added somewhere in the HTML document.
     *
     * <code>
     * new UIComponent().loadHTML( "frontend/menu.html", function( menuTag ) {
     *     document.body.appendChild( menuTag );
     * } );
     </code>
     *
     * @param {String} url
     * @param {Function} callback
     */
    loadHTML: function( url, callback ) {
        var self = this;
        Request.get( url, {}, function( data ) {
            var element = document.createElement( 'div' );
            element.innerHTML = data;
            callback( element );
        } );
    }
};
/*global Matrix4:true, Renderer:true, Drawable:true, Framebuffer:true, Mesh:true, Buffer:true, VertexAttribute:true, Light:true, Texture:true, Skybox: true */

/**
 * @class
 * Renders a Scene object.
 *
 * @constructor
 */
function RenderManager() {
    /**
     * The Renderer used for rendering.
     * @type Renderer
     */
    this.renderer = new Renderer();

    this.forcedMaterial = null;

    this.postProcess = false;

    /**
     * @type FrameBuffer
     * The framebuffer used for post process effects.
     */
    this.framebuffer = new Framebuffer( this.renderer.width, this.renderer.height );

    if ( this.renderer.getParameter( Renderer.FLOAT_TEXTURE ) ) {
        this.framebuffer.colorTexture.setDataType( Texture.FLOAT );
    }

    this.postProcessEffects = [];

    this.quad = new Mesh();
    this.quad.setVertexAttribute( new VertexAttribute( 'UVCoord' ).setBuffer( new Buffer().setData( [ -1, -1, 1, 1, -1, 1, 1, -1 ] ) ).setSize( 2 ) );
    this.quad.setIndexBuffer( new Buffer( Buffer.ELEMENT_BUFFER ).setData( [ 0, 1, 2, 0, 3, 1 ] ) );

    this.globalUniformCache = {
        Time: Date.now(),
        ProjectionMatrix: new Matrix4(),
        ViewMatrix: new Matrix4(),
        WorldMatrix: new Matrix4(),
        ViewProjectionMatrix: new Matrix4(),
        WorldViewMatrix: new Matrix4(),
        WorldViewProjectionMatrix: new Matrix4()
    };
}

RenderManager.prototype = {
    constructor: RenderManager,
    /**
     * @public
     * @param {Material} material
     */
    addPostProcessEffect: function( material ) {
        this.postProcess = true;
        this.postProcessEffects.push( material );
        return this;
    },
    /**
     * @public
     */
    applyPostProcessEffects: function() {
        var i, l, effect,
            effects = this.postProcessEffects,
            quad = this.quad,
            renderer = this.renderer,
            colorTexture = this.framebuffer.colorTexture;

        l = effects.length;

        renderer.bindFramebuffer( null );
        renderer.clear();
        for ( i = 0; i < l; ++i ) {
            effect = effects[ i ];
            effect.setParameter( 'ColorTexture', colorTexture );
            effect.setParameter( 'FramebufferWidth', this.framebuffer.width );
            effect.setParameter( 'FramebufferHeight', this.framebuffer.height );
            renderer.useShader( effect.getShader() );
            renderer.render( quad );
        }
        return this;
    },
    /**
     * @public
     */
    resize: function( width, height ) {
        this.renderer.setSize( width, height );
        this.framebuffer.setDimensions( width, height );
        return this;
    },
    /**
     * @public
     */
    renderScene: function( scene, camera ) {
        if ( this.postProcess ) {
            this.renderer.bindFramebuffer( this.framebuffer );
        }

        this.renderer.clear();
        var g = this.globalUniformCache;
        camera.projectionMatrix.copyTo( g.ProjectionMatrix );
        camera.getAbsoluteInverseMatrix( g.ViewMatrix );
        g.ViewProjectionMatrix.set( g.ProjectionMatrix ).multiply( g.ViewMatrix );

        // TODO: Draw non-transparent materials first, then transparent materials
        //Sort drawables by material

        var drawableList = scene.drawableList;

        drawableList.sort( function( a, b ) {
            return a.material.uid - b.material.uid;
        } );

        var currentMaterial = -1;
        var l = drawableList.length;
        while ( l-- ) {
            var currentDrawable = drawableList[ l ];
            currentDrawable.onBeforeRender( camera );
            currentDrawable.getAbsoluteMatrix( g.WorldMatrix );

            g.WorldViewMatrix.set( g.ViewMatrix ).multiply( g.WorldMatrix );
            g.WorldViewProjectionMatrix.set( g.ViewProjectionMatrix ).multiply( g.WorldMatrix );

            var material = currentDrawable.material;
            for ( var engineParameter in material.engineParameters ) {
                material.setParameter( engineParameter, g[ engineParameter ] );
            }

            this.renderer.useShader( material.getShader() );
            this.renderer.render( currentDrawable.mesh );
        }

        if ( this.postProcess ) {
            this.applyPostProcessEffects();
        }
    }
};
/*global
    Request: false
*/

/**
 * @class
 * Exports objects to JSON format.
 *
 * <p>Objects to be exported must define a getExportData method that returns the data to be saved.</p>
 * <p>You need to run the exporter nodejs script on the resourcePath folder for exporting to work.</p>
 *
 * @constructor
 * @param {string} resourcePath The path to the folder to use for exports.
 */
function Exporter( resourcePath ) {
    if ( resourcePath[ resourcePath.length - 1 ] !== '/'  ){
        resourcePath += '/';
    }

    /**
     * @public
     * Resource export path.
     * @type String
     */
    this.resourcePath = resourcePath;

    /**
     * @public
     * @default false
     * @type Boolean
     */
    this.isSaving = false;

    this.pending = [];
}

Exporter.prototype = {
    /**
     * @public
     * Send object export data to exporter script for saving.
     * @param {Object} object Object to be saved.
     * @param {Function} callback Called when exporting is done.
     */
    save: function( object, callback ) {
        this.isSaving = true;

        // console.log( object.name );
        var data = { library: {}, object: object.name };
        data.library[ object.name ] = {
            'class': object.constructor.name,
            'data': object.getExportData( this )
        };
        //console.log( object.name );
        var self = this;
        var payload = window.escape( JSON.stringify( data ) );
        // console.log( 'Sending ' + payload.length / 1024 / 1024 + 'MB' );
        Request.post( 'http://localhost:5000/', { data: payload }, function() {
            if ( self.pending.length > 0 ) {
                self.save( self.pending.shift(), callback );
            }
            else {
                self.isSaving = false;
                callback();
            }
        } );
    },
    alsoSave: function( object ) {
        if ( this.isSaving ) {
            this.pending.push( object );
            return;
        }
        // console.log( 'TON PAIRNEI' );
        this.save( object );
    }
};
/*jshint evil: true */
/*global Request: true, EventWaiter: true */

/**
 * @class
 *
 * Imports assets into the game.
 *
 * @constructor
 * @param {String} resourcePath
 * @param {Function} defaultCallback
 */
function Importer( resourcePath, defaultCallback ) {
    if ( resourcePath[ resourcePath.length - 1 ] !== '/' ) {
        resourcePath += '/';
    }

    /**
     * @type String
     * The base path from which resources will be loaded.
     * This path will always be appended to URLs passed to {@link load}.
     */
    this.resourcePath = resourcePath;

    /**
     * @type Function
     * The callback to be used when no callback is passed to {@link load}.
     */
    this.defaultCallback = defaultCallback;
}

Importer.prototype = {
    constructor: Importer,
    /**
     * <p>Loads an asset.</p>
     *
     * <p>Determines the loader to be used from the extension of the filename of the asset.<br />
     * If no extension is recongnized, JSON extension is assumed.</p>
     *
     * @param {String} asset The path to the asset relative to resourcePath. If no extension is given (or not recognized), .json extension is assumed.
     * @param {Function} callback Callback that is called with the loaded object as a parameter.
     */
    load: function( asset, callback ) {
        var self = this, extension;

        if ( !callback ) {
            callback = this.defaultCallback;
        }

        extension = asset.slice( asset.lastIndexOf( '.' ) + 1 ).toLowerCase();
        if ( typeof Importer.loader[ extension ] == "undefined" || asset.indexOf( "." ) == -1 ) {
            extension = "json";
            asset += ".json";
        }

        asset = this.resourcePath + asset;

        // make sure you check cache after adding extension to avoid misses.
        if ( Importer.cache[ asset ] ) {
            callback( Importer.cache[ asset ], asset );
            return;
        }

        Importer.getLoader( extension ).load( asset, this, function( node ) {
            Importer.cache[ asset ] = node;
            callback( node, asset );
        } );
    }
};

/**
 * <p>Sets the loader to be used for a given extension.</p>
 *
 * <p>The loader must have a load method that gets three parameters:</p>
 * <ul>
 *  <li>the path to the asset</li>
 *  <li>the importer instance being used</li>
 *  <li>a callback</li>
 * </ul>
 * and calls the third parameter (callback) with the loaded object.
 */
Importer.setLoader = function( extension, loader ) {
    extension = extension.toLowerCase();
    if ( typeof Importer.loader[ extension ] != "undefined" ) {
        console.log( "Importer: overwriting loader for extension " + extension );
    }

    Importer.loader[ extension ] = loader;
};

/**
 * Get the loader used for loading an extension.
 */
Importer.getLoader = function( extension ) {
    return Importer.loader[ extension ];
};

/**
 * @private
 * Global cache used by Importer instances.
 */
Importer.cache = {};

Importer.loader = {};
/*global Request: false, Importer: false */

/**
 * @class
 * Loads JSON objects exported with the {@link Exporter} class.
 *
 * @constructor
 */
function JSONLoader() {
}

JSONLoader.prototype = {
    constructor: JSONLoader,
    /**
     * @public
     */
    load: function( path, importer, callback ) {
        var self = this;
        Request.get( path, {}, function( data ) {
            callback( self.processData( data, importer ) );
        } );
    },
    processData: function( data, importer ) {
        data = JSON.parse( data );
        var object = data.library[ data.object ];
        //Careful with eval statements..
        if ( /[a-zA-Z_$][0-9a-zA-Z_$]*/.test( object[ 'class' ] ) ) {
            var ObjectClass = eval( object[ 'class' ] );
            if ( typeof ObjectClass == 'function' ) {
                var ret = new ObjectClass();
                ret.setImportData( importer, object.data );
                return ret;
            }
        }
        return null;
    }
};

Importer.setLoader( 'json', new JSONLoader() );
/*global EventWaiter: false, Importer: false, Texture: false, SceneNode: false, Buffer: false, VertexAttribute: false, Drawable: false, Mesh: false, TexturedMaterial: false, BasicMaterial: false, Vector3: false */

/**
 * @class
 * Loads .obj files into a tree of {@link SceneNode} instances.
 *
 * @constructor
 */
function OBJLoader() {
    this.ready = true;
    var self = this;
    this.mtlCache = {};
    this.objCache = {};
    this.pending = [];
}

OBJLoader.prototype = {
    constructor: OBJLoader,
    loadMtl: function( url, callback ) {
        var that = this;

        if ( this.mtlCache[ url ] !== undefined && false ) {
            // cache hit
            callback( this.mtlCache[ url ] );
            return;
        }

        /*Find the base url in order to construct the path for the texture maps*/
        var baseUrl = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

        var matReq = new XMLHttpRequest();
        matReq.open( 'GET', url );
        matReq.onreadystatechange = function() {
            if ( matReq.readyState == 4 ) {
                //This map will hold an object for each material found in the mtl file
                var materials = {};

                /*Get the response and put each line in an array*/
                var lines = matReq.responseText.split( '\n' );

                var i, line, l = lines.length, currentMaterial;

                /*Parse the file line by line*/
                for ( i = 0; i < l; i++ ) {
                    /*Trim each line and split it in parts with whitespace as separator*/
                    line = lines[ i ].trim().split( /\s+/ );
                    switch ( line[ 0 ] ){
                        /*A new material definition starts here.*/
                        case 'newmtl':
                            /*Every line following this one will this material definion
                             *Keep the current material name*/
                            currentMaterial = line[ 1 ];
                            /*Make a new object in which the material parameters will be saved*/
                            materials[ currentMaterial ] = {};
                            break;
                        case 'map_Kd':
                            /*A diffuse texture map. Store the url pointing to the image*/
                            var path = "", options = { blenu: true, blenv: true }, paramNumber = 0;
                            for ( var j = 1; j < line.length; ++j ) {
                                paramNumber = 0;
                                switch ( line[ j ] ) {
                                    case "-blenu":
                                       options.blenu = line[ j + 1 ] == "on";
                                       paramNumber = 1;
                                       break;
                                    case "-blenv":
                                        options.blenv = line[ j + 1 ] == "on";
                                        paramNumber = 1;
                                        break;
                                    case "-bm":
                                        options.bm = parseFloat( line[ j + 1 ] );
                                        paramNumber = 1;
                                        break;
                                    case "-boost":
                                        options.boost = parseFloat( line[ j + 1 ] );
                                        paramNumber = 1;
                                        break;
                                    case "-cc":
                                        options.cc = line[ j + 1 ] == "on";
                                        paramNumber = 1;
                                        break;
                                    case "-clamp":
                                        options.clamp = line[ j + 1 ] == "on";
                                        paramNumber = 1;
                                        break;
                                    case "-mm":
                                        options.mm = [ parseFloat( line[ j + 1 ] ), parseFloat( line[ j + 2 ] ) ];
                                        paramNumber = 2;
                                        break;
                                    case "-o":
                                        options.o = [ parseFloat( line[ j + 1 ] ), parseFloat( line[ j + 1 ] ), parseFloat( line[ j + 3 ] ) ];
                                        paramNumber = 3;
                                        break;
                                    case "-s":
                                        options.s = [ parseFloat( line[ j + 1 ] ), parseFloat( line[ j + 1 ] ), parseFloat( line[ j + 3 ] ) ];
                                        paramNumber = 3;
                                        break;
                                }
                                if ( paramNumber ) {
                                    j += paramNumber;
                                }
                                else {
                                    path = line.slice( j ).join( ' ' );
                                    break;
                                }
                            }
                            materials[ currentMaterial ].diffuseTexture = baseUrl + path;
                            materials[ currentMaterial ].diffuseTextureOptions = options;
                            break;
                        case 'Ka':
                            /*The material's ambient color*/
                            materials[ currentMaterial ].ambient = [ line[ 1 ], line[ 2 ], line[ 3 ] ];
                            break;
                        case 'Kd':
                            /*The material's diffuse color*/
                            materials[ currentMaterial ].diffuse = [ line[ 1 ], line[ 2 ], line[ 3 ] ];
                            break;
                        case 'Ks':
                            /*The material's specular color*/
                            materials[ currentMaterial ].specular = [ line[ 1 ], line[ 2 ], line[ 3 ] ];
                            break;
                        case 'bump':
                            /*A bump map. Store the url pointing to the image*/
                            materials[ currentMaterial ].bumpTexture = baseUrl + line[ 1 ];
                            break;
                    }
                }
                var textureCache = {};

                for ( var material in materials ) {
                    if ( materials[ material ].diffuseTexture !== undefined ) {
                        var texture = materials[ material ].diffuseTexture;
                        materials[ material ] = new TexturedMaterial();
                        materials[ material ].name = material;

                        var tex;
                        if ( textureCache[ texture ] ) {
                            tex = textureCache[ texture ];
                        }
                        else {
                            var img = new Image();
                            img.src = texture;
                            tex = textureCache[ texture ] = new Texture().setImage( img ).setWrapS( Texture.REPEAT ).setWrapT( Texture.REPEAT );
                        }

                        materials[ material ].setParameter( 'texture', { data: tex } );
                    }
                    else {
                        var diffuse = materials[ material ].diffuse;
                        materials[ material ] = new BasicMaterial();
                        materials[ material ].name = material;
                        materials[ material ].setParameter( 'Diffuse', new Vector3( diffuse ) );
                    }
                }
                that.mtlCache[ url ] = materials; // memoize
                callback( materials );
            }
        };
        matReq.send();
    },
    /**
     * Generates a {@link SceneNode} that can be added to a scene for rendering.
     * @param {String} url The complete url to the .obj file
     * @param {Function} callback Called when loading is finished with the node tree as a parameter.
     */
    load: function( url, importer, callback ) {
        /*WRAPPER FUNCTIONS*/
            if ( !this.ready ) {
                this.pending.push( arguments );
                return;
            }
            var myCallback = callback;
            callback = function( objectsByMaterial ) {
                var node = new SceneNode();
                for ( var material in objectsByMaterial ) {
                    var d = new Drawable();
                    var obj = objectsByMaterial[ material ];

                    var vertices = new Buffer( Buffer.DATA_BUFFER, Buffer.STATIC );
                    vertices.setData( obj.vertices );

                    var uvcoords = new Buffer( Buffer.DATA_BUFFER, Buffer.STATIC );
                    uvcoords.setData( obj.uvcoords );

                    var normals = new Buffer( Buffer.DATA_BUFFER, Buffer.STATIC );
                    normals.setData( obj.normals );

                    var verticesVB = new VertexAttribute( 'Position' );
                    verticesVB.setBuffer( vertices );

                    var normalsVB = new VertexAttribute( 'Normal' );
                    normalsVB.setBuffer( normals );

                    var uvcoordsVB = new VertexAttribute( 'UVCoord' );
                    uvcoordsVB.size = 2;
                    uvcoordsVB.setBuffer( uvcoords );

                    var indices = new Buffer( Buffer.ELEMENT_BUFFER, Buffer.STATIC );
                    indices.setData( obj.indices );

                    var m = new Mesh();
                    m.setVertexAttribute( verticesVB );
                    m.setVertexAttribute( normalsVB );
                    m.setVertexAttribute( uvcoordsVB );
                    m.setIndexBuffer( indices );

                    d.mesh = m;
                    d.setMaterial( obj.material );
                    m.name = material + '_mesh';
                    d.name = material + '_drawable';
                    node.appendChild( d );
                }
                myCallback( node );
            };
        /*----*/
        var that = this;

        if ( this.objCache[ url ] !== undefined ) {
            // cache hit
            callback( this.objCache[ url ] );
            return;
        }

        var baseUrl = url.substring( 0, url.lastIndexOf( '/' ) + 1 );
        var vReq = new XMLHttpRequest();
        vReq.open( 'GET', url );
        vReq.onreadystatechange = function() {
            if ( vReq.readyState == 4 ) {
                var data = vReq.responseText;
                var lines = data.split( "\n" );
                var i, j, line, activeMaterial, indicesIndex;

                var vList = [];
                var nList = [];
                var tList = [];

                var ret = {};
                var materialsLoaded = true;
                var materialCallback = function( materials ) {
                    for ( var material in ret ) {
                        if ( material === 'default' ) {
                            continue;
                        }
                        ret[ material ].material = materials[ material ];
                    }
                    that.objCache[ url ] = ret; // memoize
                    callback( ret );
                };

                ret[ 'default' ] = {
                    vertices: [],
                    normals: [],
                    uvcoords:[],
                    indices: [],
                    material: 'solid',
                    indexIndex: 0 //lol
                };
                activeMaterial = ret[ 'default' ];

                var lineCount = lines.length, hit;
                for ( i = 0; i < lineCount; ++i ){
                    line = lines[ i ].trim().split( /\s+/ );
                    switch ( line[ 0 ] ) {
                        case 'mtllib':
                            materialsLoaded = false;
                            that.loadMtl( baseUrl + line[ 1 ], materialCallback );
                            break;
                        case 'usemtl': //Group Data
                            var materialName = line[ 1 ];
                            if ( ret[ materialName ] === undefined ) {
                                ret[ materialName ] = {
                                    vertices: [],
                                    normals: [],
                                    uvcoords:[],
                                    indices: [],
                                    uberObject: {},
                                    indexIndex: 0 //lol
                                };
                            }
                            activeMaterial = ret[ materialName ];
                            break;
                        case 'v': //Vertex Data
                            vList.push( line[ 1 ], line[ 2 ], line[ 3 ] );
                            break;
                        case 'vn': //Normal Data
                            nList.push( line[ 1 ], line[ 2 ], line[ 3 ] );
                            break;
                        case 'vt': //Normal Data
                            tList.push( line[ 1 ], line[ 2 ] );
                            break;
                        case 'f': //Face definition
                            var vertexIndex, uvIndex, normalIndex, words;
                            for ( j = 1; j <= 3; ++j ) {
                                words = line[ j ].split( '/' );
                                vertexIndex = ( words[ 0 ] - 1 ) * 3;
                                uvIndex = ( words[ 1 ] - 1 ) * 2;
                                normalIndex = ( words[ 2 ] - 1 ) * 3;

                                hit = activeMaterial.uberObject[ line[ j ] ];
                                if ( hit ) {
                                    activeMaterial.indices.push( hit );
                                }
                                else {
                                    activeMaterial.vertices.push( vList[ vertexIndex ], vList[ vertexIndex  + 1 ], vList[ vertexIndex  + 2 ] );
                                    activeMaterial.uvcoords.push( tList[ uvIndex ], tList[ uvIndex  + 1 ] );
                                    activeMaterial.normals.push( nList[ normalIndex ], nList[ normalIndex + 1 ], nList[ normalIndex + 2 ] );
                                    activeMaterial.indices.push( activeMaterial.indexIndex );

                                    activeMaterial.uberObject[ line[ j ] ] = activeMaterial.indexIndex++;
                                }

                            }
                            if ( line[ 4 ] !== undefined ) {
                                vertexIndex = ( line[ 3 ].split( '/' )[ 0 ] - 1 ) * 3;
                                uvIndex = ( line[ 3 ].split( '/' )[ 1 ] - 1 ) * 2;
                                normalIndex = ( line[ 3 ].split( '/' )[ 2 ] - 1 ) * 3;

                                hit = activeMaterial.uberObject[ line[ 3 ] ];
                                if ( hit ) {
                                    activeMaterial.indices.push( hit );
                                }
                                else {
                                    activeMaterial.vertices.push( vList[ vertexIndex ], vList[ vertexIndex  + 1 ], vList[ vertexIndex  + 2 ] );
                                    activeMaterial.uvcoords.push( tList[ uvIndex ], tList[ uvIndex  + 1 ] );
                                    activeMaterial.normals.push( nList[ normalIndex ], nList[ normalIndex + 1 ], nList[ normalIndex + 2 ] );
                                    activeMaterial.indices.push( activeMaterial.indexIndex );

                                    activeMaterial.uberObject[ line[ j ] ] = activeMaterial.indexIndex++;
                                }

                                vertexIndex = ( line[ 4 ].split( '/' )[ 0 ] - 1 ) * 3;
                                uvIndex = ( line[ 4 ].split( '/' )[ 1 ] - 1 ) * 2;
                                normalIndex = ( line[ 4 ].split( '/' )[ 2 ] - 1 ) * 3;

                                hit = activeMaterial.uberObject[ line[ 4 ] ];
                                if ( hit ) {
                                    activeMaterial.indices.push( hit );
                                }
                                else {
                                    activeMaterial.vertices.push( vList[ vertexIndex ], vList[ vertexIndex  + 1 ], vList[ vertexIndex  + 2 ] );
                                    activeMaterial.uvcoords.push( tList[ uvIndex ], tList[ uvIndex  + 1 ] );
                                    activeMaterial.normals.push( nList[ normalIndex ], nList[ normalIndex + 1 ], nList[ normalIndex + 2 ] );
                                    activeMaterial.indices.push( activeMaterial.indexIndex );

                                    activeMaterial.uberObject[ line[ j ] ] = activeMaterial.indexIndex++;
                                }

                                vertexIndex = ( line[ 1 ].split( '/' )[ 0 ] - 1 ) * 3;
                                uvIndex = ( line[ 1 ].split( '/' )[ 1 ] - 1 ) * 2;
                                normalIndex = ( line[ 1 ].split( '/' )[ 2 ] - 1 ) * 3;

                                hit = activeMaterial.uberObject[ line[ 1 ] ];
                                if ( hit ) {
                                    activeMaterial.indices.push( hit );
                                }
                                else {
                                    activeMaterial.vertices.push( vList[ vertexIndex ], vList[ vertexIndex  + 1 ], vList[ vertexIndex  + 2 ] );
                                    activeMaterial.uvcoords.push( tList[ uvIndex ], tList[ uvIndex  + 1 ] );
                                    activeMaterial.normals.push( nList[ normalIndex ], nList[ normalIndex + 1 ], nList[ normalIndex + 2 ] );
                                    activeMaterial.indices.push( activeMaterial.indexIndex );

                                    activeMaterial.uberObject[ line[ j ] ] = activeMaterial.indexIndex++;
                                }
                            }
                    }
                }
                for ( i in ret ) {
                    if ( ret[ i ].indices.length === 0 ) {
                        delete ret[ i ];
                    }
                }
                if ( materialsLoaded ) {
                    that.objCache[ url ] = ret; // memoize
                    callback( ret );
                }
            }
        };
        vReq.send();
    }
};

Importer.setLoader( 'obj', new OBJLoader() );
/*global SoundAsset:false, Importer: false */

/**
 * @class
 *
 * Imports sound files into SoundSource instances.
 */
function SoundLoader() {
}

SoundLoader.prototype = {
    constructor: SoundLoader,
    load: function( path, importer, callback ) {
        var request = new XMLHttpRequest();
        request.open( "GET", path, true );
        request.responseType = "arraybuffer";
        request.onload = function() {
            var soundAsset = new SoundAsset( request.response );
            callback( soundAsset );
        };
        request.send();
    }
};

( function() {
    var soundLoader = new SoundLoader();
    Importer.setLoader( 'mp3', soundLoader );
    Importer.setLoader( 'wav', soundLoader );
    Importer.setLoader( 'ogg', soundLoader );
}() );
/*global EventEmitter: false */

/**
 * @class
 * A sound effect, soundtrack song or any other sound asset.
 *
 * @extends EventEmitter
 * @constructor
 * @param url
 * @param loadMetadata
 */
function SoundAsset( url ) {
    var self = this;
    EventEmitter.call( this );

    /**
     * A unique indentifer (local).
     * @type String
     */
    this.uid = SoundAsset.uid++;

    /**
     * The url of this asset.
     * @type String
     */
    this.url = url;

    /**
     * The duration of this asset. If metadata is not yet loaded, it is null.
     * @type Number
     */
    this.duration = null;

    /**
     * An HTML audio element with this asset as a source.
     * @type HTMLElement
     */
    this.tag = document.createElement( 'audio' );
    this.tag.src = url;
    this.tag.addEventListener( 'loadedmetadata', function() {
        self.duration = this.duration;
        self.emit( 'loadedmetadata' );
    } );

    document.body.appendChild( this.tag );
}

SoundAsset.prototype = {
    constructor: SoundAsset,
    /**
     * Call a callback with the metadata information.
     * @param Function callback A callback to pass the metadata.
     */
    getMetadata: function( callback ) {
        var self = this;
        if ( this.duration ) {
            callback( { duration: this.duration } );
        }
        else {
            this.on( 'loadedmetadata', function() {
                callback( { duration: self.duration } );
            } );
        }
    }
};

SoundAsset.extend( EventEmitter );

SoundAsset.uid = 0;
/*global SceneNode: false, Vector3: false, SoundAsset: false, EventEmitter: false */

/**
 * @class
 *
 * A node in the scene representing a source of sound.
 *
 * This can be thought of as a speaker that can play different SoundSources.
 *
 * @extends SceneNode
 *
 * @constructor
 */
function SoundSource() {
    SceneNode.call( this );

    /**
     * The asset currently playing.
     * @type SoundAsset
     * @default null
     */
    this.nowPlaying = null;

    /**
     * Whether the next song will be played when a song ends.
     * @type Number
     */
    this.playUntilLast = false;

    /**
     * The index of the asset that is played now or will be played next.
     * @type Number
     */
    this.currentTrack = 0;

    /**
     * The velocity of this source.
     * @type Number
     */
    this.velocity = new Vector3();

    /**
     * A unique identifier (local)
     * @type String
     */
    this.uid = SoundSource.uid++;

    /**
     * SoundSource.LOOP_NONE, SoundSource.LOOP_ONE or SoundSource.LOOP_ALL
     * @default SoundSource.LOOP_NONE
     * @type Number
     */
    this.loop = SoundSource.LOOP_NONE;

    this.assets = [];
}

/**
 * Don't loop songs.
 * @static
 * @type Number
 */
SoundSource.LOOP_NONE = 0;

/**
 * Repeat the song being played infinately.
 * @static
 * @type Number
 */
SoundSource.LOOP_ONE = 1;

/**
 * If playing all songs, restart playing all songs when the last one is played.
 * @static
 * @type Number
 */
SoundSource.LOOP_ALL = 2;

SoundSource.prototype = {
    constructor: SoundSource,
    /**
     * Add sound to asset list.
     */
    addSound: function( asset ) {
        this.assets.push( asset );
        this.emit( 'soundadded', asset );
    },
    _play: function( asset ) {
        var self = this;
        asset.getMetadata( function( metadata ) {
            var durationms = metadata.duration / 1000;

            self.nowPlaying = asset;
            self.emit( 'playing', asset );

            setTimeout( function() {
                self.ended();
            }, durationms );
        } );
    },
    /**
     * Play a SoundSource asset.
     * @param asset It can be a SoundAsset, the index of the asset in the list of assets, or no parameters to play the asset pointed by currentTrack property.
     */
    play: function( asset ) {
        if ( !( asset instanceof SoundAsset ) ) {
            if ( typeof asset == "number" ) {
                if ( this.currentTrack > this.assets.length ) {
                    console.log( 'play: unknown track number ' + asset );
                    return false;
                }
                this.currentTrack = asset;
                asset = this.assets[ this.currentTrack ];
            }
            else if ( !asset && this.assets.length ) {
                if ( this.currentTrack >= this.assets.length ) {
                    this.currentTrack = 0;
                }
                asset = this.assets[ this.currentTrack ];
            }
            else {
                console.log( 'invalid parameter to play', asset );
                return false;
            }
        }
        this.playUntilLast = false;
        this._play( asset );
    },
    /**
     * Play all assets until the last one.
     * @param startTrack The index of the asset to start from.
     */
    playAll: function( startTrack ) {
        startTrack = startTrack || 0;
        if ( startTrack >= this.assets.length ) {
            console.log( 'playAll: unknown track number ' + startTrack );
            return;
        }
        this.currentTrack = startTrack;
        if ( this.loop == SoundSource.LOOP_ONE ) {
            this.loop = SoundSource.LOOP_NONE;
        }
        this.playUntilLast = true;
        this._play( this.assets[ this.currentTrack ] );
    },
    /**
     * Set the sound source velocity.
     * Set this to change the sound according to the doppler effect.
     */
    setVelocity: function( v ) {
        this.velocity = v;
    },
    /**
     * Get the sound source velocity.
     */
    getVelocity: function() {
        return this.velocity;
    },
    ended: function() {
        this.emit( 'ended', this.nowPlaying );

        if ( this.playUntilLast ) {
            this.currentTrack = ( this.currentTrack + 1 ) % this.assets.length;
        }

        switch ( this.loop ) {
            case SoundSource.LOOP_NONE:
                this.nowPlaying = null;
                break;
            case SoundSource.LOOP_ONE:
                this.play( this.nowPlaying );
                break;
            case SoundSource.LOOP_ALL:
                if ( this.currentTrack > 0 ) {
                    this._play( this.assets[ this.currentTrack ] );
                }
                break;
            default:
                console.log( 'unknown soundsource loop property' );
        }
    }
};

SoundSource.extend( SceneNode );
SoundSource.uid = 0;
/*jshint newcap: false */
/*global SoundAsset: false, SoundSource: false, webkitAudioContext:  false, assert: false */

/**
 * @class
 *
 * Manages 3D sound sources using Web Audio Api.
 *
 * This falls back to playing the sound at different volumes when Web Audio Api is not available.
 *
 * @constructor
 */
function SoundManager( scene, camera ) {
    var self = this;

    /**
     * The scene associated with this manager.
     */
    this.scene = scene;

    /**
     * The camera associated with this manager.
     */
    this.camera = camera;

    /**
     * Cached asset buffer data.
     */
    this.bufferData = {};

    this.scene.on( 'childadded', function onchildadded( node ) {
        if ( node instanceof SoundSource ) {
            self.addSource( node );
        }
        else {
            for ( var i = 0; i < node.children.length; ++i ) {
                onchildadded( node.children[ i ] );
            }
        }
    } );
    this.scene.on( 'childremoved', function onchildremoved( node ) {
        if ( node instanceof SoundSource ) {
            self.removeSource( node );
        }
        else {
            for ( var i = 0; i < node.children.length; ++i ) {
                onchildremoved( node.children[ i ] );
            }
        }
    } );

    this.playing = {};
    this.callbacks = {};

    if ( webkitAudioContext ) {
        this.context = new webkitAudioContext();
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.connect( this.context.destination );
    }
}

/**
 * The distance from where the listener cannot hear anymore.
 * This is used only when the Web Audio Api is NOT being used.
 */
SoundManager.MAX_HEARING_DISTANCE = 200;

SoundManager.prototype = {
    constructor: SoundManager,
    /**
     * @public
     * @param Number dt milliseconds since last update
     */
    update: function( dt ) {
        var uid, cpos = this.camera.getAbsolutePosition().data;
        if ( this.context ) {
            this.context.listener.setPosition( cpos[ 0 ], cpos[ 1 ], cpos[ 2 ] );
            for ( uid in this.playing ) {
                this.updatePanner( this.playing[ uid ].source, this.playing[ uid ].panner );
            }
        }
    },
    /**
     * Manage a new SoundSource.
     * The SoundManager adds sources added to the associated scene by itself.
     * @param SoundSource source
     */
    addSource: function( source ) {
        var self = this;

        /*DEBUG*/
        assert( source instanceof SoundSource, 'Tried to add source that is not instance of SoundSource' );
        /*DEBUG_END*/

        function onplaying( asset ) {
            /*DEBUG*/
            assert( asset instanceof SoundAsset, 'Tried to play asset that is not instance of SoundAsset' );
            /*DEBUG_END*/
            self.playAsset( source, asset );
        }
        function onended( asset ) {
            self.endAsset( source, asset );
        }
        function onsoundadded( asset ) {
            if ( self.context && source.parent != self.camera ) {
                self.loadBufferData( asset );
            }
            else {
                asset.tag.load();
            }
        }

        source.on( 'playing', onplaying );
        source.on( 'ended', onended );
        source.on( 'soundadded', onsoundadded );

        this.callbacks[ source.uid ] = {
            onplaying: onplaying,
            onended: onended,
            onsoundadded: onsoundadded
        };
    },
    /**
     * Stop managing a SoundSource and remove references to it.
     * The SoundManager removes sources removed from the associated scene by itself.
     * @param SoundSource source
     */
    removeSource: function( source ) {
        /*DEBUG*/
        assert( source instanceof SoundSource, 'Tried to remove source that is not instance of SoundSource' );
        assert( source.uid in this.callbacks, 'Tried to remove source that was not added' );
        /*DEBUG_END*/

        var eventName, callbacks = this.callbacks[ source.uid ];
        for ( eventName in callbacks ) {
            source.removeListener( eventName, callbacks[ eventName ] );
        }
        delete this.callbacks[ source.uid ];
        delete this.playing[ source.uid ];
    },
    /**
     * Start playing an asset from a sound source.
     * This is automatically called when a added SoundSource starts playing an asset.
     * @param SoundSource source
     * @param SoundAsset asset
     */
    playAsset: function( source, asset ) {
        var self = this;
        if ( this.context && source.parent != this.camera ) {
            if ( this.bufferData[ asset.uid ] ) {
                this.playFromAudioBuffer( source, asset );
            }
            else {
                this.loadBufferData( asset, function() {
                    self.playFromAudioBuffer( source, asset );
                } );
            }
        }
        else {
            this.playFromAudioTag( source, asset );
        }
    },
    playFromAudioTag: function( source, asset ) {
        var distVector = source.getAbsolutePosition().subtract( this.camera.getAbsolutePosition() ),
            dist = distVector.length(),
            vol = ( SoundManager.MAX_HEARING_DISTANCE - dist ) / SoundManager.MAX_HEARING_DISTANCE;

        asset.tag.load();
        asset.tag.volume = vol > 0 ? vol : 0;
        asset.tag.play();
    },
    playFromAudioBuffer: function( source, asset ) {
        var bufferSource = this.context.createBufferSource(),
            panner = this.context.createPanner(),
            gain = this.context.createGainNode();

        bufferSource.buffer = this.context.createBuffer( this.bufferData[ asset.uid ], false );

        this.updatePanner( source, panner );

        bufferSource.connect( panner );
        panner.connect( gain );
        gain.connect( this.compressor );

        bufferSource.loop = source.loop == SoundSource.LOOP_ONE;
        bufferSource.noteOn( 0 );

        this.playing[ source.uid ] = {
            asset: asset,
            source: source,
            bufferSource: bufferSource,
            start: this.context.currentTime,
            end: source.loop ? Infinity : this.context.currentTime + bufferSource.buffer.duration,
            panner: panner
        };
    },
    /**
     * Stop playing a sound from an asset.
     * This is automatically called when a added SoundSource stops playing an asset.
     * @param SoundSource source
     * @param SoundAsset asset
     */
    endAsset: function( source, asset ) {
        // this.playing[ source.uid ].bufferSource.noteOff( 0 );
        if ( source.loop != SoundSource.LOOP_ONE ) {
            delete this.playing[ source.uid ];
        }
    },
    updatePanner: function( source, panner ) {
        var pos = source.getAbsolutePosition().data,
            vel = source.getVelocity().data;

        panner.setPosition( pos[ 0 ], pos[ 1 ], pos[ 2 ] );
        panner.setVelocity( vel[ 0 ], vel[ 1 ], vel[ 2 ] );
    },
    /**
     * Load asset data to an ArrayBuffer.
     * @param SoundAsset asset
     * @param Function [callback] Will be called with an ArrayBuffer parameter.
     */
    loadBufferData: function( asset, callback ) {
        var self = this, request = new XMLHttpRequest();

        request.open( "GET", asset.url, true );
        request.responseType = "arraybuffer";
        request.onload = function() {
            self.bufferData[ asset.uid ] = request.response;
            if ( typeof callback == "function" ) {
                callback();
            }
        };
        request.send();
    }
};
/*global
    Camera          : false,
    Exporter        : false,
    Importer        : false,
    RenderManager   : false,
    Scene           : false,
    Vector3         : false,
    InputHandler    : false,
    UIComponent     : false,
    SoundManager    : false,
    SoundSource     : false
*/

/**
 * @class
 * The main object of a game. Initializes basic modules and starts the main loop.
 *
 * The most basic Final Engine application is just the creation of an instance of Application:
 *
 * <code>
 * var app = new Application();
 </code>
 *
 * Most applications will import some assets, add them to the scene and update them:
 *
 * <code>
 * var app = new Application();
 *
 * var character = null;
 *
 * app.importer.load( "character", function( ch ) {
 *      character = ch;
 *      app.scene.appendChild( character );
 *  } );
 *
 * app.update = function( dt ) {
 *     if ( character ) {
 *         character.update( dt );
 *     }
 *     else {
 *         // character has not loaded yet
 *     }
 * };
 </code>
 *
 * You can get access to the instantiated application from any part of your code by calling the static method <a href="#getInstance">Application.getInstance()</a>.</p>
 *
 * <h3>Extending Application</h3>
 *
 * You can extend the Application class to write the main application code inside a class.
 *
 * <code>
 * function MyApplication() {
 *    Application.call( this );
 *
 *    this.cube = new Cube();
 *    this.scene.appendChild( this.cube );
 * }
 *
 * MyApplication.extend( Application );
 *
 * // in the main file:
 * app = new MyApplication();</pre>
 *
 * This provides cleaner code and avoids possible global namespace pollution.
 *
 * @constructor
 * The Application constructor initiates the render loop (using requestAnimationFrame) that also calls <a href="#onBeforeUpdate">onBeforeRender</a> and the main loop that iterates 60 times per second,
 * updates the sound manager and calls the <a href="#update">update</a> method.
 */
function Application() {
    var self = this;

    /**
     * @public
     *
     * The application title. The default value is the HTML document's title.
     * @type String
     */
    this.title = document.title;

    /**
     * @public
     *
     * The render manager used for rendering the scene.
     * Its {@link RenderManager#renderScene} method is called in a loop.
     * @type RenderManager
     */
    this.renderManager = new RenderManager();

    /**
     * The scene to be rendered. Change this property if you need to render some other scene object.
     * @type Scene
     */
    this.scene = new Scene();

    /**
     * @public
     * The default camera.
     *
     * Its original position is at (0, 0, 10).
     * @type Camera
     */
    this.camera = new Camera().setPosition( new Vector3( [ 0, 0, 10 ] ) );

    /**
     * The default importer.
     *
     * Imports from "resources" folder. If no callback is passed, the default callback adds the loaded node to the application's scene.
     * @type Importer
     */
    this.importer = new Importer( 'resources', function( node ) {
        self.scene.appendChild( node );
    } );

    /**
     * The default exporter. Exports to "resources" folder.
     * @type Exporter
     */
    this.exporter = new Exporter( 'resources' );

    /**
     * The default input handler.
     * @type InputHandler
     */
    this.input = new InputHandler();

    /**
     * @type UIComponent
     *
     * Adds ui elements to the application.
     */
    this.ui = new UIComponent();

    /**
     * @type SoundManager
     *
     * Manages sound sources added to the scene.
     */
    this.soundManager = new SoundManager( this.scene, this.camera );

    /**
     * @type SoundSource
     *
     * A sound source used for soundtrack or any other background music that
     * doesn't have a specific location in space.
     */
    this.soundtrack = new SoundSource( this.scene );
    this.camera.appendChild( this.soundtrack );

    this.scene.appendChild( this.camera );

    var canvas = this.renderManager.renderer.canvas;
    this.setupCanvas( canvas );

    this._nextFrame = null;
    this.capFPS( 60 );

    var t = Date.now();
    function renderLoop() {
        var now = Date.now();
        self.onBeforeRender( now - t );
        t = now;
        self.renderManager.renderScene( self.scene, self.camera );
        // console.log( self._nextFrame );
        self._nextFrame( renderLoop );
    }

    var tUpdate = Date.now();
    setInterval( function() {
        var now = Date.now();
        self.soundManager.update( now - tUpdate );
        self.update( now - tUpdate );
        tUpdate = now;
    }, 1000 / 60 );

    // it is necessary to call this asynchronously because the inheriting
    // developer may override the constructor and will call the parent constructor
    // initially; the rest of the inheriting constructor will initilize some objects
    // which may be required by the renderLoop; therefore run it after the inheriting
    // constructor has finished initializations
    setTimeout( renderLoop, 1 );
}
Application.prototype = {
    constructor: Application,
    setupCanvas: function( canvas ) {
        var self = this;
        window.addEventListener( 'resize', function() {
            self.resize( window.innerWidth, window.innerHeight );
        }, false );
        document.body.appendChild( canvas );
        this.resize( window.innerWidth, window.innerHeight );
        return this;
    },
    /**
     * Resize canvas.
     * @param {Number} width
     * @param {Number} height
     * @returns Application
     */
    resize: function( width, height ) {
        this.renderManager.resize( width, height );
        var camera = this.camera;
        camera.width = width;
        camera.height = height;
        camera.setPerspective();
        return this;
    },
    /**
     * Set the application title.
     *
     * This sets the {@link title} property and alters the HTML &lt;title&gt; tag.
     * @param {String} title
     * @returns String
     */
    setTitle: function( title ) {
        document.title = title;
        return this;
    },
    /**
     * Override this method to update your application before rendering.
     * The render loop uses requestAnimationFrame.
     * @param {Number} dt milliseconds since the previous onBeforeRender.
     */
    onBeforeRender: function( dt ) {
    },
    /**
     * Override this method to update your application on every iteration of the main loop.
     * The main loop is an interval called around 60 times per second.
     * @param {Number} dt milliseconds since the previous update
     */
    update: function ( dt ) {
        // override me
    },
    /**
     * Limit rendering frames per second.
     * @param {Number} fps
     */
    capFPS: function( fps ) {
        if ( fps >= 60 ) {
            this._nextFrame = window.requestAnimationFrame.bind( window );
        }
        else {
            this._nextFrame = function( renderLoop ) {
                setTimeout( renderLoop, 1000 / fps );
            };
        }
    }
};
