class TileRoadManager{
    constructor(
        worldP,
    )
    {

        this.worldP = worldP;
        this.worldGrid = Array.from({ length: this.worldP.worldGridSize * this.worldP.worldGridSize });

        this.worldGridOrigine = Math.round(this.worldP.worldGridSize/2)-1; // start from 0
        this.uperLeftGridPosition = {
            x:this.worldP.worldOrigine.x - (this.worldP.tileSize*(this.worldGridOrigine+1)) + this.worldP.tileSize/2,
            y:this.worldP.worldOrigine.y - (this.worldP.tileSize*(this.worldGridOrigine+1)) + this.worldP.tileSize/2
        }
        this.flagTile = 0;


    }


// uper left ref: gridX and Y start from 0 to worldGridSize -1
    getTilArrayPosition(gridXY){
        return this.tileXY = [(this.worldP.worldGridSize * gridXY.y) + gridXY.x];    
    }

    convertWorldPosToGrid(posXY){
        const gridX = Math.floor((posXY.x - this.uperLeftGridPosition.x)/this.worldP.tileSize);
        const gridY = Math.floor((posXY.y - this.uperLeftGridPosition.y)/this.worldP.tileSize);
        const gridXY = {x:gridX, y:gridY};
        const bondariseTchec = tchecBondarise(gridXY, this.worldP.worldGridSize) ;
        if(bondariseTchec == true ){
            return gridXY;
        }else{
            return false;
        }
    }

    creatFlagTile(){
        this.flagTile = this.worldGrid[Math.floor(Math.random()*this.worldP.worldGridSize * this.worldP.worldGridSize)];
        this.flagTile.flag = true;
        return this.flagTile.position;
    }

    generateTile(
        position,
        tileId,
        rotateAngle = {N:false ,S:false ,O:false ,E:false })
        {
        
        if(tileId == 0){
            const tile = new TileFullTurn(this.worldP, position, rotateAngle);
                return tile;
            }
        if(tileId == 1){
            const tile = new TileRoad(this.worldP, position, rotateAngle);
                return tile;
            }
        if(tileId == 2){
            const tile = new TileTurn(this.worldP, position, rotateAngle);
                return tile;
            }
        if(tileId == 3){
            const tile = new TileTCross(this.worldP, position, rotateAngle);
                return tile;
            }
        if(tileId == 4){
            const tile = new TileStar(this.worldP, position);
                return tile;
            }
        if(tileId == 5){
            const tile = new TileCross(this.worldP, position);
                return tile;
            }
        if(tileId == 6){
            const tile = new TileCircle(this.worldP, position,);
                return tile;
            }
    }

