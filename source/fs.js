
var handle = 0
var fsize = 0
var buffor = 0

function ReadFileData(fileName){
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
function main(){
    ReadFileData('default.frag')
    ReadFileData('default.vert')
}