
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\opengl.inc'

section '.text' code readable executable

macro TestA
    if var1<var2
        invoke	printf, "ok"
    end if
end macro

  start:
	sub	rsp,8		; Make stack dqword aligned

	invoke	printf, "ok"

    TestA

	invoke	ExitProcess,0

section '.data' data readable writeable

  _title db 'OpenGL example',0
  _class db 'FASMOPENGL32',0

  var1 dq 10.0
  var2 dq 15.0

section '.idata' import data readable writeable
    include 'include\idata.inc'
