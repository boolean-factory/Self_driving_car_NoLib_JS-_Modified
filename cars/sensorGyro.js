class SensorGyro{
    constructor(car){
        this.car = car;

        this.carPost = {x:this.car.x,y:this.car.y} ;
        this.vectorNorXY = 0;
    
    
        this.angle = 0;
        this.angle2 = 0;
        this.angle3 = 0; 

        this.normalazedRes = 1;

    }






    update(carObjectivePosition){
        this.carPost = {x:this.car.x,y:this.car.y} ;
        this.vectorNorXY = vectorNormalXY(carObjectivePosition, this.carPost);
        this.angle = Math.atan2(this.vectorNorXY.x,this.vectorNorXY.y);
        this.angle2 = -this.angle+Math.PI/2;
        this.angle3 = Math.PI - this.angle;

        const orientationFactor = Math.abs(this.car.angle + this.angle3);
        const range2PI = orientationFactor - (2*Math.PI * Math.floor(orientationFactor/(2*Math.PI)));
        const range90 = Math.abs((2*Math.PI*Math.floor(range2PI/(Math.PI))) - range2PI);
        this.normalazedRes = range90 /(Math.PI);


        return this.normalazedRes;

    }



    draw(ctx){

        const offSetX = this.car.height*Math.cos(this.angle2);
        const offSetY = this.car.height*Math.sin(this.angle2);
        
        const point1 = rotation(this.angle3,-7,0,this.car.x + offSetX, this.car.y + offSetY);
        const point2 = rotation(this.angle3,7,0,this.car.x + offSetX, this.car.y + offSetY);
        const point3 = rotation(this.angle3,0,-8,this.car.x + offSetX, this.car.y + offSetY);
    
        ctx.strokeStyle = "rgba(24,94,144,"+this.normalazedRes+")";
        ctx.moveTo(point1.x,point1.y);
        ctx.lineTo(point2.x,point2.y);
        ctx.lineTo(point3.x,point3.y);
        ctx.closePath(); // draws last line of the triangle
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,"+this.normalazedRes+")";
        ctx.fill();
    }
}