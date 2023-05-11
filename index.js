// require your server and launch it
const server = require('./api/server')

const PORT = 3000

// server.get('*', (req, res) => {
//     res.send('<h1>Hello</h1>');
// })

server.listen(PORT, () => {
    console.log('Hello from port:', PORT);
})