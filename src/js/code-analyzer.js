/* eslint-disable no-console,complexity,null,no-unused-vars */
import * as esprima from 'esprima';
import {generate} from 'escodegen';

const  program=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.body=parsed.body.map((a)=>checkType(a,dic,glb,funcs,color));
    return parsed;
};
const sequence=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.expressions=parsed.expressions.map((a)=>checkType(a,dic,glb,funcs,color));
    return parsed;
};
const expression=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.expression=checkType(parsed.expression,dic,glb,funcs,color);
    return parsed;
};
const declarations=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.declarations.map((node)=>{
        node['color']=color;
        glb[node.id.name]=checkType(JSON.parse(JSON.stringify(node.init)),glb,{},funcs,color);
        return node;
    });
    return parsed;
};
const unary=(parsed,dic,glb,funcs,color)=>
{
    parsed['color']=color;
    parsed.argument=checkType(parsed.argument,dic,glb,funcs,color);
    return parsed;
};
const binary=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.left=checkType(parsed.left,dic,glb,funcs,color);
    parsed.right=checkType(parsed.right,dic,glb,funcs,color);
    return parsed;
};
const addFuncs=(funcs)=>{
    funcs['Program']=program;
    funcs['SequenceExpression']=sequence;
    funcs['FunctionDeclaration']=functionDecl;
    funcs['AssignmentExpression']=functionAssignment;
    funcs['ExpressionStatement']=expression;
    funcs['VariableDeclaration']=declarations;
    funcs['MemberExpression']=member;
    funcs['UnaryExpression']=unary;
    funcs['BinaryExpression']=binary;
    funcs['Identifier']=identifier;
    funcs['WhileStatement']=whileStatment;
    funcs['BlockStatement']=blockStatment;
    funcs['ReturnStatement']=returnStatement;
    funcs['Literal']=literal;
    funcs['IfStatement']=ifStatemenet;
    funcs['UpdateExpression']=updateExpression;
    funcs['ArrayExpression']=array;
    return funcs;
};
const array=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.elements=parsed.elements.map((a)=>{a['color']=color; return checkType(a,dic,glb,funcs,color);});
    return parsed;
};
const literal=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    return parsed;
};
const  identifier=(parsed,dic,glb,funcs,color,args)=>{
    parsed['color']=color;
    if(dic[parsed.name]!==undefined) {
        return checkType(dic[parsed.name],dic,glb,funcs,color);
    }
    return parsed;
};
const checkType=(parsed,dic,glb,funcs,color)=>{
    return funcs[parsed.type](parsed,dic,glb,funcs,color);
};
const member=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.object=checkType(parsed.object,dic,glb,funcs,color);
    parsed.property=checkType(parsed.property,dic,glb,funcs,color);
    return parsed;
};
const updateExpression=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.argument=checkType(parsed.argument,dic,glb,funcs,color);
    return parsed;
};
const ifStatemenet= (parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.test=checkType(parsed.test,dic,glb,funcs,color);
    let o=checkType(JSON.parse(JSON.stringify(parsed.test)), glb, {}, funcs);
    let save=JSON.parse(JSON.stringify(glb));
    let ok=JSON.parse(JSON.stringify(glb));
    parsed.consequent=checkType(parsed.consequent,JSON.parse(JSON.stringify(dic)),save,funcs,eval(generate(o)));
    if(parsed.alternate!=undefined) {
        parsed.alternate=checkType(parsed.alternate,JSON.parse(JSON.stringify(dic)),ok,funcs,!eval(generate(o)));
    }
    return parsed;
};
const returnStatement=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.argument=checkType(parsed.argument,dic,glb,funcs,color);
    return parsed;
};

const blockStatment=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.body=parsed.body.map((a)=>{a['color']=color;return checkType(a,dic,glb,funcs,color);});
    return parsed;
};
const whileStatment=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.test=checkType(parsed.test,dic,glb,funcs,color);
    let my=JSON.parse(JSON.stringify(glb));
    let test = eval(generate(checkType(JSON.parse(JSON.stringify(parsed.test)),my,my,funcs,color)));
    parsed.body=checkType(parsed.body,dic,glb,funcs,JSON.parse(JSON.stringify(test)));
    return parsed;
};
const functionAssignment=(parsed,dic,glb,funcs,color)=>{
    parsed['color']=color;
    parsed.right=checkType(parsed.right,dic,glb,funcs,color);
    glb[parsed.left.name] = checkType(JSON.parse(JSON.stringify(parsed.right)),glb,{},funcs,color);
    return parsed;
};

const functionDecl=(parsed,dic,glb,funcs,color)=>{/*
    parsed.params=parsed.params.map((par)=>{glb[par.name]=par;return par;});*/
    parsed['color']=color;
    parsed.body=checkType(parsed.body,dic,glb,funcs,color);
    return parsed;
};

export const parseCode = (codeToParse,args,jh) => {
    jh=esprima.parseScript(codeToParse);
    let glb={};
    let funcs={};
    let lcl={};
    funcs=addFuncs(funcs);
    let check=make(args);
    let nuevo='(';
    jh.body=jh.body.map((a)=>{if(a.type=='FunctionDeclaration') {
        nuevo = maybe(a.params, check, nuevo );
        return a;
    }else {
        return checkType(a,lcl,glb,funcs,false);
    }
    }).filter((a)=>a.type=='FunctionDeclaration');
    console.log(jh);
    checkType(esprima.parseScript(nuevo),{},glb,funcs,false);
    jh.body=jh.body.map((a)=>{return checkType(a,lcl,glb,funcs,true);});//subsitute
    return jh;
};
const make=(list)=>
{
    let hi=list.split(',');
    hi=hi.map((a)=>a.trim());
    let trym=[];
    for (let h=0;h<hi.length;h++)
    {
        h=off(h,trym,hi);
    }
    return trym;
}
;
const off=(h,trym,hi)=>{
    let j=h;
    if(hi[h][0]=='[')
    {
        j++;
        while (hi[j][hi[j].length-1]!=']')
        {
            hi[h]+=','+hi[j];
            hi[j]='';
            j++;
        }
        hi[h]+=','+hi[j];
    }
    trym[h]=hi[h];
    return j;
};
const maybe=(args, list,nuevo)=>{
    list=list.filter((a)=>a!='');
    for (let i =0; i<args.length;i++)
    {
        nuevo+=generate(args[i])+'='+list[i]+',';
    }
    nuevo=nuevo.replace(/.$/,')');
    return nuevo;
};
