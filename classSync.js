// GOOGLE SHEETS SYNC MODULE FOR CLASS INVITATION
(function () {
  // 1. CẤU HÌNH ĐỒNG BỘ GOOGLE SHEET WEB APP
  // Dán URL Web App Google Apps Script của bạn vào đây để đồng bộ trực tuyến.
  // Nếu để trống, dữ liệu sẽ tự động lưu vào localStorage và hoạt động bình thường trên trình duyệt của bạn.
  window.GOOGLE_SHEETS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwVZ2tS1MOZHq3gYuYfK1j84Fjt7wFCDFMqYMG7kkM1LKUpRnKW6ybkxtELug4iosRQ/exec";

  // 2. HÀM ĐỒNG BỘ GỬI DỮ LIỆU LÊN SHEET (POST)
  window.syncWithGoogleSheets = function (action, data, callback) {
    if (!window.GOOGLE_SHEETS_SCRIPT_URL) {
      if (typeof callback === "function") callback();
      return;
    }

    let payload;
    if (action === "vote") {
      payload = {
        formType: "BinhChon",
        category: data.category,
        studentName: data.studentName,
        voterName: data.voterName,
        voterId: data.voterId,
      };
    } else if (action === "confession") {
      payload = {
        formType: "Confession",
        author: data.author,
        text: data.text,
        color: data.color,
        time: data.time
      };
    } else {
      payload = { action: action, data: data };
    }

    fetch(window.GOOGLE_SHEETS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        console.log("Google Sheets sync completed for action: " + action);
        if (typeof callback === "function") callback();
      })
      .catch((err) => {
        console.warn("Google Sheets sync error:", err);
        if (typeof callback === "function") callback();
      });
  };

  // 3. HÀM TẢI DỮ LIỆU MỚI NHẤT TỪ SHEET VỀ MÁY (GET)
  window.fetchLatestFromGoogleSheets = function () {
    if (!window.GOOGLE_SHEETS_SCRIPT_URL) return;

    fetch(window.GOOGLE_SHEETS_SCRIPT_URL + "?action=get")
      .then((res) => res.json())
      .then((data) => {
        if (data.votes) {
          window.currentVotes = data.votes;
          if (typeof window.renderLeaderboard === "function")
            window.renderLeaderboard();
          if (typeof window.initSeatingChart === "function")
            window.initSeatingChart();
        }
        if (data.confessions) {
          window.currentConfessions = data.confessions;
          if (typeof window.renderConfessionsBoard === "function")
            window.renderConfessionsBoard();
        }
        if (data.wishes) {
          window.currentWishes = data.wishes;
          localStorage.setItem(
            "class_wishes",
            JSON.stringify(window.currentWishes),
          );
          if (typeof window.renderWishingTree === "function")
            window.renderWishingTree();
        }
      })
      .catch((err) => console.warn("Google Sheets data fetch failed:", err));
  };
})();
