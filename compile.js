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
var DATA2 = []

var MACRO = {}


var funcIDX = 1


var REGISTERS = ['rax','rbx','rcx','rdx']



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




    source = source.replace(/import(.*)/gm,match=>{
        //match=match.replace(/\"/gm,'')
        /*if(match.indexOf('.inc')>-1){
            match=match.replace('import','include')
        }
        if(match.indexOf('.lib')>-1){
            match=match.replace('import','includelib')
        }
        if(match.indexOf('.js')>-1){*/
            const name=match.replace('import ','')
            //const data = fs.readFileSync('./source/'+name).toString()
            //return parseSource(data)
            var parts = name.split('/')
            console.log('parts',parts)
            if(parts.length>1){
                try{
                fs.mkdirSync('./cache/'+parts[0])
                }catch(e){}
            }
            console.log('NNMAME',name)
            Parse('./source/'+name.replace(/\"/gm,''))
            match=match.replace('.js','.asm')
        //}
        match=match.replace('import','include').replace(/\//gm,'\\')
        return match
    })

    var lines = source.split('\n')
    lines=lines.map(line=>{
        var prefix=''
        var index = 0
        line=line.replace(/\&([a-zA-Z0-9\_]+)/gm,match=>{
            prefix+='lea '+REGISTERS[index]+', '+match.replace('&','')+'\n'
            index++
            return REGISTERS[index-1]
        })
        return prefix+line
    })
    source = lines.join('\n')



    //function inner replacements
    var whileIndex = 0
    var _IFidx = 0
    var blockIndex = 6675
    source = source.replace(/function(.*)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,match=>{

        var LOCAL = ''

        //FOR
        match = match.replace(/\bfor([\s\S]+?)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,match=>{
            var head=match.split('(')[1].split(')')[0].trim().split(';')
            var body=match.split('{')[1]
            body=body.substring(0,body.length-6)
            blockIndex++
            return `${head[0]}
            while(${head[1]}):${blockIndex}{
                ${head[2]}
                ${body}
            :${blockIndex}}`
        })

        //while
        match = match.replace(/while([\s\S]+?)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,match=>{
            var head=match.split('(')[1].split(')')[0].trim()
            var body2=match.split('{')[1]
            body2=body2.substring(0,body2.length-6)
            //console.log('WHILE',head,body2)
            whileIndex++
            LOCAL+=`LOCAL while${whileIndex}\n`
            blockIndex++
            return `.while${whileIndex}:
            ${body2}
            if(${head}):${blockIndex}{
                jmp .while${whileIndex}
            :${blockIndex}}`
        })

        //if
        var __IF=(oper,var1,var2)=>{
            var regexpr=new RegExp('if\\(([\\w]+)['+oper+']+([\\w]+)\\)(?<num>\\:[0-9]+)\\{([\\s\\S]+?)(\\k<num>)\\}else(?<num2>\\:[0-9]+)\\{([\\s\\S]+?)(\\k<num2>)\\}','gm')
            match=match.replace( regexpr, mmm=>{
                var head = mmm.split('(')[1].split(')')[0]
                var left = head.split(oper.replace(/\\/gm,''))[0]
                var right = head.split(oper.replace(/\\/gm,''))[1]
                var body1 = mmm.split('{')[1].split('}')[0]
                body1=body1.substring(0,body1.length-5)
                var body2 = mmm.split('{')[2].split('}')[0]
                body2=body2.substring(0,body2.length-5)
                _IFidx++
                LOCAL+=`LOCAL if${_IFidx}\n`
                LOCAL+=`LOCAL else${_IFidx}\n`
                LOCAL+=`LOCAL endif${_IFidx}\n`
                LOCAL+=`LOCAL else${_IFidx}\n`
                return 'mov rax, '+left+'\nmov rbx, '+right+'\ncmp rax, rbx\n'+var1+' if'+_IFidx
                +'\n'+var2+' .else'+_IFidx+'\njmp .endif'+_IFidx+'\n.if'
                +_IFidx+':\n'+body1+'jmp .endif'+_IFidx+'\n.else'+_IFidx+':\n'+body2+'\n.endif'+_IFidx+':'
            })
            var regexpr=new RegExp('if\\(([\\w]+)'+oper+'([\\w]+)\\)(?<num>\\:[0-9]+)\\{([\\s\\S]+?)(\\k<num>)\\}','gm')
            match=match.replace( regexpr, mmm=>{
                _IFidx++
                var head = mmm.split('(')[1].split(')')[0]
                var left = head.split(oper.replace(/\\/gm,''))[0]
                var right = head.split(oper.replace(/\\/gm,''))[1]
                var body = mmm.split('{')[1].split('}')[0]
                body=body.substring(0,body.length-5)
                _IFidx++
                LOCAL+=`LOCAL if${_IFidx}\n`
                LOCAL+=`LOCAL endif${_IFidx}\n`
                return 'mov rax, '+left+'\nmov rbx, '+right+'\ncmp rax, rbx\n'+var1
                +' .if'+_IFidx+'\njmp .endif'+_IFidx+'\n.if'
                +_IFidx+':\n'+body+'\n.endif'+_IFidx+':'
            })
        }
        __IF('\\=\\=\\=','je','jne')
        __IF('\\=\\=','je','jne')
        __IF('\\<','jl','jnl')
        __IF('\\!\\=','jne','je')
        __IF('\\>','jg','jng')

        //var
        /*match=match.replace( /var (.*)/gm, mmm=>{
            var name = mmm.split('=')[0].replace('var','').trim()
            var value = mmm.split('=')[1].trim()
            var type = 'QWORD'
            if((value.indexOf('\'')>-1)||(value.indexOf('"')>-1)){
                type = 'db'
                value += ',0'
            }
            LOCAL+='LOCAL '+name+':'+type+'\n'
            return 'mov '+name+', '+value
        })*/


        var first = match.split('{')[0]
        var rest = match.split('{')
        rest[0]=first
        //rest[1]='\n'+LOCAL+'\n'+rest[1]

        return rest.join('{')

    })




    /*r(/if\((.*)\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}else(?<num2>\:[0-9]+)\{([\s\S]+?)(\k<num2>)\}/gm,
        'if $1\n$3\nelse if\n$6\nend if')
    r(/if\((.*)\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,
        'if $1\n$3\nend if')
    r(/while\((.*)\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,
        'while $1\n$3\nend while')*/

    r(/(.*)\-\-/gm,'$1 = $1 - 1')
    r(/(.*)\+\+/gm,'$1 = $1 + 1')







    var index = 0
    var parseMaths=(line,op,name)=>{
        line=line.replace( new RegExp('(.*)\\b([a-zA-Z\\_0-9\\[\\]\\.]+)[\ ]+'+op+'[\ ]+([a-zA-Z\\_0-9\\[\\]\\.]+)','gm'), 
            match=>{
                var matched = /(.*)\b([a-zA-Z\_0-9\\[\]\\.]+)[\ ]+([\+\-\*\/])[\ ]+([a-zA-Z\_0-9\[\]\\.]+)/gm.exec(match)
                index++
                //if((TYPES[matched[2]]==undefined)||((TYPES[matched[2]]=='float')||(matched[2].indexOf('mth')==0))){
                    return 'Macro_Math_'+name+'('+matched[2]+','+matched[4]+',mth'+index+')\n'+matched[1]+'mth'+index+''
                //}else{
                //    return 'Macro_iMath_'+name+'('+matched[2]+','+matched[4]+',mth'+index+')\n'+matched[1]+'mth'+index+''
                //}
        })
        return line

    }
    var lines=source.split('\n')
    lines=lines.map(line=>{
        index = 0
        while(index<16){
            line=parseMaths(line,'\\*','pomnoz')
            line=parseMaths(line,'\\/','podziel')
            line=parseMaths(line,'\\+','dodaj')
            line=parseMaths(line,'\\-','odejmnij')
            index++
        }
        return line
    })
    source=lines.join('\n')








    var ClassINDEX = 0
    r(/^class([\s\S]+?)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,match=>{
        var name = match.split(' ')[1].replace('{','').trim().split(':')[0]

        var fields=[]
        const funcs={}
        var paramsS = []
        match=match.replace(/constructor\(\)(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,mmm=>{
            mmm=mmm.replace(/this\.(.*)/gm,m=>{
                m=m.replace('this.','')
                m=m.replace('=','dq')
                fields.push(m)
                var name=m.trim().split(' ')[0]
                var value=m.trim().split(' ')[2]
                paramsS.push({name,value})
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

        OBJECTS[name]={name,fields:fields,funcs,params:paramsS,classes:[]}

        var functions = []
        for(const func of Object.keys(funcs)){
            var FUNC = funcs[func]
            var data = FUNC.data
            var params = FUNC.params
            params=params.length?(','+params):''
            data = data.replace(/this\.([a-zA-Z0-9\_]+)\(/gm,name+'_$1(self,')
            var paramIdx = 0
            for(const param of paramsS){
                data = data.replace(new RegExp('this\\.'+param.name,'gm'),'qword[self+'+paramIdx+']')
                paramIdx+=8
            }
            ClassINDEX++
            functions.push('function '+name+'_'+func+'(this'+params+'):'+ClassINDEX+'{\n'+data+'\n:'+ClassINDEX+'}\n')
        }

        return `struct ${name}
            ${(fields.join('\n'))}
        ends
        ${functions.join('\n')}`
    })
    console.log('OBJECTS',OBJECTS)


    source = source.replace(/var [a-zA-Z0-9\_\.]+ = new [a-zA-Z0-9]+\(\)/gm,match=>{
        var params = match.split(' ')
        var OBJ=OBJECTS[params[4].replace('()','')]
        OBJ.classes.push(params[1])
        //OBJ.params.push(params[1])
        //return `${params[1]} ${params[4].replace('()','')}`
        var defs = ''
        var paramIdx = 0
        for(const param of OBJ.params){
            defs += 'mov rax,'+param.value+'\nmov qword['+params[1]+'+'+paramIdx+'],rax\n'
            paramIdx+=8
        }
        DATA.push(`${params[1]} dq ?`)
        return `invoke malloc, ${OBJ.params.length*8}\nmov [${params[1]}],rax\n${defs}\n`
    })
    source = source.replace(/(.*) = new [a-zA-Z0-9]+\(\)/gm,match=>{
        var params = match.trim().split(' ')
        console.log('params',params)
        var OBJ=OBJECTS[params[3].replace('()','')]
        OBJ.classes.push(params[0])
        //OBJ.params.push(params[1])
        //return `${params[1]} ${params[4].replace('()','')}`
        var defs = ''
        var paramIdx = 0
        for(const param of OBJ.params){
            defs += 'mov rax,'+param.value+'\nmov qword['+params[0]+'+'+paramIdx+'],rax\n'
            paramIdx+=8
        }
        //DATA.push(`${params[0]} dq ?`)
        return `invoke malloc, ${OBJ.params.length*8}\nmov [${params[0]}],rax\n${defs}\n`
    })
    
    for(const key of Object.keys(OBJECTS)){
        var OBJ = OBJECTS[key]
        for(var param of OBJ.classes){
            param=param.replace('[','\\[').replace(']','\\]').replace('+','\\+')
            source = source.replace(new RegExp(param+'\\.[a-zA-Z0-9\_]+\\(','gm'),match=>{
                var obj = match.split('.')[0]
                var func = match.split('.')[1].split('(')[0]
                return `${key}_${func}(${obj},`
            })
        }
    }
    r(/this/gm,'self')
    console.log('OBJECTS',OBJECTS)
    for(const key of Object.keys(OBJECTS)){
        var OBJ = OBJECTS[key]
        for(const klass of OBJ.classes){
            var paramIdx = 0
            for(const param of OBJ.params){
                source = source.replace(new RegExp(klass+'\\.'+param.name,'gm'),'qword['+klass+'+'+paramIdx+']')
                paramIdx+=8
            }
        }
    }


    r(/\,\)/gm,')')

    //fs.writeFileSync('./cache/dump1.js',source)

    r(/var (.*) = (.*\(.*)/gm,'$2\n$1 = rax')
    r(/(.*) = (.*\(.*)/gm,'$2\n$1 = rax')
    r(/return (.*)/gm,'mov rax, $1')

    /*r(/^(.*) (dq|dd,db|rq) (.*)$/gm,match=>{
        DATA.push(match)
        return ''
    })*/
    









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
            //if(name!='main'){
            //    MACRO[name] = {params,body}
            //    return ''
            //}else{
                return `macro ${name} ${params}
                ${body}
                end macro`
            //}
        }
    })

    r(/var (.*)/gm,match=>{
        var name = match.split('=')[0].replace('var ','').trim()
        if(!match.split('=')[1]){
            return match
        }
        if(match.split('=')[1].trim().indexOf('[')==-1){
            var value = match.split('=')[1].trim().replace('[','').replace(']','')
            DATA.push(name+' dq '+value)
        }else{
            var value = match.split('=')[1].trim().replace('[','').replace(']','')
            DATA2.push(name+' dq '+value)
        }
        return ''
    })

    r(/(.*) = (.*)/gm,'mov rax,$2\nmov $1,rax')

    for(let invoke of idata){
        r(new RegExp('('+invoke+')\\((.*)\\)','gm'),'invoke $1, $2')
    }

    r(/([a-zA-Z0-9]+)\[([0-9]+)\]/gm,'[$1 + $2*8]')
    r(/([0-9]+)\*([0-9]+)/gm,match=>{
        return eval(match)
    })
    r(/\[\[([a-zA-Z0-9]+)\]/gm,'[$1')

    


    r(/macro([\s\S]+?)end macro/gm,match=>{
        var res = match.split('\n')
        var line1 = res[0]
        var line1 = line1.split(' ')
        var name = line1[1]
        var line1 = line1[2].split(',')
        //line1.splice(0,1)
        //line1.splice(0,1)
        var params = line1
        res.splice(0,1)
        res.splice(res.length-1,1)
        res = res.join('\n')
        MACRO[name] = {params,body:res}
        if(name=='main'){
            return match
        }else{
            return ''
        }
    })
    console.log('MACRO',MACRO)

    //   nizej podmiana iteracja numerów funkcji lokalnych
    function switchMacro(){
        for(let macro of Object.keys(MACRO)){
            r(new RegExp('('+macro+')\\((.*)\\)','gm'),match=>{
                var name = match.split('(')[0].trim()
                var params = match.split('(')[1].split(')')[0].trim()
                console.log('NM',name)
                var res = MACRO[name].body//.split('\n')
                //res.splice(0,1)
                //res.splice(res.length-1,1)
                //res = res.join('\n')
                var paramsMacro = MACRO[name].params
                var newParams = params.split(',')
                var i = 0
                for(const param of paramsMacro){
                    res = res.replace(new RegExp(param,'gm'),newParams[i])
                    i++
                }
                res = res.replace(/(\ |\n)\.([a-zA-Z0-9]+)/gm,'$1.$2'+funcIDX)
                funcIDX++
                return res
            })//'$1 $2')
        }
    }
    var tmp = source+' '
    while(tmp!=source){
        tmp = source
        switchMacro()
    }

    for(const dat of DATA){
        var name = dat.trim().split(' ')[0].trim()
        r(new RegExp('\\b'+name+'\\b','gm'),'['+name+']')
    }

    r(/\[\[([a-zA-Z0-9]+)\]/gm,'[$1')
    //r(/([a-zA-Z])\.([a-zA-Z0-9])/gm,'$1 .$2')
    r(/(.*)\((.*)\)/gm,'invoke $1, $2')

    var GLFuncs = []
    r(/(gl[a-zA-Z0-9\_]+)/gm,match=>{
        GLFuncs.push(match)
        return match
    })
    console.log('GLF',GLFuncs)

    var gl64 = require('./build/make.js')
    gl64(GLFuncs)

    r(/\[(.*)\] dq/gm,'$1 dq')
    r(/([a-zA-Z0-9\_]+)\.\[(.*)\]/gm,'[$1.$2]')

    r(/\[qword\[(.*)+([0-9]+)\]\]/gm,'qword[$1+$2]')
    r(/\]\]/gm,']+0]')
    r(/(.*)\[qword\[(.*)\+([0-9]+)\]\+([0-9]+)\]/gm,'mov rdx,qword[$2+$3]\n$1qword[rdx+$4]')
    r(/qwordqword/gm,'qword')

    var main = ''
    r(/macro main([\s\S]+?)end macro/gm,match=>{
        main=match.replace('macro main','').replace('end macro','')
        return ''
    })




    if(mainFile){
        let frame = fs.readFileSync('./frames/'+FRM+'.asm').toString()
        source = frame.replace(/{{SOURCE}}/gm,source)
        source = source.replace(/main/gm,main)
        source = source.replace(/{{DATA}}/gm,DATA.join('\n')+'\n'+DATA2.join('\n'))
    }


    fs.writeFileSync('./cache/'+filePath,source)
}

const entry = process.argv[2]
Parse('./source/'+entry+'.js',true)