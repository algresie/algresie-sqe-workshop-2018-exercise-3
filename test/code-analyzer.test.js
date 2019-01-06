/* eslint-disable no-console,complexity,null */
import assert from 'assert';
import {parseMe} from '../src/js/graph';
describe('my parser',()=>{
    it('sub1',()=>{
        assert.deepEqual(parseMe('function my(x, y, z)\n' +
            '{\n' +
            'let a=x[0]+1;\n' +
            '}\n','[1,2,3], 2, 3',{}),'op0=>operation: (1)\n' +
            'a = x[0] + 1|current\n');});
    it('sub2',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '    let a = x[0] + 1;\n' +
            '    if (a < z) {\n' +
            '        c = c + 5;\n' +
            '    } \n' +
            '    \n' +
            '    return c;\n' +
            '}','[1,2,3],2,3',{}),'op0=>operation: (1)\n' +
            'a = x[0] + 1|current\n' +
            'cond1=>condition: (2)\n' +
            'a < z|current\n' +
            'op2=>operation: (3)\n' +
            'c = c + 5|current\n' +
            'op3=>operation: (4)\n' +
            'return c|current\n' +
            'op0->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2->op3\n' +
            'cond1(no,right)->op3\n');
    });
    it('if',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '    let a = x[0] + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } \n' +
            '    \n' +
            '    return c;\n' +
            '}','[1,2,3],2,3',{}),'op0=>operation: (1)\n' +
            'a = x[0] + 1\n' +
            'b = a + y\n' +
            'c = 0|current\n' +
            'cond1=>condition: (2)\n' +
            'b < z|current\n' +
            'op2=>operation: (3)\n' +
            'c = c + 5\n' +
            'op3=>operation: (4)\n' +
            'return c|current\n' +
            'op0->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2->op3\n' +
            'cond1(no,right)->op3\n');
    });
    it('if-else',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '    let a = x[2] + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } \n' +
            '    \n' +
            '    return c;\n' +
            '}','[1,2,3],2,3',{}),'op0=>operation: (1)\n' +
            'a = x[2] + 1\n' +
            'b = a + y\n' +
            'c = 0|current\n' +
            'cond1=>condition: (2)\n' +
            'b < z|current\n' +
            'op2=>operation: (3)\n' +
            'c = c + 5\n' +
            'op3=>operation: (4)\n' +
            'return c|current\n' +
            'op0->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2->op3\n' +
            'cond1(no,right)->op3\n');
    });
    it('while',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}','1, 2, 3',{}),'op0=>operation: (1)\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|current\n' +
            'cond1=>condition: (2)\n' +
            'b < z|current\n' +
            'op2=>operation: (3)\n' +
            'c = c + 5\n' +
            'e1=>end: e|current\n' +
            'cond3=>condition: (4)\n' +
            'b < z * 2|current\n' +
            'op4=>operation: (5)\n' +
            'c = c + x + 5|current\n' +
            'op5=>operation: (6)\n' +
            'c = c + z + 5\n' +
            'op7=>operation: (7)\n' +
            'return c|current\n' +
            'op0->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2->e1\n' +
            'cond1(no,right)->cond3\n' +
            'cond3(yes,left)->op4\n' +
            'op4->e1\n' +
            'cond3(no,right)->op5\n' +
            'op5->e1\n' +
            'e1->op7\n');
    });
    it('while-if',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}','1, 2, 3',{}),'op0=>operation: (1)\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|current\n' +
            'op1=>operation: (2)\n' +
            'null|current\n' +
            'cond1=>condition: (3)\n' +
            'a < z|current\n' +
            'op2=>operation: (4)\n' +
            'c = a + b\n' +
            'z = c * 2\n' +
            'a++|current\n' +
            'op4=>operation: (5)\n' +
            'return z|current\n' +
            'op0->op1\n' +
            'op1->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2(left)->op1\n' +
            'cond1(no,right)->op4\n');
    });
    it('example',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            'if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}','1, 2, 3',{}),'op0=>operation: (1)\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|current\n' +
            'op1=>operation: (2)\n' +
            'null|current\n' +
            'cond1=>condition: (3)\n' +
            'a < z|current\n' +
            'cond2=>condition: (4)\n' +
            'b < z|current\n' +
            'op3=>operation: (5)\n' +
            'c = c + 5\n' +
            'e2=>end: e|current\n' +
            'cond4=>condition: (6)\n' +
            'b < z * 2|current\n' +
            'op5=>operation: (7)\n' +
            'c = c + x + 5|current\n' +
            'op6=>operation: (8)\n' +
            'c = c + z + 5\n' +
            'op8=>operation: (9)\n' +
            'c = a + b\n' +
            'z = c * 2\n' +
            'a++|current\n' +
            'op9=>operation: (10)\n' +
            'return z|current\n' +
            'op0->op1\n' +
            'op1->cond1\n' +
            'cond1(yes,left)->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->e2\n' +
            'cond2(no,right)->cond4\n' +
            'cond4(yes,left)->op5\n' +
            'op5->e2\n' +
            'cond4(no,right)->op6\n' +
            'op6->e2\n' +
            'e2->op8\n' +
            'op8(left)->op1\n' +
            'cond1(no,right)->op9\n');
    });
    it('example2',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '    let a = x[0]+1;\n' +
            'let b=y*2;\n' +
            'while(a>y)\n' +
            '{\n' +
            'if(a<z)\n' +
            'return a;\n' +
            '}\n' +
            'if(b>a)\n' +
            'return z;\n' +
            '}','[2,3,4],2,3',{}),'op0=>operation: (1)\n' +
            'a = x[0] + 1\n' +
            'b = y * 2|current\n' +
            'op1=>operation: (2)\n' +
            'null|current\n' +
            'cond1=>condition: (3)\n' +
            'a > y|current\n' +
            'cond2=>condition: (4)\n' +
            'a < z|current\n' +
            'op3=>operation: (5)\n' +
            'return a\n' +
            'op4=>operation: (6)\n' +
            'cond5=>condition: (7)\n' +
            'b > a|current\n' +
            'op6=>operation: (8)\n' +
            'return z|current\n' +
            'op7=>operation: (9)\n' +
            'op0->op1\n' +
            'op1->cond1\n' +
            'cond1(yes,left)->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->op4\n' +
            'cond2(no,right)->op4\n' +
            'op4(left)->op1\n' +
            'cond1(no,right)->cond5\n' +
            'cond5(yes,left)->op6\n' +
            'op6->op7\n' +
            'cond5(no,right)->op7\n');
    });
    it('example3',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '    let a = x[0]+1;\n' +
            'while(a>y)\n' +
            '{\n' +
            'if(a<z)\n' +
            'return a;\n' +
            '}\n' +
            'return z;\n' +
            '}','[2,3,4],2,3',{}),'op0=>operation: (1)\n' +
            'a = x[0] + 1|current\n' +
            'op1=>operation: (2)\n' +
            'null|current\n' +
            'cond1=>condition: (3)\n' +
            'a > y|current\n' +
            'cond2=>condition: (4)\n' +
            'a < z|current\n' +
            'op3=>operation: (5)\n' +
            'return a\n' +
            'op4=>operation: (6)\n' +
            'op6=>operation: (7)\n' +
            'return z|current\n' +
            'op0->op1\n' +
            'op1->cond1\n' +
            'cond1(yes,left)->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->op4\n' +
            'cond2(no,right)->op4\n' +
            'op4(left)->op1\n' +
            'cond1(no,right)->op6\n');
    });
    it('example4',()=>{
        assert.deepEqual(parseMe('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}','1,2,3',{}),'op0=>operation: (1)\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|current\n' +
            'cond1=>condition: (2)\n' +
            'b < z|current\n' +
            'op2=>operation: (3)\n' +
            'c = c + 5\n' +
            'return x + y + z + c\n' +
            'e1=>end: e|current\n' +
            'cond3=>condition: (4)\n' +
            'b < z * 2|current\n' +
            'op4=>operation: (5)\n' +
            'c = c + x + 5\n' +
            'return x + y + z + c|current\n' +
            'op5=>operation: (6)\n' +
            'c = c + z + 5\n' +
            'return x + y + z + c\n' +
            'op0->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2->e1\n' +
            'cond1(no,right)->cond3\n' +
            'cond3(yes,left)->op4\n' +
            'op4->e1\n' +
            'cond3(no,right)->op5\n' +
            'op5->e1\n');
    });
    it('example5',()=>{
        assert.deepEqual(parseMe('function ok(a)\n' +
            '{\n' +
            'let b=-a;\n' +
            'if(b<0)\n' +
            '{\n' +
            'return a;\n' +
            '}\n' +
            'return b;\n' +
            '}','2',{}),'op0=>operation: (1)\n' +
            'b = -a|current\n' +
            'cond1=>condition: (2)\n' +
            'b < 0|current\n' +
            'op2=>operation: (3)\n' +
            'return a|current\n' +
            'op3=>operation: (4)\n' +
            'return b|current\n' +
            'op0->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2->op3\n' +
            'cond1(no,right)->op3\n');
    });
    it('example5',()=>{
        assert.deepEqual(parseMe('function foo(a){\n' +
            '    let b=-a;\n' +
            'if(b<0)\n' +
            'a=-2;\n' +
            '    \n' +
            '    return a;\n' +
            '}','2',{}),'op0=>operation: (1)\n' +
            'b = -a|current\n' +
            'cond1=>condition: (2)\n' +
            'b < 0|current\n' +
            'op2=>operation: (3)\n' +
            'a = -2|current\n' +
            'op3=>operation: (4)\n' +
            'return a|current\n' +
            'op0->cond1\n' +
            'cond1(yes,left)->op2\n' +
            'op2->op3\n' +
            'cond1(no,right)->op3\n');
    });
    it('example6',()=>{
        assert.deepEqual(parseMe('let a=2;\n' +
            'function vv(b)\n' +
            '{\n' +
            'if(a==b)\n' +
            'return true;\n' +
            'else if(a<b)\n' +
            'return false;\n' +
            '}','2',{}),'cond0=>condition: (1)\n' +
            'a == b|current\n' +
            'op1=>operation: (2)\n' +
            'return true|current\n' +
            'e0=>end: e|current\n' +
            'cond2=>condition: (3)\n' +
            'a < b\n' +
            'op3=>operation: (4)\n' +
            'return false\n' +
            'cond0(yes,left)->op1\n' +
            'op1->e0\n' +
            'cond0(no,right)->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->e0\n' +
            'cond2(no,right)->e0\n');
    });
    it('example7',()=>{
        assert.deepEqual(parseMe('function a(b){\n' +
            'while(b<0)\n' +
            '{\n' +
            'let z=1;\n' +
            'if(z>0)\n' +
            'return z;\n' +
            '}\n' +
            '}','4',{}),'op0=>operation: (1)\n' +
            'null|current\n' +
            'cond0=>condition: (2)\n' +
            'b < 0|current\n' +
            'op1=>operation: (3)\n' +
            'z = 1\n' +
            'cond2=>condition: (4)\n' +
            'z > 0\n' +
            'op3=>operation: (5)\n' +
            'return z|current\n' +
            'op4=>operation: (6)\n' +
            'op0->cond0\n' +
            'cond0(yes,left)->op1\n' +
            'op1->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->op4\n' +
            'cond2(no,right)->op4\n' +
            'op4(left)->op0\n');
    });
    it('example7',()=>{
        assert.deepEqual(parseMe('function a(b){\n' +
            'while(b<0)\n' +
            '{\n' +
            'let z=1;\n' +
            'if(z>0)\n' +
            'return z;\n' +
            'else if(z<0)\n' +
            'return 0;\n' +
            'else\n' +
            'return 1;\n' +
            '}\n' +
            '}','4',{}),'op0=>operation: (1)\n' +
            'null|current\n' +
            'cond0=>condition: (2)\n' +
            'b < 0|current\n' +
            'op1=>operation: (3)\n' +
            'z = 1\n' +
            'cond2=>condition: (4)\n' +
            'z > 0\n' +
            'op3=>operation: (5)\n' +
            'return z|current\n' +
            'e2=>end: e\n' +
            'cond4=>condition: (6)\n' +
            'z < 0\n' +
            'op5=>operation: (7)\n' +
            'return 0\n' +
            'return 1|current\n' +
            'op0->cond0\n' +
            'cond0(yes,left)->op1\n' +
            'op1->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->e2\n' +
            'cond2(no,right)->cond4\n' +
            'cond4(yes,left)->op5\n' +
            'op5->e2\n' +
            'cond4(no,right)->e2\n' +
            'e2(left)->op0\n');
    });
    it('example8',()=>{
        assert.deepEqual(parseMe('function a(b){\n' +
            'if(b<0)\n' +
            '{\n' +
            'let z=1;\n' +
            'if(z>0)\n' +
            'return z;\n' +
            'else if(z<0)\n' +
            'return 0;\n' +
            'else\n' +
            'return 1;\n' +
            'while(z<0)\n' +
            '{\n' +
            'z++;\n' +
            '}\n' +
            '}\n' +
            '}','4',{}),'cond0=>condition: (1)\n' +
            'b < 0|current\n' +
            'op1=>operation: (2)\n' +
            'z = 1\n' +
            'cond2=>condition: (3)\n' +
            'z > 0\n' +
            'op3=>operation: (4)\n' +
            'return z|current\n' +
            'e2=>end: e\n' +
            'cond4=>condition: (5)\n' +
            'z < 0\n' +
            'op5=>operation: (6)\n' +
            'return 0\n' +
            'return 1|current\n' +
            'op6=>operation: (7)\n' +
            'null\n' +
            'cond6=>condition: (8)\n' +
            'z < 0\n' +
            'op7=>operation: (9)\n' +
            'z++\n' +
            'op8=>operation: (10)\n' +
            'cond0(yes,left)->op1\n' +
            'op1->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->e2\n' +
            'cond2(no,right)->cond4\n' +
            'cond4(yes,left)->op5\n' +
            'op5->e2\n' +
            'cond4(no,right)->e2\n' +
            'e2->op6\n' +
            'op6->cond6\n' +
            'cond6(yes,left)->op7\n' +
            'op7(left)->op6\n' +
            'cond6(no,right)->op8\n' +
            'cond0(no,right)->op8\n');
    });
    it('example9',()=>{
        assert.deepEqual(parseMe('function a(b){\n' +
            'if(b<0)\n' +
            '{\n' +
            'let z=1;\n' +
            'if(z>0)\n' +
            'return z;\n' +
            'else if(z<0)\n' +
            'return 0;\n' +
            'else\n' +
            'return 1;\n' +
            'while(z<0)\n' +
            '{\n' +
            'z++;\n' +
            '}\n' +
            '}\n' +
            'else\n' +
            '{\n' +
            'let a=0;\n' +
            'if(b<0)\n' +
            '{\n' +
            'return a;\n' +
            '}\n' +
            'return a;\n' +
            '}\n' +
            '}','4',{}),'cond0=>condition: (1)\n' +
            'b < 0|current\n' +
            'op1=>operation: (2)\n' +
            'z = 1\n' +
            'cond2=>condition: (3)\n' +
            'z > 0\n' +
            'op3=>operation: (4)\n' +
            'return z|current\n' +
            'e2=>end: e\n' +
            'cond4=>condition: (5)\n' +
            'z < 0\n' +
            'op5=>operation: (6)\n' +
            'return 0\n' +
            'return 1|current\n' +
            'op6=>operation: (7)\n' +
            'null\n' +
            'cond6=>condition: (8)\n' +
            'z < 0\n' +
            'op7=>operation: (9)\n' +
            'z++\n' +
            'e0=>end: e|current\n' +
            'op8=>operation: (10)\n' +
            'a = 0|current\n' +
            'cond9=>condition: (11)\n' +
            'b < 0|current\n' +
            'op10=>operation: (12)\n' +
            'return a\n' +
            'op11=>operation: (13)\n' +
            'return a|current\n' +
            'cond0(yes,left)->op1\n' +
            'op1->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->e2\n' +
            'cond2(no,right)->cond4\n' +
            'cond4(yes,left)->op5\n' +
            'op5->e2\n' +
            'cond4(no,right)->e2\n' +
            'e2->op6\n' +
            'op6->cond6\n' +
            'cond6(yes,left)->op7\n' +
            'op7(left)->op6\n' +
            'cond6(no,right)->e0\n' +
            'cond0(no,right)->op8\n' +
            'op8->cond9\n' +
            'cond9(yes,left)->op10\n' +
            'op10->op11\n' +
            'cond9(no,right)->op11\n' +
            'op11->e0\n');
    });
    it('example9',()=>{
        assert.deepEqual(parseMe('function a(b){\n' +
            'if(b<0)\n' +
            '{\n' +
            'b=2;\n' +
            '}\n' +
            'else if(b>0)\n' +
            '{\n' +
            'b=-2;\n' +
            '}\n' +
            'else if(b==0)\n' +
            '{\n' +
            'return 0;\n' +
            '}\n' +
            'else \n' +
            '{\n' +
            'return 1;\n' +
            '}\n' +
            '}','4',{}),'cond0=>condition: (1)\n' +
            'b < 0|current\n' +
            'op1=>operation: (2)\n' +
            'b = 2\n' +
            'e0=>end: e|current\n' +
            'cond2=>condition: (3)\n' +
            'b > 0|current\n' +
            'op3=>operation: (4)\n' +
            'b = -2|current\n' +
            'cond4=>condition: (5)\n' +
            'b == 0\n' +
            'op5=>operation: (6)\n' +
            'return 0\n' +
            'op6=>operation: (7)\n' +
            'return 1|current\n' +
            'cond0(yes,left)->op1\n' +
            'op1->e0\n' +
            'cond0(no,right)->cond2\n' +
            'cond2(yes,left)->op3\n' +
            'op3->e0\n' +
            'cond2(no,right)->cond4\n' +
            'cond4(yes,left)->op5\n' +
            'op5->e0\n' +
            'cond4(no,right)->op6\n' +
            'op6->e0\n' +
            'e0->e0\n');
    });
});
