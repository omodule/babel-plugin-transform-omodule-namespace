import onode from './src/onode'

console.log('omodule scope detail ')
console.log('--------------------------- ')
console.log(JSON.stringify(onode, null, 2))
document.getElementById('onodes').innerText = JSON.stringify(onode, null, 2)
