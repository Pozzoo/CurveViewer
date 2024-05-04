import { Point2D, WindowDimentions, CanvasDimentions } from "./interfaces.js";

export function drawCartesian(context:CanvasRenderingContext2D, wDimentions:WindowDimentions, cDimentions:CanvasDimentions, scale:number) {
    //REMEMBER: y axis is inverted on canvas
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(-wDimentions.width, 0); 
    context.lineTo(wDimentions.width, 0);
    context.stroke(); //draws x axis
     
    context.beginPath();
    context.moveTo(0, -wDimentions.height); 
    context.lineTo(0,  wDimentions.height);
    context.stroke(); // draws y axis

    context.font = "12px Arial";
    context.fillText("+ x", (cDimentions.width - 40) / 2, -10);
    context.fillText("- y", 10, (cDimentions.height - 20) / 2);
    
    context.fillText("- x", -(cDimentions.width - 20) / 2, -10);
    context.fillText("+ y", 10, -(cDimentions.height - 20) / 2);  

    let xScale = cDimentions.width / scale;

    for (let index = 0; index < scale; index++) {
        context.beginPath();
        context.moveTo(index * xScale, 5); 
        context.lineTo(index * xScale, -5);
        context.stroke();
    
        context.beginPath();
        context.moveTo(-index * xScale, 5); 
        context.lineTo(-index * xScale, -5);
        context.stroke(); //draws x axis
        
        context.beginPath();
        context.moveTo(5, index * xScale); 
        context.lineTo(-5, index * xScale);
        context.stroke();

        context.beginPath();
        context.moveTo(5, -index * xScale); 
        context.lineTo(-5, -index * xScale);
        context.stroke(); //draws y axis
        
    }
}

export function drawGrid(context:CanvasRenderingContext2D, cDimentions:CanvasDimentions, scale:number) {
    let xScale = cDimentions.width / scale;

    for (let index = 0; index < scale; index++) {
        context.beginPath();
        context.lineWidth = 0.3;
        context.moveTo(index * xScale, cDimentions.width); 
        context.lineTo(index * xScale, -cDimentions.width);
        context.stroke(); 
    
        context.beginPath();
        context.moveTo(-index * xScale, cDimentions.width); 
        context.lineTo(-index * xScale, -cDimentions.width);
        context.stroke(); //draws y axis
        
        context.beginPath();
        context.moveTo(cDimentions.width, index * xScale); 
        context.lineTo(-cDimentions.width, index * xScale);
        context.stroke();

        context.beginPath();
        context.moveTo(cDimentions.width, -index * xScale); 
        context.lineTo(-cDimentions.width, -index * xScale);
        context.stroke(); //draws x axis
    }
}

export function drawPoints(context:CanvasRenderingContext2D, wDimentions:WindowDimentions, cDimentions:CanvasDimentions, scale:number, points:Point2D[], toggleGrid: HTMLInputElement, toggleCartesian: HTMLInputElement) {
    clearScreen(context, wDimentions, cDimentions, scale, toggleGrid, toggleCartesian);

    points.forEach(Point2D => {
        context.fillRect(Point2D.x - 5, Point2D.y - 5, 10, 10);
    });
}

export function clearScreen(context:CanvasRenderingContext2D, wDimentions:WindowDimentions, cDimentions:CanvasDimentions, scale:number, toggleGrid: HTMLInputElement, toggleCartesian: HTMLInputElement) {
    context.clearRect(-960, -540, 1920, 1080);
    
    if (toggleGrid.checked) {
        drawGrid(context, cDimentions, scale);
    }

    if (toggleCartesian.checked) {
        drawCartesian(context, wDimentions, cDimentions, scale);
    }
}

export function clearAll(context:CanvasRenderingContext2D, wDimentions:WindowDimentions, cDimentions:CanvasDimentions, scale:number, points:Point2D[], toggleGrid: HTMLInputElement, toggleCartesian: HTMLInputElement) {
    clearScreen(context, wDimentions, cDimentions, scale, toggleGrid, toggleCartesian);
    return points = [];
}