
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable






macro main 
                                    invoke malloc, 8*8
mov rax,rax
mov     [arrayA],rax

                    invoke malloc, 8*8
mov rax,rax
mov     [arrayB],rax


mov rax,123
lea rbx,[arrayA]
mov     [rbx + 0],rax
mov rax,12
lea rbx,[arrayB]
mov     [rbx + 0],rax
mov rax,123
lea rbx,[arrayA]
mov     [rbx + 8],rax

    invoke printf, "%i",[arrayB + 0]
                end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    arrayA rq 6400
arrayB rq 6400


section '.idata' import data readable writeable
    include 'include\\idata.inc'
