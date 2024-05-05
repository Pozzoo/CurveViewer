import { lagrangeInterpolation, catmullInterpolation, autoCatmullInterpolation } from "./interpolators.js";
import { clearAll, clearScreen, drawPoints } from "./drawFunctions.js";
import { writeAndSave } from "./saveFunciton.js";
var selectedMethod = 0;
var selectedPoint = -1;
var mouseMode;
var points = new Array();
const scale = 100;
const tipCanvas = document.getElementById("tipCanvas");
const tipCtx = tipCanvas.getContext("2d");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const densitySelector = document.getElementById("density");
var density = parseFloat(densitySelector.value);
const toggleCartesian = document.getElementById("cartesianToggle");
toggleCartesian.checked = false;
const toggleGrid = document.getElementById("gridToggle");
toggleGrid.checked = false;
const toggleFunction = document.getElementById("functionToggle");
toggleFunction.checked = false;
const xPicker = document.getElementById("xCoordinate");
const yPicker = document.getElementById("yCoordinate");
const heightOffset = document.getElementById("buttons").offsetHeight;
const clearButton = document.getElementById("clearButton");
const autoCatmullButton = document.getElementById("autoCatmullButton");
const catmullButton = document.getElementById("catmullButton");
const lagrangeButton = document.getElementById("lagrangeButton");
const addPointButton = document.getElementById("addPointButton");
const exportButton = document.getElementById("exportButton");
clearButton.addEventListener("click", function handleClick() {
    points = clearAll(context, windowDimentions, canvasDimentions, scale, points, toggleGrid, toggleCartesian);
});
autoCatmullButton.addEventListener("click", function handleClick() {
    draw(0);
});
catmullButton.addEventListener("click", function handleClick() {
    draw(1);
});
lagrangeButton.addEventListener("click", function handleClick() {
    draw(2);
});
addPointButton.addEventListener("click", function handleClick() {
    addPointManual(parseInt(xPicker.value), parseInt(yPicker.value), points);
});
exportButton.addEventListener("click", function handleClick() {
    writeAndSave(points);
});
const windowDimentions = {
    height: window.outerHeight - heightOffset,
    width: window.outerWidth
};
const canvasDimentions = {
    height: windowDimentions.height - 95 - heightOffset,
    width: windowDimentions.width - 35
};
warmupCanvas(tipCanvas, canvas);
toggleCartesian.onchange = function () {
    draw(selectedMethod);
};
toggleGrid.onchange = function () {
    draw(selectedMethod);
};
densitySelector.oninput = function (event) {
    density = parseFloat(event.target.value);
    draw(selectedMethod);
};
toggleFunction.onchange = function () {
    points = clearAll(context, windowDimentions, canvasDimentions, scale, points, toggleGrid, toggleCartesian);
    if (toggleFunction.checked) {
        toggleCartesian.checked = true;
        toggleCartesian.disabled = true;
        draw(selectedMethod);
    }
    else {
        toggleCartesian.disabled = false;
    }
};
canvas.onmousedown = function (e) {
    var point = isColliding(e);
    if (point.index !== -1) {
        mouseMode = e.type;
        selectedPoint = point.index;
    }
    else {
        addPoint(e);
    }
};
canvas.onmouseup = function (e) {
    if (selectedPoint != -1) {
        if (toggleFunction.checked && selectedPoint - 1 >= 0) {
            if (e.clientX - (canvasDimentions.width / 2) > points[selectedPoint - 1].x) {
                points[selectedPoint].x = e.clientX - (canvasDimentions.width / 2);
                points[selectedPoint].y = e.clientY - (canvasDimentions.height / 2 + heightOffset);
            }
        }
        else {
            points[selectedPoint].x = e.clientX - (canvasDimentions.width / 2);
            points[selectedPoint].y = e.clientY - (canvasDimentions.height / 2 + heightOffset);
        }
    }
    draw(selectedMethod);
    mouseMode = "mouseup";
    selectedPoint = -1;
};
canvas.onmousemove = function (e) {
    var point = isColliding(e);
    if (point.pointX != -50000 && point.pointY != -50000) {
        tipCanvas.style.left = ((point.pointX) + (canvasDimentions.width / 2)) + "px";
        tipCanvas.style.top = ((point.pointY - 40) + (canvasDimentions.height / 2 + heightOffset)) + "px";
        tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
        if (toggleCartesian.checked) {
            tipCtx.fillText((point.pointX / 20) + ", " + (-(point.pointY / 20)), 3, 15);
        }
        else {
            tipCtx.fillText((point.pointX) + ", " + (-point.pointY), 3, 15);
        }
    }
    else {
        tipCanvas.style.left = "-200px";
    }
};
function isColliding(event) {
    let pointX = -50000;
    let pointY = -50000;
    for (var index = 0; index < points.length; index++) {
        var dX = (event.clientX - (canvasDimentions.width / 2)) - points[index].x;
        var dY = (event.clientY - (canvasDimentions.height / 2 + heightOffset)) - points[index].y;
        if (dX * dX + dY * dY < 100) {
            pointX = points[index].x;
            pointY = points[index].y;
            return { pointX, pointY, index };
        }
    }
    index = -1;
    return { pointX, pointY, index };
}
function draw(method) {
    selectedMethod = method;
    switch (method) {
        case 0:
            clearScreen(context, windowDimentions, canvasDimentions, scale, toggleGrid, toggleCartesian);
            drawPoints(context, windowDimentions, canvasDimentions, scale, points, toggleGrid, toggleCartesian);
            autoCatmullInterpolation(density, points, context);
            break;
        case 1:
            clearScreen(context, windowDimentions, canvasDimentions, scale, toggleGrid, toggleCartesian);
            drawPoints(context, windowDimentions, canvasDimentions, scale, points, toggleGrid, toggleCartesian);
            catmullInterpolation(density, points, context);
            break;
        case 2:
            clearScreen(context, windowDimentions, canvasDimentions, scale, toggleGrid, toggleCartesian);
            drawPoints(context, windowDimentions, canvasDimentions, scale, points, toggleGrid, toggleCartesian);
            lagrangeInterpolation(density, points, context);
            break;
    }
}
function addPoint(event) {
    if (!toggleFunction.checked) {
        let point = {
            x: event.clientX - (canvasDimentions.width / 2),
            y: event.clientY - (canvasDimentions.height / 2 + heightOffset)
        };
        points.push(point);
        draw(selectedMethod);
        return;
    }
    if (points.length >= 1) {
        if (event.clientX - (canvasDimentions.width / 2) > points[points.length - 1].x) {
            let point = {
                x: event.clientX - (canvasDimentions.width / 2),
                y: event.clientY - (canvasDimentions.height / 2 + heightOffset)
            };
            points.push(point);
            draw(selectedMethod);
        }
    }
    else {
        let point = {
            x: event.clientX - (canvasDimentions.width / 2),
            y: event.clientY - (canvasDimentions.height / 2 + heightOffset)
        };
        points.push(point);
        draw(selectedMethod);
    }
}
function addPointManual(xLoc, yLoc, points) {
    if (toggleCartesian.checked) {
        let point = {
            x: xLoc * 20,
            y: yLoc * 20
        };
        points.push(point);
    }
    else {
        let point = {
            x: xLoc,
            y: yLoc
        };
        points.push(point);
    }
    draw(selectedMethod);
}
canvas.ondrop = function (event) {
    clearAll(context, windowDimentions, canvasDimentions, scale, points, toggleGrid, toggleCartesian);
    if (event.dataTransfer == null)
        return;
    var file = event.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        if (event.target == null)
            return;
        const csv = reader.result;
        var jsonData = JSON.parse(csv);
        console.log('Dropped JSON:', jsonData);
        points = clearAll(context, windowDimentions, canvasDimentions, scale, points, toggleGrid, toggleCartesian);
        for (let index = 0; index < jsonData.length; index++) {
            let point = {
                x: jsonData[index].x,
                y: jsonData[index].y
            };
            points.push(point);
        }
        draw(selectedMethod);
    };
    reader.readAsText(file);
};
canvas.ondragover = function (event) {
    event.preventDefault();
};
window.ondrop = function (event) {
    event.preventDefault();
};
function warmupCanvas(tipCanvas, canvas) {
    tipCanvas.width = 75;
    tipCanvas.height = 25;
    canvas.width = canvasDimentions.width;
    canvas.height = canvasDimentions.height;
    context.translate(canvasDimentions.width / 2, canvasDimentions.height / 2);
    canvas.style.background = "white";
}
