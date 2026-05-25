// CLASS WISHING TREE MODULE (TANZAKU JAPANESE STYLE)
(function () {
    const now = Date.now();

    // 30 Dữ liệu mock ban đầu tương ứng với 30 vị trí lá trên cành
    const wishesListMock = [
        { author: "Lớp trưởng", text: "Chúc tập thể 12A1 của chúng mình luôn đoàn kết, yêu thương nhau. Mong rằng tất cả các bạn đều đạt điểm cao trong kỳ thi tốt nghiệp sắp tới và bước chân vào ngôi trường Đại học mong ước!", theme: "red", time: now - 5 * 60 * 1000 },
        { author: "Ẩn danh", text: "Ước mong đỗ nguyện vọng 1 vào Đại học Bách Khoa Hà Nội ngành CNTT! 12A1 quyết thắng!", theme: "green", time: now - 15 * 60 * 1000 },
        { author: "Minh Tuấn", text: "Mong rằng tớ sẽ đạt điểm IELTS 8.0 trong năm nay để đi du học thuận lợi.", theme: "gold", time: now - 35 * 60 * 1000 },
        { author: "Quỳnh Anh", text: "Chúc cho tình bạn của chúng ta mãi bền chặt, dù sau này mỗi đứa một phương trời.", theme: "red", time: now - 50 * 60 * 1000 },
        { author: "Ẩn danh", text: "Ước gì học kỳ này cả tổ 3 đều được học sinh giỏi!", theme: "green", time: now - 72 * 60 * 1000 },
        { author: "Bảo Nam", text: "Chúc thầy cô luôn mạnh khỏe và lớp mình đỗ tốt nghiệp 100%.", theme: "gold", time: now - 2 * 60 * 60 * 1000 },
        { author: "Cậu bé bàn cuối", text: "Tớ thầm ước cô bạn ngồi bàn đầu tổ 2 luôn vui vẻ và hạnh phúc. Mong là sau này chúng mình vẫn giữ liên lạc với nhau nhé.", theme: "red", time: now - 2.5 * 60 * 60 * 1000 },
        { author: "Lớp phó học tập", text: "Chúc cả lớp thi cử thật suôn sẻ, đề thi trúng tủ! 10 năm sau họp lớp, ai trong chúng mình cũng đã có một sự nghiệp thành công rực rỡ nhé!", theme: "gold", time: now - 5 * 60 * 60 * 1000 },
        { author: "Ẩn danh", text: "Gửi thời thanh xuân tươi đẹp nhất! Cảm ơn thầy cô và tất cả các bạn học đã cùng đồng hành tạo nên những kỷ niệm học sinh không bao giờ quên.", theme: "green", time: now - 18 * 60 * 60 * 1000 },
        { author: "Vy Vy", text: "Ước mơ nhỏ bé của tớ là trở thành một nhà thiết kế thời trang tài năng. Chúc lớp mình luôn giữ mãi ngọn lửa đam mê!", theme: "gold", time: now - 28 * 60 * 60 * 1000 },
        { author: "Hoàng Long", text: "Mong đỗ vào Đại học Kinh tế Quốc dân ngành Quản trị Kinh doanh!", theme: "green", time: now - 32 * 60 * 60 * 1000 },
        { author: "Phương Thảo", text: "Chúc cho cả lớp mình ai cũng tìm thấy hạnh phúc riêng và thành công trên con đường đã chọn.", theme: "red", time: now - 36 * 60 * 60 * 1000 },
        { author: "Ẩn danh", text: "Cảm ơn thanh xuân vì đã cho tớ gặp gỡ những người bạn tuyệt vời nhất ở 12A1.", theme: "red", time: now - 42 * 60 * 60 * 1000 },
        { author: "Đức Anh", text: "Chiến thắng kỳ thi tốt nghiệp THPT Quốc gia! 12A1 tiến lên!", theme: "green", time: now - 45 * 60 * 60 * 1000 },
        { author: "Khánh Linh", text: "Chúc cho cô chủ nhiệm luôn giữ vững ngọn lửa nhiệt huyết để dẫn dắt các thế hệ học trò.", theme: "gold", time: now - 48 * 60 * 60 * 1000 },
        { author: "Ẩn danh", text: "Mong ước gia đình luôn bình an, mạnh khỏe và luôn ủng hộ những quyết định của tớ.", theme: "green", time: now - 52 * 60 * 60 * 1000 },
        { author: "Tuấn Kiệt", text: "Hi vọng sau này tớ sẽ trở thành một kiến trúc sư thiết kế nên những công trình vĩ đại.", theme: "gold", time: now - 60 * 60 * 1000 },
        { author: "Thu Hà", text: "Nhớ mãi những buổi chiều cùng nhau ăn vặt cổng trường và ôn thi mệt mỏi.", theme: "red", time: now - 65 * 60 * 1000 },
        { author: "Ẩn danh", text: "Ước mơ đỗ vào trường Đại học Ngoại thương ngành Kinh tế đối ngoại!", theme: "green", time: now - 72 * 60 * 1000 },
        { author: "Hữu Phước", text: "Chúc cho câu lạc bộ bóng đá trường mình luôn phát triển mạnh mẽ.", theme: "gold", time: now - 80 * 60 * 1000 },
        { author: "Tuyết Mai", text: "Mong rằng tớ có thể đi du lịch khắp thế giới cùng người thân yêu.", theme: "red", time: now - 90 * 60 * 1000 },
        { author: "Ẩn danh", text: "Chúc các thầy cô giáo luôn giữ mãi nụ cười trên môi mỗi khi đứng lớp.", theme: "green", time: now - 100 * 60 * 1000 },
        { author: "Hải Đăng", text: "Mong đỗ vào Học viện Bưu chính Viễn thông ngành An toàn thông tin!", theme: "green", time: now - 110 * 60 * 1000 },
        { author: "Ngọc Trâm", text: "Chúc cho bản thân luôn tự tin, kiên cường vượt qua mọi khó khăn thử thách phía trước.", theme: "red", time: now - 120 * 60 * 1000 },
        { author: "Ẩn danh", text: "Ước gì được quay lại năm lớp 10 để sửa chữa những sai lầm ngớ ngẩn ngày xưa.", theme: "green", time: now - 130 * 60 * 1000 },
        { author: "Thành Đạt", text: "Chúc cho ước mơ trở thành một phi công của tớ sớm thành hiện thực.", theme: "gold", time: now - 140 * 60 * 1000 },
        { author: "Mỹ Duyên", text: "Ước mong đỗ vào Đại học Y Hà Nội ngành Bác sĩ Đa khoa!", theme: "red", time: now - 150 * 60 * 1000 },
        { author: "Ẩn danh", text: "Chúc cho người tớ yêu thầm suốt 3 năm luôn vui vẻ, hạnh phúc và thành công.", theme: "red", time: now - 160 * 60 * 1000 },
        { author: "Quang Huy", text: "Mong đỗ Đại học Giao thông Vận tải ngành Kỹ thuật ô tô!", theme: "green", time: now - 170 * 60 * 1000 },
        { author: "Nhật Minh", text: "12A1 mãi là ký ức đẹp nhất trong tim mỗi chúng ta. Tạm biệt thời học sinh!", theme: "gold", time: now - 180 * 60 * 1000 }
    ];

    // Tải dữ liệu từ localStorage hoặc mock data
    try {
        const savedWishes = localStorage.getItem("class_wishes");
        window.currentWishes = savedWishes ? JSON.parse(savedWishes) : JSON.parse(JSON.stringify(wishesListMock));
    } catch (e) {
        window.currentWishes = JSON.parse(JSON.stringify(wishesListMock));
    }

    // Định nghĩa chính xác 30 tọa độ tương ứng với vị trí các cành cây SVG (dành cho cây Tanzaku Nhật Bản sum suê)
    const LEAF_POSITIONS = [
        // Phía cành bên trái (10 vị trí)
        { left: "12%", top: "38%" },
        { left: "16%", top: "28%" },
        { left: "20%", top: "45%" },
        { left: "22%", top: "22%" },
        { left: "25%", top: "36%" },
        { left: "28%", top: "18%" },
        { left: "32%", top: "28%" },
        { left: "34%", top: "40%" },
        { left: "10%", top: "22%" },
        { left: "15%", top: "16%" },

        // Phía giữa và trên cao (8 vị trí)
        { left: "42%", top: "14%" },
        { left: "45%", top: "24%" },
        { left: "48%", top: "10%" },
        { left: "52%", top: "10%" },
        { left: "55%", top: "22%" },
        { left: "58%", top: "14%" },
        { left: "38%", top: "32%" },
        { left: "48%", top: "34%" },

        // Phía cành bên phải (10 vị trí)
        { left: "64%", top: "28%" },
        { left: "66%", top: "18%" },
        { left: "70%", top: "36%" },
        { left: "74%", top: "24%" },
        { left: "78%", top: "42%" },
        { left: "82%", top: "30%" },
        { left: "85%", top: "38%" },
        { left: "88%", top: "22%" },
        { left: "72%", top: "14%" },
        { left: "78%", top: "16%" },
        
        // Phía cành thấp (2 vị trí)
        { left: "28%", top: "48%" },
        { left: "68%", top: "48%" }
    ];

    // HÀM TÍNH THỜI GIAN ĐỘNG (REAL-TIME RELATIVE TIME)
    function formatRelativeTime(timeVal) {
        if (!timeVal) return "Vừa xong";
        let dateMs = Number(timeVal);

        if (isNaN(dateMs)) {
            const parsedDate = Date.parse(timeVal);
            if (!isNaN(parsedDate)) {
                dateMs = parsedDate;
            } else {
                return timeVal;
            }
        }

        const diff = Date.now() - dateMs;
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
            const date = new Date(dateMs);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }
    }

    // POPULATE LÁ ĐIỀU ƯỚC LÊN CÂY (TANZAKU STYLE)
    window.renderWishingTree = function () {
        const canvas = document.getElementById("wishing-tree-canvas");
        if (!canvas) return;

        // Xóa các lá cũ
        const oldLeaves = canvas.querySelectorAll(".wishing-leaf");
        oldLeaves.forEach(el => el.remove());

        // Lấy tối đa 30 điều ước mới nhất để treo lên cây
        const displayWishes = window.currentWishes.slice(0, LEAF_POSITIONS.length);

        displayWishes.forEach((wish, index) => {
            const pos = LEAF_POSITIONS[index];
            const leaf = document.createElement("div");
            
            // Thêm class đặc biệt nếu điều ước này vừa được tạo
            const isNew = wish.isNewElement ? " new-wish" : "";
            leaf.className = `wishing-leaf${isNew}`;
            leaf.style.left = pos.left;
            leaf.style.top = pos.top;

            // Góc đung đưa ngẫu nhiên lệch pha để tự nhiên hơn
            const delay = (Math.random() * -3).toFixed(2);
            leaf.style.animationDelay = `${delay}s`;

            // TÁCH LẤY TÊN Ở CUỐI MỖI CHỮ (Ví dụ: "Nguyễn Văn Cường" -> "Cường")
            const authorName = wish.author.trim();
            const nameParts = authorName.split(/\s+/);
            const displayName = nameParts[nameParts.length - 1] || "Ẩn danh";

            leaf.innerHTML = `
                <div class="wishing-leaf-tooltip">Điều ước của ${escapeHtml(wish.author)}</div>
                <div class="wishing-leaf-thread"></div>
                <div class="wishing-leaf-tag ${wish.theme || 'red'}">
                    <div class="wishing-leaf-tag-text">${escapeHtml(displayName)}</div>
                </div>
            `;

            // Lắng nghe click để mở chi tiết
            leaf.addEventListener("click", function () {
                openWishDetail(wish);
            });

            canvas.appendChild(leaf);

            // Gỡ bỏ class phát sáng của lá mới sau 10 giây
            if (wish.isNewElement) {
                setTimeout(() => {
                    leaf.classList.remove("new-wish");
                    delete wish.isNewElement;
                }, 10000);
            }
        });
    };

    // MỞ CHI TIẾT MỘT ĐIỀU ƯỚC
    function openWishDetail(wish) {
        const modal = document.getElementById("wish-detail-modal");
        if (!modal) return;

        let icon = "🔴";
        if (wish.theme === "green") icon = "🍃";
        if (wish.theme === "gold") icon = "✨";

        modal.querySelector(".wish-card-icon").textContent = icon;
        modal.querySelector(".wish-card-text").textContent = `"${wish.text}"`;
        modal.querySelector(".wish-card-author").textContent = `✍️ ${wish.author}`;
        modal.querySelector(".wish-card-time").textContent = formatRelativeTime(wish.time);

        modal.classList.add("active");
    }

    // MỞ DANH SÁCH TẤT CẢ ĐIỀU ƯỚC DẠNG LƯỚI
    function openAllWishes() {
        const modal = document.getElementById("wish-list-modal");
        const container = document.getElementById("wishes-grid-container");
        if (!modal || !container) return;

        container.innerHTML = "";

        window.currentWishes.forEach(wish => {
            const card = document.createElement("div");
            card.className = `wish-grid-card ${wish.theme || 'red'}`;

            let icon = "🔴";
            if (wish.theme === "green") icon = "🍃";
            if (wish.theme === "gold") icon = "✨";

            card.innerHTML = `
                <div class="grid-card-text">"${escapeHtml(wish.text)}"</div>
                <div class="grid-card-footer">
                    <span>${icon} ${escapeHtml(wish.author)}</span>
                    <span>${formatRelativeTime(wish.time)}</span>
                </div>
            `;

            // Click vào card nhỏ mở modal xem to
            card.addEventListener("click", () => {
                modal.classList.remove("active");
                setTimeout(() => openWishDetail(wish), 250);
            });

            container.appendChild(card);
        });

        modal.classList.add("active");
    }

    // ĐÓNG TẤT CẢ MODAL
    function closeAllModals() {
        const modals = document.querySelectorAll(".wishing-modal");
        modals.forEach(modal => modal.classList.remove("active"));
    }

    // KHỞI TẠO KHU VỰC CÂY ĐIỀU ƯỚC
    window.initWishingTree = function () {
        window.renderWishingTree();

        // Cài đặt đóng mở modal
        const closeBtns = document.querySelectorAll(".wishing-modal-close");
        closeBtns.forEach(btn => {
            btn.addEventListener("click", closeAllModals);
        });

        const backdrops = document.querySelectorAll(".wishing-modal-backdrop");
        backdrops.forEach(backdrop => {
            backdrop.addEventListener("click", closeAllModals);
        });

        // Nút mở tất cả điều ước
        const readAllBtn = document.getElementById("btn-read-all-wishes");
        if (readAllBtn) {
            readAllBtn.addEventListener("click", openAllWishes);
        }

        // Xử lý gửi Form điều ước
        const wishingForm = document.getElementById("wishing-submit-form");
        if (wishingForm) {
            // Loại bỏ Listener cũ (nếu có)
            const newForm = wishingForm.cloneNode(true);
            wishingForm.parentNode.replaceChild(newForm, wishingForm);

            newForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const authorInput = document.getElementById("wish-author");
                const messageInput = document.getElementById("wish-message");
                const themeRadio = newForm.querySelector('input[name="wish-theme"]:checked');

                const author = authorInput.value.trim() || "Ẩn danh";
                const text = messageInput.value.trim();
                const theme = themeRadio ? themeRadio.value : "red";

                if (!text) return;

                const newWish = {
                    author: author,
                    text: text,
                    theme: theme,
                    time: Date.now(),
                    isNewElement: true // Đánh dấu là phần tử mới để tạo hiệu ứng phát sáng
                };

                // Thêm vào đầu danh sách
                window.currentWishes.unshift(newWish);

                // Lưu vào localStorage
                localStorage.setItem("class_wishes", JSON.stringify(window.currentWishes));

                // Đồng bộ hóa với Google Sheets (nếu có cấu hình)
                if (typeof window.syncWithGoogleSheets === "function") {
                    window.syncWithGoogleSheets("wish", newWish);
                }

                // Cập nhật lại giao diện cây
                window.renderWishingTree();

                // Reset Form
                authorInput.value = "";
                messageInput.value = "";
                const defaultTheme = newForm.querySelector('input[name="wish-theme"][value="red"]');
                if (defaultTheme) defaultTheme.checked = true;

                // Tạo hiệu ứng nổ pháo hoa hạt lấp lánh cực lung linh khi gửi thành công
                for (let i = 0; i < 30; i++) {
                    setTimeout(() => spawnSingleParticle(true), i * 60);
                }
            });
        }

        // Bắt đầu luồng tạo hạt bay lơ lửng và cánh hoa rơi
        startFloatingParticles();
    };

    // LUỒNG HIỆU ỨNG HẠT LẤP LÁNH VÀ CÁNH HOA RƠI LUNG LINH
    let sparkleInterval = null;
    let petalInterval = null;

    function startFloatingParticles() {
        if (sparkleInterval) clearInterval(sparkleInterval);
        if (petalInterval) clearInterval(petalInterval);

        // 1. Sinh hạt lấp lánh (sparkle) lơ lửng xung quanh cây mỗi 800ms
        sparkleInterval = setInterval(() => {
            spawnSingleParticle(false, false);
        }, 800);

        // 2. Sinh cánh hoa anh đào rơi từ trên xuống mỗi 2.5 giây
        petalInterval = setInterval(() => {
            spawnSingleParticle(false, true);
        }, 2500);

        // Tạo sẵn một số hạt để cây lung linh ngay lập tức khi load trang
        for (let i = 0; i < 8; i++) {
            spawnSingleParticle(false, false, Math.random() * 300 + 100);
        }
        for (let i = 0; i < 3; i++) {
            spawnSingleParticle(false, true, Math.random() * 250);
        }
    }

    function spawnSingleParticle(isExplosion = false, forcePetal = false, customY = null) {
        const canvas = document.getElementById("wishing-tree-canvas");
        if (!canvas) return;

        const particle = document.createElement("div");
        
        // Xác định loại hạt: sparkle hay hoa anh đào (petal)
        let isSparkle = !forcePetal;
        if (!isExplosion && !forcePetal) {
            isSparkle = Math.random() > 0.45; // 55% sparkle, 45% petal khi chạy tự động
        }

        particle.className = `wishing-particle${isSparkle ? ' sparkle' : ''}`;

        // Kích thước hạt ngẫu nhiên
        const size = isSparkle ? (Math.random() * 6 + 3) : (Math.random() * 7 + 5);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        let animDuration;

        if (isExplosion) {
            // Nổ hoa chúc mừng ném hạt ra từ tâm cây
            const startX = 200 + Math.random() * 200;
            const startY = 150 + Math.random() * 150;
            animDuration = 1.2 + Math.random() * 1.5;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 120;
            const endX = startX + Math.cos(angle) * distance;
            const endY = startY + Math.sin(angle) * distance - 40;

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            particle.style.transition = `all ${animDuration}s cubic-bezier(0.1, 0.8, 0.3, 1), opacity ${animDuration}s ease`;
            
            if (isSparkle) {
                particle.style.background = `radial-gradient(circle, #FFE5A3 0%, rgba(255, 255, 255, 0) 70%)`;
            } else {
                particle.style.background = "#FFA4B4";
            }

            canvas.appendChild(particle);

            setTimeout(() => {
                particle.style.left = `${endX}px`;
                particle.style.top = `${endY}px`;
                particle.style.opacity = 0;
                particle.style.transform = `rotate(${Math.random() * 360}deg) scale(0.3)`;
            }, 50);

            setTimeout(() => particle.remove(), animDuration * 1000 + 100);
            return;
        }

        // Sinh hạt bay tự nhiên
        if (isSparkle) {
            // HẠT LẤP LÁNH: Bay lơ lửng, tan biến nhẹ tại khu vực tán cây
            const startX = 100 + Math.random() * 400; // Tập trung xung quanh tán cây
            const startY = customY !== null ? customY : (100 + Math.random() * 320);
            animDuration = 3 + Math.random() * 3; // Bay nhanh hơn 3-6s

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            // Set variables cho Keyframe animation
            particle.style.setProperty("--start-y", `${startY}px`);
            particle.style.setProperty("--target-x-shift", `${-30 + Math.random() * 60}px`);
            
            particle.style.animation = `floatSparkle ${animDuration}s ease-in-out forwards`;
        } else {
            // CÁNH HOA RƠI: Rơi từ đỉnh xuống đáy
            const startX = Math.random() * canvas.clientWidth;
            const startY = customY !== null ? customY : -20; // Bắt đầu ở mép trên cùng
            animDuration = 7 + Math.random() * 8; // Rơi chậm rãi 7-15s

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            const targetXShift = 50 + Math.random() * 100;
            particle.style.setProperty("--target-x-shift", `${targetXShift}px`);
            
            // Tông màu xanh lá tự nhiên
            const greenTones = ["#A8D5BA", "#C8E6C9", "#D4EDDA", "#81C784"];
            particle.style.background = greenTones[Math.floor(Math.random() * greenTones.length)];
            
            particle.style.animation = `fallPetal ${animDuration}s linear forwards`;
        }

        canvas.appendChild(particle);

        // Tự động xóa khỏi DOM sau khi kết thúc animation
        setTimeout(() => {
            particle.remove();
        }, animDuration * 1000);
    }

    // Helper phòng chống XSS
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
})();
