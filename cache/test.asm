
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable




macro main 
                
    invoke printf, "OK %f",prop1
            end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    prop1 = 23.99
prop2 = "END"
prop3 = 2.23


section '.idata' import data readable writeable
    include 'include\\idata.inc'
