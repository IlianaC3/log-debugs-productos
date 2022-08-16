const autocannon = require('autocannon');
const { PassThrough } = require('stream');

function runTest (url) {
    const buffer = [];
    const streamSalida = new PassThrough();

    let configuracion = autocannon({
        url,
        connections: 100,
        duration: 20
    })

    autocannon.track(configuracion, {streamSalida})

    streamSalida.on('data', data => buffer.push(data))
    configuracion.on('done', function () {
        process.stdout.write(Buffer.concat(buffer));
    })
}

console.log("Haciendo las pruebas de autocannon");

runTest('http://localhost:3000/random/info')
runTest('http://localhost:3000/random/api/randoms')