// SUPERLATIVES ACCORD VOTE MODULE
(function() {
    // Mock data mặc định ban đầu
    const superlativesVotesMock = {
        "👑 Lớp trưởng quốc dân": { "Khánh Linh": 15, "Minh Quân": 12, "Ngọc Anh": 4 },
        "😴 Chiến thần ngủ gật": { "Gia Huy": 18, "Hoàng Long": 11, "Thế Vinh": 5 },
        "🤡 Danh hài nhân dân": { "Gia Huy": 22, "Hoàng Bách": 14, "Tuấn Anh": 3 },
        "📚 Mọt sách học bá": { "Minh Triết": 25, "Khánh Linh": 9, "Phương Thảo": 4 },
        "🏃 Chiến thần thể thao": { "Hoàng Long": 17, "Gia Bảo": 12, "Thế Vinh": 2 },
        "💅 Nam thanh nữ tú": { "Ngọc Anh": 14, "Thu Hà": 11, "Quỳnh Chi": 5 }
    };

    // Tải bình chọn từ localStorage hoặc mock data
    try {
        const savedVotes = localStorage.getItem("superlatives_votes");
        window.currentVotes = savedVotes ? JSON.parse(savedVotes) : JSON.parse(JSON.stringify(superlativesVotesMock));
    } catch (e) {
        window.currentVotes = JSON.parse(JSON.stringify(superlativesVotesMock));
    }

    // TÍNH TOÁN HỌC SINH ĐOẠT GIẢI NHẤT MỖI DANH HIỆU
    window.getSeatAwards = function() {
        const awards = {}; // maps studentName -> { category, emoji, votes }
        
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

                // Nếu học sinh đoạt nhiều giải, chọn giải có số lượt vote cao nhất
                if (!awards[winner] || awards[winner].votes < maxVotes) {
                    awards[winner] = {
                        category: category,
                        emoji: emoji,
                        votes: maxVotes
                    };
                }
            }
        }
        return awards;
    };

    // VẼ BẢNG XẾP HẠNG THÀNH TÍCH
    window.renderLeaderboard = function() {
        const leaderboardGrid = document.getElementById("leaderboard-grid");
        if (!leaderboardGrid) return;

        leaderboardGrid.innerHTML = '';

        for (const category in window.currentVotes) {
            const studentVotes = window.currentVotes[category];
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
                const winnerObj = (window.seatingStudents || []).find(s => s.name === winnerName);
                const avatar = winnerObj ? winnerObj.avatar : "https://i.pravatar.cc/150?img=99";

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
        }
    };

    // KHỞI TẠO LOGIC BÌNH CHỌN
    window.initSuperlatives = function() {
        const studentSelect = document.getElementById("vote-student");
        if (!studentSelect) return;

        // Đổ danh sách học sinh vào select box bình chọn
        studentSelect.innerHTML = '<option value="" disabled selected>Chọn bạn học...</option>';
        const sortedStudents = [...(window.seatingStudents || [])].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        sortedStudents.forEach(student => {
            const opt = document.createElement("option");
            opt.value = student.name;
            opt.textContent = student.name;
            studentSelect.appendChild(opt);
        });

        window.renderLeaderboard();

        const voteForm = document.getElementById("superlative-vote-form");
        if (voteForm) {
            // Loại bỏ Listener cũ nếu có
            const newVoteForm = voteForm.cloneNode(true);
            voteForm.parentNode.replaceChild(newVoteForm, voteForm);

            newVoteForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const category = document.getElementById("vote-category").value;
                const studentName = document.getElementById("vote-student").value;

                if (!category || !studentName) return;

                if (!window.currentVotes[category]) {
                    window.currentVotes[category] = {};
                }
                if (!window.currentVotes[category][studentName]) {
                    window.currentVotes[category][studentName] = 0;
                }
                window.currentVotes[category][studentName]++;

                // Lưu lại localStorage
                localStorage.setItem("superlatives_votes", JSON.stringify(window.currentVotes));

                // Gửi đồng bộ Google Sheets (nếu có cấu hình)
                if (typeof window.syncWithGoogleSheets === "function") {
                    window.syncWithGoogleSheets("vote", { category: category, studentName: studentName });
                }

                // Cập nhật lại giao diện
                window.renderLeaderboard();
                if (typeof window.initSeatingChart === "function") {
                    window.initSeatingChart();
                }

                alert(`Cảm ơn bạn đã bình chọn "${category}" cho ${studentName}!`);
            });
        }
    };
})();
