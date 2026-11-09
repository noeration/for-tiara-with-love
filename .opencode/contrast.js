function lum(hex){let c=hex.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function cr(a,b){let x=lum(a),y=lum(b);return ((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2)}
const pairs=[['#14151B','#F5F5FA'],['#FFFFFF','#2B3BEE'],['#F1EDE4','#2B3BEE'],['#14151B','#AEB7F2'],['#14151B','#E2E5FA'],['#2B3BEE','#F5F5FA'],['#2B3BEE','#F1EDE4'],['#D9DDFF','#2B3BEE']];
for(const [a,b] of pairs) console.log(a,'on',b,cr(a,b));
