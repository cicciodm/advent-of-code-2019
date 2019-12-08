import {
  wire1Path,
  wire2Path,
  smallTest1,
  smallTest2,
  testPath1,
  testPath2,
  testPath3,
  testPath4
} from "./inputs";

const coordinatesMap = new Map<string, string[]>();

const stepFormat = /([A-Z])([1-9]+)/;

type Direction = "U" | "D" | "L" | "R";
interface Point {
  x: number;
  y: number;
  steps: number;
}

function markPath(path: string[], wireName: string): void {
  const currentPoint: Point = {
    x: 0,
    y: 0,
    steps: 0
  };

  path.map((step, index) => {
    const matches = step.match(stepFormat);

    const direction = matches[1] as Direction;
    const length = parseInt(matches[2]);

    moveInDirectionFrom(
      currentPoint,
      direction,
      length,
      wireName,
      index === path.length - 1
    );
  });
}

function moveInDirectionFrom(
  point: Point,
  direction: Direction,
  length: number,
  wireName: string,
  isLastDirection: boolean
): void {
  while (length > 0) {
    switch (direction) {
      case "U":
        point.y = point.y + 1;
        break;
      case "R":
        point.x = point.x + 1;
        break;
      case "D":
        point.y = point.y - 1;
        break;
      case "L":
        point.x = point.x - 1;
        break;
    }
    point.steps = point.steps + 1;

    const indexCoord = point.x.toString() + "," + point.y.toString();

    const existingWires = coordinatesMap.get(indexCoord);
    coordinatesMap.set(indexCoord, [
      ...(existingWires || []),
      wireName +
        "," +
        (length !== 1
          ? getDirectionMarker(direction)
          : isLastDirection
          ? getDirectionMarker(direction)
          : "+") +
        "," +
        point.steps
    ]);

    length--;
  }
}

function getDirectionMarker(direction: Direction): string {
  switch (direction) {
    case "D":
    case "U":
      return "|";
    case "L":
    case "R":
      return "-";
  }
}

function areWiresCrossing(lines: string[]): boolean {
  const firstWire = lines[0];
  const secondWire = lines[1];

  const [firstWireName, firstWireDirection] = firstWire.split(",");
  const [secondWireName, secondWireDirection] = secondWire.split(",");

  const wiresAreDifferent = firstWireName !== secondWireName;
  const wiresAreCrossing =
    (firstWireDirection === "|" && secondWireDirection === "-") ||
    (firstWireDirection === "-" && secondWireDirection === "|");

  return wiresAreDifferent && wiresAreCrossing;
}

function smallestInArray(a: number[]): number {
  return Math.min.apply(Math, a);
}

function drawPaths(): void {
  let resultString = [];
  for (let y = 10; y > -10; y--) {
    let row = [];
    for (let x = -10; x < 10; x++) {
      const indexCoord = x.toString() + "," + y.toString();
      const val = coordinatesMap.get(indexCoord);

      let charToPush = ",";

      if (val && val.length) {
        const firstLine = val[0];
        const wireName = firstLine.split(",")[0];
        charToPush = firstLine.split(",")[1];

        if (val.length === 2 && areWiresCrossing(val)) {
          charToPush = "X";
        }
      }

      if (x === 0 && y === 0) {
        charToPush = "o";
      }

      row.push(charToPush);
    }
    resultString.push(row.join(""));
  }

  resultString.forEach(row => console.log(row));
}

function calculateSteps(lines: string[]): number {
  const firstWire = lines[0];
  const secondWire = lines[1];

  const [firstWireName, firstWireDirection, steps1] = firstWire.split(",");
  const [secondWireName, secondWireDirection, steps2] = secondWire.split(",");

  return parseInt(steps1) + parseInt(steps2);
}

function findIntersections(): number[] {
  const intersections = [];

  coordinatesMap.forEach((val, key) => {
    if (val.length === 2 && areWiresCrossing(val)) {
      const steps = calculateSteps(val);

      intersections.push(steps);
    }
  });

  return intersections;
}

markPath(wire1Path, "tp1");
markPath(wire2Path, "tp2");

// console.log(coordinatesMap);

// drawPaths();

const intersections = findIntersections();
const dist = smallestInArray(intersections);

// const intersections = [];

console.log("Found intersections", intersections);

// const distances = intersections.map(coord => {
//   const [x, y] = coord.split(",");
//   return Math.abs(parseInt(x)) + Math.abs(parseInt(y));
// });

// console.log("distances", distances);

// const dist = smallestInArray(distances);

console.log("Found closest", dist);
