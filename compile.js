const fs = require('fs')

let idataFile = fs.readFileSync('./include/idata.inc').toString()
let idata = []
idataFile.replace(/([a-zA-Z0-9\_]+)\,/gm,match=>{
    idata.push(match.replace(',',''))
})
//console.log(idata)


function ParseBlocks(ROOTSource){

    //this.ROOT.source = ''
    var iteration = 1
    var source = ''

    for(let i=0;i<ROOTSource.length;i++){

        var char = ROOTSource[i]

        if(char=='{'){
            source+=':'+iteration+'{'
            iteration++
        }else if(char=='}'){
            iteration--
            source+=':'+(iteration)+'}'
        }else{
            source+=char
        }

    }

    let uniuque = 1024
    let index = 1
    while(1024 > index){
        tmp = ' '+source
        while(tmp != source){
            tmp = source
            source = source
                .replace(':'+index+'{',':'+uniuque+'{')
                .replace(':'+index+'}',':'+uniuque+'}')
            if((tmp != source)){
                uniuque++
            }
        }
        index++
    }

    return source

}


function Parse(filePath,mainFile=false){
    let source = fs.readFileSync(filePath).toString()
    filePath=filePath.replace('./source/','').replace('.js','.asm')

    function r(regex,callback){
        source=source.replace(regex,callback)
    }



    source = ParseBlocks(source)


    for(let invoke of idata){
        r(new RegExp('('+invoke+')\\((.*)\\)','gm'),'invoke $1, $2')
    }

    r(/\'/gm,'"')

    r(/function(.*)(?<num>\:[0-9]+){([\s\S]+)(\k<num>)}/gm,match=>{
        var name = match.split('(')[0].replace('function','').trim()
        var params = match.split('(')[1].split(')')[0].trim()
        var body = match.split('\n')
        body.splice(0,1)
        body.splice(body.length-1,1)
        body = body.join('\n')
        console.log(name,params,body)
        return `macro ${name} ${params}
        ${body}
        end macro`
    })


    if(mainFile){
        source=`
; OpenGL programming example

include 'win64a.inc'

format PE64 CONSOLE 5.0
entry start

include 'include\\opengl.inc'

;section '.text' code readable executable

${source}

    start:
    sub	rsp,8		; Make stack dqword aligned

    main

    invoke	ExitProcess,0

;section '.data' data readable writeable

section '.idata' import data readable writeable
    include 'include\\idata.inc'
`
    }


    fs.writeFileSync('./cache/'+filePath,source)
}

const entry = process.argv[2]
Parse('./source/'+entry+'.js',true)