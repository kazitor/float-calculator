/*
exponent bits:
5,8,11,15,19
precisions:
10,23,52,112,236

bias = 2**(exp - 1) - 1
*/

var val = {
  bits: [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0],
  sig: 0,
  exp: [1,1,1,1,0],
  man: [0,0,0,0,0,0,0,0,0,0]
};
var width = 16;
var precision = 10;

$(function() {
  $('.bits span').click(function() {
    $(this).text(1 - $(this).text());

    updatevalues();
  });

  $('#precision').change(function() {
    setsize($(this).val());
  });
});

function updatevalues() {
  var bits = [];
  $('.bits span').each(function() {
    bits.push( parseInt($(this).text()) );
  });

  bits.reverse();

  val.bits = bits;
  val.sig = bits[width-1];
  val.exp = bits_to_int(bits.slice(precision,width));
  val.man = bits_to_int(bits.slice(0,precision).concat([1]));

  $('#val_precise').text(precisevalue(val));
}

function bits_to_int(bits) {
  var val = 0;
  for(var i = 0; i < bits.length; i++)
    if(bits[i])
      val += Math.pow(2,i);

  return val;
}

function precisevalue(val) {
  // (-1)**sign  *  2**(exponent - bias)  *  mantissa
  if(val.exp == Math.pow(2,width-precision-1)-1)
    return (val.man == 0) ? 'infinity' : 'NaN';
  return 1;
}

function setsize(size) {
  //
}