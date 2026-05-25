// GOOGLE SHEETS SYNC MODULE FOR CLASS INVITATION
(function () {
  // 1. CẤU HÌNH ĐỒNG BỘ GOOGLE SHEET WEB APP
  // Dán URL Web App Google Apps Script của bạn vào đây để đồng bộ trực tuyến.
  // Nếu để trống, dữ liệu sẽ tự động lưu vào localStorage và hoạt động bình thường trên trình duyệt của bạn.
  window.GOOGLE_SHEETS_SCRIPT_URL = "";

  // 2. HÀM ĐỒNG BỘ GỬI DỮ LIỆU LÊN SHEET (POST)
  window.syncWithGoogleSheets = function (action, data) {
    if (!window.GOOGLE_SHEETS_SCRIPT_URL) return;

    fetch(window.GOOGLE_SHEETS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: action, data: data }),
    })
      .then(() =>
        console.log("Google Sheets sync completed for action: " + action),
      )
      .catch((err) => console.warn("Google Sheets sync error:", err));
  };

  // 3. HÀM TẢI DỮ LIỆU MỚI NHẤT TỪ SHEET VỀ MÁY (GET)
  window.fetchLatestFromGoogleSheets = function () {
    if (!window.GOOGLE_SHEETS_SCRIPT_URL) return;

    fetch(window.GOOGLE_SHEETS_SCRIPT_URL + "?action=get")
      .then((res) => res.json())
      .then((data) => {
        if (data.votes) {
          window.currentVotes = data.votes;
          localStorage.setItem(
            "superlatives_votes",
            JSON.stringify(window.currentVotes),
          );
          if (typeof window.renderLeaderboard === "function")
            window.renderLeaderboard();
          if (typeof window.initSeatingChart === "function")
            window.initSeatingChart();
        }
        if (data.confessions) {
          window.currentConfessions = data.confessions;
          localStorage.setItem(
            "anonymous_confessions",
            JSON.stringify(window.currentConfessions),
          );
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
