/*
** Julia Set
* Cristian Rojas Cardenas, May 2022
* Algorithm based on the tutorial of Daniel Shiffman.
* See the video here: 
* https://www.youtube.com/watch?v=k6OeXGzRv0c


http://paulbourke.net/fractals/juliaset/

*/


let c1;
let c2;

let rc;
let ic;


let settings = { 
    Generate: function(){ init(); },
    max_iterations: 100,
    infinity_value: 16,
    gray_scale: false,
    rc: -0.70176,
    ic: -0.3842,
}

function gui(){
    // Adding the GUI menu
    var gui = new dat.GUI();
    gui.width = 150;
    gui.add(settings,'Generate');
    gui.add(settings,'max_iterations', 10, 200).step(1);
    gui.add(settings,'infinity_value', 1, 100).step(1);
    gui.add(settings,'rc').listen();
    gui.add(settings,'ic').listen();
    gui.add(settings,'gray_scale');
}


function setup(){
    gui();
    createCanvas(720, 400);
    pixelDensity(1); 
    generate();
}



function generate(){
    background(0);

    c1 = color(0, 0, 139);
    c2 = color(255, 255, 255);
    
    
    loadPixels();
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) { 
            n =  maldelbrot(i, j);
            n_color = getColor(n);
            setPixels(i, j, n_color.levels);
        }
    }
    updatePixels();
}

function draw(){
    settings.rc = map(mouseX, 0, width, -1, 1);
    settings.ic = map(mouseY, 0, height, -1, 1);
    console.log(settings.rc, settings.ic);
    generate();
}

function maldelbrot(i, j){

    // The grid reference is translated and scaled
    var a = map(i, 0, width, -1.5, 1.5);
    var b = map(j, 0, height, -1.5, 1.5);

    // Iterations counter
    var n = 0;

    while (n < settings.max_iterations){

        // Z^2
        var real = a*a - b*b;
        var imag = 2*a*b;

        // Zn+1 = Zn + c
        a = real + settings.rc;
        b = imag + settings.ic;

        // The process continues until it reachs the infinity value set as 16.
        // The area that points belong depends on how fast it reachs the infinity
        // value 
        if ((a-settings.rc)**2 + (b-settings.ic)**2 > settings.infinity_value**2){
            break;
        }
        n++;
    }

    return n
}

function getColor(n){

    var factor = map(n, 0, settings.max_iterations, 0, 1);
    if(settings.gray_scale){
        bright = map(sqrt(factor), 0, 1, 0, 255);
        n_color = color(bright, bright, bright);
    } 
    else{
        if(n==settings.max_iterations) n_color = color(0, 0, 0);
        else n_color = lerpColor(c1, c2, factor);
    }

    return n_color;
}

function setPixels(i, j, color){
    var pixel = 4*(i + j*width);
    pixels[pixel] = color[0];
    pixels[pixel+1] = color[1];
    pixels[pixel+2] = color[2];
    pixels[pixel+3] = 255;
}

