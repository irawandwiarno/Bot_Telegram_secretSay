var token = "Bot Token";
var url = "https://api.telegram.org/bot" + token;
var webAppUrl =
  "link deploy";

var ssId = "ID google sheet";

function setWebhook() {
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

function doPost(e) {
  var stringJson = e.postData.getDataAsString();
  var updates = JSON.parse(stringJson);

  var id = updates.message.from.id;
  var nama = updates.message.chat.first_name;

  // sederhanakan message
  var pesan = updates.message.text;
  var msg = updates.message;

  kelolaPesan(id, pesan, nama, msg);
}

function sendText(chatid, text, replymarkup) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatid),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(replymarkup),
    },
  };
  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}

function kelolaPesan(idSender, pesan, namaSender, msg) {
  var perintah = pesan.split(" ! ");
  var userName = msg.chat.username;
  var getSeen = pesan.split(" ");
  var codeCrack = pesan.split(" ");


  if (/\/add/i.exec(perintah[0])) {
    //---------------ADD
    var tanda = 0;
    var sheet = SpreadsheetApp.openById(ssId).getSheetByName("Sheet1");
    var idData = randomNum();
    for (var i = 1; i <= sheet.getLastColumn(); i++) {
      if (idData == sheet.getRange("A" + i).getValue()) {
        tanda = 1;
      }
    }
    if (tanda == 0) {
      pushData(idData, idSender, namaSender, perintah[1]);
    }
  } else if (/\/ping/i.exec(pesan)) {
    //--------------PING
    sendText(idSender, "pong!!");
  } else if (/\/start/i.exec(codeCrack[0])) {
    //-------------START
    var tokenSay = codeCrack[1];
    if (tokenSay != undefined) {
      var ss = SpreadsheetApp.openById(ssId).getSheetByName("Sheet1");
      for (var j = 1; j <= 1000; j++) {
        if (tokenSay == ss.getRange("A" + j).getValue()) {
          var range1 = "Sheet1!D" + j + ":I" + j;
          var data = Sheets.Spreadsheets.Values.get(ssId, range1).values;
          printF(data, idSender, namaSender, tokenSay, userName);
          break;
        }
      }
    } else {
      sendText(
        idSender,
        "Terimakasih sudah menggunakan bot ini\n\n berikut perintah bot : \n\n /add - untuk membuat kata-kata baru. \n\n /see - untuk melihat siapa yang melihat kata - kata kita"
      );
    }
  } else if (/\/see/i.exec(getSeen[0])) {
    //------------SEE
    if (getSeen[1] != undefined) {
      var ss = SpreadsheetApp.openById(ssId).getSheetByName("Sheet3");
      sendText(idSender, "SIAPA SAJA YANG MELIHAT");
      for (var j = 1; j <= 1000; j++) {
        if (getSeen[1] == ss.getRange("A" + j).getValue()) {
          var namaUser = ss.getRange("B" + j).getValue();
          var username = ss.getRange("C" + j).getValue();

          sendText(idSender, namaUser + " - http://t.me/" + username);
          Utilities.sleep(700);
        }
      }
    } else {
      sendText(idSender, "/see Id Say \n\n Contoh : /see 5764873");
    }
  }
}

function coba() {
  var getSeen = "79961464";
  var ss = SpreadsheetApp.openById(ssId).getSheetByName("Sheet3");
  sendText(idSender, "SIAPA SAJA YANG MELIHAT");
  for (var j = 1; j <= 10; j++) {
    if (getSeen == ss.getRange("A" + j).getValue()) {
      var range2 = "Sheet2!B" + j + ":C" + j;
      var range = ss.getRange(j, j);
      var dataSeen = range.getValue();

      console.log(dataSeen);
    }
  }
}

function randomNum() {
  var number = Math.floor(Math.random() * 100000000);
  return number;
}

function pushData(idData, idSender, namaSender, pesan) {
  if (pesan != undefined) {
    var arrayPesan = pesan.split(";");

    var sheetName = "Sheet1";
    var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName)
      ? SpreadsheetApp.openById(ssId).getSheetByName(sheetName)
      : SpreadsheetApp.openById(ssId).insertSheet(sheetName);
    // simpan ke google sheet
    sheet.appendRow([
      idData,
      idSender,
      namaSender,
      arrayPesan[0],
      arrayPesan[1],
      arrayPesan[2],
      arrayPesan[3],
      arrayPesan[4],
      arrayPesan[5],
      arrayPesan[6],
    ]);
    var linkSayUser = "https://t.me/SecretSayBot?start=" + idData;
    sendText(
      idSender,
      "Berhasil meng-Input data\n\n, Id Say : " +
        idData +
        "\n link Say : \n\n" +
        linkSayUser +
        "\n\n Cara Melihat Siapa saja yang melihat Say kamu dengan cara /see id say kamu \n contoh : /see 8776659 \n\n Selamat Bersenang-senang:)"
    );
    console.log("sukses");
  } else {
    console.log("add tamplate");
    sendText(
      idSender,
      "/add ! pesan1 ; pesan2 ; pesan3 ; pesan4 ; pesan5 ; pesan6 ;"
    );
  }
}

function printF(nilai, id, name, idData, username) {
  seenCount(name, idData, username);
  for (var i = 0; i < 6; i++) {
    if (typeof nilai[0][i] != undefined) {
      sendText(id, nilai[0][i]);
      Utilities.sleep(2000);
    }
  }
}

function seenCount(name, idData, userName) {
  var sheetName = "Sheet3";

  var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName)
    ? SpreadsheetApp.openById(ssId).getSheetByName(sheetName)
    : SpreadsheetApp.openById(ssId).insertSheet(sheetName);
  sheet.appendRow([idData, name, userName]);
}
