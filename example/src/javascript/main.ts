import {ChangeColor} from "./changeColor";
import * as $ from 'jquery'

const elementToChange = '.js-color';
$(elementToChange).click( () => {
    ChangeColor.newColor(elementToChange);
});
