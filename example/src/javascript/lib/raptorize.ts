import * as $ from 'jquery'

export class Raptorize {

    constructor(private element: string) {

    }

    // Animating Code
    private  init() {

        //Raptor Vars
        var raptorImageMarkup = '<img id="elRaptor" style="display: none" src="image/raptor.png" />';

        //Append Raptor and Style
        $('body').append(raptorImageMarkup);

        var raptor = $('#elRaptor').css({
            "position": "fixed",
            "bottom": "-700px",
            "right": "0",
            "display": "block"
        });

        // Movement Hilarity
        raptor.animate({
            "bottom": "0"
        }, function () {
            $(this).animate({
                "bottom": "-130px"
            }, 100, function () {
                var offset = (($(this).position().left) + 400);
                $(this).delay(300).animate({
                    "right": offset
                }, 2200, function () {
                    raptor = $('#elRaptor').css({
                        "bottom": "-700px",
                        "right": "0"
                    });
                })
            });
        });

    }

    public raptorize() {
        $(this.element).click((e) => {
                e.preventDefault();
                this.init();
            }
        );
    }

}