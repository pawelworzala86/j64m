
class TestClass{
    constructor(){
        this.valA = 24.44
        this.valB = 'kuku'
    }
    print(){
        printf('%f',this.valA)
        return 45
    }
}



var resA = 0

function main(){

    var obj = new TestClass()

    printf('OK')
    resA = obj.print()
    printf(' %i',resA)
    printf(' %f',obj.valA)
}