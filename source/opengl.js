//app:gl

var vertices = [1.0,0.9,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0]
var vertices2 = [1.0,1.0,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0]
var coords = [1.0,1.0,1.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,1.0]

var VAO = 0
var bufferID = 0

function CreateBuffer(posID,ssize,length,array){
	//lea rax, bufferID
	glGenBuffers(1, &bufferID)

	invoke glBindBuffer, GL_ARRAY_BUFFER, bufferID
    invoke glBufferData, GL_ARRAY_BUFFER, length*8, array,GL_STATIC_DRAW

    invoke glEnableVertexAttribArray, posID
	invoke glVertexAttribPointer, posID,ssize,GL_DOUBLE,GL_FALSE, ssize*8, 0
}

function ProcInit(){
    printf('OK')
	//invoke glCreateShader, GL_FRAGMENT_SHADER

	//lea rax, VAO
    glGenVertexArrays(1, &VAO)
	printf('OK %i', VAO)
    invoke glBindVertexArray, VAO

    CreateBuffer(0,3,18,vertices)
    CreateBuffer(1,2,12,coords)

    invoke glBindVertexArray, 0
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

	invoke glBindVertexArray, [VAO]
	invoke glDrawArrays, GL_TRIANGLES, 0, 6
}