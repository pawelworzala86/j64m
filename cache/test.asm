
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable








macro main 
                    
    invoke printf, "OK %f",[prop1]
                        mov rax, 1
mov rbx, 2
cmp rax, rbx
jl .if21
jmp .endif21
.if21:

        invoke printf, "end"
    
.endif21:
                        mov rax, 1
mov rbx, 2
cmp rax, rbx
jl .if22
jmp .endif22
.if22:

        invoke printf, "end"
    
.endif22:
Macro_Math_pomnoz([prop3],[prop1],mth1)
    [prop3] = mth1
                end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    prop1 dq 23.99
prop2 dq "END"
prop3 dq 2.23


section '.idata' import data readable writeable
    include 'include\\idata.inc'
