
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
        CreateFileA(fileName, GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0)
        mov handle, rax
        GetFileSize(handle, 0)
        mov fsize, rax
        //printf('fsize %i',fsize)
        malloc(fsize)
        mov buffor, rax
        ReadFile(handle, buffor, fsize, 0, 0)
        printf('%s',buffor)
        CloseHandle(handle)
    }
}

var fs = new FS()

function main(){
    fs.ReadFileData('default.frag')
    fs.ReadFileData('default.vert')
}