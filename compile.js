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










var OBJECTS = {}
var MACROS = []






function Parse(filePath,mainFile=false){
    let source = fs.readFileSync(filePath).toString()
    filePath=filePath.replace('./source/','').replace('.js','.asm')

    function r(regex,callback){
        source=source.replace(regex,callback)
    }



    source = ParseBlocks(source)

    
    //clean code
    source = source.replace(/\/\/[\s\S]+?$/gm,'')
    source = source.replace(/\/\*[\s\S]+?\*\//gm,'')


    r(/\'/gm,'"')









    var ClassINDEX = 0
    source = source.replace(/^class([\s\S]+?)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,match=>{
        var name = match.split(' ')[1].replace('{','').trim().split(':')[0]

        const fields=[]
        const funcs={}
        match=match.replace(/constructor\(\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,mmm=>{
            mmm=mmm.replace(/this\.(.*)/gm,m=>{
                m=m.replace('this.','')
                fields.push(m)
                return m
            })
            return mmm
        })
        match=match.replace(/[a-zA-Z0-9]+\(.*(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,mmm=>{
            var fname=mmm.split('(')[0].trim().substring(-5)
            var params=mmm.split('(')[1].split(')')[0].trim()
            var data=mmm.split('{')[1]
            data=data.substring(0,data.length-6)
            funcs[fname] = {data:data,params}
            return ''
        })

        OBJECTS[name]={name,fields:fields,funcs,params:[]}

        var functions = []
        for(const func of Object.keys(funcs)){
            var FUNC = funcs[func]
            var data = FUNC.data
            var params = FUNC.params
            params=params.length?(','+params):''
            data = data.replace(/this\.([a-zA-Z0-9\_]+)\(/gm,name+'_$1(self,')
            //console.log(data)
            ClassINDEX++
            functions.push('function '+name+'_'+func+'(this'+params+'):'+ClassINDEX+'{\n'+data+'\n:'+ClassINDEX+'}\n')
        }
        //console.log(functions)

        return `struct ${name}
            ${fields.join('\n')}
        ends
        ${functions.join('\n')}`
    })
    //fs.writeFileSync('./cache/objected.js',source)
    console.log('OBJECTS',OBJECTS)
    source = source.replace(/var [a-zA-Z0-9]+ = new [a-zA-Z0-9]+\(\)/gm,match=>{
        var params = match.split(' ')
        var OBJ=OBJECTS[params[4].replace('()','')]
        //console.log('params',params)
        OBJ.params.push(params[1])
        return `${params[1]} ${params[4].replace('()','')}`
    })
    for(const key of Object.keys(OBJECTS)){
        var OBJ = OBJECTS[key]
        for(const param of OBJ.params){
            //var FUNC = OBJ.funcs[func]
            source = source.replace(new RegExp(param+'\\.[a-zA-Z0-9\_]+\\(','gm'),match=>{
                var obj = match.split('.')[0]
                var func = match.split('.')[1].split('(')[0]
                return `${key}_${func}(${obj},`
            })
        }
    }
    r(/this/gm,'self')




    r(/\,\)/gm,')')


    r(/var (.*) = (.*\(.*)/gm,'$2\n$1 = rax')
    r(/return (.*)/gm,'mov rax, $1')














    r(/function(.*)(?<num>\:[0-9]+){([\s\S]+)(\k<num>)}/gm,match=>{
        var name = match.split('(')[0].replace('function','').trim()
        MACROS.push(name)
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

    r(/var (.*)/gm,'$1')

    for(let invoke of idata){
        r(new RegExp('('+invoke+')\\((.*)\\)','gm'),'invoke $1, $2')
    }

    for(let macro of MACROS){
        r(new RegExp('('+macro+')\\((.*)\\)','gm'),'$1 $2')
    }






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