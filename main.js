/**
 *  Parameters
 */

//World param
const worldOrigine = {x:200,y:400};
const tileSize = 100;
const tileRoadRatio = 0.3;
const worldGridSize = 12;
const laneCount = 3;
const doubleSense = false;
const zoomFacteur = 1;

/**
 *  World generation
 */
const world = new WorldParameters(
    worldOrigine , 
    tileSize , 
    tileRoadRatio ,
    worldGridSize , 
    laneCount , 
    doubleSense ,
    zoomFacteur 
);

// Cars params

const carConductSimParm ={
    carShapeRatio: 0.5, // largeur longeur voiture
    acceleration: 2, // g
    maxSpeed: 250, // km/h
    friction: 0.99,
}

const carPositionStart = {x:200, y:500};
const carsAINumber = 500;
const carSensorsAndBrain = {
    rayCast: true,
    rayCastParm:{rayCount:12, rayLength:world.carSize*3, raySpread: 2*Math.PI },
    Gyro: true,
    brainShape: [0,14,4],
};
const player = true;
const carDummyNumber = [];



/**
 *  Canvas gestion
 */
const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 600;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const networkCtx = networkCanvas.getContext("2d");


/**
 * road
 */

var road = new TileRoadManager(
    world
);
road.fillGridRandom();
var flagPosition = road.creatFlagTile();

/**
 * Cars
 */

const cars = new CarManager(
    carConductSimParm,
    world.carSize,
    carPositionStart,
    carSensorsAndBrain,
    carsAINumber,
    player,
    carDummyNumber,
)
cars.generateAICars();
cars.carObjectivePosition = flagPosition;

/**
 * bouton fonction creation
 */
var restartAI = false;
var generatePlayer = false;
var restartPl = false;

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(cars.bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function restartSimu(){
    restartAI = true;
}

function onOffPlayer(){
    if(generatePlayer == false){
        generatePlayer = true;
    }else{
        generatePlayer = false;
    }
}
function restartPlayer(){
    restartPl = true;
}

const loupParameter = {loup: false, frameW:300, repetitonTotal:100, frameCount:0, repetition:0};
function loupSimu(){
    loupParameter.loup = true;
}



// function saveMap(){
//     localStorage.setItem("bestMap",
//     JSON.stringify(road.worldGrid));
// }

// function discardMap(){
//     localStorage.removeItem("bestMap");
// }


animate();


function animate(time){
    
    if(generatePlayer == true && cars.player == false){
        cars.generatePlayerCar(true);
    }
    if(generatePlayer == false && cars.player == true){
        cars.player=false;
    }

    if (restartAI == true){
        cars.carsAIArray = [];
        cars.generateAICars();
        restartAI = false;
    }

    if (restartPl == true){
        cars.generatePlayerCar();
        restartPl = false;
    }

    if (loupParameter.loup == true){
        if(loupParameter.frameCount == loupParameter.frameW){
            loupParameter.repetition += 1;
            discard();
            save();
            cars.carsAIArray = [];
            cars.aiMutationFactor = 1-(loupParameter.repetition/loupParameter.repetitonTotal);
            console.log(loupParameter.repetition,loupParameter.repetitonTotal)
            cars.generateAICars();
            loupParameter.frameCount = 0;
        }else{
            loupParameter.frameCount += 1;
        }
        if(loupParameter.repetition == loupParameter.repetitonTotal){
           
            loupParameter.loup = false;
            loupParameter.frameCount = 0;
            loupParameter.repetition = 0;
        }
        
    }


    cars.updateCars(road);
    cars.updateBestCar();
    
    
    carCanvas.height = window.innerHeight;
    carCanvas.width = (window.innerWidth*(2/3));

    networkCanvas.height = window.innerHeight;
    networkCanvas.width = (window.innerWidth*(1/3));
    
    carCtx.save();
    
    carCtx.translate(-cars.cameraCar.x+carCanvas.width/2,-cars.cameraCar.y+carCanvas.height*0.7);


    road.tileDraw(carCtx,4,carPos={x:cars.cameraCar.x, y:cars.cameraCar.y});

    cars.carsDraw(carCtx);
    
    carCtx.beginPath();
    

    carCtx.restore();
    

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, cars.bestCar.brain);
    requestAnimationFrame(animate);
}
