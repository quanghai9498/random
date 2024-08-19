// Hàm để đọc tệp Excel và hiển thị danh sách học sinh
function readExcelFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const students = XLSX.utils.sheet_to_json(worksheet);

        displayStudents(students);
    };
    reader.readAsArrayBuffer(file);
}

// Hàm hiển thị danh sách học sinh
function displayStudents(students) {
    const studentList = document.getElementById("studentList");
    studentList.innerHTML = "";

    students.forEach(student => {
        const studentElement = document.createElement("div");
        studentElement.classList.add("student");
        studentElement.textContent = student.name;
        studentList.appendChild(studentElement);
    });

    // Khi danh sách học sinh được hiển thị, kích hoạt nút "Chọn học sinh"
    const selectButton = document.getElementById("selectButton");
    selectButton.disabled = false;
}

// Hàm để chơi âm thanh
function playAudio(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play().catch(error => {
        console.error('Failed to play audio:', error);
    });
}

// Hàm để đọc văn bản thành tiếng
function speak(text) {
    const ttsAudio = document.getElementById("ttsAudio");
    ttsAudio.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob`;
    ttsAudio.play();
}

function selectRandomStudent() {
    const students = document.querySelectorAll(".student");
    const remainingStudents = Array.from(students).filter(student => !student.classList.contains("selected"));

    if (remainingStudents.length === 0) {
        return; // Không có học sinh nào còn lại để chọn
    }

    remainingStudents.forEach(student => {
        student.classList.remove("active");
    });

    const backgroundAudio = document.getElementById("backgroundAudio");

    const duration = 4100; // Thời gian chạy ánh sáng màu xanh (4 giây)
    const interval = 100; // Khoảng thời gian giữa các thay đổi (0.1 giây)
    const numRemainingStudents = remainingStudents.length;

    // Bắt đầu chơi âm thanh nền
    playAudio('ok.mp3');

    let startTime = Date.now();
    let timeoutId = 4000;

    function animate() {
        const currentTime = Date.now();
        if (currentTime - startTime >= duration) {
            const randomIndex = Math.floor(Math.random() * numRemainingStudents);
            const selectedStudent = remainingStudents[randomIndex];

            selectedStudent.style.backgroundColor = "red"; // Chuyển sang màu đỏ
            // Đọc tên của học sinh được chọn thành tiếng
            speak(selectedStudent.textContent);

            setTimeout(function () {
                        
                        selectedStudent.style.backgroundColor = "yellow"; // Chuyển sang màu vàng
                        selectedStudent.classList.add("selected"); // Đánh dấu là đã được chọn

                                                // Dừng âm thanh nền khi học sinh được chọn
                        backgroundAudio.pause();
                        backgroundAudio.currentTime = 0;
                    }, 2000);

            clearTimeout(timeoutId); // Dừng hàm setTimeout
        } else {
            const randomIndex = Math.floor(Math.random() * numRemainingStudents);
            const selectedStudent = remainingStudents[randomIndex];
            selectedStudent.classList.add("active");
            selectedStudent.style.backgroundColor = "blue"; // Sử dụng màu xanh

            timeoutId = setTimeout(function () {
                selectedStudent.style.backgroundColor = "lightskyblue"; // Đặt màu nền về màu trắng
                animate(); // Chuyển sang học sinh tiếp theo
            }, interval);
        }
    }

    animate();
}




document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        readExcelFile(file);
    }
});

document.getElementById("selectButton").addEventListener("click", selectRandomStudent);
