function Array(arrayA,size){
    arrayA = malloc(size*8)
}

var array = 0

function main(){
    Array(array,8)

    array[0] = 123

    printf('%i',array[0])
}