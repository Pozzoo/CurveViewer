var points = new Array();
var workingPoints = new Array();

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

var windowHeight = window.outerHeight;
var windowWidth = window.outerWidth

var densitySelector = document.getElementById('density');
var density = densitySelector.value;

var heightOffset = document.getElementById('buttons').offsetHeight;

var selectedMethod = 0;

canvas.width = windowWidth;
canvas.height = windowHeight;

canvas.style.background = "white";

class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

canvas.addEventListener("click", clickEvent, false);
function clickEvent(event) {
    points.push(new Point2D(event.clientX, event.clientY - heightOffset));
    draw(selectedMethod);
}

function draw(method) {
    selectedMethod = method;

    switch (method) {
        case 0:
            drawAutoCatmull(density);
            break;
    
        case 1:
            drawCatmull(density);
            break;;

        case 2:
            drawSmoothstep(density)
            break;
    }
}

function drawCatmull(density) {
    clearScreen();

    points.forEach(Point2D => {
        context.fillRect(Point2D.x, Point2D.y, 10, 10);
    });

    if (3 >= points.length) return; 

    for (let j = 1; j < points.length; j++) {
        if (j == points.length - 1 || j == points.length - 2) continue;

        context.moveTo(points[j].x, points[j].y);

        for (let i = 0.0; i < 1.0; i += 1 / density) {
            var hold = getSplinePoint(i, j, points);
            
            var point = new Point2D(hold.tX, hold.tY);
            context.fillRect(points[j].x + points[j].x + point.x, points[j].y + points[j].y + point.y, 2, 2);
        }
        context.stroke();
    }
}


function drawAutoCatmull(density) {
    clearScreen();

    points.forEach(Point2D => {
        context.fillRect(Point2D.x, Point2D.y, 10, 10);
    });

    if (1 >= points.length) return; 

    let startPoint = new Point2D(points[0].x, points[0].y);
    let endPoint = new Point2D(points[points.length - 1].x, points[points.length - 1].y);

    workingPoints = [];

    workingPoints = points.slice();

    workingPoints.unshift(startPoint);
    workingPoints.push(endPoint);

    for (let j = 1; j < workingPoints.length; j++) {
        if (j == workingPoints.length - 1 || j == workingPoints.length - 2) continue;

        context.moveTo(workingPoints[j].x, workingPoints[j].y);

        for (let i = 0.0; i < 1.0; i += 1 / density) {
            var hold = getSplinePoint(i, j, workingPoints);
            
            var point = new Point2D(hold.tX, hold.tY);
            context.fillRect(workingPoints[j].x + workingPoints[j].x + point.x, workingPoints[j].y + workingPoints[j].y + point.y, 2, 2);
        }
        context.stroke();
    }
}

function getSplinePoint(t, startingPoint, array) {
    
    var q1, q2, q3, q4;
    q1 = -(t * t * t) + 2.0 * (t * t) - t;
    q2 = 3.0 * (t * t * t) - 5.0 * (t * t) - 2.0;
    q3 = -3 * (t * t * t) + 4.0 * (t * t) + t;
    q4 = (t * t * t) - (t * t);

    var tX = (array[startingPoint - 1].x * q1 + array[startingPoint].x * q2 + array[startingPoint + 1].x * q3 + array[startingPoint + 2].x * q4) / 2;
    var tY = (array[startingPoint - 1].y * q1 + array[startingPoint].y * q2 + array[startingPoint + 1].y * q3 + array[startingPoint + 2].y * q4) / 2;

    return {tX, tY};
}

function drawSmoothstep(density) {
    clearScreen();

    points.forEach(Point2D => {
        context.fillRect(Point2D.x, Point2D.y, 10, 10);
    });

    if (1 >= points.length) return; 

    for (var i = 0; i < points.length; i++) {
        if (i + 1 >= points.length) continue;

        var incrementX = (points[i + 1].x - points[i].x) / density;
        var incrementY = (points[i + 1].y - points[i].y) / density;

        for (var j = 0; j < density; j++) {

            var k = clamp(j / density, 0, 1);
            var smoothStep = (10 * (k ** 3)) - (15 * (k ** 4)) + ( 6 * (k ** 5));

            context.fillRect(points[i].x + incrementX * j, points[i].y + (incrementY * j * smoothStep), 2, 2)
        }
    }
    context.stroke()
}

function clamp(x, t1, t2) {
    var result = (x - t1) / (t2 - t1);

    return Math.max(0, Math.min(1, result));
}

densitySelector.oninput = function() {
    density = this.value;
    draw(selectedMethod);
}

function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAll() {
    clearScreen();
    points = [];
}