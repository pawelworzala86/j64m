
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
        







invoke malloc, 24
mov [fs],rax
mov rax,0
mov qword[fs+0],rax
mov rax,0
mov qword[fs+8],rax
mov rax,0
mov qword[fs+16],rax





    start:
    sub	rsp,8		; Make stack dqword aligned

     
                                    
invoke CreateFileA, "default.frag", GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0
mov rax,rax
mov         qword[fs+0],rax
        
invoke GetFileSize, qword[fs+0], 0
mov rax,rax
mov         qword[fs+8],rax
        
        
invoke malloc, qword[fs+8]
mov rax,rax
mov         qword[fs+16],rax
        
        invoke ReadFile, qword[fs+0], qword[fs+16], qword[fs+8], 0, 0
        invoke printf, "%s",qword[fs+16]
        invoke CloseHandle, qword[fs+0]
    
                    
invoke CreateFileA, "default.vert", GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0
mov rax,rax
mov         qword[fs+0],rax
        
invoke GetFileSize, qword[fs+0], 0
mov rax,rax
mov         qword[fs+8],rax
        
        
invoke malloc, qword[fs+8]
mov rax,rax
mov         qword[fs+16],rax
        
        invoke ReadFile, qword[fs+0], qword[fs+16], qword[fs+8], 0, 0
        invoke printf, "%s",qword[fs+16]
        invoke CloseHandle, qword[fs+0]
    
                

    invoke	ExitProcess,0

section '.data' data readable writeable
    lf db 13,10,0

    fs dq ?



section '.idata' import data readable writeable
    include 'include\\idata.inc'
