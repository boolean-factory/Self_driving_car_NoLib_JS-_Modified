class TileFullTurn{
        constructor(
            worldParameters,
            position,
            tileRotationParam = [0,1,0,0],
            roadResolution = 30)
            {
            this.flag = false;
            this.worldP = worldParameters;
            this.position = position;
            this.circlRotation = Math.PI-(2*Math.PI/6);
            this.roadOpeningList = tileRotationParam ;
            
            this.tileRotationParam = 0;

            
            if(this.roadOpeningList[0] == 0 
                && this.roadOpeningList[1] == 0 
                && this.roadOpeningList[2] == 0
                && this.roadOpeningList[3] == 0){
                this.roadOpeningList = [0,1,0,0];
            };


            if(this.roadOpeningList[1] == 1){
                this.tileRotationParam = 0 
            };
            if(this.roadOpeningList[3] == 1){
                this.tileRotationParam = 1
            };
            if(this.roadOpeningList[0] == 1){
                this.tileRotationParam = 2
                
            };
            if(this.roadOpeningList[2] == 1){
                this.tileRotationParam = 3 
            };

            
            this.tileRotation = this.tileRotationParam * (Math.PI/2);

            // Turn parameters
            this.externalCircleResolution = roadResolution;
            
            this.angleRotation = 2*Math.PI - (2*Math.PI/6) ;
            this.extAngleResolution = this.angleRotation/this.externalCircleResolution;
            
            this.extCircleRadius = this.worldP.roadSize;

            // Enter Points parameters
            
            this.extRoadPoint = this.worldP.tileSize - this.worldP.tileBorderToRoad ;
            this.inerRoadPoint = this.worldP.tileBorderToRoad ;

            this.x2 = -this.inerRoadPoint + this.worldP.tileMide;
            this.x3 = -this.extRoadPoint + this.worldP.tileMide;

            this.y1 = 0 + this.worldP.tileMide;

            this.bottomExtXYRot = rotation(this.tileRotation, this.x3, this.y1, this.position.x, this.position.y);  
            this.bottomInerXYRot = rotation(this.tileRotation, this.x2, this.y1, this.position.x, this.position.y);

            this.borders = [
                [this.bottomExtXYRot],
            ];
    
            for(let i=0; i <= this.externalCircleResolution; i++){

                const x = (Math.cos(this.circlRotation + this.extAngleResolution*i)* this.extCircleRadius) ;
                const y = (Math.sin(this.circlRotation + this.extAngleResolution*i)* this.extCircleRadius) ;
                
                const xyRot = rotation(this.tileRotation, x, y, this.position.x, this.position.y);

                this.borders[0].push(xyRot);
            }
            this.borders[0].push(this.bottomInerXYRot);
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


    
    