/* eslint-disable no-console,complexity,null,no-unused-vars,semi */
import $ from 'jquery';
import {parseMe} from './graph';
import flowchart from 'flowchart.js';

var option = {
    'symbols': {
        'start': {
            'font-color': 'red',
            'element-color': 'green',
            'fill': 'yellow'
        },
        'end': {
            'class': 'end-element'
        }
    },
    'flowstate': {
        'current': {'fill': 'green', 'font-color': 'black', 'font-weight': 'bold'}
    }
};
$(document).ready( () => {
    $('#codeSubmissionButton').click(() => {

        let jh={};
        let codeToParse = $('#codePlaceholder').val();
        let args=$('#getElements').val();
        let please=flowchart.parse(parseMe(codeToParse,args,jh));
        please.drawSVG('please',option);
    });
} );
