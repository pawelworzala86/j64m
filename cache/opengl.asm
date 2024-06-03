
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\opengl.inc'
include 'build\gl46.inc'

section '.text' code readable executable



vertices dq 1.0,0.9,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0
vertices2 dq 1.0,1.0,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0
coords dq 1.0,1.0,1.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,1.0






proc ProcInit 
                invoke printf, "OK"
	

	lea rax, [VAO]
    invoke glGenVertexArrays, 1, rax
	invoke printf, "OK %i", [VAO]
    invoke glBindVertexArray, [VAO]

                    	lea rax, [bufferID]
	invoke glGenBuffers, 1, rax

	invoke glBindBuffer, GL_ARRAY_BUFFER, [bufferID]
    invoke glBufferData, GL_ARRAY_BUFFER, 18*8, vertices,GL_STATIC_DRAW

    invoke glEnableVertexAttribArray, 0
	invoke glVertexAttribPointer, 0,3,GL_DOUBLE,GL_FALSE, 3*8, 0
                    	lea rax, [bufferID]
	invoke glGenBuffers, 1, rax

	invoke glBindBuffer, GL_ARRAY_BUFFER, [bufferID]
    invoke glBufferData, GL_ARRAY_BUFFER, 12*8, coords,GL_STATIC_DRAW

    invoke glEnableVertexAttribArray, 1
	invoke glVertexAttribPointer, 1,2,GL_DOUBLE,GL_FALSE, 2*8, 0

    invoke glBindVertexArray, 0
            ret
            endp

proc ProcRender 
                
    invoke	glClear,GL_COLOR_BUFFER_BIT
	invoke	glBegin,GL_QUADS
	invoke	glColor3f,float dword 1.0,float dword 0.1,float dword 0.1
	invoke	glVertex3d,float -0.6,float -0.6,float 0.0
	invoke	glColor3f,float dword 0.1,float dword 0.1,float dword 0.1
	invoke	glVertex3d,float 0.6,float -0.6,float 0.0
	invoke	glColor3f,float dword 0.1,float dword 0.1,float dword 1.0
	invoke	glVertex3d,float 0.6,float 0.6,float 0.0
	invoke	glColor3f,float dword 1.0,float dword 0.1,float dword 1.0
	invoke	glVertex3d,float -0.6,float 0.6,float 0.0
	invoke	glEnd

	invoke glBindVertexArray, [VAO]
	invoke glDrawArrays, GL_TRIANGLES, 0, 6
            ret
            endp

  start:
	sub	rsp,8		; Make stack dqword aligned

	invoke	GetModuleHandle,0
	mov	[wc.hInstance],rax
	invoke	LoadIcon,0,IDI_APPLICATION
	mov	[wc.hIcon],rax
	invoke	LoadCursor,0,IDC_ARROW
	mov	[wc.hCursor],rax
	invoke	RegisterClass,wc
	invoke	CreateWindowEx,0,_class,_title,WS_VISIBLE+WS_OVERLAPPEDWINDOW+WS_CLIPCHILDREN+WS_CLIPSIBLINGS,16,16,432,432,NULL,NULL,[wc.hInstance],NULL

  msg_loop:
	invoke	GetMessage,addr msg,NULL,0,0
	cmp	eax,1
	jb	end_loop
	jne	msg_loop
	invoke	TranslateMessage,addr msg
	invoke	DispatchMessage,addr msg
	jmp	msg_loop

  end_loop:
	invoke	ExitProcess,[msg.wParam]

proc WindowProc uses rbx rsi rdi, hwnd,wmsg,wparam,lparam
	mov	[hwnd],rcx
	frame
	cmp	edx,WM_CREATE
	je	.wmcreate
	cmp	edx,WM_SIZE
	je	.wmsize
	cmp	edx,WM_PAINT
	je	.wmpaint
	cmp	edx,WM_KEYDOWN
	je	.wmkeydown
	cmp	edx,WM_DESTROY
	je	.wmdestroy
  .defwndproc:
	invoke	DefWindowProc,rcx,rdx,r8,r9
	jmp	.finish
  .wmcreate:
	invoke	GetDC,rcx
	mov	[hdc],rax
	lea	rdi,[pfd]
	mov	rcx,sizeof.PIXELFORMATDESCRIPTOR shr 3
	xor	eax,eax
	rep	stosq
	mov	[pfd.nSize],sizeof.PIXELFORMATDESCRIPTOR
	mov	[pfd.nVersion],1
	mov	[pfd.dwFlags],PFD_SUPPORT_OPENGL+PFD_DOUBLEBUFFER+PFD_DRAW_TO_WINDOW
	mov	[pfd.iLayerType],PFD_MAIN_PLANE
	mov	[pfd.iPixelType],PFD_TYPE_RGBA
	mov	[pfd.cColorBits],16
	mov	[pfd.cDepthBits],16
	mov	[pfd.cAccumBits],0
	mov	[pfd.cStencilBits],0
	invoke	ChoosePixelFormat,[hdc],addr pfd
	invoke	SetPixelFormat,[hdc],eax,addr pfd
	invoke	wglCreateContext,[hdc]
	mov	[hrc],rax
	invoke	wglMakeCurrent,[hdc],[hrc]
	invoke	GetClientRect,[hwnd],addr rc
	invoke	glViewport,0,0,[rc.right],[rc.bottom]
	call InitGL
	call ProcInit
	invoke	GetTickCount
	mov	[clock],eax
	xor	eax,eax
	jmp	.finish
  .wmsize:
	invoke	GetClientRect,[hwnd],addr rc
	invoke	glViewport,0,0,[rc.right],[rc.bottom]
	xor	eax,eax
	jmp	.finish
  .wmpaint:
	invoke	GetTickCount
	sub	eax,[clock]
	cmp	eax,10
	jb	.animation_ok
	add	[clock],eax
	;invoke	glRotatef,float [theta],float dword 0.0,float dword 0.0,float dword 1.0
      .animation_ok:

	invoke GetCursorPos, pos
    ;invoke printf, "%i %i %s", [pos.x], [pos.y], lf

	call ProcRender

	invoke	SwapBuffers,[hdc]
	xor	eax,eax
	jmp	.finish
  .wmkeydown:
	cmp	r8d,VK_ESCAPE
	jne	.defwndproc
  .wmdestroy:
	invoke	wglMakeCurrent,0,0
	invoke	wglDeleteContext,[hrc]
	invoke	ReleaseDC,[hwnd],[hdc]
	invoke	PostQuitMessage,0
	xor	eax,eax
  .finish:
	endf
	ret
endp

section '.data' data readable writeable

  _title db 'OpenGL example',0
  _class db 'FASMOPENGL32',0

  theta GLfloat 0.6

  wc WNDCLASS style:0, lpfnWndProc:WindowProc, lpszClassName:_class

  hdc dq ?
  hrc dq ?

  msg MSG
  rc RECT
  pfd PIXELFORMATDESCRIPTOR

  clock dd ?

  pos POINT

  lf db 13,10,0

	VAO dq ?
bufferID dq ?

	include 'build\gl46.d.inc'

section '.idata' import data readable writeable
    include 'include\idata.inc'
