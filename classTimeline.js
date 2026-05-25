/**
 * MEMORY TIMELINE BULLETIN BOARD - JAVASCRIPT LOGIC
 * Features: Hanging Polaroid photos, clothesline rope, school doodles, scroll parallax paper plane, horizontal drag-to-scroll, active highlighting, Polaroid details modal.
 */

(function() {
  // Memories Database
  const memories = [
    {
      date: "05/09/2023",
      title: "Ngày đầu tiên tựu trường",
      desc: "Những bước chân ngập ngừng bước qua cánh cổng trường cấp 3 thân thương. Mọi gương mặt đều mới lạ, những lời chào bỡ ngỡ đầu tiên đã bắt đầu cho một hành trình thanh xuân rực rỡ của tập thể lớp chúng mình.",
      img: "./images/1.jpg"
    },
    {
      date: "20/11/2023",
      title: "Tri ân thầy cô giáo",
      desc: "Món quà handmade tự tay cả lớp thức đêm chuẩn bị để dành tặng cô giáo chủ nhiệm. Nụ cười và những giọt nước mắt hạnh phúc của cô là động lực lớn nhất để chúng mình cố gắng học tập tốt hơn mỗi ngày.",
      img: "./images/3.jpg"
    },
    {
      date: "26/03/2024",
      title: "Hội thao bùng nổ sức trẻ",
      desc: "Những giọt mồ hôi rơi trên sân cỏ, những tiếng hò reo khản cổ từ hàng cổ động viên. Cúp vô địch kéo co và bóng đá nam đã thuộc về lớp chúng mình sau những trận đấu vô cùng kịch tính và quả cảm.",
      img: "./images/5.jpg"
    },
    {
      date: "15/05/2024",
      title: "Chuyến dã ngoại kỷ niệm",
      desc: "Rời xa phấn bảng và sách vở, chúng mình đã có một chuyến cắm trại tuyệt vời giữa thiên nhiên. Cùng dựng lều, nướng thịt và hát ca quanh ngọn lửa trại ấm áp dưới bầu trời đêm đầy sao.",
      img: "./images/7.jpg"
    },
    {
      date: "16/01/2025",
      title: "Hội diễn văn nghệ tỏa sáng",
      desc: "Tiết mục kịch kết hợp múa đương đại tự biên tự diễn của lớp đã xuất sắc giành giải Nhất toàn trường. Những đêm tập muộn mệt lả người nhưng tràn ngập tiếng cười đùa tinh nghịch.",
      img: "./images/9.jpg"
    },
    {
      date: "08/03/2025",
      title: "Yêu thương gửi các bạn nữ",
      desc: "Các bạn nam trong lớp đã bí mật chuẩn bị những chiếc bánh ngọt ngọt ngào và những bông hoa hồng xinh xắn để dành tặng cho các cô gái xinh đẹp của lớp. Một ngày ngập tràn tiếng cười ấm áp.",
      img: "./images/11.jpg"
    },
    {
      date: "20/04/2026",
      title: "Buổi chụp ảnh kỷ yếu",
      desc: "Cơn mưa rào mùa hạ không ngăn được chúng mình khoác lên mình tà áo dài trắng và bộ vest trang trọng. Những bức ảnh ghi lại nụ cười rạng rỡ nhất của tuổi 18 dưới mái trường thân yêu.",
      img: "./images/13.jpg"
    },
    {
      date: "25/05/2026",
      title: "Lễ bế giảng - Tạm biệt nhé!",
      desc: "Tiếng ve kêu râm ran và sắc phượng đỏ rực báo hiệu giờ chia tay đã điểm. Những cái ôm thật chặt, những dòng lưu bút viết vội lên áo và những giọt nước mắt chia ly. Khép lại 3 năm học nhưng mở ra tình bạn vĩnh cửu.",
      img: "./images/15.jpg"
    }
  ];

  function initMemoryTimeline() {
    const section = document.getElementById("SECTION_MEMORY_TIMELINE");
    if (!section) return;

    const scrollWrapper = section.querySelector(".timeline-scroll-wrapper");
    const scrollContent = section.querySelector(".timeline-scroll-content");
    const prevBtn = section.querySelector(".timeline-nav-btn.prev");
    const nextBtn = section.querySelector(".timeline-nav-btn.next");

    if (!scrollWrapper || !scrollContent) return;

    // 1. Responsive parameters
    const isMobile = window.innerWidth < 768;
    const spacingX = isMobile ? 220 : 320; // Distance between photos
    const paddingStartEnd = window.innerWidth * 0.2; // Padding on edges
    const stringHeights = isMobile ? [25, 55, 85] : [35, 75, 115]; // Alternate hanging string lengths

    const totalMilestones = memories.length;
    const totalWidth = (totalMilestones - 1) * spacingX + paddingStartEnd * 2;

    // Set scroll canvas width
    scrollContent.style.width = `${totalWidth}px`;

    // 2. Render milestones (Polaroids)
    const milestoneContainer = scrollContent.querySelector(".timeline-milestones-container");
    milestoneContainer.innerHTML = ""; // Reset

    memories.forEach((memory, index) => {
      const coordX = paddingStartEnd + index * spacingX;
      const swingClass = `swing-${(index % 3) + 1}`;
      const stringH = stringHeights[index % 3];

      const milestoneDiv = document.createElement("div");
      milestoneDiv.className = `milestone ${swingClass}`;
      milestoneDiv.style.left = `${coordX}px`;
      milestoneDiv.setAttribute("data-index", index);

      // Random rotation offset inside card for natural scrapbook look
      const tiltAngle = (index % 2 === 0 ? 1 : -1) * (2 + (index % 3) * 1.5); // alternates between -2, -3.5, -5, +2, +3.5, +5 deg

      milestoneDiv.innerHTML = `
        <div class="milestone-peg"></div>
        <div class="milestone-string" style="height: ${stringH}px;"></div>
        <div class="milestone-card" style="transform: rotate(${tiltAngle}deg);">
          <div class="milestone-img-wrapper">
            <img src="${memory.img}" class="milestone-thumb" alt="${memory.title}" loading="lazy">
          </div>
          <div class="milestone-note">
            <span class="milestone-date">${memory.date}</span>
            <h4 class="milestone-title">${memory.title}</h4>
          </div>
        </div>
      `;

      // Open Modal details on click
      milestoneDiv.addEventListener("click", () => {
        openTimelineModal(memory);
      });

      milestoneContainer.appendChild(milestoneDiv);
    });

    // 3. Scatter school doodles in the background
    let doodlesContainer = scrollContent.querySelector(".timeline-doodles-container");
    if (!doodlesContainer) {
      doodlesContainer = document.createElement("div");
      doodlesContainer.className = "timeline-doodles-container";
      scrollContent.appendChild(doodlesContainer);
    } else {
      doodlesContainer.innerHTML = "";
    }

    const doodleTypes = ["pencil", "book", "star"];
    const totalDoodles = totalMilestones * 3;
    for (let i = 0; i < totalDoodles; i++) {
      const doodleType = doodleTypes[i % doodleTypes.length];
      const doodleDiv = document.createElement("div");
      doodleDiv.className = `doodle-element ${doodleType}`;

      const randX = Math.random() * totalWidth;
      // Position above or below the center rope where photos hang
      let randY = Math.random() * 80;
      if (randY > 30 && randY < 70) {
        randY = Math.random() < 0.5 ? randY - 30 : randY + 30;
      }

      const randRotation = Math.random() * 50 - 25; // -25deg to 25deg
      const randScale = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 scale

      doodleDiv.style.left = `${randX}px`;
      doodleDiv.style.top = `${randY}%`;
      doodleDiv.style.transform = `rotate(${randRotation}deg) scale(${randScale})`;
      doodlesContainer.appendChild(doodleDiv);
    }

    // 4. Drag-to-scroll logic
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollWrapper.addEventListener("mousedown", (e) => {
      isDown = true;
      scrollWrapper.style.cursor = "grabbing";
      startX = e.pageX - scrollWrapper.offsetLeft;
      scrollLeft = scrollWrapper.scrollLeft;
    });

    scrollWrapper.addEventListener("mouseleave", () => {
      isDown = false;
      scrollWrapper.style.cursor = "grab";
    });

    scrollWrapper.addEventListener("mouseup", () => {
      isDown = false;
      scrollWrapper.style.cursor = "grab";
    });

    scrollWrapper.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollWrapper.offsetLeft;
      const walk = (x - startX) * 1.5; // Scroll speed factor
      scrollWrapper.scrollLeft = scrollLeft - walk;
    });

    // 5. Wheel event redirection (vertical scroll -> horizontal scroll)
    scrollWrapper.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollWrapper.scrollLeft += e.deltaY * 0.8;
      }
    }, { passive: false });

    // 6. Navigation Buttons
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        scrollWrapper.scrollBy({ left: -360, behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        scrollWrapper.scrollBy({ left: 360, behavior: "smooth" });
      });
    }

    // 7. Active Highlight on Scroll
    function updateActiveMilestone() {
      const wrapperRect = scrollWrapper.getBoundingClientRect();
      const centerX = wrapperRect.left + wrapperRect.width / 2;
      const milestoneElements = milestoneContainer.querySelectorAll(".milestone");

      let closestMilestone = null;
      let minDistance = Infinity;

      milestoneElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - elCenterX);

        if (distance < minDistance) {
          minDistance = distance;
          closestMilestone = el;
        }

        el.classList.remove("active");
      });

      // Highlight the card closest to the viewport center
      if (closestMilestone && minDistance < 180) {
        closestMilestone.classList.add("active");
      }
    }

    scrollWrapper.addEventListener("scroll", () => {
      updateActiveMilestone();

      // Parallax move paper plane doodle on scroll
      const scrollPos = scrollWrapper.scrollLeft;
      const paperPlane = section.querySelector(".paper-plane-fly");
      if (paperPlane) {
        // Glide forward with a smooth vertical wave motion
        const planeX = (scrollPos * 0.25) % window.innerWidth;
        const planeY = 120 + Math.sin(scrollPos * 0.005) * 35;
        paperPlane.style.transform = `translate(${planeX}px, ${planeY}px) rotate(${5 + Math.cos(scrollPos * 0.005) * 10}deg)`;
      }
    });

    // Run once on load
    setTimeout(updateActiveMilestone, 300);
  }

  // Polaroid Modal Details Popup
  function openTimelineModal(memory) {
    let modal = document.getElementById("TIMELINE_MODAL");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "TIMELINE_MODAL";
      modal.className = "timeline-modal";
      modal.innerHTML = `
        <div class="timeline-modal-content">
          <button class="timeline-modal-close" aria-label="Đóng">&times;</button>
          <div class="timeline-modal-img-wrapper">
            <img class="timeline-modal-img" src="" alt="">
          </div>
          <div class="timeline-modal-body">
            <p class="timeline-modal-date"></p>
            <h4 class="timeline-modal-title"></h4>
            <p class="timeline-modal-desc"></p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector(".timeline-modal-close");
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
        }
      });
    }

    const modalImg = modal.querySelector(".timeline-modal-img");
    const modalDate = modal.querySelector(".timeline-modal-date");
    const modalTitle = modal.querySelector(".timeline-modal-title");
    const modalDesc = modal.querySelector(".timeline-modal-desc");

    modalImg.src = memory.img;
    modalImg.alt = memory.title;
    modalDate.textContent = memory.date;
    modalTitle.textContent = memory.title;
    modalDesc.textContent = memory.desc;

    modal.classList.add("show");
  }

  window.initMemoryTimeline = initMemoryTimeline;
})();
