//globální konstanty
// **
// const ROOT_URL = 'http://localhost:1818/jednadevetdevetsest';

//export const ROOT_URL = 'http://10.66.101.1:1818/1996';
 export const ROOT_URL = window.location.protocol + "//" + window.location.host + '/katalog';
// export const ROOT_URL = 'http://smilda.ddns.net:1818/1996';


// const ROOT_URL = window.location.protocol + "//" + window.location.host + 'http://localhost:1818/jednadevetdevetsest';
export const API_KEY = '?username=alois';

const COLOREDSTONE = 5000;

//globální fce

export function timeCountDown (lastDate, serverDate, longText) {
  //vrátí string, ve kterém je rozdíl času oproti jinému času (serverový / frontendový / ..)
  //lastDate je formatu Date
  //serverDate je formátu Date (počítá se rozdíl do "distance")
  //longText je true => Výstup: dlouhý formát => 12 dní 4 hodiny 22 minut 2 sekundy
  //longText je false => Výstup: krátký formát => 292:22:02
  //užití: jak_dlouho_je_to = timeCountDown("2018-03-1 18:06:05", deviceObjectLast["0"].lrespiot, false);

  // let t = lastDate.split(/[- :]/);
  // // Apply each element to the Date function
  // let d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
  // let historyTime = new Date(d);

  let historyTime;
  let currentTime;
  if (lastDate < serverDate) {
    historyTime = lastDate;
    currentTime = serverDate;
  } else {
    historyTime = serverDate;
    currentTime = lastDate;
  }


  let distance =  currentTime - historyTime;


  // console.log("historyTime: ", historyTime);
  // console.log("currentTime: ", currentTime);
  // console.log("dist", distance);

  // let t2 = serverDate.split(/[- :]/);
  // // Apply each element to the Date function
  // let d2 = new Date(t2[0], t2[1]-1, t2[2], t2[3], t2[4], t2[5], t2[6]);
  // let currentTime = new Date(d2);



  // let currentTime = new Date(serverDate);
  // console.log(distance);
  switch (true) {
    case distance > 100000000000:
        return("NEKONECNO");
      break;
    case distance > COLOREDSTONE:
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);

          if (longText == true) {
            //dlouhý tvar vystupního textu
            switch (true) {
              case days == 0:
                days = "";
                break;
              case days == 1:
                days += " den";
                break;
              case (days>1 && days <5):
                days += " dny";
                break;
              case days>4:
                days += " dní";
                break;
              default:
            }
            switch (true) {
              case hours == 0:
                hours = "";
                break;
              case hours == 1:
                hours += " hodinu";
                break;
              case (hours > 1 && hours < 5):
                hours += " hodniny";
                break;
              case hours > 4:
                hours += " hodnin";
                break;
              default:
            }
          return (days + " " + hours + " " + minutes + " " + seconds);
          } //pokud je chtěná dlouhá odpověd Jinak
          else {

            hours = Math.floor((distance / ( 1000 * 60 * 60 )));
            //vysledny tvar ma být v hhh:mm:ss

            if (hours == 0) {
              hours = "";
            } else {
              hours += ":"
            }

            if (minutes < 10) {
                minutes = "0" + minutes.toString();
            }
            if (seconds < 10) {
                seconds = "0" + seconds.toString();
            }
            return (hours + minutes + ":" + seconds);
          } //>1000
      break;
    default:
      return ("0");
  }

}