    generateTileFromPosition(
        position
        ){
        


        if(this.convertWorldPosToGrid(position)!=false){ 

            const gridPosition =   this.convertWorldPosToGrid(position);    
            const arrayPosition = this.getTilArrayPosition(gridPosition);

            if(this.worldGrid[arrayPosition] === undefined){

                var road = [0,0,0,0];
                var wall = [0,0,0,0];
                var contactWall = 0;
                var contactRoad = 0;

                const NorthTile = {x:gridPosition.x, y:gridPosition.y-1};
                var bondariseTchec = tchecBondarise(NorthTile, this.worldP.worldGridSize) ;

                if(bondariseTchec == true ){
                    var arrayPos = this.getTilArrayPosition(NorthTile);
                    var arrayValue = this.worldGrid[arrayPos];
                    if( arrayValue != undefined){
                        road[0] = arrayValue.roadOpeningList[1];
                        if(road[0] == 1){
                            contactRoad +=1; 
                            road[0] = 1;
                        }else{
                            contactWall +=1;
                            wall[0] = -1; 
                        }

                    }
                    
                }else{
                    contactWall +=1;
                    wall[0] = -1; 
                }
                
                const SouthTile = {x:gridPosition.x, y:gridPosition.y+1};
                var bondariseTchec = tchecBondarise(SouthTile, this.worldP.worldGridSize) ;
                if(bondariseTchec == true ){
                    var arrayPos  = this.getTilArrayPosition(SouthTile);
                    var arrayValue = this.worldGrid[arrayPos];
                    if( arrayValue != undefined){
                        road[1] = arrayValue.roadOpeningList[0];
                        if(road[1] == 1){
                            contactRoad +=1; 
                            road[1] = 1;
                        }else{
                            contactWall +=1;
                            wall[1] = -1; 
                        }

                    }
                }else{
                    contactWall +=1;
                    wall[1] = -1; 
                }

                const OwesTile = {x:gridPosition.x-1, y:gridPosition.y};
                var bondariseTchec = tchecBondarise(OwesTile, this.worldP.worldGridSize) ;
                if(bondariseTchec == true ){
                    var arrayPos  = this.getTilArrayPosition(OwesTile);
                    var arrayValue = this.worldGrid[arrayPos];
                    if( arrayValue != undefined){
                        road[2] = arrayValue.roadOpeningList[3];
                        if(road[2] == 1){
                            contactRoad +=1;
                            road[2] = 1; 
                        }else{
                            contactWall +=1;
                            wall[2] = -1; 
                        }

                    }
                }else{
                    contactWall +=1;
                    wall[2] = -1; 
                }

                const EstTile = {x:gridPosition.x+1, y:gridPosition.y};
                var bondariseTchec = tchecBondarise(EstTile, this.worldP.worldGridSize) ;
                if(bondariseTchec == true ){
                    var arrayPos  = this.getTilArrayPosition(EstTile);
                    var arrayValue = this.worldGrid[arrayPos];
                    if( arrayValue != undefined){
                        road[3] = arrayValue.roadOpeningList[2];
                        if(road[3] == 1){
                            contactRoad +=1;
                            road[3] = 1; 
                        }else{
                            contactWall +=1;
                            wall[3] = -1; 
                        }

                    }
                }else{
                    contactWall +=1;
                    wall[3] = -1; 
                }

                var wallInverse = 4 - contactWall

                    const interval = wallInverse - contactRoad
                    const tiletype = Math.floor((Math.random()*interval)+contactRoad+1);
                    if(tiletype>4){tiletype==4};
                    var test = road-wall;

                    // console.log("Invertwall: "+wallInverse,
                    // "road: "+contactRoad,
                    // "interval: "+interval,
                    // "randMin: "+((0*interval)+contactRoad),
                    // "randMax: "+((1*interval)+contactRoad),
                    // "RandResult: "+tiletype,
                    // )

                    if(tiletype == 4){
                        const tileId = Math.floor((Math.random()*3)+4);
                        const tile = this.generateTile(position,
                            tileId);
                        this.worldGrid[arrayPosition] = tile;
                    } 
                    if(tiletype == 3){
                        if (contactRoad < 3){
                            var entrers = 3-contactRoad;
                            for(let i=0; i<4; i++){
                                if(wall[i]==0 && road[i]==0 && entrers>0){
                                    road[i] = 1;
                                    entrers-=1;
                                }
                            };
                        };
                    
                        const tileId = 3;
                        const tile = this.generateTile(position,
                            tileId, road);
                        this.worldGrid[arrayPosition] = tile;
                    } 

                    if(tiletype == 2 && contactRoad == 2){
                        if(road[0] == 1 && road[1]  == 1 || road[2]  == 1 && road[3]  == 1 ){
                            const tileId = 1;
                            const tile = this.generateTile(position,
                                tileId, road);
                            this.worldGrid[arrayPosition] = tile;
                        }else{
                            const tileId = 2;
                            const tile = this.generateTile(position,
                                tileId, road);
                            this.worldGrid[arrayPosition] = tile;   
                        }

                    }
                    if(tiletype == 2){
                        if (contactRoad < 2){
                            var entrers = 2-contactRoad;
                            for(let i=0; i< 4 ; i++){
                                if(wall[i]==0 && road[i]==0 && entrers>0){
                                    road[i] = 1;
                                    entrers-=1;
                                }
                            }
                        }
                        if(road[0] == true && road[1]  == true || road[2]  == true && road[3]  == true ){
                            const tileId = 1;
                            const tile = this.generateTile(position,
                                tileId, road);
                            this.worldGrid[arrayPosition] = tile;
                        }else{
                            const tileId = 2;
                            const tile = this.generateTile(position,
                                tileId, road);
                            this.worldGrid[arrayPosition] = tile;   
                        }
                    } 

                    if(tiletype == 1){
                        const tileId = 0;
                        const tile = this.generateTile(position,
                            tileId, road);
                        this.worldGrid[arrayPosition] = tile;
                    } 

                    if(tiletype == 0){
                        const tileId = contactRoad;
                        const tile = this.generateTile(position,
                            tileId);
                        this.worldGrid[arrayPosition] = tile;
                    } 
            
            
            }           
        }
        // console.log(road,
        //     wall,
        //     contactWall,
        //     contactRoad,)
   
    }

    fillGridRandom(){
        for(let i=-this.worldP.worldGridSize/2; i<=this.worldP.worldGridSize/2; i++){
            for(let j=-this.worldP.worldGridSize/2; j<=this.worldP.worldGridSize/2; j++){
                var position = {x: this.worldP.worldOrigine.x-i*this.worldP.tileSize,
                    y:this.worldP.worldOrigine.y-j*this.worldP.tileSize}
                road.generateTileFromPosition(position);
        
                }
        }
    }

    tileForColisionTchec(carfieldOfColision = 1, carPosition = {x:0,y:0}){

        const actualBordersForColision = [];
        // const gridPos = this.convertWorldPosToGrid(carPosition);
        const gridPos = carPosition;

        for (let i=-carfieldOfColision; i<=carfieldOfColision; i++){

            for (let j=-carfieldOfColision; j<=carfieldOfColision; j++){

                const adjacentTil = {x:gridPos.x - i, y:gridPos.y - j}
                const til = this.getTilArrayPosition(adjacentTil)
                
                if(this.worldGrid[til] !== undefined){

                    for (let i= 0; i<=this.worldGrid[til].borders.length-1; i++){;

                        actualBordersForColision.push(this.worldGrid[til].borders[i]);
                    }
                }
            }
        }
        return actualBordersForColision;
    }

    tileDraw(ctx,carfieldOfView = 1, carPosition = this.worldP.worlOrigine){

        const gridPos = this.convertWorldPosToGrid(carPosition);

        for (let i=-carfieldOfView; i<=carfieldOfView; i++){

            for (let j=-carfieldOfView; j<=carfieldOfView; j++){ 

                const adjacentTil = {x:gridPos.x - i, y:gridPos.y - j}
                const til = this.getTilArrayPosition(adjacentTil)
                
                if(this.worldGrid[til] !== undefined){
                    this.worldGrid[til].draw(ctx);
                }
            }
        }
    }
}
