//app:gl


function ProcInit(){
    printf('OK')
}

function ProcRender(){
    
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

}