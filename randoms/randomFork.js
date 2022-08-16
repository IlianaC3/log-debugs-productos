const randomCalc  = require('./randomCal');

process.on('message', (random) => {
    // console.log(random)
    if (random > 0) {
        const result = randomCalc.randomCalc(random);
        // console.log(result);
        process.send(result)
    }
}) 