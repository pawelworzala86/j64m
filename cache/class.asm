
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable


struct TestClass
mov rax,24.44
mov             valA,rax
mov rax,"kuku"
mov valB,rax
        ends
        




obj TestClass

macro main 
                    invoke printf, "OK"
                    
        invoke printf, "%f",obj.valA1
        mov rax, 45
    
mov rax,rax
mov resA,rax
    invoke printf, " %i",resA
                end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    


section '.idata' import data readable writeable
    include 'include\\idata.inc'
