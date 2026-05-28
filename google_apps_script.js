/**
 * GOOGLE APPS SCRIPT ĐÃ TÍCH HỢP (FORM + CHỮ KÝ + BÌNH CHỌN VUI)
 * Dành cho URL: https://script.google.com/macros/s/AKfycbwhdp2yiphU2OuDgi79X3fC0ek_iL8zpTGaV8AXigUYsL_q8_Ok7vfvUrv03LNFCwVH/exec
 * 
 * Các Tab Trang Tính cần có trong File Google Sheets:
 * - Tab 1 (Index 0): Tab nhận dữ liệu Form gửi lời nhắn.
 * - Tab 2 (Index 1): Tab nhận dữ liệu Chữ ký (ChuKy).
 * - Tab 3 (Index 2): Tab khác (nếu có).
 * - Tab 4 (Index 3): Tab "Bình chọn vui" nhận nhật ký bình chọn (BinhChon).
 */

// 1. XỬ LÝ LỆNH GET (Lấy dữ liệu phiếu bầu tổng hợp gửi về cho Web hiển thị Bảng xếp hạng)
function doGet(e) {
  try {
    var action = e.parameter.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "get") {
      var sheet4 = ss.getSheets()[3]; // Sheet thứ tư (Tab Bình chọn vui)
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
      
      return ContentService
        .createTextOutput(JSON.stringify({ votes: votes }))
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

// 2. XỬ LÝ LỆNH POST (Nhận dữ liệu Form, Chữ ký và Bình chọn gửi lên từ Web)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet(); // Đây mới là toàn bộ file
    var sheet1 = ss.getSheets()[0]; // Sheet thứ nhất
    var sheet2 = ss.getSheets()[1]; // Sheet thứ hai
    var sheet4 = ss.getSheets()[3]; // Sheet thứ tư (Tab Bình chọn vui)

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

      // Ghi nhật ký bình chọn vào Sheet 4 (Tab Bình chọn vui)
      // Cột A: Thời gian, Cột B: Danh hiệu, Cột C: Học sinh được bầu, Cột D: Người bầu, Cột E: Mã người bầu
      sheet4.appendRow([
        new Date(),
        category,
        studentName,
        voterName,
        voterId
      ]);
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
