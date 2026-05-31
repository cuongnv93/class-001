/**
 * GOOGLE APPS SCRIPT ĐÃ TÍCH HỢP (FORM + CHỮ KÝ + BÌNH CHỌN VUI + CONFESSIONS + LỜI ĐIỀU ƯỚC)
 * Dành cho URL: https://script.google.com/macros/s/AKfycbwhdp2yiphU2OuDgi79X3fC0ek_iL8zpTGaV8AXigUYsL_q8_Ok7vfvUrv03LNFCwVH/exec
 */

// ==================== CẤU HÌNH CÁC TAB GOOGLE SHEETS ====================
var CONFIG = {
  // GID của Tab 3 (Confessions - Lưu bút ẩn danh)
  CONFESSIONS_GID: "1539399183",
  
  // GID của Tab 4 (Bình chọn vui)
  BINH_CHON_GID: "2086677035",
  
  // GID của Tab 5 (Lời điều ước - Wishing Tree)
  WISHES_GID: "1988746198"
};
// =========================================================================

// Hàm phụ trợ tìm Tab Trang tính theo số GID (đảm bảo không bị lỗi khi sắp xếp lại Tab)
function getSheetByGid(ss, gid) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId().toString() === gid.toString()) {
      return sheets[i];
    }
  }
  return null;
}

// 1. XỬ LÝ LỆNH GET (Lấy dữ liệu phiếu bầu tổng hợp và lưu bút gửi về cho Web)
function doGet(e) {
  try {
    var action = e.parameter.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "get") {
      // 1. Lấy dữ liệu bình chọn vui (Tab GID: CONFIG.BINH_CHON_GID)
      var sheet4 = getSheetByGid(ss, CONFIG.BINH_CHON_GID) || ss.getSheets()[3];
      var data = sheet4.getDataRange().getValues();
      var votes = {};
      
      // Bỏ qua dòng tiêu đề cột thứ nhất (i = 0)
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var category = row[1];  // Cột B: Danh hiệu
        var candidate = row[2]; // Cột C: Học sinh được bầu
        
        if (!category || !candidate) continue;
        
        if (!votes[category]) {
          votes[category] = {};
        }
        if (!votes[category][candidate]) {
          votes[category][candidate] = 0;
        }
        votes[category][candidate]++;
      }

      // 2. Lấy dữ liệu Confessions (Tab GID: CONFIG.CONFESSIONS_GID)
      var confessions = [];
      var sheet3 = getSheetByGid(ss, CONFIG.CONFESSIONS_GID) || (ss.getSheets().length > 2 ? ss.getSheets()[2] : null);
      if (sheet3) {
        var data3 = sheet3.getDataRange().getValues();
        
        // Đọc ngược từ cuối lên đầu dòng (bỏ qua tiêu đề index 0) để hiển thị mới nhất trước
        for (var j = data3.length - 1; j >= 1; j--) {
          var row3 = data3[j];
          var timeVal = row3[0];
          var authorVal = row3[1];
          var textVal = row3[2];
          var colorVal = row3[3];
          
          if (!textVal) continue;
          
          confessions.push({
            author: authorVal || 'Ẩn danh',
            text: textVal,
            color: colorVal || 'pink',
            time: timeVal ? new Date(timeVal).getTime() : Date.now()
          });
        }
      }

      // 3. Lấy dữ liệu Lời điều ước (Tab Tên "Lời điều ước" hoặc GID)
      var wishes = [];
      var sheet5 = getSheetByGid(ss, CONFIG.WISHES_GID) || ss.getSheetByName("Lời điều ước") || (ss.getSheets().length > 4 ? ss.getSheets()[4] : null);
      if (sheet5) {
        var data5 = sheet5.getDataRange().getValues();
        
        // Đọc ngược từ cuối lên đầu dòng (bỏ qua tiêu đề index 0) để hiển thị mới nhất trước
        for (var k = data5.length - 1; k >= 1; k--) {
          var row5 = data5[k];
          var timeVal = row5[0];
          var authorVal = row5[1];
          var textVal = row5[2];
          var themeVal = row5[3];
          
          if (!textVal) continue;
          
          wishes.push({
            author: authorVal || 'Ẩn danh',
            text: textVal,
            theme: themeVal || 'red',
            time: timeVal ? new Date(timeVal).getTime() : Date.now()
          });
        }
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({ votes: votes, confessions: confessions, wishes: wishes }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Ready" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. XỬ LÝ LỆNH POST (Nhận dữ liệu Form, Chữ ký, Bình chọn và Confessions gửi lên từ Web)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet1 = ss.getSheets()[0]; // Sheet thứ nhất
    var sheet2 = ss.getSheets()[1]; // Sheet thứ hai

    var data = JSON.parse(e.postData.contents);
    var formType = data.formType;

    if (formType === 'ChuKy') {
      var signature = data.signature;
      var idUser = data.idUser;
      var userCard = data.userCard;
      var x = data.x;
      var y = data.y;

      sheet2.appendRow([
        idUser,
        userCard,
        x,
        y,
        signature,
      ]);
    } else if (formType === 'BinhChon') {
      var category = data.category || '';
      var studentName = data.studentName || '';
      var voterName = data.voterName || 'Ẩn danh';
      var voterId = data.voterId || '';

      var sheet4 = getSheetByGid(ss, CONFIG.BINH_CHON_GID) || ss.getSheets()[3];
      sheet4.appendRow([
        new Date(),
        category,
        studentName,
        voterName,
        voterId
      ]);
    } else if (formType === 'Confession') {
      var author = data.author || 'Ẩn danh';
      var text = data.text || '';
      var color = data.color || 'pink';
      var time = data.time || Date.now();

      var sheet3 = getSheetByGid(ss, CONFIG.CONFESSIONS_GID) || (ss.getSheets().length > 2 ? ss.getSheets()[2] : null);
      if (sheet3) {
        sheet3.appendRow([
          new Date(time),
          author,
          text,
          color
        ]);
      }
    } else if (formType === 'Wish') {
      var author = data.author || 'Ẩn danh';
      var text = data.text || '';
      var theme = data.theme || 'red';
      var time = data.time || Date.now();

      var sheet5 = getSheetByGid(ss, CONFIG.WISHES_GID) || ss.getSheetByName("Lời điều ước") || (ss.getSheets().length > 4 ? ss.getSheets()[4] : null);
      if (sheet5) {
        sheet5.appendRow([
          new Date(time),
          author,
          text,
          theme
        ]);
      }
    } else {
      // Mặc định: Xử lý Form gửi lời nhắn thông thường ghi vào Sheet 1
      var name = data.name || '';
      var message = data.message || '';
      var form_item23 = data.form_item23 || '';
      var form_item13 = data.form_item13 || '';
      var form_item8 = data.form_item8 || '';
      var form_item12 = data.form_item12 || '';
      var form_item6 = data.form_item6 || '';

      sheet1.appendRow([
        name,       // Title
        form_item6,
        form_item23,   // Time
        form_item13,
        form_item12,
        form_item8,
        message,
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
