
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\opengl.inc'

section '.text' code readable executable





; Funkcja strlen
strlength:
    xor rax, rax        ; Zerowanie licznika
.loop:
    cmp byte [rdi], 0   ; Sprawdzenie, czy to koniec łańcucha
    je .done            ; Jeśli tak, zakończ
    inc rax             ; Zwiększ licznik
    inc rdi             ; Przejdź do następnego znaku
    jmp .loop
.done:
    ret

macro StringLength atext
    mov rdi, my_string
    call strlength
end macro



  start:
	sub	rsp,8		; Make stack dqword aligned


	; Wywołanie funkcji strlen
    StringLength my_string
    ;call strlength

    invoke printf, '%i', rax





	invoke	ExitProcess,0

section '.data' data readable writeable

  my_string db "Hello, World!",0

section '.idata' import data readable writeable
    include 'include\idata.inc'
