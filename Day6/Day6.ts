import { mainOrbitMap } from "./input";

const centerOfMass = "COM";

interface SpaceObject {
  objectName: string,
  objectsInOrbit: SpaceObject[];
}

type SpaceObjectOrbitMap = {[objectName: string ]: string[]};

const orbitMap: SpaceObjectOrbitMap = {};

mainOrbitMap.forEach(spaceObject => {
  const [center, orbitant] = spaceObject.split(")");
  const existingOrbitants = orbitMap[center] || [];
  
  existingOrbitants.push(orbitant);
  orbitMap[center] = existingOrbitants;

  if (!orbitMap[orbitant]) {
    orbitMap[orbitant] = [];
  }
})

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

