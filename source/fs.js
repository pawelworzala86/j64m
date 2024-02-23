var handle = 0
var fsize = 0
var buffor = 0
function ReadFileData(fileName){
    handle = CreateFileA(fileName, GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0)
    fsize = GetFileSize(handle, 0)
    //printf('fsize %i',fsize)
    buffor = malloc(fsize)
    //;mov rbx, rax
    ReadFile(handle, buffor, 11, 0, 0)
    printf('%s',buffor)
    CloseHandle(handle)
    /*handle = fopen(fileName, 'rb')
    printf('handle %i',handle)
    fseek(handle, 0, 2)//SEEK_END
    printf('fsize %i',0)
    fsize = ftell(handle)
    printf('fsize %i',fsize)
    fseek(handle, 0, 0)//SEEK_SET
    printf('fsize %i',fsize)
    //fread(buffer, 1, filesize, fptr)
    //fclose(fptr)*/
}
function main(){
    ReadFileData('test.txt')
    //printf('%s',[buffor])
}