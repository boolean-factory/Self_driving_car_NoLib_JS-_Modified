class TileRoad{
        constructor(
            worldParameters,
            position,
            roadOpeningList = [1,1,0,0],
            )
            {
            
            this.flag = false;
            this.worldP = worldParameters;
            this.position = position;
            this.circlRotation = Math.PI;
            this.roadOpeningList = roadOpeningList;
        
            this.tileRotationParam = 0;

            if(this.roadOpeningList[0] == 0 
                && this.roadOpeningList[1] == 0 
                && this.roadOpeningList[2] == 0
                && this.roadOpeningList[3] == 0){
                this.roadOpeningList = [1,1,0,0];
            };

            if(this.roadOpeningList[2] == 1 && this.roadOpeningList[3] == 1){
                this.tileRotationParam = 0 ;
            };
            if(this.roadOpeningList[0] == 1 && this.roadOpeningList[1] == 1){
                this.tileRotationParam = 3 ;
            };
            
            this.tileRotation = this.tileRotationParam * (Math.PI/2);
            
            // Turn parameters
            
            this.extRoadPoint = this.worldP.tileSize - this.worldP.tileBorderToRoad ;
            this.inerRoadPoint = this.worldP.tileBorderToRoad ;

            this.x1 = 0 + this.worldP.tileMide;
            this.x2 = -this.inerRoadPoint + this.worldP.tileMide;
            this.x3 = -this.extRoadPoint + this.worldP.tileMide;
            this.x4 = -this.worldP.tileSize + this.worldP.tileMide;

            this.y1 = 0 + this.worldP.tileMide;
            this.y2 = -this.inerRoadPoint + this.worldP.tileMide;
            this.y3 = -this.extRoadPoint + this.worldP.tileMide;
            this.y4 = -this.worldP.tileSize + this.worldP.tileMide;

            // Bottom Left to Right
            
            this.leftInerXYRot = rotation(this.tileRotation, this.x4, this.y2, this.position.x, this.position.y);
            this.rightInerXYRot = rotation(this.tileRotation, this.x1, this.y2, this.position.x, this.position.y);

            // Up Left to Right

            this.upLeftXYRot = rotation(this.tileRotation, this.x4, this.y3, this.position.x, this.position.y);
            this.upRightXYRot = rotation(this.tileRotation, this.x1, this.y3, this.position.x, this.position.y);


            this.borders = [
                [this.leftInerXYRot, this.rightInerXYRot],
                [this.upLeftXYRot, this.upRightXYRot]
            ];
    
        }
    
        getLaneCenter(laneIndex){
            const laneWhidth = this.width/this.laneCount;
            return this.left + laneWhidth/2 + laneWhidth * Math.min(laneIndex, this.laneCount-1);
        }
    
        draw(ctx){
            
            if(this.flag == true){
                ctx.lineWhidth = 10;
                ctx.strokeStyle = "rgb(24,94,144)";
            }else{
            ctx.lineWhidth = 5;
            ctx.strokeStyle = "white";
            }
    
            // for(let i=1; i<=this.laneCount-1; i++){
            //     const x=lerp(
            //         this.left,
            //         this.right,
            //         i/this.laneCount
            //     );
                
            //     ctx.setLineDash([20,20]);
            //     ctx.beginPath();
            //     ctx.moveTo(x, this.top);
            //     ctx.lineTo(x, this.bottom);
            //     ctx.stroke();
            // }
    
            ctx.setLineDash([]);
            this.borders.forEach(border => {
                ctx.beginPath();
                ctx.moveTo(border[0].x,border[0].y);
                for(let i=1; i<border.length;i++){
                    ctx.lineTo(border[i].x,border[i].y);
                }
                ctx.stroke();
            });
               
            ctx.closePath();
        }
    }


    
    