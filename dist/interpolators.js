export function lagrangeInterpolation(density, points, context) {
    if (points.length <= 1)
        return;
    var densityInverse = 505 - density;
    for (let i = points[0].x; i <= points[points.length - 1].x; i += (densityInverse / 10)) {
        var outputJ = 0;
        for (let j = 0; j < points.length; j++) {
            let outputM = 1;
            for (let m = 0; m < points.length; m++) {
                if (m == j)
                    continue;
                outputM *= (i - points[m].x) / (points[j].x - points[m].x);
            }
            outputJ += outputM * points[j].y;
        }
        context.fillRect(i, outputJ, 2, 2);
    }
}
export function catmullInterpolation(density, points, context) {
    if (3 >= points.length)
        return;
    for (let j = 1; j < points.length; j++) {
        if (j == points.length - 1 || j == points.length - 2)
            continue;
        context.moveTo(points[j].x, points[j].y);
        for (let i = 0.0; i < 1.0; i += 1 / density) {
            var point = getSplinePoint(i, j, points);
            context.fillRect((points[j].x + points[j].x + point.x) - 1, (points[j].y + points[j].y + point.y) - 1, 2, 2);
        }
        context.stroke();
    }
}
export function autoCatmullInterpolation(density, points, context) {
    if (1 >= points.length)
        return;
    let startPoint = points[0];
    let endPoint = points[points.length - 1];
    let newX = points[0].x;
    var workingPoints = [];
    workingPoints = points.slice();
    workingPoints.unshift(startPoint);
    workingPoints.push(endPoint);
    for (let j = 1; j < workingPoints.length; j++) {
        if (j == workingPoints.length - 1 || j == workingPoints.length - 2)
            continue;
        context.moveTo(workingPoints[j].x, workingPoints[j].y);
        for (let i = 0.0; i < 1.0; i += 1 / density) {
            var point = getSplinePoint(i, j, workingPoints);
            context.fillRect(workingPoints[j].x + workingPoints[j].x + point.x, workingPoints[j].y + workingPoints[j].y + point.y, 2, 2);
        }
        context.stroke();
    }
}
function getSplinePoint(t, startingPoint, array) {
    let q1, q2, q3, q4;
    q1 = -(t * t * t) + 2.0 * (t * t) - t;
    q2 = 3.0 * (t * t * t) - 5.0 * (t * t) - 2.0;
    q3 = -3 * (t * t * t) + 4.0 * (t * t) + t;
    q4 = (t * t * t) - (t * t);
    let x = (array[startingPoint - 1].x * q1 + array[startingPoint].x * q2 + array[startingPoint + 1].x * q3 + array[startingPoint + 2].x * q4) / 2;
    let y = (array[startingPoint - 1].y * q1 + array[startingPoint].y * q2 + array[startingPoint + 1].y * q3 + array[startingPoint + 2].y * q4) / 2;
    return { x, y };
}
