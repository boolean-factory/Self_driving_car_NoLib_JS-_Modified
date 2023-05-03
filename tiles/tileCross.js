class TileCross{
        constructor(
            worldParameters,
            position,
            roadResolution = 10
            )
            {
            
            this.flag = false;
            this.worldP = worldParameters;
            this.position =position;
            this.tileRotation = 0;
            this.roadOpeningList = [1,1,1,1];

            // Turn parameters           
            this.inerRoadPoint = this.worldP.tileBorderToRoad ;

            this.x1 = 0 + this.worldP.tileMide;
            this.x2 = -this.inerRoadPoint + this.worldP.tileMide;

            this.y1 = 0 + this.worldP.tileMide;
            this.y2 = -this.inerRoadPoint + this.worldP.tileMide;

            // Bottom Right path points
            this.bR1 = rotation(this.tileRotation, this.x2, this.y1, this.position.x, this.position.y);
            this.bR2 = rotation(this.tileRotation, this.x2, this.y2, this.position.x, this.position.y);
            this.bR3 = rotation(this.tileRotation, this.x1, this.y2, this.position.x, this.position.y);  

            // Bottom Left path 
            const botLeftRotation = Math.PI/2 ;
            this.bL1 = rotation(this.tileRotation + botLeftRotation, this.x2, this.y1, this.position.x, this.position.y);
            this.bL2 = rotation(this.tileRotation + botLeftRotation, this.x2, this.y2, this.position.x, this.position.y);
            this.bL3 = rotation(this.tileRotation + botLeftRotation, this.x1, this.y2, this.position.x, this.position.y);  

            // Up Right path
            const upRightRotation = Math.PI ;
            this.uR1 = rotation(this.tileRotation + upRightRotation, this.x2, this.y1, this.position.x, this.position.y);
            this.uR2 = rotation(this.tileRotation + upRightRotation, this.x2, this.y2, this.position.x, this.position.y);
            this.uR3 = rotation(this.tileRotation + upRightRotation, this.x1, this.y2, this.position.x, this.position.y);  

            // Up Left path
            const upLeftRotation = 2*Math.PI - Math.PI/2;
            this.uL1 = rotation(this.tileRotation + upLeftRotation, this.x2, this.y1, this.position.x, this.position.y);
            this.uL2 = rotation(this.tileRotation + upLeftRotation, this.x2, this.y2, this.position.x, this.position.y);
            this.uL3 = rotation(this.tileRotation + upLeftRotation, this.x1, this.y2, this.position.x, this.position.y);  

    
            this.borders = [
                [this.bR1, this.bR2, this.bR3],
                [this.bL1, this.bL2, this.bL3],
                [this.uR1, this.uR2, this.uR3],
                [this.uL1, this.uL2, this.uL3],
            ];
    
        }
    
        // getLaneCenter(laneIndex){
        //     const laneWhidth = this.width/this.laneCount;
        //     return this.left + laneWhidth/2 + laneWhidth * Math.min(laneIndex, this.laneCount-1);
        // }
    
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


    
    