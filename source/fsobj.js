
var handle = 0
var fsize = 0
var buffor = 0

class FS{
    constructor(){
        this.handle = 0
        this.fsize = 0
        this.buffor = 0
    }
    ReadFileData(fileName){
        this.handle = CreateFileA(fileName, GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0)
        //mov this.handle, rax
        this.fsize = GetFileSize(this.handle, 0)
        //mov this.fsize, rax
        //printf('fsize %i',fsize)
        malloc(this.fsize)
        mov buffor, rax
        ReadFile(this.handle, buffor, this.fsize, 0, 0)
        printf('%s',buffor)
        CloseHandle(this.handle)
    }
}

var fs = new FS()

function main(){
    fs.ReadFileData('default.frag')
    fs.ReadFileData('default.vert')
}