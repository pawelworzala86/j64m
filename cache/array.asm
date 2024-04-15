
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable





macro main 
                                    invoke malloc, 8*8
mov rax,rax
mov     [array],rax

mov rax,123
mov     [array + 0],rax

    invoke printf, "%i",[array + 0]
                end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    array dq 0


section '.idata' import data readable writeable
    include 'include\\idata.inc'
