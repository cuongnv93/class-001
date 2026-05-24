// AI PHOTO BOOTH MODULE FOR WEDDING CARD
(function () {
    // 1. CẤU HÌNH AI PHOTO BOOTH
    // Điền API Key của fal.ai vào đây để sử dụng AI hoán đổi khuôn mặt (Face Swap) thật.
    // Nếu để trống, hệ thống sẽ tự động chạy "Chế độ Ghép Ảnh Kỷ Niệm (Canvas)" ngoại tuyến.
    // window.FAL_AI_API_KEY = "a3212044-6e61-4d54-b3d2-dae583e682de:1891d7278a703b19a877f92ea4c3df29";

    // Ảnh cưới mặc định của dâu rể
    window.WEDDING_TEMPLATE_IMAGE = "https://raw.githubusercontent.com/uwedding/my-images/main/vuthao-lanhuong.jpg";

    let guestImageBase64 = null;

    // 2. KHỞI TẠO EVENT LISTENERS KHI TRANG SẴN SÀNG
    function initAiBooth() {
        const dropzone = document.getElementById("guest-upload-zone");
        const fileInput = document.getElementById("guest-image-input");
        const generateBtn = document.getElementById("btn-generate-ai");
        const downloadBtn = document.getElementById("btn-download-result");
        const templateImg = document.getElementById("wedding-template-img");

        if (!dropzone || !fileInput || !generateBtn || !downloadBtn) return;

        // Đặt ảnh dâu rể mặc định vào preview
        if (templateImg) {
            templateImg.src = window.WEDDING_TEMPLATE_IMAGE;
        }

        // Click vào vùng dropzone để mở hộp thoại chọn file
        dropzone.addEventListener("click", () => fileInput.click());

        // Xử lý kéo thả file
        dropzone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropzone.style.borderColor = "#FA5F5F";
            dropzone.style.backgroundColor = "rgba(250, 95, 95, 0.05)";
        });

        dropzone.addEventListener("dragleave", () => {
            dropzone.style.borderColor = "rgba(197, 168, 128, 0.4)";
            dropzone.style.backgroundColor = "transparent";
        });

        dropzone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropzone.style.borderColor = "rgba(197, 168, 128, 0.4)";
            dropzone.style.backgroundColor = "transparent";

            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        // Xử lý chọn file từ hộp thoại
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        // Nút bấm kích hoạt ghép ảnh
        generateBtn.addEventListener("click", processPhotoMerge);

        // Nút bấm tải ảnh
        downloadBtn.addEventListener("click", downloadResultImage);
    }

    // 3. XỬ LÝ KHI CHỌN ẢNH KHÁCH MỜI
    function handleFileSelect(file) {
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng tải lên một file ảnh chân dung hợp lệ!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            guestImageBase64 = e.target.result;

            // Cập nhật giao diện xem trước ảnh khách mời
            const previewImg = document.getElementById("guest-preview-img");
            const placeholder = document.getElementById("dropzone-text");
            const generateBtn = document.getElementById("btn-generate-ai");

            if (previewImg && placeholder && generateBtn) {
                previewImg.src = guestImageBase64;
                previewImg.style.display = "block";
                placeholder.style.display = "none";
                generateBtn.disabled = false; // Bật nút Ghép ảnh
            }
        };
        reader.readAsDataURL(file);
    }

    // 4. TIẾN HÀNH GHÉP ẢNH (REAL AI HOẶC CANVAS)
    async function processPhotoMerge() {
        if (!guestImageBase64) return;

        const placeholder = document.getElementById("result-placeholder");
        const loader = document.getElementById("result-loader");
        const resultImg = document.getElementById("result-image");
        const downloadBtn = document.getElementById("btn-download-result");
        const generateBtn = document.getElementById("btn-generate-ai");

        if (placeholder) placeholder.style.display = "none";
        if (resultImg) resultImg.style.display = "none";
        if (loader) loader.style.display = "flex";
        if (downloadBtn) downloadBtn.disabled = true;
        if (generateBtn) generateBtn.disabled = true;

        try {
            if (window.FAL_AI_API_KEY) {
                // CHẾ ĐỘ 1: GỌI API FACE SWAP THẬT (FAL.AI)
                console.log("Đang chạy chế độ AI Face Swap...");
                const resultUrl = await runRealFaceSwap(window.WEDDING_TEMPLATE_IMAGE, guestImageBase64);

                if (resultImg) {
                    resultImg.src = resultUrl;
                    resultImg.style.display = "block";
                }
            } else {
                // CHẾ ĐỘ 2: CANVAS BLENDING (MOCK AI/OFFLINE COMPOSITE)
                console.log("Đang chạy chế độ Canvas Blending...");
                const resultDataUrl = await runCanvasBlending(window.WEDDING_TEMPLATE_IMAGE, guestImageBase64);

                if (resultImg) {
                    resultImg.src = resultDataUrl;
                    resultImg.style.display = "block";
                }
            }

            if (downloadBtn) downloadBtn.disabled = false;
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra trong quá trình xử lý ghép ảnh: " + error.message);
            if (placeholder) placeholder.style.display = "flex";
        } finally {
            if (loader) loader.style.display = "none";
            if (generateBtn) generateBtn.disabled = false;
        }
    }

    // 5. CHẾ ĐỘ AI FACE SWAP THẬT (FAL.AI)
    async function runRealFaceSwap(templateSrc, guestBase64) {
        // Chuyển ảnh cưới template sang Base64 để gửi lên API nếu nó là URL cục bộ
        let templateBase64 = templateSrc;
        if (templateSrc.startsWith(".") || templateSrc.startsWith("/")) {
            templateBase64 = await convertImageToBase64(templateSrc);
        }

        const response = await fetch("https://queue.fal.run/fal-ai/face-swap", {
            method: "POST",
            headers: {
                "Authorization": `Key ${window.FAL_AI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                base_image_url: templateBase64,
                swap_image_url: guestBase64
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`FAL.ai API Error: ${errText}`);
        }

        const result = await response.json();

        // Gọi polling kết quả nếu API chạy ở chế độ queue bất đồng bộ
        if (result.request_id) {
            return await pollFalResult(result.request_id);
        }

        return result.image.url;
    }

    // Polling kết quả hàng đợi của fal.ai
    async function pollFalResult(requestId) {
        const checkUrl = `https://queue.fal.run/fal-ai/face-swap/requests/${requestId}`;

        while (true) {
            const response = await fetch(checkUrl, {
                headers: {
                    "Authorization": `Key ${window.FAL_AI_API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error("Lỗi khi kiểm tra trạng thái hàng đợi AI.");
            }

            const status = await response.json();

            if (status.status === "COMPLETED") {
                return status.logs || status.response.image.url;
            } else if (status.status === "FAILED") {
                throw new Error("Xử lý AI bị thất bại.");
            }

            // Đợi 1.5 giây rồi kiểm tra lại
            await new Promise(r => setTimeout(r, 1500));
        }
    }

    // 6. CHẾ ĐỘ CANVAS BLENDING (GHÉP KHUNG ẢNH LƯU NIỆM OFFLINE)
    async function runCanvasBlending(templateSrc, guestBase64) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 1200;
        canvas.height = 800;

        // Tải bất đồng bộ cả 2 bức ảnh
        const [weddingImg, guestImg] = await Promise.all([
            loadImage(templateSrc),
            loadImage(guestBase64)
        ]);

        // Bước A: Tô nền màu kem nhạt sang trọng
        ctx.fillStyle = "#FAF6F0";
        ctx.fillRect(0, 0, 1200, 800);

        // Bước B: Vẽ viền khung ngoài nghệ thuật (Màu vàng đồng)
        ctx.strokeStyle = "#C5A880";
        ctx.lineWidth = 6;
        ctx.strokeRect(20, 20, 1160, 760);

        ctx.lineWidth = 2;
        ctx.strokeRect(32, 32, 1136, 736);

        // Bước C: Vẽ khung ảnh cô dâu & chú rể ở bên trái
        const borderMargin = 75;
        const frameWidth = 490;
        const frameHeight = 540;

        // Vẽ bóng đổ nhẹ cho 2 khung ảnh
        ctx.shadowColor = "rgba(44, 62, 53, 0.1)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;

        // Vẽ nền trắng khung polaroid cho ảnh trái
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(borderMargin, borderMargin, frameWidth, frameHeight);

        // Vẽ nền trắng khung polaroid cho ảnh phải
        ctx.fillRect(1200 - borderMargin - frameWidth, borderMargin, frameWidth, frameHeight);

        // Tắt bóng đổ để vẽ hình tiếp theo không bị nhòe
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Vẽ ảnh cưới dâu rể vào ô trái (thu hẹp 20px so với viền trắng để tạo hiệu ứng khung ảnh)
        const imgPadding = 20;
        const clipX1 = borderMargin + imgPadding;
        const clipY1 = borderMargin + imgPadding;
        const clipW1 = frameWidth - (imgPadding * 2);
        const clipH1 = frameHeight - (imgPadding * 2) - 30; // Chừa chỗ trống bên dưới kiểu polaroid

        drawCoverImage(ctx, weddingImg, clipX1, clipY1, clipW1, clipH1);

        // Vẽ ảnh chân dung khách mời vào ô phải
        const clipX2 = 1200 - borderMargin - frameWidth + imgPadding;
        const clipY2 = borderMargin + imgPadding;
        const clipW2 = frameWidth - (imgPadding * 2);
        const clipH2 = frameHeight - (imgPadding * 2) - 30;

        drawCoverImage(ctx, guestImg, clipX2, clipY2, clipW2, clipH2);

        // Khung viền chỉ vàng mảnh quanh ảnh
        ctx.strokeStyle = "rgba(197, 168, 128, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(clipX1, clipY1, clipW1, clipH1);
        ctx.strokeRect(clipX2, clipY2, clipW2, clipH2);

        // Bước D: Vẽ chữ thư pháp, ngày kỷ niệm đám cưới bên dưới
        ctx.textAlign = "center";

        // Vẽ dòng chữ chủ đề "Kỷ niệm đám cưới"
        ctx.fillStyle = "#8A6D47";
        ctx.font = "italic 600 24px 'Philosopher', 'Roboto Slab', 'Georgia', serif";
        ctx.fillText("KỶ NIỆM ĐÁM CƯỚI", 600, 665);

        // Vẽ tên dâu rể Vũ Thảo & Lan Hương lớn hơn
        ctx.fillStyle = "#FA5F5F"; // Màu hoa hồng/đỏ dâu của thiệp cưới
        ctx.font = "bold 42px 'Philosopher', 'Times New Roman', serif";
        ctx.fillText("Vũ Thảo 💗 Lan Hương", 600, 715);

        // Vẽ ngày cưới
        ctx.fillStyle = "#2C3E35";
        ctx.font = "bold 20px 'Roboto Slab', 'Arial', sans-serif";
        ctx.fillText("26 . 04 . 2026", 600, 750);

        // Vẽ các nhánh cành lá trang trí trang nhã bằng vàng kim hai bên chữ
        ctx.strokeStyle = "#C5A880";
        ctx.lineWidth = 2;

        ctx.beginPath();
        // Nhánh trái
        ctx.moveTo(350, 708);
        ctx.lineTo(440, 708);
        // Nhánh phải
        ctx.moveTo(760, 708);
        ctx.lineTo(850, 708);
        ctx.stroke();

        // Bước E: Phủ một lớp filter màu nắng ấm/retro nhẹ để blend 2 ảnh hòa quyện màu với nhau
        ctx.fillStyle = "rgba(197, 168, 128, 0.05)";
        ctx.fillRect(0, 0, 1200, 800);

        try {
            return canvas.toDataURL("image/jpeg", 0.9);
        } catch (e) {
            console.error("Canvas export failed:", e);
            if (e.name === "SecurityError") {
                throw new Error("Trình duyệt chặn xuất ảnh do hạn chế bảo mật khi mở trực tiếp file HTML (giao thức file://). Vui lòng chạy trang web bằng máy chủ local (ví dụ: Live Server trong VS Code) hoặc tải trang web lên hosting thực tế để sử dụng chức năng này.");
            }
            throw e;
        }
    }

    // Helper: Vẽ ảnh dạng cover (object-fit: cover) tránh méo ảnh
    function drawCoverImage(ctx, img, x, y, w, h) {
        const imgRatio = img.width / img.height;
        const targetRatio = w / h;
        let sx, sy, sw, sh;

        if (imgRatio > targetRatio) {
            sh = img.height;
            sw = sh * targetRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
        } else {
            sw = img.width;
            sh = sw / targetRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    }

    // Helper: Load ảnh dạng Promise
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // Chỉ thiết lập crossOrigin nếu là URL tuyệt đối từ domain khác để tránh lỗi CORS khi tải tài nguyên local
            if (src && src.startsWith("http") && !src.includes(window.location.host)) {
                img.crossOrigin = "anonymous";
            }
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(new Error("Không thể tải tài nguyên ảnh: " + src));
            img.src = src;
        });
    }

    // Helper: Chuyển đổi ảnh thường thành Base64
    function convertImageToBase64(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                const reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = () => reject(new Error("CORS: Lỗi chuyển ảnh sang Base64. Trình duyệt chặn tải tài nguyên cục bộ qua AJAX khi mở trực tiếp file HTML (giao thức file://). Hãy sử dụng máy chủ local (ví dụ: Live Server trong VS Code) hoặc tải trang web lên hosting thực tế để sử dụng tính năng này."));
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.send();
        });
    }

    // 7. XỬ LÝ TẢI ẢNH KẾT QUẢ XUỐNG
    function downloadResultImage() {
        const resultImg = document.getElementById("result-image");
        if (!resultImg || !resultImg.src) return;

        const link = document.createElement("a");
        link.href = resultImg.src;
        link.download = "KyNiem_DamCuoi_VuThao_LanHuong.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // CHẠY KHỞI TẠO
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAiBooth);
    } else {
        initAiBooth();
    }
})();
