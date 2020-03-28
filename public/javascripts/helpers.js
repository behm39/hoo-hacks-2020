function lineSegmentCircleIntersection(pt1, pt2, circPt, r) {
    
    let circlex = circPt.x;
    let circley = circPt.y;
    let radius = r;
    let x1 = pt1.x;
    let y1 = pt1.y
    let x2 = pt2.x;
    let y2 = pt2.y;

	//Calculate change in x and y for the segment
    let deltax = x2 - x1;
    let deltay = y2 - y1;

    //Set up our quadratic formula
    let a = deltax * deltax + deltay * deltay;
    let b = 2 * (deltax * (x1-circlex) + deltay * (y1 - circley));
    let c = (x1 - circlex) * (x1 - circlex) + (y1 - circley) * (y1 - circley) - radius * radius;

    //Check if there is a negative in the discriminant
    let discriminant = b * b - 4 * a * c;
    if (discriminant < 0) 
        return false;

    //Try both +- in the quadratic formula
    let quad1 = (-b + Math.sqrt(discriminant))/(2 * a);
    let quad2 = (-b - Math.sqrt(discriminant))/(2 * a);

    //If the result is between 0 and 1, there is an intersection
    if (quad1 >= 0 && quad1 <= 1) 
        return true;
    else if (quad2 >= 0 && quad2 <= 1) 
        return true;
    return false;

    // pt1 = p5.Vector.sub(pt1, circPt);
    // pt2 = p5.Vector.sub(pt2, circPt);

    // let x0 = pt1.x;
    // let x1 = pt2.x;
    // let y0 = pt1.y;
    // let y1 = pt2.y;

    // let a = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    // let b = 2 * (x1 - x0) * x0 + 2 * (y1 - y0) * y0;
    // let c = x0 * x0 + y0 * y0 - r * r;

    // let t = (2 * c) / (-b + sqrt(b * b - 4 * a * c));
    // return t >= 0 && t <= 1;
}


// all parameters are vectors
function lineSegmentIntersection(p1, q1, p2, q2) {
    // Find the four orientations needed for general and 
    // special cases 
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    // General case 
    if (o1 != o2 && o3 != o4)
        return true;

    // Special Cases 
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are colinear and q2 lies on segment p1q1 
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases 
}

function onSegment(p, q, r) {
    return (q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) &&
        q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y));
}

function orientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) -
        (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0;  // colinear 

    return (val > 0) ? 1 : 2; // clock or counterclock wise 
}


