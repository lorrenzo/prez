import * as $ from "jquery"

export class ChangeColor {

    public static newColor(classElement:string) {
       $(classElement).css('background-color', ChangeColor.randomColor() )
    }


    private static randomColor() : string {
        const color = ['red', 'blue', 'green', 'yellow', 'grey' ];
        const rand : number = Math.floor((Math.random() * color.length));

        return color[rand];
    }

}