
handle dq 0
fsize dq 0
buffor dq 0

function ReadFileData(fileName){
    CreateFileA(fileName, GENERIC_READ,0,0,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL, 0)
    mov [handle], rax
    GetFileSize([handle], 0)
    mov [fsize], rax
    //printf('fsize %i',fsize)
    malloc([fsize])
    mov [buffor], rax
    //;mov rbx, rax
    ReadFile([handle], [buffor], 11, 0, 0)
    printf('%s',[buffor])
    CloseHandle([handle])
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