
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable

include "math.asm"








macro main 
                    
    invoke printf, "OK %f",[prop1]
                        mov rax, 1
mov rbx, 2
cmp rax, rbx
jl.if22
jmp.endif22
.if2:

        invoke printf, "end"
    
.endif2:
                        mov rax, 1
mov rbx, 2
cmp rax, rbx
jl.if23
jmp.endif23
.if2:

        invoke printf, "end"
    
.endif2:
                    fld [prop3]
    fmul [prop1]
    fstp [mth1]
mov rax,[mth1]
mov     [prop3],rax
    invoke printf, "OK %f",[prop3]
                end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    mth1 dq 0
prop1 dq 23.99
prop2 dq "END"
prop3 dq 2.23


section '.idata' import data readable writeable
    include 'include\\idata.inc'
