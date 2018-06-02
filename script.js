$(document).ready(function(){
    // provides the starting color in [r,g,b]
    var colors = {
        magenta: [236,0,140],
        red: [255,0,0],
        yellow: [255,242,0],
        green: [0,255,0],
        blue: [0,0,255],
        cyan:[0,174,239],
        white: [255,255,255],
        black: [0,0,0]
    }
    
    // provides the goal colors in [r,g,b]
    var endpoints = {
        love: [230,16,79],
        health: [5,158,227],
        happiness: [255,213,24],
        luck: [152,227,80],
        pleasure: [250,98,10],
        money: [8,98,34],
        misfortune: [182,0,3],
        death: [71,11,88] // 71,11,88???
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
            check[i] = goalColor[i]-2 <= checkColor[i] && checkColor[i] <= goalColor[i]+2;
        }
        console.log(check);
        console.log(check.filter(x => x).length);
        if(check.filter(x => x).length == 3) {
            alert('success!');
        } else if (check.filter(x => x).length ==2) {
            alert('soooooo close!');
        } else if (check.filter(x => x).length == 1) {
            alert('getting there!');
        }
    }
    
    // allows the player to reset the mixer bottle
    $('#reset').click(function(){
        changeColor(mixerBottle, rgbify[169,213,224]);
        mixerBottle.addClass('empty');
    });
});