tambahBukuPerline({
    id: 1,
    judul: "Shibou End wo Kaihi shita Galge no Heroine-tachi ga Ore no [Nikki-chou] o Yonde Himitsu o Shitta Rashii",
    penulis: "chhooooky",
    tahun: "2026",
    jenis: "Novel",            // Pilihan: "Novel", "Manga", "Manhwa", "Manhua"
    status: "Ongoing",         // Pilihan: "Ongoing" atau "Completed"
    genre: ["Fantasy", "Romance", "School Life", "Drama"],
    kodeNegara: "JP",
    ikon: "assets/cover/nv1cv.png",
    warnaSampul: "#1F242D",
    chapters: [
        {
            idChap: "c1",
            volume: 1,
            nomorChapter: 1,
            judulChapter: "Bertahan Hidup Dari Akhir Kematian",
            // Gunakan format "YYYY-MM-DD HH:mm" agar waktu terus berjalan maju:
            waktuUpload: "2026-10-08 10:00",
            fileUrl: "assets/novel/nv1/aku1.1.txt"
        },
        {
            idChap: "c2",
            volume: 1,
            nomorChapter: 2,
            judulChapter: "Bagian Kedua",
            // Karena kurang dari 24 jam dari sekarang, otomatis muncul badge UP merah:
            waktuUpload: "2026-10-16 09:00",
            fileUrl: "assets/novel/nv1/aku1.2.txt"
        }
    ]
});