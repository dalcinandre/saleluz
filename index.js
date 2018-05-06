const fs = require( 'fs' )
const express = require( 'express' )
const http = require( 'http' )
const Gpio = require( 'onoff' ).Gpio
const lampada = new Gpio( 17, 'high' )
const path = require( 'path' )

const app = express()
const server = http.createServer( app )
const io = require( 'socket.io' )( server )

io.on( 'connection', ( socket ) => {
  socket.on( 'lampada', ( data ) => {
    lampada.writeSync( data ? 1 : 0 )
    socket.emit( 'status', !data )
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
