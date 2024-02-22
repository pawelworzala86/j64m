
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable

prop1 = 23.99
prop2 = "END"
prop3 = 2.23
macro main 
            invoke printf, "OK %f %s",prop1*prop3,prop2
    if 1<2

        invoke printf, "OK"
    
else if

        invoke printf, "OK"
    
end if
    testA = 10
    while testA>0

        testA =         testA - 1
        invoke printf, "OK"
    
end while
        end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    


section '.idata' import data readable writeable
    include 'include\\idata.inc'
