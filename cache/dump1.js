
struct TestClass
            valA dq 24.44
valB dq "kuku"
        ends
        function TestClass_constructor(self):1{

        valA dq 24.44
        valB dq "kuku"
    
:1}

function TestClass_print(self):2{

invoke malloc, 16
mov [qword[self+8]],rax
mov rax,4.33
mov qword[qword[self+8]+0],rax
mov rax,"kuku"
mov qword[qword[self+8]+8],rax


        printf("aa %f",qword[self+0])
        TTClass_print(qword[self+8])
        
        return 45
    
:2}


struct TTClass
            valA dq 4.33
valB dq "kuku"
        ends
        function TTClass_constructor(self):3{

        valA dq 4.33
        valB dq "kuku"
    
:3}

function TTClass_print(self):4{

        printf("%f",qword[self+0])
        return 45
    
:4}




var resA = 0

function main():1026{

    invoke malloc, 16
mov [obj],rax
mov rax,24.44
mov qword[obj+0],rax
mov rax,"kuku"
mov qword[obj+8],rax



    printf("OK")
    resA = TestClass_print(obj)
    printf(" %i",resA)
    printf(" %f",qword[obj+0])
:1026}