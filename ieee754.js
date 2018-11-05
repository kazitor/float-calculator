val = {
  bits: {
    all: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    sig: 0,
    exp: [0,0,0,0,0],
    man: [0,0,0,0,0,0,0,0,0,0]
  },
  vals: {
    precise: null,
    out: null,
    exp: null,
    man: null
  },
  size: [5,10],
  
  setbits: function setbits(bits) {
    this.bits.all = bits;
    this.bits.sig = bits[0];
    this.bits.exp = bits.slice(1, this.size[0]+1);
    this.bits.man = bits.slice(this.size[0] + 1, 2 + this.size[0] + this.size[1]);
  },

  update: function update() {
    //
  },

  setsize: function setsize(exp, man) {
    var old = this;
  }
};
    

$(function() {
  $('.bits span').click(function() {
    $(this).text(1 - $(this).text());

    update();
  });

  $('#precision').change(function() {
    var vals = $(this).val().split(',');
    setsize(vals[0],vals[1]);
  });
});

function update() {
  var bits = [];
  $('.bits span').each(function() {
    bits.push( parseInt($(this).text()) );
  });

  val.setbits(bits);

  console.log(val);
}

function setsize(exponent, mantissa) {
  //
}