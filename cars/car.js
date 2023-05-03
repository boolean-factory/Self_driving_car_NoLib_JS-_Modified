class Car {
    constructor(x,y, carSizeInWorld, carConductSimParm, carSensors, controlType, color = "rgb(24,94,144)"){
        

        this.x = x;
        this.y = y;

        this.width = carSizeInWorld*carConductSimParm.carShapeRatio;
        this.height = carSizeInWorld;

        this.speed = 0;
        this.angle = 0;
        this.acceleration = carConductSimParm.acceleration;
        this.maxSpeed = carConductSimParm.maxSpeed;
        this.friction = carConductSimParm.friction;
        this.damaged = false;

        this.brainEntreNuber = 0;
        this.brainShape = carSensors.brainShape;
        this.useBrain = controlType == "AI";
        
        if(controlType!="DUMMY"){
            if(carSensors.rayCast){
                this.sensorRayCast= new SensorRayCast(this,carSensors.rayCastParm);
                this.brainEntreNuber += carSensors.rayCastParm.rayCount;
                this.brainShape[0] = this.brainEntreNuber
            }
            if(carSensors.Gyro){
                this.sensorGyro= new SensorGyro(this);
                this.brainEntreNuber+=1;
                this.brainShape[0] = this.brainEntreNuber
            }
            this.brain=new NeuralNetwork(
                this.brainShape
            );
        }
        this.controls = new Controls(controlType);

        this.img = new Image();
        this.img.src = "car1image.png"

        this.mask = document.createElement("canvas");
        this.mask.width = this.width;
        this.mask.height = this.height;

        const maskCtx = this.mask.getContext("2d");
        this.img.onload=()=>{
            maskCtx.fillStyle = color;
            maskCtx.rect(0,0,this.width,this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation= "destination-atop";
            maskCtx.drawImage(this.img,0,0,this.width,this.height);
        }
    }

    update(roadBorders, traffic, carObjectivePosition = {x: this.x, y:this.y} ){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic); 
        }
        if(this.sensorRayCast){
            this.sensorRayCast.update(roadBorders, traffic);
            // reading inputs from ray to neuralNet
            const offsets = this.sensorRayCast.readings.map(
                s=>s==null?0:1-s.offset
            );
            if(this.sensorGyro){
                offsets.push(this.sensorGyro.update(carObjectivePosition));
            }
            const outputs=NeuralNetwork.feedForward(offsets, this.brain);
            

            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic){
        for(let i=0; i<roadBorders.length; i++){
            if(polysLineIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i=0; i<traffic.length; i++){
            if(polysPolysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

//get rectangle point of the rectangle car for colision 
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
        
    }

    #move(){
                // Add movent by incresing the speed of the car 
                if(this.controls.forward){
                    this.speed += this.acceleration;
                    
                }
                if(this.controls.reverse){
                    this.speed -= this.acceleration;
                }
                
                // Controle The max speed for the car 
                if(this.speed > this.maxSpeed){
                    this.speed = this.maxSpeed;
                }
                if (this.speed < -this.maxSpeed/2){
                    this.speed = -this.maxSpeed/2;
                }
                
                // add friction to the car to reduce the speed wen no acceleration
                if (this.speed > 0){
                    //this.speed -= this.friction;
                    this.speed = this.speed * this.friction;
                }
                if (this.speed < 0){
                    //this.speed += this.friction;
                    this.speed = this.speed * this.friction;
                }
                // if(Math.abs(this.speed)<this.friction){
                //     this.speed = 0
                // }
                if(Math.abs(this.speed)<0.01){
                    this.speed = 0
                }
                
                if(this.speed!=0){
                    const flip = this.speed>0?1:-1;
                
                    if(this.controls.left){
                        this.angle += 0.03*flip
                    }
            
                    if(this.controls.right){
                        this.angle -= 0.03*flip
                    }
                
                }
                this.x -= Math.sin(this.angle)*this.speed;
                this.y -= Math.cos(this.angle)*this.speed;
    }

    draw(ctx,color,drawSensor = false){

        //vertion rectangel simple
        // if(this.damaged){
        //     ctx.fillStyle="gray";
        // }else{
        //     ctx.fillStyle=color;
        // }
        // ctx.beginPath();
        // ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        // for(let i=1; i<this.polygon.length; i++){
        //     ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        // }
        // ctx.fill();

        if(this.sensorRayCast && drawSensor){
            this.sensorRayCast.draw(ctx);

        }
        if(this.sensorGyro && drawSensor){
            this.sensorGyro.draw(ctx);
        }

        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        if(!this.damaged){

            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
                );
                ctx.globalCompositeOperation = "multiply"
        }
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
            );
        ctx.restore();

    }
}