




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



