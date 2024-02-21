
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

;section '.text' code readable executable

{{SOURCE}}

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

;section '.data' data readable writeable

section '.idata' import data readable writeable
    include 'include\\idata.inc'
