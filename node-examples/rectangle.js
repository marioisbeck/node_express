module.exports = (x,y,callback) => {
    if (x <= 0 || y <= 0)
        setTimeout(() => 
            callback(new Error("Rectangle dimensions should be greater than zero: l = "
                + x + ", and b = " + y), 
            null),
            2000);
    else
        setTimeout(() => 
            callback(null, {
                perimeter: () => (2*(x+y)), // x and y are passed in by x and y in the module.exports line
                area:() => (x*y)
            }), 
            2000);
}


// exports.perimeter =  (x, y) => (2*(x+y));
// exports.area = (x, y) => (x*y);