/*
    Developers:
        Petros Aggelatos <petros@kamibu.com>

    Copyright (c) 2011, Petros Aggelatos
    All rights reserved.

    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    Neither the name of the Kamibu Limited nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var cubeTriangles = [
    //Front side
    [
        [  1,  1, -1 ],
        [  1, -1, -1 ],
        [ -1,  1, -1 ]
    ],
    [
        [ -1, -1, -1 ],
        [ -1,  1, -1 ],
        [  1, -1, -1 ]
    ],
    //Backside
    [
        [  1,  1,  1 ],
        [  1, -1,  1 ],
        [ -1,  1,  1 ]
    ],
    [
        [ -1, -1,  1 ],
        [ -1,  1,  1 ],
        [  1, -1,  1 ]
    ],
    //Left side
    [
        [ -1,  1,  1 ],
        [ -1, -1,  1 ],
        [ -1,  1, -1 ]
    ],
    [
        [ -1, -1, -1 ],
        [ -1,  1, -1 ],
        [ -1, -1,  1 ]
    ],
    //Rightside
    [
        [ 1,  1,  1 ],
        [ 1, -1,  1 ],
        [ 1,  1, -1 ]
    ],
    [
        [ 1, -1, -1 ],
        [ 1,  1, -1 ],
        [ 1, -1,  1 ]
    ],
    //Bottom side
    [
        [  1, -1,  1 ],
        [ -1, -1,  1 ],
        [  1, -1, -1 ]
    ],
    [
        [ -1, -1, -1 ],
        [  1, -1, -1 ],
        [ -1, -1,  1 ]
    ],
    //Top side
    [
        [  1, 1,  1 ],
        [ -1, 1,  1 ],
        [  1, 1, -1 ]
    ],
    [
        [ -1, 1, -1 ],
        [  1, 1, -1 ],
        [ -1, 1,  1 ]
    ],
];

var colors = [ 
    'aqua',
    'blue',
    'fuchsia',
    'green',
    'maroon',
    'navy',
    'purple',
    'red',
    'silver',
    'teal',
    'white',
    'yellow'
];

var numTriangles = cubeTriangles.length;
for ( var i = 0; i < numTriangles; i += 2 ) {
    cubeTriangles[ i ].color =  colors[ ( i / 2 )  % colors.length ];
    cubeTriangles[ i + 1 ].color = colors[ ( i / 2 )  % colors.length ];
};
