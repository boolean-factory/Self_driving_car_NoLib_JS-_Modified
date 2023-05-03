class CarManager{
    constructor(carConductSimParm, carSizeInWorld, carPositionStart, carSensorsAndBrain, carsAINumber,player = false,carDummyNumber = [], carObjectivePosition = 0){

        this.carConductSimParm = carConductSimParm;
        this.carSizeInWorld = carSizeInWorld;
        this.carPositionStart = carPositionStart;
        this.carSensorsAndBrain = carSensorsAndBrain;
        this.carObjectivePosition = carObjectivePosition;
        this.aiMutationFactor = 0.5;
        
        this.carRealWorldWeid = 2.4;
        this.oneMeterPixel = carSizeInWorld/this.carRealWorldWeid;
        
        this.carConductSimParm.maxSpeed = (this.oneMeterPixel*carConductSimParm.maxSpeed)/216;
        this.carConductSimParm.acceleration = ((carConductSimParm.acceleration * 10)*this.oneMeterPixel)/3600;
    
        this.carsAINumber = carsAINumber;
        this.carsAIArray = Array.from({ length: this.carsAINumber });
        this.bestCar = this.carsAIArray[0];


        this.player = player;
        this.carPlayer = 0;
        if(player == true){
            this.carPlayer = new Car(this.carPositionStart.x,this.carPositionStart.y,this.carSizeInWorld,this.carConductSimParm ,this.carSensorsAndBrain,"PLAYER")
            this.cameraCar = this.carPlayer;
        }else{
            this.cameraCar = this.carsAIArray[0];
        }

        this.carDummyNumber = carDummyNumber;
        this.traffic = [];

    }

    generatePlayerCar(tchecSave = false){
        if(tchecSave == true){
            if(this.carPlayer !=0){
                this.cameraCar = this.carPlayer;
                this.player = true;
            }else{
                this.carPlayer = new Car(this.carPositionStart.x,this.carPositionStart.y,this.carSizeInWorld,this.carConductSimParm ,this.carSensorsAndBrain,"PLAYER")
                this.cameraCar = this.carPlayer;
                this.player = true;
            }
        }else{
            this.carPlayer = new Car(this.carPositionStart.x,this.carPositionStart.y,this.carSizeInWorld,this.carConductSimParm ,this.carSensorsAndBrain,"PLAYER")
            this.cameraCar = this.carPlayer;
            this.player = true;

        }
    }
    generateAICars(){
        const cars=[];
        if (localStorage.getItem("bestBrain")){
            for (let i=0;i<=this.carsAINumber-1;i++){
                this.carsAIArray[i] = (new Car(this.carPositionStart.x,this.carPositionStart.y,this.carSizeInWorld,this.carConductSimParm ,this.carSensorsAndBrain,"AI"));

                this.carsAIArray[i].brain = JSON.parse(
                    localStorage.getItem("bestBrain")
                );

                if(i!=0){
                    NeuralNetwork.mutate(this.carsAIArray[i].brain, this.aiMutationFactor);
                }
            
            }
        }else{
            for (let i=0;i<=this.carsAINumber-1;i++){
                this.carsAIArray[i] = 
                (new Car(this.carPositionStart.x,
                    this.carPositionStart.y,
                    this.carSizeInWorld,
                    this.carConductSimParm ,
                    this.carSensorsAndBrain,
                    "AI"));
            }   
        }
    }

    updateCars(roadManager){
        var curXY = {x:0,y:0};
        var curBordersToTchec = [];
        var curGridPos ={x:0, y:0};
        
        if (this.player == true){
            
            curXY = {x:this.carPlayer.x, y:this.carPlayer.y};
            const GridPos = roadManager.convertWorldPosToGrid(curXY);

            if(curGridPos.x == GridPos.x && curGridPos.y == GridPos.y ){
                this.carPlayer.update(curBordersToTchec, this.traffic, this.carObjectivePosition);
            }else{
                curBordersToTchec= roadManager.tileForColisionTchec(1,GridPos);
                this.carPlayer.update(curBordersToTchec, this.traffic, this.carObjectivePosition);
            }
            
        }

        for (let i=0;i<=this.carsAINumber-1;i++){

            curXY = {x:this.carsAIArray[i].x, y:this.carsAIArray[i].y};
            const GridPos = roadManager.convertWorldPosToGrid(curXY);

            if(curGridPos.x == GridPos.x && curGridPos.y == GridPos.y ){
                this.carsAIArray[i].update(curBordersToTchec, this.traffic, this.carObjectivePosition);
            }else{
                curBordersToTchec= roadManager.tileForColisionTchec(1,GridPos);
                this.carsAIArray[i].update(curBordersToTchec, this.traffic,  this.carObjectivePosition);
            }
            
        }
    }

    updateBestCar(){

        
        if(this.carObjectivePosition !=0 ){
            var carId = 0;
            var distanceSmall = 10000000000;
            for(let i=0;i<=this.carsAINumber-1;i++){
            const iaPosXY = {x:this.carsAIArray[i].x, y:this.carsAIArray[i].y};
            const distance = distancePoints(
                this.carObjectivePosition,
                iaPosXY,
                );
                if(distance<distanceSmall){
                    distanceSmall = distance;
                    carId = i;
                }
            }
            this.bestCar = this.carsAIArray[carId];
        }else{
            this.bestCar = this.carsAIArray.find(
                c=>c.y==Math.max(
                    ...this.carsAIArray.map(c=>c.y)
                )
            );
        }
        if(this.player == false){
            this.cameraCar = this.bestCar;
        }
        
    }

    carsDraw(carCtx){
    // for (let i=0; i<traffic.length; i++){
    //     traffic[i].draw(carCtx,"red");
    // }

    carCtx.globalAlpha=0.2;
    for(let i=0; i<this.carsAIArray.length;i++){
        this.carsAIArray[i].draw(carCtx,"rgb(24,94,144)");
    }
    carCtx.globalAlpha=1;
    this.cameraCar.draw(carCtx,"rgb(24,94,144)",true);

    }
}


