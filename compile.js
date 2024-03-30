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





var FRM = 'cmd'




var OBJECTS = {}
var MACROS = []
var DATA = []





function Parse(filePath,mainFile=false){
    let source = fs.readFileSync(filePath).toString()
    filePath=filePath.replace('./source/','').replace('.js','.asm')

    function r(regex,callback){
        source=source.replace(regex,callback)
    }



    source = ParseBlocks(source)

    source = source.replace(/\/\/app:gl/gm,match=>{
        FRM = 'opengl'
        return ''
    })

    //clean code
    r(/\/\*[\s\S]+?\*\//gm,'')
    r(/\/\/[\s\S]+?$/gm,'')


    r(/\'/gm,'"')




    r(/if\((.*)\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}else(?<num2>\:[0-9]+)\{([\s\S]+?)(\k<num2>)\}/gm,
        'if $1\n$3\nelse if\n$6\nend if')
    r(/if\((.*)\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,
        'if $1\n$3\nend if')
    r(/while\((.*)\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,
        'while $1\n$3\nend while')

    r(/(.*)\-\-/gm,'$1 = $1 - 1')
    r(/(.*)\+\+/gm,'$1 = $1 + 1')




    var ClassINDEX = 0
    r(/^class([\s\S]+?)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,match=>{
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

            ClassINDEX++
            functions.push('function '+name+'_'+func+'(this'+params+'):'+ClassINDEX+'{\n'+data+'\n:'+ClassINDEX+'}\n')
        }

        return `struct ${name}
            ${fields.join('\n')}
        ends
        ${functions.join('\n')}`
    })
    console.log('OBJECTS',OBJECTS)
    source = source.replace(/var [a-zA-Z0-9]+ = new [a-zA-Z0-9]+\(\)/gm,match=>{
        var params = match.split(' ')
        var OBJ=OBJECTS[params[4].replace('()','')]
        OBJ.params.push(params[1])
        return `${params[1]} ${params[4].replace('()','')}`
    })
    for(const key of Object.keys(OBJECTS)){
        var OBJ = OBJECTS[key]
        for(const param of OBJ.params){
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
    r(/(.*) = (.*\(.*)/gm,'$2\n$1 = rax')
    r(/return (.*)/gm,'mov rax, $1')

    r(/^(.*) (dq|dd,db|rq) (.*)$/gm,match=>{
        DATA.push(match)
        return ''
    })












    r(/function(.*)(?<num>\:[0-9]+){([\s\S]+)(\k<num>)}/gm,match=>{
        var name = match.split('(')[0].replace('function','').trim()
        MACROS.push(name)
        var params = match.split('(')[1].split(')')[0].trim()
        var body = match.split('\n')
        body.splice(0,1)
        body.splice(body.length-1,1)
        body = body.join('\n')
        console.log(name,params,body)
        if(name.indexOf('Proc')>-1){
            return `proc ${name} ${params}
            ${body}
            ret
            endp`
        }else{
            return `macro ${name} ${params}
            ${body}
            end macro`
        }
    })

    r(/var (.*)/gm,match=>{
        var name = match.split('=')[0].replace('var ','').trim()
        var value = match.split('=')[1].trim()
        DATA.push(name+' = '+value)
        return ''
    })

    for(let invoke of idata){
        r(new RegExp('('+invoke+')\\((.*)\\)','gm'),'invoke $1, $2')
    }

    for(let macro of MACROS){
        r(new RegExp('('+macro+')\\((.*)\\)','gm'),'$1 $2')
    }



    


    if(mainFile){
        let frame = fs.readFileSync('./frames/'+FRM+'.asm').toString()
        source = frame.replace(/{{SOURCE}}/gm,source)
        source = source.replace(/{{DATA}}/gm,DATA.join('\n'))
    }


    fs.writeFileSync('./cache/'+filePath,source)
}

const entry = process.argv[2]
Parse('./source/'+entry+'.js',true)