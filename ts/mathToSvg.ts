import { mathjax } from './mathjax';
import { AsciiMath } from './input/asciimath';
import { SVG } from './output/svg';
import { RegisterHTMLHandler } from './handlers/html';
import { liteAdaptor } from './adaptors/liteAdaptor';

import { TeX } from './input/tex';
import { AllPackages } from './input/tex/AllPackages';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const tex = new TeX({packages: AllPackages});
const ascii = new AsciiMath({});
const svg = new SVG();
const asciiToSvgHtml = mathjax.document('', {InputJax: ascii, OutputJax: svg});
const texToSvgHtml = mathjax.document('', {InputJax: tex, OutputJax: svg});

export function mathToSvg(path: string): string {
    if (path.startsWith('$/')) {
        path = path.substr(2).replace(/\s+/g, ' ');
        return adaptor.innerHTML(asciiToSvgHtml.convert(path));
    }
    
    if (path.startsWith('$$/')) {
        path = path.substr(3).replace(/\s+/g, ' ');
        var str = "";
        for (var i = 0; i < path.length; ++i) {
            if (path[i] == '`' && i + 1 < path.length && path[i + 1] == '`') {
                str += '"';
                ++i;
            } else if (path[i] == '-' && i + 1 < path.length && path[i + 1] == '-') {
                str += "\\\\";
                ++i;
            } else if (path[i] == '/') {
                if (i + 1 < path.length && path[i + 1] == '/') {
                    str += '/';
                    ++i;
                } else {
                    str += '\\';
                }
            } else {
                str += path[i];
            }
        }
        return adaptor.innerHTML(texToSvgHtml.convert(str));
    }

    return null;
}
