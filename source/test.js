import 'math.js'

var prop1 = 23.99
var prop2 = 'END'
var prop3 = 2.23

function testF(){
    if(1<2){
        printf('end')
    }
}


function main(){
    printf('OK %f',prop1)
    testF()
    testF()
    prop3 = prop3 * prop1
    printf('OK %f',prop3)
}