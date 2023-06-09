class Visualizer{
    static drawNetwork(ctx,network){
        const margin =50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin*2;
        const height = ctx.canvas.height - margin*2;

        const levelHeight = height/network.levels.length;

        // we draw first the out put to not over right the bius on intermidiet levels
        for(let i=network.levels.length-1; i>=0;i--){
            const levelTop = top+
                lerp(
                    height-levelHeight,
                    0,
                    network.levels.length==1
                        ?0.5
                        :i/(network.levels.length-1)
                );
            ctx.setLineDash([7,3]);
            Visualizer.drawLevel(ctx,network.levels[i],
                left,levelTop,
                width,levelHeight,
                i==network.levels.length-1
                    ?['🠉','🠈','🠊','🠋']
                    :[]
                );
        }
    }

    static drawLevel(ctx,level,left,top,width,height,outputLabels){
        const right = left+width;
        const bottom = top+height;

        // simplify cod riting as level.inputs => inputs
        const {inputs,outputs,weights,biases}=level;

        // draw weight
        for(let i=0; i<inputs.length;i++){
            for(let j=0; j<outputs.length; j++){
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs,i,left,right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs,j,left,right),
                    top
                );
                ctx.lineWidth = 2;
                // use RGB to evaluet value of connection Alpha for intensiti of connection next to 1 or -1 
                //R and B for negative or positive value
                ctx.strokeStyle= getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        const nodeRadius = 18;
        for(let i=0;i<inputs.length; i++){
            const x=Visualizer.#getNodeX(inputs,i,left,right);
            // Drawing large black node first to hide conextion onli visual
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            ctx.fillStyle= "rgb(24,94,144)";
            ctx.fill();
            // Drawing with on top 
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(inputs[i]);
            ctx.fill();
        }

        for(let i=0;i<outputs.length; i++){
            // Node
            const x=Visualizer.#getNodeX(outputs,i,left,right);
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fillStyle="rgb(24,94,144)";
            ctx.fill();
            // White
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(outputs[i]);
            ctx.fill();

            // Contour
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x,top,nodeRadius *0.8 ,0,Math.PI*2);
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle="white";
                ctx.font = (nodeRadius*1.5)+"px Arial";
                ctx.fillText(outputLabels[i],x,top+nodeRadius*0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.1);
            }
        }


    }

    static #getNodeX(nodes,index,left,right){
        return lerp(
            left,
            right,
            nodes.length==1
                ?0.5
                :index/(nodes.length-1)
        );
    }
}