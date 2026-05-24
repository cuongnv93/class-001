// ANONYMOUS CONFESSIONS MODULE
(function () {
    const now = Date.now();

    // Dữ liệu mock ban đầu (Sử dụng timestamp thực tế lùi lại theo thời gian)
    const confessionsListMock = [
        { author: "Ẩn danh", text: "Thực ra mình đã thích thầm cậu bạn bàn bên suốt 3 năm học qua... Chúc cậu thi tốt nhé!", color: "pink", time: now - 10 * 60 * 1000 },       // 10 phút trước
        { author: "Tổ trưởng tổ 3", text: "Mong cả lớp chúng ta ai cũng đỗ nguyện vọng 1 và mãi mãi nhớ về nhau!", color: "cream", time: now - 60 * 60 * 1000 },      // 1 giờ trước
        { author: "Quân Minh", text: "Nhớ nhất những buổi trốn học đi uống trà sữa trân châu tổ 2 bao.", color: "pink", time: now - 3 * 60 * 60 * 1000 },       // 3 giờ trước
        { author: "Cô gái chuyên Toán", text: "Thanh xuân đẹp nhất là khi có các cậu cùng đồng hành.", color: "cream", time: now - 5 * 60 * 60 * 1000 },    // 5 giờ trước
        { author: "Ẩn danh", text: "Lớp mình là tuyệt vời nhất! 12A1 mãi đỉnh!!", color: "cream", time: now - 24 * 60 * 60 * 1000 }      // 1 ngày trước
    ];

    // Tải confessions từ localStorage hoặc mock data
    try {
        const savedConfessions = localStorage.getItem("anonymous_confessions");
        window.currentConfessions = savedConfessions ? JSON.parse(savedConfessions) : JSON.parse(JSON.stringify(confessionsListMock));
    } catch (e) {
        window.currentConfessions = JSON.parse(JSON.stringify(confessionsListMock));
    }

    // HÀM TÍNH THỜI GIAN ĐỘNG (REAL-TIME RELATIVE TIME)
    function formatRelativeTime(timeVal) {
        if (!timeVal) return "Vừa xong";

        let dateMs = Number(timeVal);

        // Nếu không phải là dạng số (ví dụ: chuỗi ISO hoặc chuỗi ngày giờ từ Google Sheets)
        if (isNaN(dateMs)) {
            const parsedDate = Date.parse(timeVal);
            if (!isNaN(parsedDate)) {
                dateMs = parsedDate;
            } else {
                // Trả về chuỗi gốc nếu không thể phân tích cú pháp (fallback)
                return timeVal;
            }
        }

        const diff = Date.now() - dateMs;

        // Nếu chênh lệch âm hoặc quá nhỏ do lệch giờ hệ thống
        if (diff < 0) return "Vừa xong";

        const diffSecs = Math.floor(diff / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffMins < 1) {
            return "Vừa xong";
        } else if (diffMins < 60) {
            return `${diffMins} phút trước`;
        } else if (diffHrs < 24) {
            return `${diffHrs} giờ trước`;
        } else if (diffDays < 7) {
            return `${diffDays} ngày trước`;
        } else {
            // Định dạng ngày giờ chuẩn dd/MM/yyyy HH:mm
            const date = new Date(dateMs);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
    }

    // VẼ CÁC POST-IT LÊN CORKBOARD
    window.renderConfessionsBoard = function () {
        const board = document.getElementById("confessions-board");
        if (!board) return;

        board.innerHTML = '';

        window.currentConfessions.forEach(item => {
            const note = document.createElement("div");

            // Xoay góc ngẫu nhiên từ -3deg đến +3deg để tự nhiên hơn
            const rot = (Math.random() * 6 - 3).toFixed(1);

            note.className = `confession-note ${item.color}`;
            note.style.transform = `rotate(${rot}deg)`;

            note.innerHTML = `
                <div class="note-text">${escapeHtml(item.text)}</div>
                <div class="note-footer">
                    <span class="note-author">✍️ ${escapeHtml(item.author)}</span>
                    <span class="note-time">${formatRelativeTime(item.time)}</span>
                </div>
            `;

            board.appendChild(note);
        });
    };

    // KHỞI TẠO KHU VỰC TƯƠNG TÁC CONFESSIONS
    window.initConfessions = function () {
        window.renderConfessionsBoard();

        const confessionForm = document.getElementById("confession-submit-form");
        if (confessionForm) {
            // Loại bỏ Event Listener cũ nếu có
            const newConfessionForm = confessionForm.cloneNode(true);
            confessionForm.parentNode.replaceChild(newConfessionForm, confessionForm);

            newConfessionForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const authorInput = document.getElementById("confession-author");
                const messageInput = document.getElementById("confession-message");
                const colorSelect = document.getElementById("confession-color");

                const author = authorInput.value.trim() || "Ẩn danh";
                const text = messageInput.value.trim();
                const color = colorSelect.value || "pink";

                if (!text) return;

                const newConfession = {
                    author: author,
                    text: text,
                    color: color,
                    time: Date.now() // Lưu timestamp thực tế thay vì chuỗi chữ cố định
                };

                window.currentConfessions.unshift(newConfession);

                // Lưu lại localStorage
                localStorage.setItem("anonymous_confessions", JSON.stringify(window.currentConfessions));

                // Đồng bộ hóa với Google Sheets (nếu có)
                if (typeof window.syncWithGoogleSheets === "function") {
                    window.syncWithGoogleSheets("confession", newConfession);
                }

                // Cập nhật lại giao diện
                window.renderConfessionsBoard();

                // Reset form
                authorInput.value = '';
                messageInput.value = '';
                colorSelect.selectedIndex = 0;
            });
        }
    };

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
})();
