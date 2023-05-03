
function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){
    const tTop = (D.x - C.x)*(A.y - C.y) - (D.y-C.y) * (A.x - C.x);
    const uTop = (C.y - A.y)*(A.x - B.x) - (C.x -A.x) * (A.y - B.y);
    const bottom = (D.y - C.y)*(B.x - A.x) - (D.x - C.x)*(B.y - A.y);

    if(bottom != 0){
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t >= 0 && t<=1 && u >= 0 && u <= 1){
            return {
                x:lerp(A.x, B.x, t),
                y:lerp(A.y, B.y, t),
                offset:t
            }
        }
    }
}

function polysLineIntersect(poly1, line){
    for(let i=0; i<poly1.length; i++){
        for(let j=0;j<line.length-1; j++){
            const touch = getIntersection(
                poly1[i],
                // to evoid going out of the ray of polygon et go bac to poly 0 the fist one 
                poly1[(i+1)%poly1.length],
                line[j],
                line[j+1]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}


function polysPolysIntersect(poly1, poly2){
    for(let i=0; i<poly1.length; i++){
        for(let j=0;j<poly2.length; j++){
            const touch = getIntersection(
                poly1[i],
                // to evoid going out of the ray of polygon et go bac to poly 0 the fist one 
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    
    // use RGB to evaluet value of connection Alpha for intensiti of connection next to 1 or -1 
    //R and B for negative or positive value

    // const alpha = Math.abs(value);
    // const R=value<0?0:255;
    // const G=R;
    // const B=value>0?0:255;
    // return "rgba("+R+","+G+","+B+","+alpha+")";
    
    const alpha = Math.abs(value);
    const R=value<0?24:255;
    const G=value<0?94:255;
    const B=value<0?144:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
    
}

function rotation(angle,x,y, offSetX = 0, offSetY = 0){
    const xRot = (Math.cos(angle)*x - Math.sin(angle)*y) + offSetX;
    const yRot = (Math.sin(angle)*x + Math.cos(angle)*y) + offSetY;
    return {x: xRot,y: yRot};
}



function tchecBondarise( gridXY, worldGridSize){
    if(gridXY.x < 0 || gridXY.y < 0 ){
        return false;
    }else{ 
        if(gridXY.x > worldGridSize - 1 || gridXY.y > worldGridSize -1){
            return false;
        }else{

            return true;
        }
    }
}

function vectorNormalXY(position1,position2){
    const deltaX = position1.x - position2.x; 
    const deltaY = position1.y - position2.y;
    // const max = Math.max(deltaX,deltaY);
    // const vectorNormalXY = {x:deltaX/max,y:deltaY/max};
    const vectorNormalXY = {x:deltaX,y:deltaY};
    return vectorNormalXY;
}

function vectorAngle(vector){
const angleX =  Math.atan(vector.y,vector.x);
}

function distancePoints(position1,position2){
    const distance = Math.sqrt(Math.pow((position1.x - position2.x),2) + Math.pow((position1.y - position2.y),2) );
    return distance;
}

