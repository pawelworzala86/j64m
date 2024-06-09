//app:gl

var vertices = [1.0,0.9,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0]
var vertices2 = [1.0,1.0,0.0,1.0,-1.0,0.0,-1.0,-1.0,0.0,1.0,1.0,0.0,-1.0,-1.0,0.0,-1.0,1.0,0.0]
var coords = [1.0,1.0,1.0,0.0,0.0,0.0,1.0,1.0,0.0,0.0,0.0,1.0]

var VAO = 0
var bufferID = 0

function CreateBuffer(posID,ssize,length,array){
	//lea rax, bufferID
	glGenBuffers(1, &bufferID)

	glBindBuffer(GL_ARRAY_BUFFER, bufferID)
    glBufferData(GL_ARRAY_BUFFER, length*8, array,GL_STATIC_DRAW)

    glEnableVertexAttribArray(posID)
	glVertexAttribPointer(posID,ssize,GL_DOUBLE,GL_FALSE, ssize*8, 0)
}

var handle = 0
var fsize = 0
var buffor = 0

var vertexShader = 0
var fragmentShader = 0

var programID = 0

function ProcInit(){
    printf('OK')


	handle = CreateFileA('default.vert', GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0);
    fsize = GetFileSize(handle, 0);
    buffor = malloc(fsize);
    ReadFile(handle, buffor, fsize, 0, 0);

	//printf('shader %s', buffor)

	vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader,1, &buffor, &fsize);
    glCompileShader(vertexShader);

	handle = CreateFileA('default.frag', GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0);
    fsize = GetFileSize(handle, 0);
    buffor = malloc(fsize);
    ReadFile(handle, buffor, fsize, 0, 0);

	fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader,1, &buffor, &fsize);
    glCompileShader(fragmentShader);

	programID = glCreateProgram();
    glAttachShader(programID, vertexShader);
    glAttachShader(programID, fragmentShader);
    glLinkProgram(programID);

	glUseProgram(programID);
    //gl.ValidateProgram,*programID

    glDetachShader(programID, vertexShader);
	glDetachShader(programID, fragmentShader);

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);


	//invoke glCreateShader, GL_FRAGMENT_SHADER

	//lea rax, VAO
    glGenVertexArrays(1, &VAO)
	printf('OK %i', VAO)
    glBindVertexArray(VAO)

    CreateBuffer(0,3,18,vertices)
    CreateBuffer(1,2,12,coords)

    glBindVertexArray(0)
}

function ProcRender(){
    
    /*invoke	glClear,GL_COLOR_BUFFER_BIT
	invoke	glBegin,GL_QUADS
	invoke	glColor3f,float dword 1.0,float dword 0.1,float dword 0.1
	invoke	glVertex3d,float -0.6,float -0.6,float 0.0
	invoke	glColor3f,float dword 0.1,float dword 0.1,float dword 0.1
	invoke	glVertex3d,float 0.6,float -0.6,float 0.0
	invoke	glColor3f,float dword 0.1,float dword 0.1,float dword 1.0
	invoke	glVertex3d,float 0.6,float 0.6,float 0.0
	invoke	glColor3f,float dword 1.0,float dword 0.1,float dword 1.0
	invoke	glVertex3d,float -0.6,float 0.6,float 0.0
	invoke	glEnd*/

	glBindVertexArray([VAO])
	glDrawArrays(GL_TRIANGLES, 0, 6)
}