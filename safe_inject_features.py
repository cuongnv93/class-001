# -*- coding: utf-8 -*-
import os
import shutil
import re
import io
import sys

# Tương thích input giữa Python 2 và 3
try:
    input = raw_input
except NameError:
    pass

def safe_inject(target_dir):
    source_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Sử dụng encoding của hệ thống tập tin (mbcs trên Windows) để tránh lỗi ký tự tiếng Việt
    fs_encoding = sys.getfilesystemencoding() or 'mbcs'
    
    try:
        if isinstance(target_dir, str):
            target_dir = target_dir.decode(fs_encoding)
        if isinstance(source_dir, str):
            source_dir = source_dir.decode(fs_encoding)
    except Exception:
        # Fallback về utf-8 nếu không giải mã được bằng mbcs
        try:
            if isinstance(target_dir, str):
                target_dir = target_dir.decode('utf-8')
            if isinstance(source_dir, str):
                source_dir = source_dir.decode('utf-8')
        except Exception:
            pass
        
    # Chuẩn hóa đường dẫn
    target_dir = os.path.abspath(target_dir)
    source_dir = os.path.abspath(source_dir)

    if not os.path.exists(target_dir):
        # Tránh lỗi in unicode trên python 2 console bằng cách encode sang utf-8
        msg = u"❌ Thư mục đích không tồn tại: " + target_dir
        print(msg.encode('utf-8'))
        return

    msg_start = u"🚀 Bắt đầu tích hợp tính năng từ '{}' sang '{}'...\n".format(source_dir, target_dir)
    print(msg_start.encode('utf-8'))

    # ==========================================
    # BƯỚC 1: DANH SÁCH FILE CẦN COPY (JS, CSS, IMAGES)
    # ==========================================
    js_files = [
        "classSync.js", "classroomSeating.js", "classSuperlatives.js",
        "classConfessions.js", "classWishingTree.js", "classTimeline.js",
        "classStudentId.js", "kyten.js", "readSignature.js", "messageBoxFunction.js"
    ]
    css_files = [
        "classWishingTree.css", "classTimeline.css", "classStudentId.css", "kyten.css"
    ]

    # Copy các file JS & CSS
    for file_list, ext in [(js_files, "JS"), (css_files, "CSS")]:
        for f in file_list:
            src = os.path.join(source_dir, f)
            dst = os.path.join(target_dir, f)
            if os.path.exists(src):
                shutil.copy2(src, dst)
                msg_copy = u"  ✓ Đã copy file {}: {}".format(ext, f)
                print(msg_copy.encode('utf-8'))

    # Copy thư mục hình ảnh bổ trợ (ancient_wishing_tree.png)
    src_img = os.path.join(source_dir, "images")
    dst_img = os.path.join(target_dir, "images")
    if os.path.exists(src_img):
        if not os.path.exists(dst_img):
            os.makedirs(dst_img)
        wishing_tree_img = os.path.join(src_img, "ancient_wishing_tree.png")
        if os.path.exists(wishing_tree_img):
            shutil.copy2(wishing_tree_img, os.path.join(dst_img, "ancient_wishing_tree.png"))
            msg_img = u"  ✓ Đã copy ảnh: images/ancient_wishing_tree.png"
            print(msg_img.encode('utf-8'))

    # Tự động gỡ bỏ nạp photoBook.js nếu có để giữ Album mặc định hoạt động bình thường
    target_render_script = os.path.join(target_dir, "renderTagScript.js")
    if os.path.exists(target_render_script):
        try:
            with io.open(target_render_script, "r", encoding="utf-8") as rf:
                r_content = rf.read()
            
            pattern1 = r'addScriptWithTimestamp\(\s*"\./deleteUrl\.js"\s*\),\s*addScriptWithTimestamp\(\s*_0x[a-f0-9]+\(0xe1\)\s*\);'
            pattern2 = r'addScriptWithTimestamp\(\s*"\./deleteUrl\.js"\s*\),\s*addScriptWithTimestamp\(\s*"\./photoBook\.js"\s*\);'
            
            modified = False
            if re.search(pattern1, r_content):
                r_content = re.sub(pattern1, 'addScriptWithTimestamp("./deleteUrl.js");', r_content)
                modified = True
            elif re.search(pattern2, r_content):
                r_content = re.sub(pattern2, 'addScriptWithTimestamp("./deleteUrl.js");', r_content)
                modified = True
                
            if modified:
                with io.open(target_render_script, "w", encoding="utf-8") as wf:
                    wf.write(r_content)
                msg_disable_pb = u"  ✓ Đã tự động gỡ nạp photoBook.js trong renderTagScript.js để bảo toàn Album mặc định."
                print(msg_disable_pb.encode('utf-8'))
        except Exception as e:
            pass

    # ==========================================
    # BƯỚC 2: SAO LƯU FILE HTML ĐÍCH ĐỂ ĐẢM BẢO AN TOÀN
    # ==========================================
    target_html_path = os.path.join(target_dir, "index1.html")
    if not os.path.exists(target_html_path):
        target_html_path = os.path.join(target_dir, "index.html")
        
    if not os.path.exists(target_html_path):
        msg_err = u"❌ Lỗi: Không tìm thấy file index.html hoặc index1.html ở thư mục đích!"
        print(msg_err.encode('utf-8'))
        return

    # Tự động tạo bản backup (Ví dụ: index.html.bak) trước khi đụng vào code
    backup_path = target_html_path + ".bak"
    shutil.copy2(target_html_path, backup_path)
    
    msg_bak = u"\n💾 ĐÃ TỰ ĐỘNG SAO LƯU FILE GỐC RA: '{}' (Yên tâm 100% không mất code cũ)".format(os.path.basename(backup_path))
    print(msg_bak.encode('utf-8'))

    # ==========================================
    # BƯỚC 3: ĐỌC VÀ TRÍCH XUẤT CODE TỪ FILE NGUỒN
    # ==========================================
    source_html_path = os.path.join(source_dir, "index1.html")
    with io.open(source_html_path, "r", encoding="utf-8") as sf:
        source_content = sf.read()

    # Trích xuất toàn bộ các Section giao diện custom
    section_pattern = r"(<!-- START OF CLASSROOM SEATING CHART SECTION -->.*?)(?=\s*<!-- SCRIPTS CHỨC NĂNG LỚP HỌC -->)"
    section_match = re.search(section_pattern, source_content, re.DOTALL)
    if not section_match:
        msg_err2 = u"❌ Lỗi: Không thể trích xuất HTML các Section từ file nguồn!"
        print(msg_err2.encode('utf-8'))
        return
    sections_html = section_match.group(1)

    # Trích xuất toàn bộ Scripts nhúng ở cuối trang
    scripts_pattern = r"(<!-- SCRIPTS CHỨC NĂNG LỚP HỌC -->.*?<!-- END OF CLASSROOM SEATING CHART SECTION -->)"
    scripts_match = re.search(scripts_pattern, source_content, re.DOTALL)
    if not scripts_match:
        msg_err3 = u"❌ Lỗi: Không thể trích xuất Scripts khởi chạy từ file nguồn!"
        print(msg_err3.encode('utf-8'))
        return
    scripts_html = scripts_match.group(1)

    # ==========================================
    # BƯỚC 4: TIÊM CODE AN TOÀN (CÓ KIỂM TRA TRÙNG LẶP)
    # ==========================================
    with io.open(target_html_path, "r", encoding="utf-8") as tf:
        target_content = tf.read()

    # 1. Nhúng các file CSS
    css_links = u"""    <link rel="stylesheet" href="./classWishingTree.css">
    <link rel="stylesheet" href="./classTimeline.css">
    <link rel="stylesheet" href="./classStudentId.css">"""
    
    if "classWishingTree.css" not in target_content:
        target_content = target_content.replace("</head>", "{}\n</head>".format(css_links))
        msg_css = u"  ✓ Đã chèn các link CSS vào thẻ <head>"
        print(msg_css.encode('utf-8'))
    else:
        msg_css_skip = u"  - Thẻ CSS đã tồn tại, tự động bỏ qua để tránh trùng lặp."
        print(msg_css_skip.encode('utf-8'))

    # 2. Nhúng các Section HTML (Giao diện)
    if "SECTION_SEATING_CHART" not in target_content:
        # Chèn cụm Section HTML vào trước thẻ đóng </body>
        target_content = target_content.replace("</body>", "\n{}\n</body>".format(sections_html))
        msg_sec = u"  ✓ Đã chèn giao diện các Section lớp học vào trang"
        print(msg_sec.encode('utf-8'))
    else:
        msg_sec_skip = u"  - Giao diện các Section đã tồn tại, tự động bỏ qua."
        print(msg_sec_skip.encode('utf-8'))

    # 3. Nhúng Scripts điều khiển ở cuối file
    if "classroomSeating.js" not in target_content:
        target_content = target_content.replace("</body>", "\n{}\n</body>".format(scripts_html))
        msg_js = u"  ✓ Đã chèn toàn bộ Scripts khởi tạo hệ thống ở cuối trang"
        print(msg_js.encode('utf-8'))
    else:
        msg_js_skip = u"  - Scripts điều khiển đã tồn tại, tự động bỏ qua."
        print(msg_js_skip.encode('utf-8'))

    # Ghi đè lại file HTML đích sau khi đã được chèn an toàn
    with io.open(target_html_path, "w", encoding="utf-8") as tf:
        tf.write(target_content)

    msg_done = u"\n🎉 HOÀN THÀNH TÍCH HỢP AN TOÀN SANG THƯ MỤC: '{}'!".format(os.path.basename(target_dir))
    print(msg_done.encode('utf-8'))
    
    msg_check = u"👉 Hãy mở thử file HTML ở thư mục mới để kiểm tra thành quả nhé!"
    print(msg_check.encode('utf-8'))

if __name__ == "__main__":
    # Hỗ trợ truyền đường dẫn trực tiếp qua đối số dòng lệnh, hoặc nhập từ bàn phím nếu chạy click-to-run
    import sys
    if len(sys.argv) > 1:
        path_input = sys.argv[1]
    else:
        # Nhập đường dẫn thư mục thiệp đích từ bàn phím
        path_input = input("Nhập đường dẫn tuyệt đối hoặc tương đối tới thư mục thiệp mới: ").strip()
        
    if path_input:
        safe_inject(path_input)
    else:
        print("❌ Không nhận được đường dẫn thư mục đích!")
