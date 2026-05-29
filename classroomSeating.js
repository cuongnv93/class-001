// CLASSROOM SEATING CHART MODULE
(function () {
  // --- CẤU HÌNH SƠ ĐỒ LỚP HỌC ---
  window.totalSeats = 48; // Tổng số lượng ô ngồi trong sơ đồ
  window.seatsPerRow = 8; // Số lượng ghế trên 1 hàng (Số cột hiển thị: 8, 6,...)
  window.SEATING_SHEET_ID = "1WIpB0DzMY-UPHzfGbjgzaN_Gd7wofOtem6gnkl2Zx6Q"; // Google Sheets ID
  window.SEATING_SHEET_GID = "909964321"; // Tab GID chứa thông tin học sinh

  const defaultAvatarSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2355b079'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>`;

  // Khởi tạo danh sách học sinh trống ban đầu (Dữ liệu sẽ nạp động từ Google Sheets)
  window.seatingStudents = [];

  /*
  window.seatingStudents = [
    {
      name: "Minh Quân",
      seatIndex: 1,
      avatar: "https://i.pravatar.cc/150?img=11",
      quote: "Rồi chúng ta sẽ ổn thôi.",
      hobby: "Nghe nhạc Lo-fi",
      dream: "Software Engineer",
      crush: "Lớp bên cạnh 👀",
    },
    {
      name: "Thu Hà",
      seatIndex: 2,
      avatar: "https://i.pravatar.cc/150?img=32",
      quote: "Thanh xuân là những ngày có nhau.",
      hobby: "Chụp ảnh",
      dream: "Designer",
      crush: "Không tiết lộ 😳",
    },
    {
      name: "Gia Huy",
      seatIndex: 3,
      avatar: "https://i.pravatar.cc/150?img=15",
      quote: "Đi học ít thôi nhưng vui.",
      hobby: "Game FPS",
      dream: "Streamer",
      crush: "Bí mật",
    },
    {
      name: "Ngọc Anh",
      seatIndex: 4,
      avatar: "https://i.pravatar.cc/150?img=25",
      quote: "12A1 mãi đỉnh.",
      hobby: "Dance",
      dream: "Idol",
      crush: "🤫",
    },
    {
      name: "Hoàng Long",
      seatIndex: 6,
      avatar: "https://i.pravatar.cc/150?img=18",
      quote: "Chưa làm bài tập bao giờ.",
      hobby: "Bóng đá",
      dream: "Footballer",
      crush: "Bạn cùng bàn",
    },
    {
      name: "Mai Phương",
      seatIndex: 7,
      avatar: "https://i.pravatar.cc/150?img=44",
      quote: "Mong sau này vẫn gặp lại.",
      hobby: "Cafe chill",
      dream: "Marketing",
      crush: "...",
    },
    {
      name: "Tuấn Kiệt",
      seatIndex: 8,
      avatar: "https://i.pravatar.cc/150?img=33",
      quote: "Đằng sau ống kính là những nụ cười.",
      hobby: "Du lịch bụi",
      dream: "Photographer",
      crush: "Một em lớp 10",
    },
    {
      name: "Khánh Linh",
      seatIndex: 9,
      avatar: "https://i.pravatar.cc/150?img=47",
      quote: "Học hết mình, chơi nhiệt tình!",
      hobby: "Đọc sách",
      dream: "Doctor",
      crush: "Cậu bạn lớp trưởng",
    },
    {
      name: "Đức Minh",
      seatIndex: 10,
      avatar: "https://i.pravatar.cc/150?img=12",
      quote: "Vẽ nên ước mơ của chính mình.",
      hobby: "Vẽ tranh",
      dream: "Architect",
      crush: "Không có",
    },
    {
      name: "Phương Thảo",
      seatIndex: 12,
      avatar: "https://i.pravatar.cc/150?img=49",
      quote: "Mỗi ngày là một bài học mới.",
      hobby: "Học ngoại ngữ",
      dream: "Translator",
      crush: "Đang tìm kiếm",
    },
    {
      name: "Bảo Nam",
      seatIndex: 14,
      avatar: "https://i.pravatar.cc/150?img=14",
      quote: "Ước mơ nhỏ bé cùng âm nhạc.",
      hobby: "Chơi Guitar",
      dream: "Musician",
      crush: "Cây đàn Guitar",
    },
    {
      name: "Quỳnh Chi",
      seatIndex: 15,
      avatar: "https://i.pravatar.cc/150?img=26",
      quote: "Ngọt ngào như những chiếc bánh.",
      hobby: "Làm bánh",
      dream: "Businesswoman",
      crush: "Rất nhiều người",
    },
    {
      name: "Minh Triết",
      seatIndex: 16,
      avatar: "https://i.pravatar.cc/150?img=51",
      quote: "Khám phá thế giới rộng lớn.",
      hobby: "Nghiên cứu khoa học",
      dream: "Scientist",
      crush: "Tri thức",
    },
    {
      name: "Thùy Dương",
      seatIndex: 17,
      avatar: "https://i.pravatar.cc/150?img=22",
      quote: "Viết tiếp những trang nhật ký lớp học.",
      hobby: "Viết lách",
      dream: "Journalist",
      crush: "Sổ tay",
    },
    {
      name: "Việt Anh",
      seatIndex: 18,
      avatar: "https://i.pravatar.cc/150?img=53",
      quote: "Bay cao, bay xa cùng ước mơ.",
      hobby: "Lắp ráp mô hình",
      dream: "Pilot",
      crush: "Bầu trời",
    },
    {
      name: "Thanh Trúc",
      seatIndex: 19,
      avatar: "https://i.pravatar.cc/150?img=29",
      quote: "Luôn ở đây để lắng nghe các bạn.",
      hobby: "Chia sẻ & lắng nghe",
      dream: "Psychologist",
      crush: "Cả lớp 12A1",
    },
    {
      name: "Thế Vinh",
      seatIndex: 20,
      avatar: "https://i.pravatar.cc/150?img=55",
      quote: "Tự do là trên hết.",
      hobby: "Chạy bộ",
      dream: "Pilot",
      crush: "Một bạn nữ cùng tổ",
    },
    {
      name: "Diễm Quỳnh",
      seatIndex: 21,
      avatar: "https://i.pravatar.cc/150?img=34",
      quote: "Hãy cười nhiều hơn mỗi ngày.",
      hobby: "Xem phim truyền hình",
      dream: "Pharmacist",
      crush: "Không có",
    },
    {
      name: "Hoàng Bách",
      seatIndex: 23,
      avatar: "https://i.pravatar.cc/150?img=57",
      quote: "Học đi đôi với hành.",
      hobby: "Lập trình",
      dream: "AI Specialist",
      crush: "Bí mật",
    },
    {
      name: "Trà My",
      seatIndex: 24,
      avatar: "https://i.pravatar.cc/150?img=36",
      quote: "Mỗi ngày là một trải nghiệm mới.",
      hobby: "Đi du lịch",
      dream: "Event Planner",
      crush: "Sách vở",
    },
    {
      name: "Minh Đức",
      seatIndex: 25,
      avatar: "https://i.pravatar.cc/150?img=59",
      quote: "Thất bại là mẹ thành công.",
      hobby: "Chơi cờ vua",
      dream: "Grandmaster",
      crush: "Môn Toán",
    },
    {
      name: "Thanh Vân",
      seatIndex: 26,
      avatar: "https://i.pravatar.cc/150?img=38",
      quote: "Gieo hành vi, gặt số phận.",
      hobby: "Đan len",
      dream: "Psychologist",
      crush: "Tình yêu đầu",
    },
    {
      name: "Gia Bảo",
      seatIndex: 27,
      avatar: "https://i.pravatar.cc/150?img=61",
      quote: "Không gì là không thể.",
      hobby: "Bóng rổ",
      dream: "Athlete",
      crush: "Phim ảnh",
    },
    {
      name: "Ngọc Vy",
      seatIndex: 28,
      avatar: "https://i.pravatar.cc/150?img=40",
      quote: "Hãy sống là chính mình.",
      hobby: "Vẽ tranh phong cảnh",
      dream: "Fashion Designer",
      crush: "Thời trang",
    },
    {
      name: "Quang Huy",
      seatIndex: 29,
      avatar: "https://i.pravatar.cc/150?img=63",
      quote: "Đi một ngày đàng, học một sàng khôn.",
      hobby: "Đi phượt",
      dream: "Geologist",
      crush: "Thế giới tự nhiên",
    },
    {
      name: "Thu Trang",
      seatIndex: 31,
      avatar: "https://i.pravatar.cc/150?img=42",
      quote: "Luôn hướng về phía trước.",
      hobby: "Hát nhạc thính phòng",
      dream: "Singer",
      crush: "Sân khấu",
    },
    {
      name: "Đăng Khoa",
      seatIndex: 32,
      avatar: "https://i.pravatar.cc/150?img=65",
      quote: "Kiên trì sẽ dẫn tới thành công.",
      hobby: "Lắp ráp robot",
      dream: "Robotics Engineer",
      crush: "Lớp trưởng",
    },
    {
      name: "Mỹ Duyên",
      seatIndex: 33,
      avatar: "https://i.pravatar.cc/150?img=45",
      quote: "Nụ cười là liều thuốc bổ.",
      hobby: "Trang điểm cá nhân",
      dream: "Beauty Blogger",
      crush: "Gương soi",
    },
    {
      name: "Tuấn Anh",
      seatIndex: 34,
      avatar: "https://i.pravatar.cc/150?img=67",
      quote: "Làm việc chăm chỉ trong im lặng.",
      hobby: "Tập gym",
      dream: "Fitness Trainer",
      crush: "Sức khỏe",
    },
    {
      name: "Như Ý",
      seatIndex: 35,
      avatar: "https://i.pravatar.cc/150?img=48",
      quote: "Mọi điều tốt đẹp đều cần thời gian.",
      hobby: "Chăm hoa cây cảnh",
      dream: "Botanist",
      crush: "Thiên nhiên",
    },
    {
      name: "Thành Nam",
      seatIndex: 38,
      avatar: "https://i.pravatar.cc/150?img=69",
      quote: "Thanh xuân không bao giờ trở lại.",
      hobby: "Quay phim nghệ thuật",
      dream: "Director",
      crush: "Chiếc máy quay",
    },
    {
      name: "Minh Thư",
      seatIndex: 39,
      avatar: "https://i.pravatar.cc/150?img=50",
      quote: "Sống rực rỡ như những đóa hoa.",
      hobby: "Đọc tiểu thuyết",
      dream: "Writer",
      crush: "Cậu bạn cùng bàn",
    },
    {
      name: "Duy Mạnh",
      seatIndex: 40,
      // avatar: "https://i.pravatar.cc/150?img=71",
      quote: "Chân lý thuộc về kẻ mạnh.",
      hobby: "Học võ cổ truyền",
      dream: "Police Officer",
      crush: "Công lý",
    },
    {
      name: "Phương Linh",
      seatIndex: 42,
      avatar: "https://i.pravatar.cc/150?img=52",
      quote: "Hãy trân trọng từng khoảnh khắc.",
      hobby: "Chơi Piano",
      dream: "Pianist",
      crush: "Âm nhạc",
    },
    {
      name: "Tiến Đạt",
      seatIndex: 44,
      // avatar: "https://i.pravatar.cc/150?img=73",
      quote: "Không ngừng học hỏi.",
      hobby: "Tin tức khoa học",
      dream: "Journalist",
      crush: "Bút ký",
    },
    {
      name: "Hồng Hạnh",
      seatIndex: 46,
      avatar: "https://i.pravatar.cc/150?img=54",
      quote: "Hạnh phúc là sự sẻ chia.",
      hobby: "Nấu ăn cùng mẹ",
      dream: "Chef",
      crush: "Ẩm thực",
    },
  ];
  */

  let isFetching = false;
  let isFetched = false;

  // KHỞI TẠO SƠ ĐỒ LỚP HỌC
  window.initSeatingChart = function () {
    const gridContainer = document.getElementById("classroom-seats");
    const profilePanel = document.getElementById("student-profile");
    if (!gridContainer || !profilePanel) return;

    // Thiết lập số cột động
    gridContainer.style.gridTemplateColumns = `repeat(${window.seatsPerRow}, 1fr)`;

    // Nếu có cấu hình Google Sheet và chưa fetch dữ liệu
    if (window.SEATING_SHEET_ID && !isFetched && !isFetching) {
      isFetching = true;
      const tsvUrl = `https://docs.google.com/spreadsheets/d/${window.SEATING_SHEET_ID}/export?format=tsv&gid=${window.SEATING_SHEET_GID || "0"}`;

      // Hiển thị trạng thái loading trong khi tải dữ liệu
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7E7873; font-weight: 500;">
          <div style="font-size: 24px; margin-bottom: 10px; animation: spin 1.5s linear infinite;">⏳</div>
          Đang tải danh sách sơ đồ lớp từ Google Sheets...
        </div>
      `;

      fetch(tsvUrl)
        .then((response) => {
          if (!response.ok)
            throw new Error("Không thể fetch dữ liệu Google Sheets");
          return response.text();
        })
        .then((tsvText) => {
          const lines = tsvText.split(/\r?\n/);
          if (lines.length > 0) {
            const headers = lines[0].split("\t").map((h) => h.trim());

            const nameIdx = headers.indexOf("Tên");
            const seatIdx = headers.indexOf("Số thứ tự ngồi");
            const quoteIdx = headers.indexOf("Câu nói đạo lý");
            const hobbyIdx = headers.indexOf("Sở thích");
            const dreamIdx = headers.indexOf("Ước mơ");
            const crushIdx = headers.indexOf("Crush");
            const avatarIdx = headers.indexOf("Avatar");

            // Parse data nếu các cột tiêu đề hợp lệ
            if (nameIdx !== -1 && seatIdx !== -1) {
              // Hàm tự động chuyển đổi link chia sẻ Google Drive sang link trực tiếp dùng được trong thẻ img
              const convertDriveUrl = (url) => {
                if (!url) return "";
                const driveRegex =
                  /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?id=)([a-zA-Z0-9_-]+)/;
                const match = url.match(driveRegex);
                if (match && match[1]) {
                  return `https://lh3.googleusercontent.com/d/${match[1]}`;
                }
                return url;
              };

              const parsedStudents = [];
              for (let i = 1; i < lines.length; i++) {
                const cells = lines[i].split("\t");
                if (
                  cells.length <= Math.max(nameIdx, seatIdx) ||
                  !cells[nameIdx]?.trim()
                )
                  continue;

                parsedStudents.push({
                  name: cells[nameIdx].trim(),
                  seatIndex: parseInt(cells[seatIdx]) || null,
                  quote: cells[quoteIdx] ? cells[quoteIdx].trim() : "",
                  hobby: cells[hobbyIdx] ? cells[hobbyIdx].trim() : "",
                  dream: cells[dreamIdx] ? cells[dreamIdx].trim() : "",
                  crush: cells[crushIdx] ? cells[crushIdx].trim() : "",
                  avatar: cells[avatarIdx]
                    ? convertDriveUrl(cells[avatarIdx].trim())
                    : "",
                });
              }

              if (parsedStudents.length > 0) {
                window.seatingStudents = parsedStudents;
              }
            }
          }
          isFetched = true;
          isFetching = false;
          renderSeats();

          // Sau khi tải xong, cập nhật lại dropdown và leaderboard của Superlatives
          if (typeof window.initSuperlatives === "function") {
            window.initSuperlatives();
          }
        })
        .catch((err) => {
          console.warn(
            "Lỗi đồng bộ sơ đồ lớp từ Google Sheets, dùng dữ liệu mặc định:",
            err,
          );
          isFetched = true;
          isFetching = false;
          renderSeats();
        });
    } else {
      renderSeats();
    }

    function renderSeats() {
      const studentMap = {};
      window.seatingStudents.forEach((student) => {
        if (student.seatIndex) {
          studentMap[student.seatIndex] = student;
        }
      });

      gridContainer.innerHTML = "";
      const seatAwards =
        typeof window.getSeatAwards === "function"
          ? window.getSeatAwards()
          : {};

      for (let seatNum = 1; seatNum <= window.totalSeats; seatNum++) {
        const seat = document.createElement("div");
        const student = studentMap[seatNum];

        if (student) {
          seat.className = "seat-item";

          // Thiết lập tooltip (Tên + Các danh hiệu nếu có)
          let tooltipText = student.name;
          if (seatAwards[student.name] && seatAwards[student.name].length > 0) {
            const awardDetails = seatAwards[student.name].map(a => `${a.emoji} ${a.category.split(" ").slice(1).join(" ")}`);
            tooltipText += ` (${awardDetails.join(", ")})`;
          }
          seat.setAttribute("data-tooltip", tooltipText);

          const avatarUrl = student.avatar || defaultAvatarSvg;
          seat.innerHTML = `<img src="${avatarUrl}" alt="${student.name}" loading="lazy" onerror="this.onerror=null;this.src='${defaultAvatarSvg}';">`;

          // Huy hiệu danh hiệu trên sơ đồ
          if (seatAwards[student.name] && seatAwards[student.name].length > 0) {
            const badge = document.createElement("div");
            badge.className = "award-badge";
            badge.textContent = seatAwards[student.name].map(a => a.emoji).join("");
            seat.appendChild(badge);

            // Thêm class highlight đặc biệt cho bàn học đạt giải
            seat.classList.add("awarded-seat");
          }

          // Sự kiện click xem chi tiết
          seat.addEventListener("click", function () {
            document
              .querySelectorAll(".seat-item")
              .forEach((s) => s.classList.remove("active-seat"));
            seat.classList.add("active-seat");

            let awardsHtml = "";
            if (seatAwards[student.name] && seatAwards[student.name].length > 0) {
              awardsHtml = seatAwards[student.name].map(award => `
                              <div class="profile-info-card" style="border-color: rgb(197, 168, 128); background: rgba(197, 168, 128, 0.15);">
                                  <span>🏆</span>
                                  <div><strong>Danh hiệu:</strong> ${award.category} (${award.votes} phiếu)</div>
                              </div>
                          `).join("");
            }

            profilePanel.innerHTML = `
                          <div class="profile-img-container">
                              <img src="${avatarUrl}" alt="${student.name}" onerror="this.onerror=null;this.src='${defaultAvatarSvg}';">
                          </div>
                          <h3 class="profile-name">${student.name}</h3>
                          <p class="profile-quote">"${student.quote}"</p>
                          <div class="profile-info-list">
                              ${awardsHtml}
                              <div class="profile-info-card">
                                  <span>🎵</span>
                                  <div><strong>Sở thích:</strong> ${student.hobby}</div>
                              </div>
                              <div class="profile-info-card">
                                  <span>🚀</span>
                                  <div><strong>Ước mơ:</strong> ${student.dream}</div>
                              </div>
                              <div class="profile-info-card">
                                  <span>💌</span>
                                  <div><strong>Crush:</strong> ${student.crush}</div>
                              </div>
                          </div>
                      `;
          });
        } else {
          // Ô ngồi trống
          seat.className = "seat-item empty-seat";
          seat.innerHTML = `<span style="font-size: 10px; color: #999; font-weight: 500;">Trống</span>`;
        }

        gridContainer.appendChild(seat);
      }
    }
  };
})();
