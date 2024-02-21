
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

function main(){
    printf('OK')
    var resA = obj.print()
    printf(' %i',resA)
}