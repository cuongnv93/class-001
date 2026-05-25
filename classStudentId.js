/**
 * CUSTOM STUDENT ID CARD GENERATOR - JAVASCRIPT LOGIC
 * Features: Real-time text binding, image file reader, 3D tilt transformation, holographic glare position control, DOM-to-image export using html2canvas.
 */

(function() {
  function initStudentIDCard() {
    const section = document.getElementById("SECTION_STUDENT_ID_CARD");
    if (!section) return;

    // Form inputs
    const inputName = document.getElementById("idcard-input-name");
    const inputNickname = document.getElementById("idcard-input-nickname");
    const inputClass = document.getElementById("idcard-input-class");
    const selectRole = document.getElementById("idcard-select-role");
    const inputYear = document.getElementById("idcard-input-year");
    const inputFile = document.getElementById("idcard-input-file");
    const dropzone = document.getElementById("idcard-upload-dropzone");
    const downloadBtn = document.getElementById("idcard-btn-download");
    const inputSchool = document.getElementById("idcard-input-school");
    const themeDots = section.querySelectorAll(".theme-dot");

    // Preview elements on card
    const card = document.getElementById("idcard-preview-card");
    const cardWrapper = card.parentElement;
    const cardName = document.getElementById("card-preview-name");
    const cardClass = document.getElementById("card-preview-class");
    const cardNickname = document.getElementById("card-preview-nickname");
    const cardRole = document.getElementById("card-preview-role");
    const cardYear = document.getElementById("card-preview-year");
    const cardAvatar = document.getElementById("card-preview-avatar");
    const cardSchool = document.getElementById("card-preview-school");
    const cardFooterClass = document.getElementById("card-preview-footer-class");

    // Map theme name -> primary color for default avatar SVG
    const themeColorMap = {
      blue:   "%233b82f6",
      yellow: "%23d97706",
      purple: "%238b5cf6",
      orange: "%23f97316",
      red:    "%23ef4444",
      green:  "%2355b079",
      pink:   "%23ec4899"
    };

    // Track whether user has uploaded their own photo
    let userHasUploadedPhoto = false;

    // Helper: build default avatar SVG with a given color
    function buildDefaultAvatar(color) {
      return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${color}'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>`;
    }

    const defaultAvatarSvg = buildDefaultAvatar(themeColorMap["green"]);

    if (!inputName || !card) return;

    // 1. Text input real-time bindings
    inputName.addEventListener("input", (e) => {
      cardName.textContent = e.target.value.trim() || "Họ và Tên";
    });

    if (inputSchool && cardSchool) {
      inputSchool.addEventListener("input", (e) => {
        cardSchool.textContent = e.target.value.trim() || "Tên Trường Học";
      });
    }

    if (inputClass) {
      inputClass.addEventListener("input", (e) => {
        const val = e.target.value.trim() || "Lớp";
        if (cardClass) {
          cardClass.textContent = val;
        }
        if (cardFooterClass) {
          cardFooterClass.textContent = `${val} OFFICIAL`;
        }
      });
    }

    inputNickname.addEventListener("input", (e) => {
      cardNickname.textContent = e.target.value.trim() || "Biệt Danh";
    });

    inputYear.addEventListener("input", (e) => {
      cardYear.textContent = e.target.value.trim() || "Niên khóa";
    });

    selectRole.addEventListener("change", (e) => {
      cardRole.textContent = e.target.value;
    });

    // 2. Color Theme Swapper
    themeDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        // Remove active class from all dots
        themeDots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");

        // Remove old theme classes from card
        card.classList.forEach(className => {
          if (className.startsWith("theme-")) {
            card.classList.remove(className);
          }
        });

        // Apply new theme class
        const theme = dot.getAttribute("data-theme");
        card.classList.add(`theme-${theme}`);

        // Update default avatar color to match theme (only if no photo uploaded)
        if (!userHasUploadedPhoto) {
          const color = themeColorMap[theme] || themeColorMap["green"];
          cardAvatar.src = buildDefaultAvatar(color);
        }
      });
    });

    // 3. Image Upload handling (Drag & Drop & Click)
    const previewArea = dropzone.querySelector(".upload-preview");
    const placeholderArea = dropzone.querySelector(".upload-placeholder");
    const filenameSpan = dropzone.querySelector(".preview-filename");
    const removeBtn = dropzone.querySelector(".btn-remove-preview");

    dropzone.addEventListener("click", (e) => {
      // Don't click file input if click was on remove button
      if (e.target !== removeBtn) {
        inputFile.click();
      }
    });

    inputFile.addEventListener("change", (e) => {
      handleFiles(e.target.files);
    });

    // Drag-over styling
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    });

    // Remove uploaded photo
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid triggering file chooser dialog
      resetImageInput();
    });

    function handleFiles(files) {
      if (files.length === 0) return;
      const file = files[0];

      // Validate image format
      if (!file.type.match("image.*")) {
        alert("Vui lòng tải lên tệp tin dạng ảnh chân dung!");
        return;
      }

      userHasUploadedPhoto = true;

      // Display upload preview details
      filenameSpan.textContent = file.name;
      placeholderArea.style.display = "none";
      previewArea.style.display = "flex";

      // Render image preview inside card
      const reader = new FileReader();
      reader.onload = (event) => {
        cardAvatar.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    function resetImageInput() {
      inputFile.value = "";
      filenameSpan.textContent = "";
      previewArea.style.display = "none";
      placeholderArea.style.display = "flex";
      userHasUploadedPhoto = false;
      // Restore default avatar with current theme color
      const activeTheme = (card.className.match(/theme-(\w+)/) || [])[1] || "green";
      const color = themeColorMap[activeTheme] || themeColorMap["green"];
      cardAvatar.src = buildDefaultAvatar(color);
    }

    // 4. 3D Tilt & Holographic Shine Movement
    cardWrapper.addEventListener("mousemove", (e) => {
      const rect = cardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse X within element
      const y = e.clientY - rect.top;  // mouse Y within element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (limit between -16 to +16 degrees)
      const rotateY = ((x - centerX) / centerX) * 16;
      const rotateX = -((y - centerY) / centerY) * 16;

      // Apply 3D rotation styles
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Move Hologram shine overlay position based on coordinates
      const shine = card.querySelector(".card-shine");
      if (shine) {
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        shine.style.backgroundPosition = `${shineX}% ${shineY}%`;
      }
    });

    // Reset rotation on mouse leave
    cardWrapper.addEventListener("mouseleave", () => {
      // Add smooth transition back
      card.style.transition = "transform 0.5s ease";
      card.style.transform = "rotateX(0deg) rotateY(0deg)";

      const shine = card.querySelector(".card-shine");
      if (shine) {
        shine.style.backgroundPosition = "50% 50%";
      }

      // Remove temporary transitions
      setTimeout(() => {
        card.style.transition = "transform 0.1s ease";
      }, 500);
    });

    // 5. Card Download logic using html2canvas
    downloadBtn.addEventListener("click", () => {
      // Reset card rotations to flat angle for a clean picture snapshot
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      card.style.transition = "none";

      const originalText = downloadBtn.innerHTML;
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = `
        <svg class="download-icon animate-spin" viewBox="0 0 24 24" style="animation: spin 1s linear infinite; width:20px; height:20px;">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.3"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> ĐANG TẠO THẺ...
      `;

      // Allow DOM style updates to render before capture
      setTimeout(() => {
        if (typeof html2canvas === "undefined") {
          alert("Không thể tải thư viện html2canvas. Hãy kiểm tra kết nối mạng!");
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = originalText;
          card.style.transition = "transform 0.1s ease";
          return;
        }

        html2canvas(card, {
          useCORS: true,
          scale: 3, // High density image export
          backgroundColor: null, // Transparent card corners
          logging: false
        }).then((canvas) => {
          // Download anchor link creation
          const link = document.createElement("a");
          const name = inputName.value.trim() || "the_hoc_sinh";
          
          // Formats file name slug
          const fileNameSlug = name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove diacritics
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-zA-Z0-9]/g, "_")  // non-alphanumeric to underscores
            .toLowerCase();

          link.download = `TheHocSinh_${fileNameSlug}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();

          // Restore normal state
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = originalText;
          card.style.transition = "transform 0.1s ease";
        }).catch((err) => {
          console.error("Export card failed:", err);
          alert("Xuất ảnh thẻ thất bại. Xin vui lòng thử lại!");
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = originalText;
          card.style.transition = "transform 0.1s ease";
        });
      }, 200);
    });
  }

  // Publish global initializer
  window.initStudentIDCard = initStudentIDCard;
})();
