import 'math.js'

var prop1 = 23.99
var prop2 = 'END'
var prop3 = 2.23

function testF(){
    if(1<2){
        printf('end')
    }
}

function testRET(inP){
    return prop1
}

var aF = 9.9

function main(){
    aF = testRET()
    printf('OK %f',testRET(4.44))
    testF()
    testF()
    prop3 = prop3 * prop1
    printf('OK %f',prop3)
}