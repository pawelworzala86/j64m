
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

;section '.text' code readable executable


struct TestClass
            valA = 24.44
valB = "kuku"
        ends
        macro TestClass_constructor self
        
        valA = 24.44
        valB = "kuku"
    
        end macro

macro TestClass_print self
        
        invoke printf, "%f",self.valA
        mov rax, 45
    
        end macro


obj TestClass

macro main 
            invoke printf, "OK"
    TestClass_print obj
resA = rax
    invoke printf, " %i",resA
        end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

;section '.data' data readable writeable

section '.idata' import data readable writeable
    include 'include\\idata.inc'
