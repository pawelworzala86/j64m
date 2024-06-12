
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable


struct TestClass
            valA dq 24.44
valB dq "kuku"
        ends
        




struct TTClass
            valA dq 4.33
valB dq "kuku"
        ends
        










    start:
    sub	rsp,8		; Make stack dqword aligned

     
                
    invoke malloc, 16
mov [obj],rax
mov rax,24.44
mov qword[obj+0],rax
mov rax,"kuku"
mov qword[obj+8],rax



    invoke printf, "OK"
                
invoke malloc, 16
mov qword[obj++8],rax
mov rax,4.33
mov rdx,qword[obj+8]
mov qword[rdx+0],rax
mov rax,"kuku"
mov rdx,qword[obj+8]
mov qword[rdx+8],rax


        invoke printf, "aa %f",qword[obj+0]
                        
mov rdx,qword[obj+8]
        invoke printf, "%f",qword[rdx+0]
        mov rax, 45
    
        mov rax, 45
    
mov rax,rax
mov     [resA],rax
    invoke printf, " %i",[resA]
    invoke printf, " %f",qword[obj+0]
                

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    obj dq ?
resA dq 0



section '.idata' import data readable writeable
    include 'include\\idata.inc'
