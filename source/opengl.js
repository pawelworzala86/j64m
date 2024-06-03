//app:gl

vertices dq 1.0,1.0,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0
vertices2 dq 1.0,1.0,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0
coords dq 1.0,1.0,1.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,1.0

var VAO = ?

function ProcInit(){
    printf('OK')
	//invoke glCreateShader, GL_FRAGMENT_SHADER


    //invoke glGenVertexArrays, 1, [VAO]
	//printf('OK %i', [VAO])
    //invoke glBindVertexArray, [VAO]

    //this->CreateBuffer(0,3,18,vertices);
    //this->CreateBuffer(1,2,12,coords);

    invoke glBindVertexArray, 0

/*
void CMesh::CreateBuffer(int posID,int size,int length,void* array){

    glGenBuffers(1,&this->bufferID);
    glBindBuffer(GL_ARRAY_BUFFER, this->bufferID);
    glBufferData(GL_ARRAY_BUFFER, length*8, array,GL_STATIC_DRAW);

    glEnableVertexAttribArray(posID);
    glVertexAttribPointer(posID,size,GL_DOUBLE,GL_FALSE, size*8, 0);

};
	*/
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

	//glBindVertexArray(this->VAO);
	//glDrawArrays(GL_TRIANGLES, 0, 6);

}