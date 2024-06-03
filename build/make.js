const fs = require('fs')

var data = fs.readFileSync('./build/gl4.6.js').toString()
var idata = fs.readFileSync('./include/idata.inc').toString()

var lib = ''
var libd = ''

data.replace(/export type (.*) = (.*);/gm,match=>{
    console.log(match)
})

data.replace(/export const (.*) = (.*);/gm,match=>{
    var params = match.split('=')
    var name = params[0].replace('export const ','').trim()
    var value = params[1].trim().replace('0x','$')
    console.log(match)
    lib+='GL_'+name+' = '+value+'\n'
})

data.replace(/export function ([a-zA-Z0-9]+)/gm,match=>{
    var params = match.split('=')
    var name = params[0].replace('export function ','').trim()
    if(idata.indexOf('gl'+name)==-1){
    console.log(match)
    libd+='gl'+name+' dq ?\n'
    }
})

lib+='\n\nproc InitGL\n'
//wglGetProcAddress
data.replace(/export function ([a-zA-Z0-9]+)/gm,match=>{
    var params = match.split('=')
    var name = params[0].replace('export function ','').trim()
    console.log(match)
    if(idata.indexOf('gl'+name)==-1){
        lib+='invoke wglGetProcAddress, "gl'+name+'"\nmov [gl'+name+'],rax\n'
    }
})
lib+='\n\nret\nendp\n\n'

console.log(lib)

fs.writeFileSync('./build/gl46.inc', lib)
fs.writeFileSync('./build/gl46.d.inc', libd)