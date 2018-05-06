const fs = require( 'fs' )
const express = require( 'express' )
const http = require( 'http' )
const Gpio = require( 'onoff' ).Gpio
const lampada = new Gpio( 17, 'high' )
const path = require( 'path' )

const app = express()
const server = http.createServer( app )
const io = require( 'socket.io' )( server )
let status = true;

io.on( 'connection', ( socket ) => {
  socket.on( 'lampada', () => {
    status = !status
    lampada.writeSync( 0 )
    // lampada.writeSync( status ? 1 : 0 )
  } )
} )

app.use( '/js', express.static( `${ __dirname }/node_modules/vue/dist` ) )
app.use( '/js', express.static( `${ __dirname }/node_modules/bootstrap/dist/js` ) )
app.use( '/js', express.static( `${ __dirname }/node_modules/jquery/dist` ) )

app.use( '/css', express.static( `${ __dirname }/node_modules/bootstrap/dist/css` ) )

app.use( '/css', express.static( `${ __dirname }/node_modules/open-iconic/font/css` ) )
app.use( '/fonts', express.static( `${ __dirname }/node_modules/open-iconic/font/fonts` ) )

app.use( express.static( `${ __dirname }/static` ) )

server.listen( 8080, () => console.log( 'Executantdo na porta *:8080' ) )

process.on( 'SIGINT', () => {
  lampada.unexport()

  process.exit( 0 )
} )
