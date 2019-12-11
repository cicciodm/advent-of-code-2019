import { mainOrbitMap,testOrbitMap } from "./input";

type SpaceObjectOrbitMap = {[objectName: string ]: string[]};

const centerOfMass = "COM";
const you = "YOU"; 
const santa = "SAN"; 

function calculateOrbits(): void {
  const orbitMap: SpaceObjectOrbitMap = {};

  mainOrbitMap.forEach(spaceObject => {
    const [center, orbitant] = spaceObject.split(")");
    const existingOrbitants = orbitMap[center] || [];
    
    existingOrbitants.push(orbitant);
    orbitMap[center] = existingOrbitants;

    if (!orbitMap[orbitant]) {
      orbitMap[orbitant] = [];
    }
  });

  console.log("OrbitMap", orbitMap);

  const orbitCounts: {[obj: string]: number} = {};

  orbitCounts[centerOfMass] = 0;

  let currentLayer = 1;
  let accumulator = 0;
  let orbitantsAtLayer = orbitMap[centerOfMass];

  while (orbitantsAtLayer.length !== 0) {
    console.log("At layer", currentLayer, "here are the orbitants", orbitantsAtLayer);
    accumulator += orbitantsAtLayer.length * currentLayer;
    orbitantsAtLayer = orbitantsAtLayer.map(orbitant => orbitMap[orbitant]).flat();
    currentLayer++;
  }

  console.log(accumulator);
}

interface TransfersToObj {
  object: string;
  transfers: number;
}

function findPath(): void {
  const orbitMap: SpaceObjectOrbitMap = {};
  const visitedMap = {};

  mainOrbitMap.forEach(spaceObject => {
    const [center, orbitant] = spaceObject.split(")");
    
    const existingOrbitants = orbitMap[center] || [];
    existingOrbitants.push(orbitant);
    orbitMap[center] = existingOrbitants;

    const existingCenters = orbitMap[orbitant] || [];
    existingCenters.push(center);
    orbitMap[orbitant] = existingCenters;
    
    visitedMap[center] = false;
    visitedMap[orbitant] = false;
  })

  visitedMap[you] = true;
  console.log(orbitMap);

  const startingObject = orbitMap[you][0];
  const destinationObject = orbitMap[santa][0];
  
  const reachedObjects: TransfersToObj[] = [{object: startingObject, transfers: 0}];

  while (!reachedObjects.find(r => r.object === destinationObject)) {
    // console.log("This iteration will go through", reachedObjects, "things");
    const toProcess = reachedObjects.shift();
    console.log("the item to process is", toProcess, "and here's the next", orbitMap[toProcess.object]);

    const nextObjs = orbitMap[toProcess.object].filter(obj => !visitedMap[obj]);
    
    const transferNumber = toProcess.transfers + 1;

    reachedObjects.push(...nextObjs.map(o => ({object: o, transfers: transferNumber})));
    visitedMap[toProcess.object] = true;

    // console.log("Post-processing", reachedObjects);
  }

  const found = reachedObjects.find(r => r.object === destinationObject);
  console.log("Found santa here", found);

}

// calculateOrbits();
findPath();

