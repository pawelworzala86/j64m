
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

var obj = new TestClass()

var resA = 0

function main(){
    printf('OK')
    resA = obj.print()
    printf(' %i',resA)
}