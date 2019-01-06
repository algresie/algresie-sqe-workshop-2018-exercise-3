/* eslint-disable no-console,complexity,null,no-unused-vars */
import {generate} from 'escodegen';
import {parseCode} from './code-analyzer';
var start = '';
var end='';
var last='';
var i=0;
var num=1;
const  program=(parsed,funcs)=>{
    parsed.body.map((a)=>checkType(a,funcs));
};/*
const sequence=(parsed,funcs)=>{
    parsed.expressions.map((a)=>checkType(a,funcs));
};*/
const expression=(parsed)=>{
    let a=start.slice(start.length-9,start.length-1);
    a.localeCompare('|current')===0?start=start.slice(0,start.length-9)+'\n'+generate(parsed)+a+'\n':
        parsed['color']===true?start+=generate(parsed)+'|current\n':start+=generate(parsed)+'\n';
};
const declarations=(parsedl,funcs)=>{
    parsedl.declarations.map((parsed)=>{
        let a=start.slice(start.length-9,start.length-1);
        a.localeCompare('|current')===0?start=start.slice(0,start.length-9)+'\n'+generate(parsed)+a+'\n'
            :parsed['color']===true?start+=generate(parsed)+'|current\n':start+=generate(parsed)+'\n';});
};
const addFuncs=(funcs)=>{
    funcs['Program']=program;
    /*  funcs['SequenceExpression']=sequence;*/
    funcs['FunctionDeclaration']=functionDecl;
    funcs['ExpressionStatement']=expression;
    funcs['VariableDeclaration']=declarations;
    funcs['WhileStatement']=whileStatment;
    funcs['BlockStatement']=blockStatment;
    funcs['ReturnStatement']=returnStatement;
    funcs['IfStatement']=ifStatemenet;
    return funcs;
};

const checkType=(parsed,funcs)=>{
    funcs[parsed.type](parsed,funcs);
};
const add=()=>{
    start += 'op' + i + '=>operation: ('+(num++)+')\n';
    end += last + '->op' + i + '\n';
    last = 'op' + i;
    i++;
};
const ifStatemenet= (parsed,funcs)=>{
    let y=num++;
    parsed['color']? start+='cond'+i+'=>condition: ('+y+')\n'+generate(parsed.test)+'|current\n':start+='cond'+i+'=>condition: ('+y+')\n'+generate(parsed.test)+'\n';
    if(last!='')end+=last+'->cond'+i+'\n';
    let save=i;
    last='cond'+(i++)+'(yes,left)';
    if(parsed.consequent.type!='BlockStatement'&&parsed.consequent.type!='IfStatement'&&parsed.consequent.type!='WhileStatement')
        add();
    checkType(parsed.consequent,funcs);
    let help=last;
    last='cond'+save+'(no,right)';
    if(parsed.alternate!=undefined)
        alternate(parsed,funcs,save,help);
    if(last[0]!='e')
        what(parsed,funcs,help);

};
const what=(parsed,funcs,help)=>{
    start += 'op' + i + '=>operation: ('+(num++)+')\n';
    end += help + '->op' + i + '\n';
    help=last;
    end += help + '->op' + i + '\n';
    last = 'op' + i;
    i++;
};
const alternate=(parsed,funcs,save,help)=>{
    parsed['color']?start+='e'+save+'=>end: e|current\n':start+='e'+save+'=>end: e\n';
    end+=help+'->e'+save+'\n';
    parsed.alternate.type==='IfStatement'? elseif(parsed.alternate,funcs,'e'+save):checkType(parsed.alternate,funcs);
    if(last[0]!='e')
        end+=last+'->e'+save+'\n';
    last='e'+save;
};
const elseif=(parsed,funcs,conn)=>{
    let y=num++;
    parsed['color']? start+='cond'+i+'=>condition: ('+y+')\n'+generate(parsed.test)+'|current\n':start+='cond'+i+'=>condition: ('+y+')\n'+generate(parsed.test)+'\n';
    end+=last+'->cond'+i+'\n';
    let save=i;
    last='cond'+(i++)+'(yes,left)';
    if(parsed.consequent.type!='BlockStatement'&&parsed.consequent.type!='IfStatement'&&parsed.consequent.type!='WhileStatement')
        add();
    checkType(parsed.consequent,funcs);
    end+=last+'->'+conn+'\n';
    last='cond'+save+'(no,right)';
    if(parsed.alternate!=undefined)
    {
        parsed.alternate.type==='IfStatement'? elseif(parsed.alternate,funcs,conn):checkType(parsed.alternate,funcs);
    }
    end+=last+'->'+conn+'\n';
    last=conn;

};
const returnStatement=(parsed,funcs)=>{
    let a=start.slice(start.length-9,start.length-1);
    a.localeCompare('|current')===0?start=start.slice(0,start.length-9)+'\n'+generate(parsed)+a+'\n':
        parsed['color']===true?start+=generate(parsed)+'|current\n':start+=generate(parsed)+'\n';
};

const blockStatment=(parsed,funcs)=>{
    if(parsed.body[0].type!='IfStatement'&&parsed.body[0].type!='WhileStatement') {
        start += 'op' + i + '=>operation: ('+(num++)+')\n';
        if (i != 0)
            end += last + '->op' + i + '\n';
        last = 'op' + i;
        i++;
    }
    parsed.body.map((a)=>{
        if((last[0]=='e'||last[0]=='c')&&a.type!='IfStatement'&&a.type!='WhileStatement') {
            i++;
            start += 'op' + i + '=>operation: ('+(num++)+')\n';
            end += last + '->op' + i + '\n';
            last = 'op' + i;

        }
        checkType(a,funcs);});
};
const whileStatment=(parsed,funcs)=>{
    let y=num++;
    if(parsed['color'])start+='op'+i+'=>operation: ('+y+')\n'+'null|current\n';
    else
        start+='op'+i+'=>operation: ('+y+')\n'+'null\n';
    if(i!=0)
        end+=last+'->op'+i+'\n';
    y=num++;
    parsed['color']?start+='cond'+i+'=>condition: ('+y+')\n'+generate(parsed.test)+'|current\n':start+='cond'+i+'=>condition: ('+y+')\n'+generate(parsed.test)+'\n';
    end+='op'+i+'->cond'+i+'\n';
    let save=i;
    last='cond'+i+'(yes,left)';
    i++;
    checkType(parsed.body,funcs);
    end+=last+'(left)->op'+save+'\n';
    last='cond'+save+'(no,right)';
};

const functionDecl=(parsed,funcs)=>{
    checkType(parsed.body,funcs);
};

export const parseMe = (codeToParse,args,jh) => {
    start = '';
    end='';
    last='';
    i=0;
    num=1;
    let parsedCode = parseCode(codeToParse,args,jh);
    let funcs={};
    addFuncs(funcs);
    checkType(parsedCode,funcs);
    start=start.split(';').join('');
    console.log(start+end);
    return start+end;

};
