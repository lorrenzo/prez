import {ChangeColor} from "./changeColor";
import * as $ from 'jquery'
import {Raptorize} from "./lib/raptorize";

const elementToChange = '.js-color';
$(elementToChange).click( () => {
    ChangeColor.newColor(elementToChange);
});


var raptorize = new Raptorize('.myButton');
raptorize.raptorize();