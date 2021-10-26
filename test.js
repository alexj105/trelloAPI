var moveZeros = function (arr) {
  let counterZero = 0;

  let arrWIthoutNull = arr.filter((item) => {
    if (item === 0) {
      counterZero++;
      return false;
    }
    return true;
  });

  let arrs = Array(counterZero).fill(0);
  console.log(arrWIthoutNull);

  console.log(arrs);
  arrWIthoutNull.concat(arrs);
  console.log(arrWIthoutNull);

  return arrWIthoutNull;
};

let temp = [false, 1, 0, 1, 2, 0, 1, 3, "a"];
moveZeros(temp);
