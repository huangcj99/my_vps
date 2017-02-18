/**
 * Created by gunjoe on 2017/2/4.
 */


// let pathRegexp = (path) => {
//     let keys = [];
//
//     path = path
//         // .concat(strict ? '' : '/?')
//         // .concat('')
//         .concat('/?')
//         .replace(/\/\(/g,'?:/')
//         .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g,function (_,slash,format,key,capture,optional,star) {
//             keys.push(key);
//             slash = slash || '';
//             return ''
//                 + (optional ? '' : slash)
//                 + '(?:'
//                 + (optional ? slash : '')
//                 + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
//                 + (optional || '')
//                 + (star ? '(/*)?' : '');
//         })
//         .replace(/([\/.])/g,'\\$1')
//         .replace(/\*/g,'(.*)');
//
//     return {
//         keys:keys,
//         regexp:new RegExp('^' + path + '$')
//     };
// };
//
// let pathname = '/profile/:45645';
//
// let regPathName = pathRegexp(pathname);
//
// console.log(regPathName.regexp.exec("/profile/asdfg"));



function test() {
    let args = Array.prototype.join.call(arguments,",");
    console.log(args);
}

test("1","2","3");
















