// SUPERLATIVES ACCORD VOTE MODULE
(function () {
  // Mock data mặc định ban đầu (để trống để tải dữ liệu thực tế từ Google Sheet)
  const superlativesVotesMock = {
    "👑 Lớp trưởng quốc dân": {},
    "😴 Chiến thần ngủ gật": {},
    "🤡 Danh hài nhân dân": {},
    "📚 Mọt sách học bá": {},
    "🏃 Chiến thần thể thao": {},
    "💅 Nam thanh nữ tú": {},
  };

  // Khởi tạo bình chọn rỗng ban đầu, dữ liệu sẽ được fetch hoàn toàn từ Google Sheet
  localStorage.removeItem("superlatives_votes");
  window.currentVotes = JSON.parse(JSON.stringify(superlativesVotesMock));

  // TÍNH TOÁN HỌC SINH ĐOẠT GIẢI NHẤT MỖI DANH HIỆU
  window.getSeatAwards = function () {
    const awards = {}; // maps studentName -> Array of { category, emoji, votes }

    for (const category in window.currentVotes) {
      const studentVotes = window.currentVotes[category];
      let maxVotes = 0;
      let winner = null;

      for (const studentName in studentVotes) {
        const votes = studentVotes[studentName];
        if (votes > maxVotes) {
          maxVotes = votes;
          winner = studentName;
        }
      }

      if (winner && maxVotes > 0) {
        const parts = category.split(" ");
        const emoji = parts[0];

        if (!awards[winner]) {
          awards[winner] = [];
        }
        awards[winner].push({
          category: category,
          emoji: emoji,
          votes: maxVotes,
        });
      }
    }
    return awards;
  };

  // VẼ BẢNG XẾP HẠNG THÀNH TÍCH
  window.renderLeaderboard = function () {
    const leaderboardGrid = document.getElementById("leaderboard-grid");
    if (!leaderboardGrid) return;

    leaderboardGrid.innerHTML = "";

    const allCategories = [
      "👑 Lớp trưởng quốc dân",
      "😴 Chiến thần ngủ gật",
      "🤡 Danh hài nhân dân",
      "📚 Mọt sách học bá",
      "🏃 Chiến thần thể thao",
      "💅 Nam thanh nữ tú"
    ];

    allCategories.forEach((category) => {
      const studentVotes = (window.currentVotes && window.currentVotes[category]) || {};
      let maxVotes = 0;
      let winnerName = "";

      for (const studentName in studentVotes) {
        const votes = studentVotes[studentName];
        if (votes > maxVotes) {
          maxVotes = votes;
          winnerName = studentName;
        }
      }

      const card = document.createElement("div");
      card.className = "leader-item-card";

      if (winnerName && maxVotes > 0) {
        const winnerObj = (window.seatingStudents || []).find(
          (s) => s.name === winnerName,
        );
        const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2355b079'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>`;
        const avatar = (winnerObj && winnerObj.avatar)
          ? winnerObj.avatar
          : defaultAvatar;

        card.innerHTML = `
                    <img class="leader-avatar" src="${avatar}" alt="${winnerName}">
                    <div class="leader-info">
                        <div class="leader-title">${category}</div>
                        <div class="leader-name">${winnerName}</div>
                        <div class="leader-votes">${maxVotes} phiếu bầu</div>
                    </div>
                `;
      } else {
        card.innerHTML = `
                    <div class="leader-avatar" style="display:flex;align-items:center;justify-content:center;background:#eee;font-size:18px;">👤</div>
                    <div class="leader-info">
                        <div class="leader-title">${category}</div>
                        <div class="leader-name" style="color:#999;font-style:italic;font-size:11px;">Chưa có bình chọn</div>
                        <div class="leader-votes">0 phiếu bầu</div>
                    </div>
                `;
      }

      leaderboardGrid.appendChild(card);
    });
  };

  // Khởi tạo hoặc đọc mã người bầu (Voter ID) từ localStorage để chống spam
  let voterId = localStorage.getItem("class_voter_id");
  if (!voterId) {
    voterId = "voter_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("class_voter_id", voterId);
  }

  // KHỞI TẠO LOGIC BÌNH CHỌN
  window.initSuperlatives = function () {
    const studentSelect = document.getElementById("vote-student");
    const voterSelect = document.getElementById("vote-voter-name");
    if (!studentSelect) return;

    // Đổ danh sách học sinh vào select box bình chọn và select box người bầu
    studentSelect.innerHTML =
      '<option value="" disabled selected>Chọn bạn học...</option>';
    if (voterSelect) {
      voterSelect.innerHTML =
        '<option value="" disabled selected>Chọn tên của bạn...</option>';
    }
    const sortedStudents = [...(window.seatingStudents || [])].sort((a, b) =>
      a.name.localeCompare(b.name, "vi")
    );
    sortedStudents.forEach((student) => {
      const opt = document.createElement("option");
      opt.value = student.name;
      opt.textContent = student.name;
      studentSelect.appendChild(opt);

      if (voterSelect) {
        const optVoter = document.createElement("option");
        optVoter.value = student.name;
        optVoter.textContent = student.name;
        voterSelect.appendChild(optVoter);
      }
    });

    window.renderLeaderboard();

    const voteForm = document.getElementById("superlative-vote-form");
    if (voteForm) {
      // Loại bỏ Listener cũ nếu có để tránh lặp event
      const newVoteForm = voteForm.cloneNode(true);
      voteForm.parentNode.replaceChild(newVoteForm, voteForm);

      newVoteForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const category = document.getElementById("vote-category").value;
        const studentName = document.getElementById("vote-student").value;
        const voterNameInput = document.getElementById("vote-voter-name");
        const voterName = voterNameInput ? voterNameInput.value.trim() : "Ẩn danh";

        if (!category || !studentName) return;

        // Đọc danh sách danh hiệu đã vote trên thiết bị này
        let votedCategories = {};
        try {
          const saved = localStorage.getItem("voted_categories");
          if (saved) votedCategories = JSON.parse(saved);
        } catch (err) {}

        if (votedCategories[category]) {
          alert(`Bạn đã bình chọn cho danh hiệu "${category}" rồi! Mỗi người chỉ được bầu chọn 1 lần cho mỗi danh hiệu.`);
          return;
        }

        // Lưu danh hiệu đã vote vào localStorage của thiết bị để chặn bầu lại
        votedCategories[category] = true;
        localStorage.setItem("voted_categories", JSON.stringify(votedCategories));

        // Gửi đồng bộ lên Google Sheets (qua Apps Script Web App)
        if (typeof window.syncWithGoogleSheets === "function") {
          window.syncWithGoogleSheets("vote", {
            category: category,
            studentName: studentName,
            voterName: voterName,
            voterId: voterId
          }, function() {
            // Khi đã lưu xong lên Google Sheets, tải lại dữ liệu mới nhất từ Sheet
            if (typeof window.fetchLatestFromGoogleSheets === "function") {
              window.fetchLatestFromGoogleSheets();
            }
          });
        }

        // Reset ô nhập tên
        if (voterNameInput) {
          voterNameInput.value = "";
        }

        alert(`Cảm ơn ${voterName} đã bình chọn danh hiệu "${category}" cho ${studentName}!`);
      });
    }
  };
})();
