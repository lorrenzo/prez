import * as Reveal from "reveal";
import * as _ from 'lodash';

let names = ["toto", "titi", "tata", "tutu"];
_.map(names, (name) => console.log(name));

Reveal.initialize({
    progress: true,
    history: true
});