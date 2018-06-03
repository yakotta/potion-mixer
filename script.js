$(document).ready(function(){
    // provides the starting color in [r,g,b]
    var colors = {
        magenta: [255,0,255],
        red: [255,0,0],
        yellow: [255,255,0],
        green: [0,255,0],
        blue: [0,0,255],
        cyan:[0,255,255],
        white: [255,255,255],
        black: [0,0,0]
    }
    
    // provides the goal colors in [r,g,b]
    var endpoints = {
        love: [250, 20, 85],
        health: [33, 151, 220],
        happiness: [255, 224, 48],
        luck: [148, 223, 10],
        pleasure: [247, 93, 2],
        money: [40, 110, 18],
        misfortune: [167, 16, 18],
        death: [77, 1, 85]
    }
    
    // turns an array into rgb(x,y,z) form
    function rgbify(arr){
        return 'rgb(' + arr.join() + ')';
    }
    
    // updates the bottle color
    function changeColor(bottle, color) {
        bottle.attr('style', 'background-color: ' + color);
    }
    
    // creates the color palette
    for (var key in colors){
        if (colors.hasOwnProperty(key)) {
            var rgb = rgbify(colors[key]);
            var bottle = $('<div>')
            bottle.attr('id', key);
            bottle.addClass('bottle');
            bottle.html('<img>');
            bottle.children().attr('src', 'potion.png');
            changeColor(bottle.children(), rgb);
            $('#color-palette').append(bottle);
        }
    }
        
    // locates the larger bottles
    var mixerBottle = $('#mixing');
    var endBottle = $('#endpoint');
    var goalColor = "";
    
    // lets the player select the potion to be matched
    $('li').click(function(){
        goalColor = endpoints[$(this).html()];
        changeColor(endBottle, rgbify(goalColor));
        $('#intro').addClass('hidden');
        $('#game').removeClass('hidden');
    });
    
    // gets the rgb color of mixer bottle and returns as an array [r,g,b]
    function getColors(){
        var rgb = mixerBottle.attr('style').replace('background-color: rgb(', '').replace(')', '').split(',');
        return rgb.map(x => parseInt(x));
    }
    
    // blends two colors based on rgb values
    function blendColors(startColor, addColor){
        addColor = colors[addColor];
        var newColor = [];
        for (i = 0; i < 3; i++) {
            newColor[i] = Math.round((startColor[i] + addColor[i]) / 2)
        }
        return newColor;
    }
    
    // gets the color from the clicked bottle into the mixer bottle
    $('.bottle').click(function(){
        var clickedColor = $(this).attr('id');
        if(mixerBottle.hasClass('empty')) {
            changeColor(mixerBottle, rgbify(colors[clickedColor]));
            mixerBottle.removeClass('empty');
        } else {
            var mixedColor = getColors();
            var newColor = blendColors(mixedColor, clickedColor);
            changeColor(mixerBottle, rgbify(newColor));
            isThatAWin(newColor);
        }
    });
    
    // looks to see if the player won
    function isThatAWin(checkColor){
        var hslGoal = rgb2hsl(...goalColor);
        var hslCheck = rgb2hsl(...checkColor);
        console.log("goal: " + hslGoal.join(" "));
        console.log("check: " + hslCheck.join(" "));
        var check = [];
        
        for (i = 0; i < 3; i++){
            if (i = 1) {
                check[i] = hslGoal[i] + 5 <= hslCheck[i] && hslCheck[i] <= hslGoal[i] + 5;
            } else {
                check[i] = hslGoal[i] - .05 <= hslCheck[i] && hslCheck[i] <= hslGoal[i] + .05;
            }
        }
        console.log(check);
        //console.log(check.filter(x => x).length);
        /*if(check.filter(x => x).length == 3) {
            console.log('success!');
        } else if (check.filter(x => x).length ==2) {
            console.log('soooooo close!');
        } else if (check.filter(x => x).length == 1) {
            console.log('getting there!');
        }*/
    }
    
    // allows the player to reset the mixer bottle
    $('#reset').click(function(){
        changeColor(mixerBottle, rgbify[169,213,224]);
        mixerBottle.addClass('empty');
    });
    
    //converts rgb colors to hsl
    function rgb2hsl(r, g, b) {
        // https://www.rapidtables.com/convert/color/rgb-to-hsl.html
        var r0 = r/255;
        var g0 = g/255;
        var b0 = b/255;
        
        var cMax = Math.max(r0,g0,b0);
        var cMin = Math.min(r0,g0,b0);
        var delta = cMax - cMin;
        
        var hsl = [];
        var l = (cMax + cMin)/2;
        hsl[2] = l;
        var s = delta / (1 - Math.abs(2*l - 1));
        hsl[1] = s;
        
        var h = null;
        if (delta == 0) {
            h = 0;
        } else if (cMax == r0) {
            h = ((g0 - b0) / delta) % 6;
        } else if (cMax == g0) {
            h = 2 + (b0 - r0) / delta;
        } else if (cMax == b0) {
            h = 4 + (r0 - g0) / delta;
        }
        
        h = h * 60;
        if (h < 0) h = h + 360;
        hsl[0] = Math.round(h);

        return hsl.map(x => parseFloat(x.toFixed(2)));
    }
    
    //converts hsl colors to rgb
    function hsl2rgb(h, s, l){
        // https://www.rapidtables.com/convert/color/hsl-to-rgb.html
        var rgb = [];
        var c = (1 - Math.abs(2*l - 1)) * s;
        var x = c * (1 - Math.abs(((h/60) % 2) - 1));
        var m = l - c/2;
        
        if(0 <= h && h < 60){
            rgb = [c, x, 0];
        } else if(60 <= h && h < 120) {
            rgb = [x, c, 0];
        } else if(120 <= h && h < 180){
            rgb = [0, c, x];
        } else if(180 <= h && h < 240){
            rgb = [0, x, c];
        } else if(240 <= h && h < 300){
            rgb = [x, 0, c];
        } else if(300 <= h && h < 360){
            rgb = [c, 0, x];
        }
        
        return rgb.map(x => Math.round(255 * (x + m)));
    }
    
    // turns h,s,l into hsl(x,y%,z%)
    function hslify(h, s, l){
        return 'hsl(' + h + ',' + s*100 + '%,' + l*100 + '%)';
    }
});