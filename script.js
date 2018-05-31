$(document).ready(function(){
    // provides the color information in hex and rgb
    var colors = {
        red: [206,30,30], // #ce1e1e
        orange: [255,124,0], // #ff7c00
        yellow: [255,195,46], // #ffc32e
        green: [111,151,48], // #6f9730
        blue: [0,85,133], // #005585
        purple: [87,8,71], // #570847
        white: [255,255,255], // #ffffff
        black: [0,0,0] // #000000
    }
    
    // turns array into rgb(x,y,z) form
    function rgbify(arr){
        return 'rgb(' + arr.join() + ')';
    }
    
    // creates the color palette
    for (var key in colors){
        if (colors.hasOwnProperty(key)) {
            var rgb = rgbify(colors[key]);
            var box = $('<div>');
            box.attr('id', key);
            box.attr('style', 'background-color: ' + rgb);
            box.addClass('box');
            $('#color-palette').append(box);
        }
    }
        
    // locates the mixer box
    var mixerBox = $('#mixer-box');
    
    // get rgb color of mixer box
    function getColors(){
        var rgb = mixerBox.attr('style').replace('background-color: rgb(', '').replace(')', '').split(',');
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
    
    // gets the color from the clicked box
    $('.box').click(function(){
        var clickedColor = $(this).attr('id');
        if(mixerBox[0].hasAttribute('style')){
            var mixedColor = getColors();
            var newColor = blendColors(mixedColor, clickedColor);
            mixerBox.attr('style', 'background-color: ' + rgbify(newColor));
            
        }
        else {
            mixerBox.attr('style', 'background-color: ' + rgbify(colors[clickedColor]));
        }
    });
});