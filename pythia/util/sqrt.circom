include "min.circom";

template FieldDivide () {
  signal input x;
  signal input y;
  signal output result;

  result <-- x / y;
  result * y === x;
}
template FieldSqrt () {
  signal input x;
  signal output result;


  if (x == 0 || x != 0) { // Prevent calculation at compile time
    var q = -1;
    var s = 0;

    while (q % 2 == 0) {
      q = q >> 1;
      s = s + 1;
    }


    var z = 1;
    while (z**(-1 / 2) == 1) z += 1;

    var m = s;
    var c = z**q;
    var t = x**q;
    var r = x**((q + 1) / 2);
    var i;
    var b;

    while (t != 0 && t != 1) {
      i = 1;
      while (t**(1 << i) != 1) i += 1;

      b = c**(2**(m - i - 1));
      m = i;
      c = b**2;
      t = t * b**2;
      r = r * b;
    }

    result <-- t == 0 ? 0 : min (r, -r);
  }

  result * result === x;
}