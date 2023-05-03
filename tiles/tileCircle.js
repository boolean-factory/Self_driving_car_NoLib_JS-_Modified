class TileCircle{
        constructor(
            worldParameters,
            position,
            roadResolution = 10)
            {
                
            this.flag = false;
            this.worldP = worldParameters;
            this.position = position;
            this.circlRotation = Math.PI;
            this.tileRotation = 0;
            this.roadOpeningList = [1,1,1,1];

            // Turn parameters
            this.externalCircleResolution = roadResolution;
            this.inerCircleResolution = Math.round(this.externalCircleResolution * 4);
            
            this.extAngleRotation = Math.PI/2;
            this.inerAngleRotation = 2*Math.PI;

            this.extAngleResolution = this.extAngleRotation/this.externalCircleResolution;
            this.inerAngleResolution = this.inerAngleRotation/this.inerCircleResolution;
            
            this.extCircleRadius = this.worldP.tileBorderToRoad;
            this.inerCircleRadius = this.worldP.tileSize * (0.20 * (1-this.worldP.tileRoadRatio)) ;
            
            this.borders = [
                [],
                [],
                [],
                [],
                []

            ];
            for (let j = 1; j <= 4; j++){
                for(let i=0; i <= this.externalCircleResolution; i++){
    
                    const x = (Math.cos(this.circlRotation + this.extAngleResolution*i)* this.extCircleRadius) - this.worldP.roadSize/2;
                    const y = (Math.sin(this.circlRotation + this.extAngleResolution*i)* this.extCircleRadius) - this.worldP.roadSize/2;
                    
                    const xyRot = rotation(this.tileRotation + j * (Math.PI/2), x, y, this.position.x, this.position.y);
    
                    this.borders[j].push(xyRot);
                }
                
            }

            
            for(let i=0; i <= this.inerCircleResolution; i++){

                const x = (Math.cos(this.inerAngleResolution*i)* this.inerCircleRadius) ;
                const y = (Math.sin(this.inerAngleResolution*i)* this.inerCircleRadius) ;
                
                const xyRot = rotation(this.tileRotation, x, y , this.position.x, this.position.y);

                this.borders[0].push(xyRot);
            }
            //this.borders[1].push(inerExit);
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


    
    