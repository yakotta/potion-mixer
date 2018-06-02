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
        console.log(goalColor);
        console.log(checkColor)
        var check = [];
        for (i = 0; i < 3; i++){
            check[i] = goalColor[i]-4 <= checkColor[i] && checkColor[i] <= goalColor[i]+4;
        }
        console.log(check);
        console.log(check.filter(x => x).length);
        if(check.filter(x => x).length == 3) {
            console.log('success!');
        } else if (check.filter(x => x).length ==2) {
            console.log('soooooo close!');
        } else if (check.filter(x => x).length == 1) {
            console.log('getting there!');
        }
    }
    
    // allows the player to reset the mixer bottle
    $('#reset').click(function(){
        changeColor(mixerBottle, rgbify[169,213,224]);
        mixerBottle.addClass('empty');
    });
});