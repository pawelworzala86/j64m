
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\opengl.inc'


section '.data' data readable writeable

  _title db 'OpenGL example',0
  _class db 'FASMOPENGL32',0

  var1 = 10

  
section '.text' code readable executable



  start:
	sub	rsp,8		; Make stack dqword aligned

	invoke	printf, "ok"

  
  while var1>0
    var1 = var1 - 1
    invoke	printf, "ok"
  end while

	invoke	ExitProcess,0



section '.idata' import data readable writeable
    include 'include\idata.inc'
