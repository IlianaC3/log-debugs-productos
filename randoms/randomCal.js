const randomCalc = (random) => {
    let sum = 0;
    for (let index = 0; index < random; index++) {
        // console.log(sum)
        sum += Math.floor(Math.random() * (1000 - 1) + 1);
    }
    return sum
}

module.exports = { randomCalc };