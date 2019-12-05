const start = 236491;
const end = 713787;

// There are 2 consecutive digits
// Always increasing digits

function isValidPassword(password: number): boolean {
  const asString = password.toString();
  const asChars = asString.split("");
  
  const isSorted = asChars.sort().join("") === asString;

  const counts = {}

  asChars.forEach((char, index) => {
    if (index > 0) {
      if (char === asChars[index - 1]) {
        counts[char] = (counts[char] || 1) + 1;
      }
    }
  });
  
  return isSorted && Object.values(counts).some(val => val === 2);
}

console.log(isValidPassword(112233));
console.log(isValidPassword(123444));
console.log(isValidPassword(111122));

let counter = 0;

for (let currentPwd = start; currentPwd <= end; currentPwd++) {
  if (isValidPassword(currentPwd)) {
    counter++;
  }
}

console.log("Valid passwords:", counter);