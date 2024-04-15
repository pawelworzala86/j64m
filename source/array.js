function Array(array,size){
    array = malloc(size*8)
}

var arrayA = 0
var arrayB = 0

function main(){
    Array(arrayA,8)
    Array(arrayB,8)

    arrayA[0] = 123
    arrayB[0] = 12
    arrayA[1] = 123

    printf('%i',arrayB[0])
}