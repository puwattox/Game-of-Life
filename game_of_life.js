"use strict";

function GameOfLife(t) {
    this.template = t;
    var size = 256;
    var maskY = 0xff00;
    var maskX = 0x00ff;
    var bitSize = 8;
    var image = null;
    var canvas = null;
    var context = null;
    var current = 0;
    var buff = null;
    var drawFlag = false;
    var mouseStartX = -1;
    var mouseStartY = -1;
    var templateNo = -1;

    window.requestAnimationFrame = window.requestAnimationFrame ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame ||
                       window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame ||
                      window.webkitCancelAnimationFrame ||
                      window.mozCancelAnimationFrame ||
                      window.msCancelAnimationFrame;
    this.timerID = null;
    this.requestAnimationFrame = null;
    this.cancelAnimationFrame  = null;
    if (typeof window.requestAnimationFrame !== "undefined") {
        this.requestAnimationFrame = function () { return window.requestAnimationFrame(this.updateAnimationFrame()); } 
        this.cancelAnimationFrame  = function () { window.cancelAnimationFrame(this.timerID); } 
    } else {
        this.requestAnimationFrame = function () { return setInterval(this.runFunc(), 16); };
        this.cancelAnimationFrame  = function () { clearInterval(this.timerID); };
    }

    this.runFunc = function () {
        var _this = this;
        return function () {
            _this.run();
        }
    }

    this.updateAnimationFrame = function () {
        var _this = this;
        return function () {
            _this.timerID = window.requestAnimationFrame(_this.updateAnimationFrame());
            _this.run();
        }
    }

    this.start = function () {
        if(this.timerID == null) {
            this.timerID = this.requestAnimationFrame();
            removeMouseEvent();
        }
    }

    this.pause = function () {
        if(this.timerID != null) {
            this.cancelAnimationFrame();
            this.timerID = null;
            addMouseEvent();
        }
    }

    this.init = function () {
        current = 0;
        buff = new Array(2);
        buff[0] = new Array(size * size);
        buff[1] = new Array(size * size);
        for(var i = 0; i < buff[0].length; i++) {
            buff[0][i] = 0;
            buff[1][i] = 0;
        }
        for(var i = 0; i < size * size * 4; i += 4) {
            image.data[i + 3] = 255;
        }
    }

    this.reset = function () {
        this.pause();
        this.init();
        this.defaultCell(templateNo)
        addMouseEvent();
    }

    this.defaultCell = function(no) {
        templateNo = no;
        if (no >= 0) {
            var pattern = this.template.getTemplates()[no];
            var h = pattern.c.length;
            var w = pattern.c[0].length;
            var target = buff[0];
            var px = ((size - w) / 2) | 0;
            var py = ((size - h) / 2) | 0;
            var index = 0;
            for (var i = 0; i < h; i++) {
                for (var j = 0; j < w; j++) {
                    var p = (px + j) + ((py + i) << bitSize); 
                    target[p] = pattern.c[i][j] | 0;
                }
            }
            
        } else {
            var target = buff[0];
            switch(no | 0) {
                case -2:    // X pattern
                    var pt1 = 0, pt2 = size - 1;
                    for (var i = 0; i < size; i++) {
                        target[pt1] = target[pt2] = 1;
                        pt1 += size + 1;
                        pt2 += size - 1;
                    }
                    break;

                case -3:    // randam pattern
                    for (var i = 0; i < size * 100; i++) {
                        target[(((Math.random() * size) | 0) << bitSize) | ((Math.random() * size) | 0)] = 1;
                    }
                    break;
            }
        }
        draw();
    }

    var addMouseEvent = function() {
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseout',  onMouseOut);
        canvas.addEventListener('mouseup',   onMouseUp);
        canvas.addEventListener('mousedown', onMouseDown);
    }

    var removeMouseEvent = function() {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseout',  onMouseOut);
        canvas.removeEventListener('mouseup',   onMouseUp);
        canvas.removeEventListener('mousedown', onMouseDown);
    }

    var onMouseMove = function(e) {
        if (mouseStartX < 0) return;
        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left) | 0;
        var y = (e.clientY - rect.top) | 0;
        line(x, y);
        mouseStartX = x;
        mouseStartY = y;
        draw();
    }

    function line(endX, endY) {
        if (endX < 0) endX = 0;
        else if (endX > size) endX = size;

        if (endY < 0) endY = 0;
        else if (endY > size) endY = size;

        var lx = Math.abs(endX - mouseStartX);
        var ly = Math.abs(endY - mouseStartY);
        var signX = (endX - mouseStartX) < 0 ? -1 : 1;
        var signY = (endY - mouseStartY) < 0 ? -1 : 1;
        var target = buff[current];

        var e, d, m;
        var mask1, mask2;
        var dd1, dd2;
        var pt = (mouseStartX & maskX) | ((mouseStartY << bitSize) & maskY);

        if (lx >= ly) {
            e = lx;
            d = lx;
            m = ly;
            mask1 = maskX;
            dd1 = signX;
            mask2 = maskY;
            dd2 = signY << bitSize;
        } else {
            e = ly;
            d = ly;
            m = lx;
            mask1 = maskY;
            dd1 = signY << bitSize;
            mask2 = maskX;
            dd2 = signX;
        }

        for(var i = 0; i < d; i++) {
            target[pt] = 1;
            e -= m;
            if (e <= 0) {
                e += d;
                pt = (((pt & mask2) + dd2) & mask2) | (pt & mask1);
            }
            pt = (pt & mask2) | (((pt & mask1) + dd1) & mask1);
        }
    }

    var onMouseOut = function(e) {
        if (mouseStartX < 0) {
            return;
        }

        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left) | 0;
        var y = (e.clientY - rect.top) | 0;
        line(x, y);
        mouseStartX = x;
        mouseStartY = y;
        draw();

        mouseStartX = mouseStartY = -1;
    }

    var onMouseUp = function(e) {
        mouseStartX = mouseStartY = -1;
    }

    var onMouseDown = function (e) {
        var rect = e.target.getBoundingClientRect();
        mouseStartX = (e.clientX - rect.left) | 0;
        mouseStartY = (e.clientY - rect.top) | 0;
        buff[current][mouseStartX | (mouseStartY << bitSize)] = 1;
        draw();
    }

    this.setCanvas = function(id) {
        canvas = document.getElementById(id);
        if(!canvas.getContext) {
            return false;
        }
        context = canvas.getContext("2d");
        image = context.createImageData(size, size);
        addMouseEvent();

        return true;
    }

    var draw = function () {
        var target = buff[current];
        var pt = 0;
        for (var i = 0; i < size * size; i++) {
            if (target[i] != 0) {
                image.data[pt + 0] = 248;
                image.data[pt + 1] = 248;
                image.data[pt + 2] = 248;
            } else {
                image.data[pt + 0] = 48;
                image.data[pt + 1] = 48;
                image.data[pt + 2] = 48;
            }
            pt += 4;
        }
        context.putImageData(image, 0, 0);
        drawFlag = true;
    }

    var nextGeneration = function() {
        var src = buff[current];
        var dest = buff[current ^ 1];
        for (var i = 0; i < size * size; i++) {
            var count = countAlive(src, i);
            if (src[i] == 0) {
                dest[i] = (count == 3) ? 1 : 0;
            } else {
                if (count <= 1 || count >= 4) dest[i] = 0;
                else dest[i] = 1;
            }
        }
        current ^= 1;
    }

    var countAlive = function(target, pt) {
        var count = 0;
        var x = ((pt & maskX) - 1) & maskX;
        var y = ((pt & maskY) - size) & maskY;
        for (var i = y; i < y + 3 * size; i += size) {
            var wy = i & maskY;
            for (var j = x; j < x + 3; j++) {
                count += target[(j & maskX) | wy];
            }
        }
        return count - target[pt];
    }

    this.run = function () {
        drawFlag = false;
        do {
            nextGeneration();
            draw();
        } while(!drawFlag);
    }
}