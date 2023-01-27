function hex_password(pwd, key) {
  var hexone = sha512.hmac(key, pwd);
  var hextwo = sha512.hmac("hello", hexone);
  var hexthree = sha512.hmac("world", hexone);

  var source = hextwo.split("");
  var rule = hexthree.split("");
  console.assert(rule.length === source.length,);

  for (var i = 0; i < source.length; ++i) {
    if (isNaN(source[i])) {
      var str = "whenthecatisawaythemicewillplay666";
      if (str.search(rule[i]) > -1) {
        source[i] = source[i].toUpperCase();
      }
    }
  }
  return source.join("");
}


function seek_password(hash, length, rule_of_punctuation, rule_of_letter) {

  var lower = "abcdefghijklmnopqrstuvwxyz".split("");
  var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  var number = "0123456789".split("");
  var punctuation = "~*-+()!@#$^&".split("");
  var alphabet = lower.concat(number);
  if (parseInt(rule_of_punctuation) == 1) {
    alphabet = alphabet.concat(punctuation);
  }
  if (parseInt(rule_of_letter) == 1) {
    alphabet = alphabet.concat(upper);
  }

  
  for (var i = 0; i <= hash.length - length; ++i) {
    var sub_hash = hash.slice(i, i + parseInt(length)).split("");
    var count = 0;
    var map_index = sub_hash.map(function(c) {
      count = (count + c.charCodeAt()) % alphabet.length;
      return count;
    });
    var sk_pwd = map_index.map(function(k) {
      return alphabet[k];
    });

    var matched = [false, false, false, false];
    sk_pwd.forEach(function(e) {
      matched[0] = matched[0] || lower.includes(e);
      matched[1] = matched[1] || upper.includes(e);
      matched[2] = matched[2] || number.includes(e);
      matched[3] = matched[3] || punctuation.includes(e);
    });
    if (parseInt(rule_of_letter) == -1) {
      matched[1] = true;
    }
    if (parseInt(rule_of_punctuation) == -1) {
      matched[3] = true;
    }
    if (!matched.includes(false)) {
      return sk_pwd.join("");
    }
  }
  return "";
}


function get_select_option(select_id) {
  var select = document.getElementById(select_id);
  var select_index = select.selectedIndex;
  return [
    select.options[select_index].value,
    select.options[select_index].text
  ];
}


function generate_password() {
  
  var pwd = document.getElementById("pwd").value;
  var key = document.getElementById("key").value;
  var rule_of_punctuation = get_select_option("rule_of_punctuation");
  var rule_of_letter = get_select_option("rule_of_letter");
  var pwd_length = get_select_option("pwd_length");

  
  if (pwd && key) {
    var hash = hex_password(pwd, key);
    console.assert(hash.length === 128, );
    var sk_pwd = seek_password(
      hash,
      pwd_length[0],
      rule_of_punctuation[0],
      rule_of_letter[0]
    );
    return sk_pwd;
  }
}
