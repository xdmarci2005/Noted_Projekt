export class Functions{

  static checkEmail(email) {
    let message = "";
    if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(email)) {
      message = "Nem megfelelő a email formátuma!";
    }
    return message;
  }

  static checkInput(input) {
    if (input === undefined || input.length === 0) {
      return false;
    }
    const invalidCharaters = ['`', ';', ',', '(', ')', "'", '"', '=', '$'];
    for (let i = 0; i < invalidCharaters.length; i++) {
      if (input.includes(invalidCharaters[i])) {
        return true;
      }
    }
    return false;
  }

  static IsPasswordValid(Password){
    let message = "";
    if (Password.length < 8) {
      message = "A jelszó túl rövid (minimun 8 karakter)!";
    }
    else if (!(/\d/.test(Password))) {
      message = "A jelszónak tartalmaznia kell számokat!";
    }
    else if (!(/[A-Z]/.test(Password))) {
      message = "A jelszónak tartalmaznia kell nagy betűt!";
    } 
    return message;
  }

  static IsUsernameValid(Username){
    let message = "";
    if (Username.length < 5) {
      message = "túl rövid a felhasználó név (minimun 5 karakter)!" 
    }
    return message;
  }
}