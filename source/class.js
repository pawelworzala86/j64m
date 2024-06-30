
class TestClass{
    constructor(){
        this.valA = 24.44
        this.valB = 'kuku'
    }
    print(){
        this.valB = new TTClass()
        printf('aa %f',this.valA)
        //this.valB.valA = 66.666
        this.valB.print(66.666)
        //printf('aa %f',this.valB.valA)
        return 45
    }
}

class TTClass{
    constructor(){
        this.valA = 4.33
        this.valB = 'kuku'
    }
    print(valA){
        printf('%f',valA)
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