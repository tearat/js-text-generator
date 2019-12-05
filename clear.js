const fs = require('fs')

var data = fs.readFileSync('./data.txt', 'utf8')

var array = data.split('\n')

console.log('initial data')
console.log('Array: ' + array.length)

for( i=array.length-1; i>=0; i-- ) {
    let line = array[i].trim()
    if( line == ':' ) {
        array.splice(i, 1)
    }
    if( line == '' ) {
        array.splice(i, 1)
    }
}

console.log('completed')
console.log('Array: ' + array.length)

fs.writeFileSync('./data_clear.txt', array.join('\n'))
