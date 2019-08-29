/*
exponent bits:
5,8,11,15,19
precisions:
10,23,52,112,236
*/
var width = {
  exp: 5,
  man: 10
};

$(function() {
  $('.bits span').click(function() {
    $(this).text(1 - $(this).text());

    updatevalues();
  });
});

function updatevalues() {
  var components = decompose(get_bits());
  var parts = split_point(components);

  if(Array.isArray(parts))
    $('#val_represented').text(
      (components.sig ? '-' : '')
      + leading_decimal(parts[0])
      + '.'+ trailing_decimal(parts[1])
    );
  else
    $('#val_represented').text(parts);
}

function get_bits() {
  var bits = [];
  $('.bits span').each(function() {
    bits.push( parseInt($(this).text()) );
  });
  // make bits[0] represent least significant
  bits.reverse();

  return bits;
}

function decompose(bits) {
  var sign = bits[bits.length - 1];
  var exp  = bits_to_int(bits.slice(width.man, -1)) - Math.pow(2,(width.exp - 1)) + 1;
  var man  = bits.slice(0, width.man);

  return {
    sig: sign,
    exp: exp,
    man: man
  };
}

function bits_to_int(bits) {
  var val = 0;
  for(var i = bits.length-1; i >= 0; i--) {
    val = (val << 1) | bits[i];
  }

  return val;
}

function split_point(val) {
  if(val.exp == Math.pow(2,width.exp-1)) {
    if(val.man.every(function(bit){return bit==0;}))
      return Infinity * Math.pow(-1, val.sig);
    else
      return NaN;
  }

  var lead=[0];
  if(val.exp >= 0) {
    if(val.exp <= width.man) {
      lead = val.man.slice(width.man - val.exp, width.man);
    }
    else {
      for(var i = 1; i < val.exp - width.man; i++)
        lead.push(0);
      lead = lead.concat(val.man.slice(0, width.man));
    }
    lead.push(1);
  }

  var trail=[0];
  if(val.exp < width.man) {
    if(val.exp >= 0) {
      trail = val.man.slice(0, width.man - val.exp);
    }
    else {
      if(val.exp == 1 - Math.pow(2,(width.exp - 1)))
        trail = []; // denormal
      else
        trail[0] = 1;

      for(var i = 1; i < -val.exp; i++) {
        trail.push(0);
      }

      trail = val.man.slice(0, width.man).concat(trail);
    }
  }

  return [lead, trail];
}

function trailing_decimal(binary) {
  // return a string of decimal digits
  // binary: array of 1 or 0, with binary[len-1] = 2**-1

  var decimal = '';
  // binary multiplication
  while(binary.length > 0) {
    var length = binary.length;
    // multiply by 10 = 0b1010
    binary = binary_add([0].concat(binary), [0,0,0].concat(binary));
    decimal += bits_to_int(binary.slice(length)).toString();
    binary = binary.slice(binary.indexOf(1),length);
  }

  return decimal;
}

function leading_decimal(binary) {
  // return a string of decimal digits
  // binary: array of 1 or 0, with binary[i] = 2**i

  // double dabble
  var bcd = Array(4 * Math.ceil(binary.length/3)).fill(0);
  for(var i = binary.length-1; i >= 0; i--) {
    for(var digit = 0; digit < bcd.length; digit+=4) {
      // if digit > 4
      if(bcd[digit+3] || bcd[digit+2] && (bcd[digit+1] || bcd[digit])) {
        // add 3
        var incremented = binary_add(bcd.slice(digit,digit+4), [1,1]);
        for(var j = 0; j < 4; j++)
          bcd[digit+j] = incremented[j];
      }
    }

    // shift left
    bcd.pop();
    bcd.unshift(binary[i]);
  }

  var decimal = ''
  for(var digit = 0; digit < bcd.length; digit+=4) {
    decimal = bits_to_int(bcd.slice(digit,digit+4)).toString() + decimal;
  }

  return decimal;
}

function binary_add(a, b) {
  if(a.length < b.length) {
    var longest = b;
    b = a;
    a = longest;
  }

  var carry = 0;
  var sum = Array(a.length);

  for(var i = 0; i < a.length; i++) {
    var bit_sum = a[i]+carry;
    if(i < b.length)
      bit_sum += b[i];

    sum[i] = +(bit_sum %  2);
    carry  = +(bit_sum >= 2);
  }
  if(carry)
    sum.push(1);

  return sum;
}
