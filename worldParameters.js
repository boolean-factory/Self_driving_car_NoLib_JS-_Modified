class WorldParameters{
    constructor(
        worldOrigine, 
        tileSize, 
        tileRoadRatio,
        worldGridSize, 
        laneCount, 
        doubleSense,
        zoomFacteur = 1 ){

        this.worldOrigine = worldOrigine;

        this.tileSize = tileSize;
        this.tileMide = tileSize/2;
        this.tileRoadRatio = tileRoadRatio;
        this.worldGridSize = worldGridSize;
        
        this.laneCount = laneCount;
        this.doubleSense = doubleSense;

        this.zoomFacteur = 1;
        
        this.roadSize = this.tileSize * this.tileRoadRatio;
        this.tileRest = this.tileSize - this.roadSize;
        this.tileBorderToRoad = this.tileRest/2;

        this.totalLane = this.doubleSense == true?this.laneCount*2:this.laneCount;
        this.laneSize = this.roadSize/this.totalLane;
        
        this.carSize = this.laneSize * 0.65 ;

    }


}