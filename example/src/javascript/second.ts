import {ChangeColor} from "./changeColor";
import * as $ from 'jquery'


const elementToChange = '.js-colorZ';
$(elementToChange).click( () => {
    ChangeColor.newColor(elementToChange);
});
