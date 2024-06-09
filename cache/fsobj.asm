
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

section '.text' code readable executable






struct FS
            handle dq 0
fsize dq 0
buffor dq 0
        ends
        




fs FS

macro main 
                                    
        invoke CreateFileA, "default.frag", GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0
        mov [handle], rax
        invoke GetFileSize, [handle], 0
        mov [fsize], rax
        
        invoke malloc, [fsize]
        mov [buffor], rax
        invoke ReadFile, [handle], [buffor], [fsize], 0, 0
        invoke printf, "%s",[buffor]
        invoke CloseHandle, [handle]
    
                    
        invoke CreateFileA, "default.vert", GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0
        mov [handle], rax
        invoke GetFileSize, [handle], 0
        mov [fsize], rax
        
        invoke malloc, [fsize]
        mov [buffor], rax
        invoke ReadFile, [handle], [buffor], [fsize], 0, 0
        invoke printf, "%s",[buffor]
        invoke CloseHandle, [handle]
    
                end macro

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    handle dq 0
fsize dq 0
buffor dq 0



section '.idata' import data readable writeable
    include 'include\\idata.inc'
