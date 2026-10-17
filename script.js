// =========================================================================
// DAFTAR FILE IDENTITAS BUKU TERPISAH (PERLINE by chhooooky)
// Setiap menambah judul baru di folder assets/id/, cukup tambahkan path-nya di bawah ini:
// =========================================================================
const DAFTAR_FILE_IDENTITAS_BUKU = [
    "assets/id/nvid1.js",
    "assets/id/kmkid1.js",
    "assets/id/kmkid2.js",
    "assets/id/id4.js",
    "assets/id/id5.js"
];

let koleksiBuku = [];

// Fungsi global yang dipanggil oleh masing-masing file di dalam assets/id/...
function tambahBukuPerline(dataBuku) {
    if (!dataBuku || !dataBuku.judul) return;
    
    const idxJudulSama = koleksiBuku.findIndex(
        b => b.judul.toLowerCase() === dataBuku.judul.toLowerCase()
    );
    
    if (idxJudulSama !== -1) {
        koleksiBuku[idxJudulSama] = dataBuku;
        return;
    }
    
    const idSudahDipakai = koleksiBuku.some(b => b.id === dataBuku.id);
    if (!dataBuku.id || idSudahDipakai) {
        dataBuku.id = Date.now() + Math.floor(Math.random() * 10000);
    }
    
    koleksiBuku.push(dataBuku);
}

// Fallback bawaan jika file di assets/id/ belum dibuat oleh developer
const KOLEKSI_CADANGAN_DEFAULT = [
    {
        id: 4,
        judul: "Shibou End wo Kaihi shita Galge no Heroine-tachi ga Ore no [Nikki-chou] o Yonde Himitsu o Shitta Rashii",
        penulis: "chhooooky",
        tahun: "2026",
        kategori: "developer",
        jenis: "Novel",
        status: "Ongoing",
        genre: ["Fantasy", "Romance", "School Life", "Drama"],
        kodeNegara: "JP",
        ikon: "assets/cover/id-5.png",
        warnaSampul: "#1F242D",
        chapters: [
            {
                idChap: "c1",
                volume: 1,
                nomorChapter: 1,
                judulChapter: "Bertahan Hidup Dari Akhir Kematian",
                waktuUpload: "2026-10-09 08:00",
                fileUrl: "assets/novel/id4/aku1.1.txt"
            },
            {
                idChap: "c2",
                volume: 1,
                nomorChapter: 2,
                judulChapter: "Bagian Kedua",
                waktuUpload: "2026-10-16 06:00",
                fileUrl: "assets/novel/id4/aku1.2.txt"
            }
        ]
    },
    {
        id: 5,
        judul: "ibu tiri",
        penulis: "Studio Komik",
        tahun: "2026",
        kategori: "developer",
        jenis: "Manga",
        status: "Ongoing",
        genre: ["Romance", "Comedy", "Slice of Life"],
        kodeNegara: "JP",
        ikon: "assets/komik/idk1/001.jpg",
        warnaSampul: "#181B20",
        chapters: [
            {
                idChap: "c1",
                volume: 1,
                nomorChapter: 1,
                judulChapter: "Chapter 1",
                waktuUpload: "2026-09-05 12:00",
                folderKomik: "assets/komik/idk1",
                jumlahHalaman: 52,
                ekstensi: "jpg",
                digit: 3
            },
            {
                idChap: "c2",
                volume: 1,
                nomorChapter: 2,
                judulChapter: "Chapter 2",
                waktuUpload: "2026-10-16 10:30",
                folderKomik: "assets/komik/idk1",
                jumlahHalaman: 52,
                ekstensi: "jpg",
                digit: 3
            }
        ]
    }
];

// Memuat seluruh file identitas komik/novel dari folder assets/id/
async function muatSemuaFileIdentitasBuku() {
    const janjiMuat = DAFTAR_FILE_IDENTITAS_BUKU.map(pathFile => {
        return new Promise((resolve) => {
            const scriptEl = document.createElement("script");
            scriptEl.src = pathFile;
            scriptEl.onload = () => resolve(true);
            scriptEl.onerror = () => resolve(false);
            document.head.appendChild(scriptEl);
        });
    });

    await Promise.all(janjiMuat);

    if (koleksiBuku.length === 0) {
        KOLEKSI_CADANGAN_DEFAULT.forEach(b => tambahBukuPerline(b));
    }

    pastikanTimestampStatisBuku();
}

// =========================================================================
// DAFTAR LENGKAP SEMUA GENRE (58 GENRE) & 10 GELAR BANGSAWAN
// =========================================================================
const DAFTAR_SEMUA_GENRE = [
    "Action", "Adult", "Adventure", "Comedy", "Cooking", "Crime", "Cyberpunk",
    "Demons", "Drama", "Ecchi", "Edukasi", "Fantasy", "Game", "Gender Bender",
    "Gore", "Harem", "Historical", "Horror", "Isekai", "Josei", "Magic",
    "Martial Arts", "Mature", "Mecha", "Medical", "Military", "Murim", "Music",
    "Mystery", "One Shot", "Overpowered", "Parody", "Police", "Post-Apocalyptic",
    "Psychological", "Regression", "Reincarnation", "Romance", "School Life",
    "Sci-Fi", "Seinen", "Sejarah", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai",
    "Slice of Life", "Sports", "Super Power", "Supernatural", "Survival",
    "System", "Thriller", "Time Travel", "Tragedy", "Vampire", "Villainess",
    "Webtoons", "Wuxia", "Xianxia", "Xuanhuan", "Yuri"
];

const DAFTAR_GELAR = [
    { nama: "Rakyat Biasa", minExp: 0 },
    { nama: "Knight", minExp: 250 },
    { nama: "Baron", minExp: 750 },
    { nama: "Viscount", minExp: 1600 },
    { nama: "Count", minExp: 3000 },
    { nama: "Duke", minExp: 5000 },
    { nama: "Expert Knight", minExp: 8000 },
    { nama: "Archduke", minExp: 12000 },
    { nama: "King", minExp: 18000 },
    { nama: "Emperor", minExp: 26000 }
];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjygpygj";
const BATAS_BACA_GUEST = 3;
const ITEM_PER_HALAMAN = 10;

// =========================================================================
// STATE PENGGUNA (OTOMATIS NICK GUEST + ANGKA RANDOM JIKA BELUM LOGIN)
// =========================================================================
function buatNamaGuestRandom() {
    const angkaAcak = Math.floor(1000 + Math.random() * 9000);
    return `Guest_${angkaAcak}`;
}

let dataPengguna = JSON.parse(localStorage.getItem("perline_user_v5")) || {
    nama: buatNamaGuestRandom(),
    email: "",
    isLoggedIn: false,
    avatarUrl: "",
    tanggalGabung: Date.now(),
    totalDetikBaca: 0,
    chapterDibacaIds: [],
    bukuTamatIds: [],
    jumlahBacaBuku: {},
    favoritIds: [],
    bookmarks: [],
    history: []
};

if (!dataPengguna.isLoggedIn && (!dataPengguna.nama || dataPengguna.nama === "chhooooky")) {
    dataPengguna.nama = buatNamaGuestRandom();
}

let akunTerdaftar = JSON.parse(localStorage.getItem("perline_accounts_db")) || [];
let pendingVerifikasiAkun = null;

let menuBawahAktif = "home";
let subTabLibraryAktif = "favorit";
let halamanHomeSekarang = 1;
let halamanExploreSekarang = 1;

let bahasaAktif = localStorage.getItem("perline_lang") || "id";
let temaAktif = localStorage.getItem("perline_theme") || "dark";
let kecepatanAutoScroll = parseInt(localStorage.getItem("perline_scrollspeed")) || 3;

let bukuSedangDibuka = null;
let indexChapterAktif = 0;
let timerBacaInterval = null;
let autoScrollInterval = null;
let levelNavigasiProfil = 1;
let avatarSementaraBase64 = "";

let daftarHalamanKomikAktif = [];
let daftarHalamanTeksAktif = [];
let tipeKontenSedangDibaca = "teks";

function simpanDataPengguna() {
    try {
        localStorage.setItem("perline_user_v5", JSON.stringify(dataPengguna));
    } catch (e) {
        console.error("Penyimpanan lokal penuh:", e);
    }
    perbaruiUIProfilDanGelar();
}

function simpanDatabaseAkun() {
    localStorage.setItem("perline_accounts_db", JSON.stringify(akunTerdaftar));
}

// =========================================================================
// LOGIKA WAKTU RILIS REAL-TIME (MAKS 31+ HARI) & BADGE UP (< 24 JAM)
// =========================================================================
function pastikanTimestampStatisBuku() {
    const cacheWaktu = JSON.parse(localStorage.getItem("perline_chap_timestamps") || "{}");
    let adaPerubahan = false;

    koleksiBuku.forEach(buku => {
        if (!Array.isArray(buku.chapters)) return;
        buku.chapters.forEach((chap, idx) => {
            const key = `b${buku.id}_c${chap.idChap || idx}`;
            if (!chap.waktuUpload) {
                if (!cacheWaktu[key]) {
                    cacheWaktu[key] = new Date().toISOString();
                    adaPerubahan = true;
                }
                chap.waktuUpload = cacheWaktu[key];
            }
        });
    });

    if (adaPerubahan) {
        localStorage.setItem("perline_chap_timestamps", JSON.stringify(cacheWaktu));
    }
}

function parseWaktuUpload(waktuStr) {
    if (!waktuStr) return Date.now();
    const normalStr = waktuStr.includes(" ") && !waktuStr.includes("T")
        ? waktuStr.replace(" ", "T")
        : waktuStr;
    const ms = new Date(normalStr).getTime();
    return isNaN(ms) ? Date.now() : ms;
}

function apakahUpdateKurangDari24Jam(waktuStr) {
    if (!waktuStr) return false;
    const selisihMs = Date.now() - parseWaktuUpload(waktuStr);
    const batas24JamMs = 24 * 3600 * 1000;
    return selisihMs >= 0 && selisihMs < batas24JamMs;
}

function apakahBukuPunyaUpdate24Jam(buku) {
    if (!buku || !Array.isArray(buku.chapters) || buku.chapters.length === 0) return false;
    return buku.chapters.some(ch => apakahUpdateKurangDari24Jam(ch.waktuUpload));
}

function hitungWaktuBerlalu(waktuStr) {
    if (!waktuStr) return "Baru";
    const selisihDetik = Math.max(60, Math.floor((Date.now() - parseWaktuUpload(waktuStr)) / 1000));
    const menit = Math.floor(selisihDetik / 60);
    const jam = Math.floor(selisihDetik / 3600);
    const hari = Math.floor(selisihDetik / 86400);

    if (menit < 60) return `${menit} mnt`;
    if (jam < 24) return `${jam} jam`;
    if (hari <= 31) return `${hari} hari`;
    return `31+ hari`;
}

function dapatkanTimestampTerbaruBuku(buku) {
    if (!buku.chapters || buku.chapters.length === 0) return 0;
    return Math.max(...buku.chapters.map(c => parseWaktuUpload(c.waktuUpload)));
}

function formatLabelVolumeChapter(buku, indexChap) {
    const totalChap = buku.chapters.length;
    const chap = buku.chapters[indexChap];
    const vol = chap.volume || 1;
    const noChap = chap.nomorChapter || (indexChap + 1);
    return `Volume ${vol} Chapter ${noChap}/${totalChap}`;
}

function hitungChapterBelumDibaca(buku) {
    let belum = 0;
    if (!buku.chapters) return 0;
    buku.chapters.forEach((chap, idx) => {
        const keyChap = `${buku.id}_${chap.idChap || idx}`;
        if (!dataPengguna.chapterDibacaIds.includes(keyChap)) belum++;
    });
    return belum;
}

// =========================================================================
// INISIALISASI DROPDOWN GENRE LENGKAP
// =========================================================================
function muatDropdownGenreLengkap() {
    const selectGenre = document.getElementById("filterGenre");
    if (!selectGenre) return;
    selectGenre.innerHTML = `<option value="semua">Semua Genre (${DAFTAR_SEMUA_GENRE.length})</option>`;
    DAFTAR_SEMUA_GENRE.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g;
        opt.innerText = g;
        selectGenre.appendChild(opt);
    });
}

// =========================================================================
// PERHITUNGAN GELAR & STATISTIK MEMBACA
// =========================================================================
function hitungGelarPengguna() {
    const hariGabung = Math.max(1, Math.floor((Date.now() - dataPengguna.tanggalGabung) / (1000 * 60 * 60 * 24)) + 1);
    const menitBaca = Math.floor(dataPengguna.totalDetikBaca / 60);
    const jmlChap = dataPengguna.chapterDibacaIds.length;
    const jmlTamat = dataPengguna.bukuTamatIds.length;

    const totalExp = (hariGabung * 3) + (menitBaca * 2) + (jmlChap * 8) + (jmlTamat * 25);

    let gelarSekarang = DAFTAR_GELAR[0];
    let gelarBerikutnya = null;

    for (let i = 0; i < DAFTAR_GELAR.length; i++) {
        if (totalExp >= DAFTAR_GELAR[i].minExp) {
            gelarSekarang = DAFTAR_GELAR[i];
            gelarBerikutnya = DAFTAR_GELAR[i + 1] || null;
        }
    }

    return { gelarSekarang, gelarBerikutnya, totalExp, hariGabung };
}

function formatDurasiBaca(totalDetik) {
    const jam = Math.floor(totalDetik / 3600);
    const menit = Math.floor((totalDetik % 3600) / 60);
    const detik = totalDetik % 60;
    if (jam > 0) return `${jam}j ${menit}m`;
    if (menit > 0) return `${menit}m ${detik}d`;
    return `${detik} dtk`;
}

function perbaruiUIProfilDanGelar() {
    const info = hitungGelarPengguna();
    const inisial = (dataPengguna.nama || "G").charAt(0).toUpperCase();

    const terapkanAvatar = (el) => {
        if (!el) return;
        if (dataPengguna.isLoggedIn && dataPengguna.avatarUrl) {
            el.innerHTML = `<img src="${dataPengguna.avatarUrl}" alt="Avatar">`;
        } else {
            el.innerText = inisial;
        }
    };

    terapkanAvatar(document.getElementById("headerAvatarMini"));
    terapkanAvatar(document.getElementById("profAvatarIcon"));
    terapkanAvatar(document.getElementById("previewAvatarEdit"));

    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    const kuotaTerpakai = Math.min(BATAS_BACA_GUEST, dataPengguna.chapterDibacaIds.length);

    setTxt("headerUserName", dataPengguna.nama);
    setTxt("headerUserRank", info.gelarSekarang.nama);
    setTxt("profDisplayName", dataPengguna.nama);
    setTxt("profStatusLogin", dataPengguna.isLoggedIn && dataPengguna.email
        ? `Terverifikasi: ${dataPengguna.email}`
        : `Mode Tamu • Kuota Baca: ${kuotaTerpakai}/${BATAS_BACA_GUEST} Chapter`);
    setTxt("btnOpenAccountModal", dataPengguna.isLoggedIn ? "Ubah Foto & Profil" : "Login / Daftar");
    setTxt("profRankTitle", info.gelarSekarang.nama);
    setTxt("profJoinDays", `Hari ke-${info.hariGabung} di PERLINE`);
    setTxt("txtGuestQuotaUsed", kuotaTerpakai);

    const expBar = document.getElementById("profExpBar");
    if (info.gelarBerikutnya) {
        const range = info.gelarBerikutnya.minExp - info.gelarSekarang.minExp;
        const progress = Math.min(100, Math.round(((info.totalExp - info.gelarSekarang.minExp) / range) * 100));
        if (expBar) expBar.style.width = `${progress}%`;
        setTxt("profExpText", `${info.totalExp} / ${info.gelarBerikutnya.minExp} EXP menuju gelar ${info.gelarBerikutnya.nama}`);
    } else {
        if (expBar) expBar.style.width = `100%`;
        setTxt("profExpText", `${info.totalExp} EXP • Gelar Tertinggi (Emperor)`);
    }

    setTxt("statTotalBuku", koleksiBuku.length);
    setTxt("statDurasiBaca", formatDurasiBaca(dataPengguna.totalDetikBaca));
    setTxt("statBukuTamat", dataPengguna.bukuTamatIds.length);
    setTxt("statTotalChapter", dataPengguna.chapterDibacaIds.length);
}

// =========================================================================
// NAVIGASI 4 MENU BAWAH & PAGINASI 10 KARYA PER HALAMAN
// =========================================================================
function pindahMenuBawah(menu) {
    menuBawahAktif = menu;

    const mapViews = {
        home: "viewHome",
        explore: "viewExplore",
        history: "viewHistory",
        library: "viewLibrary"
    };
    const mapBtns = {
        home: "navBtnHome",
        explore: "navBtnExplore",
        history: "navBtnHistory",
        library: "navBtnLibrary"
    };

    Object.keys(mapViews).forEach(k => {
        document.getElementById(mapViews[k])?.classList.toggle("active", k === menu);
        document.getElementById(mapBtns[k])?.classList.toggle("active", k === menu);
    });

    if (menu === "home") tampilkanBukuHome();
    if (menu === "explore") tampilkanBukuExplore();
    if (menu === "history") renderHalamanHistoryUtama();
    if (menu === "library") renderHalamanLibraryUtama();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetHalamanDanTampilkan(target) {
    if (target === "home") {
        halamanHomeSekarang = 1;
        tampilkanBukuHome();
    } else {
        halamanExploreSekarang = 1;
        tampilkanBukuExplore();
    }
}

function buatElemenKartuBuku(buku) {
    const isGambar = buku.ikon.includes(".") || buku.ikon.startsWith("data:image") || buku.ikon.startsWith("blob:");
    const totalChap = buku.chapters ? buku.chapters.length : 0;
    const bukuAdaUpdate24Jam = apakahBukuPunyaUpdate24Jam(buku);

    const duaChapterTerbaru = [];
    for (let i = totalChap - 1; i >= Math.max(0, totalChap - 2); i--) {
        duaChapterTerbaru.push({ chap: buku.chapters[i], indexAsli: i });
    }

    const htmlTombolChapter = duaChapterTerbaru.map(item => {
        const noChap = item.chap.nomorChapter || (item.indexAsli + 1);
        const waktuLalu = hitungWaktuBerlalu(item.chap.waktuUpload);
        const chapBaru24Jam = apakahUpdateKurangDari24Jam(item.chap.waktuUpload);
        const keyChap = `${buku.id}_${item.chap.idChap || item.indexAsli}`;
        const sudahDibaca = dataPengguna.chapterDibacaIds.includes(keyChap);

        return `
            <button class="chap-pill-row ${sudahDibaca ? 'is-read' : ''}" onclick="event.stopPropagation(); mulaiBacaChapter(${buku.id}, ${item.indexAsli})">
                <span>
                    Chapter ${noChap}
                    ${chapBaru24Jam ? `<span class="badge-up-inline">UP</span>` : ``}
                </span>
                <span class="chap-pill-time">${waktuLalu}</span>
            </button>
        `;
    }).join("");

    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
        <div>
            <div class="book-cover" style="background-color: ${buku.warnaSampul};" onclick="bukaModalChapter(${buku.id})">
                <span class="cover-badge-top-left">${buku.jenis || 'Novel'}</span>
                ${buku.kodeNegara ? `<span class="cover-badge-bottom-right">${buku.kodeNegara}</span>` : ``}
                ${isGambar 
                    ? `<img src="${buku.ikon}" alt="${buku.judul}" loading="lazy" onerror="cobaFormatSampulLain(this, '${buku.ikon}')">` 
                    : `<span>${buku.ikon}</span>`
                }
            </div>
            <div class="card-title-wrap" onclick="bukaModalChapter(${buku.id})">
                <h3 class="book-title">
                    ${bukuAdaUpdate24Jam ? `<span class="badge-up">UP</span>` : ``}${buku.judul}
                </h3>
            </div>
        </div>
        <div class="latest-chapters-stack">
            ${htmlTombolChapter}
        </div>
    `;
    return card;
}

function renderKontrolPaginasi(containerId, totalItem, halamanAktif, fungsiGantiHalaman) {
    const box = document.getElementById(containerId);
    if (!box) return;
    box.innerHTML = "";

    const totalHalaman = Math.ceil(totalItem / ITEM_PER_HALAMAN);
    if (totalHalaman <= 1) return;

    const btnPrev = document.createElement("button");
    btnPrev.className = "page-btn";
    btnPrev.innerText = "‹ Sebelumnya";
    btnPrev.disabled = (halamanAktif <= 1);
    btnPrev.onclick = () => fungsiGantiHalaman(halamanAktif - 1);
    box.appendChild(btnPrev);

    for (let p = 1; p <= totalHalaman; p++) {
        const btnNum = document.createElement("button");
        btnNum.className = `page-btn ${p === halamanAktif ? "active" : ""}`;
        btnNum.innerText = p;
        btnNum.onclick = () => fungsiGantiHalaman(p);
        box.appendChild(btnNum);
    }

    const btnNext = document.createElement("button");
    btnNext.className = "page-btn";
    btnNext.innerText = "Selanjutnya ›";
    btnNext.disabled = (halamanAktif >= totalHalaman);
    btnNext.onclick = () => fungsiGantiHalaman(halamanAktif + 1);
    box.appendChild(btnNext);
}

function tampilkanBukuHome() {
    const grid = document.getElementById("homeBookGrid");
    if (!grid) return;
    const kataKunci = (document.getElementById("homeSearchInput")?.value || "").toLowerCase();

    grid.innerHTML = "";

    const hasil = koleksiBuku
        .filter(buku =>
            buku.judul.toLowerCase().includes(kataKunci) ||
            buku.penulis.toLowerCase().includes(kataKunci)
        )
        .sort((a, b) => dapatkanTimestampTerbaruBuku(b) - dapatkanTimestampTerbaruBuku(a));

    const badge = document.getElementById("homeTotalBadge");
    if (badge) badge.innerText = `${hasil.length} Karya`;

    if (hasil.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 32px;">Karya tidak ditemukan.</p>`;
        document.getElementById("homePagination").innerHTML = "";
        return;
    }

    const totalHalaman = Math.ceil(hasil.length / ITEM_PER_HALAMAN);
    if (halamanHomeSekarang > totalHalaman) halamanHomeSekarang = 1;

    const indexAwal = (halamanHomeSekarang - 1) * ITEM_PER_HALAMAN;
    const itemHalamanIni = hasil.slice(indexAwal, indexAwal + ITEM_PER_HALAMAN);

    itemHalamanIni.forEach(buku => grid.appendChild(buatElemenKartuBuku(buku)));

    renderKontrolPaginasi("homePagination", hasil.length, halamanHomeSekarang, (halBaru) => {
        halamanHomeSekarang = halBaru;
        tampilkanBukuHome();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function tampilkanBukuExplore() {
    const grid = document.getElementById("exploreBookGrid");
    if (!grid) return;

    const kataKunci = (document.getElementById("exploreSearchInput")?.value || "").toLowerCase();
    const filterJenis = document.getElementById("filterJenis")?.value || "semua";
    const filterGenre = document.getElementById("filterGenre")?.value || "semua";
    const filterStatus = document.getElementById("filterStatus")?.value || "semua";

    grid.innerHTML = "";

    const hasil = koleksiBuku
        .filter(buku => {
            const cocokJenis = (filterJenis === "semua") || (buku.jenis === filterJenis);
            const cocokGenre = (filterGenre === "semua") || (Array.isArray(buku.genre) && buku.genre.includes(filterGenre));
            const cocokStatus = (filterStatus === "semua") || (buku.status === filterStatus);
            const cocokCari = buku.judul.toLowerCase().includes(kataKunci) ||
                              buku.penulis.toLowerCase().includes(kataKunci);
            return cocokJenis && cocokGenre && cocokStatus && cocokCari;
        })
        .sort((a, b) => dapatkanTimestampTerbaruBuku(b) - dapatkanTimestampTerbaruBuku(a));

    const badge = document.getElementById("exploreTotalBadge");
    if (badge) badge.innerText = `${hasil.length} Karya`;

    if (hasil.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 32px;">Tidak ada karya yang cocok dengan filter ini.</p>`;
        document.getElementById("explorePagination").innerHTML = "";
        return;
    }

    const totalHalaman = Math.ceil(hasil.length / ITEM_PER_HALAMAN);
    if (halamanExploreSekarang > totalHalaman) halamanExploreSekarang = 1;

    const indexAwal = (halamanExploreSekarang - 1) * ITEM_PER_HALAMAN;
    const itemHalamanIni = hasil.slice(indexAwal, indexAwal + ITEM_PER_HALAMAN);

    itemHalamanIni.forEach(buku => grid.appendChild(buatElemenKartuBuku(buku)));

    renderKontrolPaginasi("explorePagination", hasil.length, halamanExploreSekarang, (halBaru) => {
        halamanExploreSekarang = halBaru;
        tampilkanBukuExplore();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function renderHalamanHistoryUtama() {
    const hisBox = document.getElementById("mainHistoryListBox");
    if (!hisBox) return;

    if (dataPengguna.history.length === 0) {
        hisBox.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding: 36px 0;">Belum ada riwayat bacaan.</p>`;
    } else {
        hisBox.innerHTML = dataPengguna.history.map(h => `
            <div class="mini-item" onclick="mulaiBacaChapter(${h.idBuku}, ${h.indexChap})">
                <div>
                    <strong>${h.judulBuku}</strong><br>
                    <small style="color:var(--accent-main); font-weight:600;">${h.judulChap}</small>
                </div>
                <small style="color:var(--text-secondary);">${h.waktu}</small>
            </div>
        `).join("");
    }
}

function switchLibraryTab(mode) {
    subTabLibraryAktif = mode;
    const isFav = (mode === "favorit");
    document.getElementById("tabBtnLibFav")?.classList.toggle("active", isFav);
    document.getElementById("tabBtnLibBm")?.classList.toggle("active", !isFav);

    const favGrid = document.getElementById("mainFavGrid");
    const bmBox = document.getElementById("mainBookmarkListBox");
    if (favGrid) favGrid.style.display = isFav ? "grid" : "none";
    if (bmBox) bmBox.style.display = isFav ? "none" : "flex";

    renderHalamanLibraryUtama();
}

function renderHalamanLibraryUtama() {
    const favGrid = document.getElementById("mainFavGrid");
    const bmBox = document.getElementById("mainBookmarkListBox");

    if (favGrid) {
        favGrid.innerHTML = "";
        const bukuFavs = koleksiBuku.filter(b => dataPengguna.favoritIds.includes(b.id));
        if (bukuFavs.length === 0) {
            favGrid.innerHTML = `<p style="grid-column: 1 / -1; color:var(--text-secondary); text-align:center; padding: 36px 0;">Belum ada karya di daftar Favorit Anda.</p>`;
        } else {
            bukuFavs.forEach(b => favGrid.appendChild(buatElemenKartuBuku(b)));
        }
    }

    if (bmBox) {
        if (dataPengguna.bookmarks.length === 0) {
            bmBox.innerHTML = `<p style="color:var(--text-secondary); text-align:center; padding: 36px 0;">Belum ada chapter yang ditandai (Bookmark).</p>`;
        } else {
            bmBox.innerHTML = dataPengguna.bookmarks.map(bm => `
                <div class="mini-item" onclick="mulaiBacaChapter(${bm.idBuku}, ${bm.indexChap})">
                    <div>
                        <strong>${bm.judulBuku}</strong><br>
                        <small style="color:var(--accent-main); font-weight:600;">${bm.judulChap}</small>
                    </div>
                    <small style="color:var(--text-secondary);">${bm.waktu}</small>
                </div>
            `).join("");
        }
    }
}

function tampilkanBuku() {
    tampilkanBukuHome();
    tampilkanBukuExplore();
    if (menuBawahAktif === "library") renderHalamanLibraryUtama();
}

// =========================================================================
// MODAL DAFTAR CHAPTER
// =========================================================================
function bukaModalChapter(idBuku) {
    const buku = koleksiBuku.find(b => b.id === idBuku);
    if (!buku) return;
    bukuSedangDibuka = buku;

    const isGambar = buku.ikon.includes(".") || buku.ikon.startsWith("data:image") || buku.ikon.startsWith("blob:");
    const coverBox = document.getElementById("chapModalCover");
    if (coverBox) {
        coverBox.style.backgroundColor = buku.warnaSampul;
        coverBox.innerHTML = isGambar
            ? `<img src="${buku.ikon}" alt="${buku.judul}" onerror="cobaFormatSampulLain(this, '${buku.ikon}')">`
            : `<div style="display:flex;height:100%;align-items:center;justify-content:center;font-weight:800;">${buku.ikon}</div>`;
    }

    const kaliDibaca = dataPengguna.jumlahBacaBuku[buku.id] || 0;
    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    setTxt("chapModalType", buku.jenis || "Novel");
    setTxt("chapModalStatus", buku.status || "Ongoing");
    setTxt("chapModalReadCount", `Dibaca ${kaliDibaca}x`);
    setTxt("chapModalTitle", buku.judul);
    setTxt("chapModalAuthor", `${buku.penulis} • ${buku.tahun || "2026"}`);
    setTxt("chapModalGenres", Array.isArray(buku.genre) ? `Genre: ${buku.genre.join(", ")}` : "");
    setTxt("chapTotalLabel", `${buku.chapters.length} Chapter`);

    perbaruiTombolFavoritUI();
    renderDaftarChapterModal();

    const modal = document.getElementById("chapterModal");
    if (modal) modal.style.display = "flex";
}

function renderDaftarChapterModal() {
    const box = document.getElementById("chapterListContainer");
    if (!box || !bukuSedangDibuka) return;
    box.innerHTML = "";

    bukuSedangDibuka.chapters.forEach((chap, idx) => {
        const keyChap = `${bukuSedangDibuka.id}_${chap.idChap || idx}`;
        const sudahDibaca = dataPengguna.chapterDibacaIds.includes(keyChap);
        const labelVolChap = formatLabelVolumeChapter(bukuSedangDibuka, idx);
        const waktuLalu = hitungWaktuBerlalu(chap.waktuUpload);
        const baru24Jam = apakahUpdateKurangDari24Jam(chap.waktuUpload);

        const item = document.createElement("div");
        item.className = `chapter-item ${sudahDibaca ? "read-done" : ""}`;
        item.onclick = () => mulaiBacaChapter(bukuSedangDibuka.id, idx);

        item.innerHTML = `
            <div>
                <span class="vol-chap-badge">${labelVolChap}</span>
                ${baru24Jam ? `<span class="badge-up-inline">UP</span>` : ``}<br>
                <b>${chap.judulChapter}</b>
            </div>
            <div style="text-align:right;">
                <small style="color:var(--text-secondary); display:block;">${waktuLalu}</small>
                <span style="font-size:11px; color:${sudahDibaca ? 'var(--accent-main)' : 'var(--text-secondary)'}; font-weight:700;">
                    ${sudahDibaca ? "Sudah Dibaca" : "Belum Dibaca"}
                </span>
            </div>
        `;
        box.appendChild(item);
    });
}

function tutupModalChapter() {
    const modal = document.getElementById("chapterModal");
    if (modal) modal.style.display = "none";
}

function lanjutBacaDariModal() {
    if (!bukuSedangDibuka) return;
    let targetIdx = bukuSedangDibuka.chapters.findIndex((chap, idx) => {
        const keyChap = `${bukuSedangDibuka.id}_${chap.idChap || idx}`;
        return !dataPengguna.chapterDibacaIds.includes(keyChap);
    });
    if (targetIdx === -1) targetIdx = 0;
    mulaiBacaChapter(bukuSedangDibuka.id, targetIdx);
}

// =========================================================================
// PEMBACA KOMIK & NOVEL + MENDUKUNG 003__001.jpg & 003_001.jpg
// =========================================================================
function ambilDaftarGambarKomik(chap) {
    if (chap.halaman && Array.isArray(chap.halaman) && chap.halaman.length > 0) {
        return chap.halaman.map((url, idx) => ({
            urlUtama: url,
            folder: "",
            nomor: idx + 1
        }));
    }
    if (chap.folderKomik && chap.jumlahHalaman) {
        const folderBersih = chap.folderKomik.replace(/\/+$/, "");
        const ext = chap.ekstensi || "jpg";
        const digit = parseInt(chap.digit) || 3;
        const hasil = [];
        for (let i = 1; i <= chap.jumlahHalaman; i++) {
            const namaNomor = digit > 1 ? i.toString().padStart(digit, "0") : i.toString();
            hasil.push({
                urlUtama: `${folderBersih}/${namaNomor}.${ext}`,
                folder: folderBersih,
                nomor: i
            });
        }
        return hasil;
    }
    return null;
}

// Otomatis mencari format 003__001.jpg (2 underscore), 003_001.jpg (1 underscore), maupun 003.jpg
function cobaFormatGambarKomikLain(imgEl) {
    const folder = imgEl.getAttribute("data-folder");
    const nomor = parseInt(imgEl.getAttribute("data-nomor"));
    if (!folder || !nomor) {
        imgEl.style.display = "none";
        return;
    }

    const n1 = nomor.toString();
    const n2 = nomor.toString().padStart(2, "0");
    const n3 = nomor.toString().padStart(3, "0");

    const daftarKandidat = [
        { url: `${folder}/${n3}__001.jpg`, sub: 1, prefix: `${folder}/${n3}`, sep: "__", pad: 3, ext: "jpg" },
        { url: `${folder}/${n3}_001.jpg`, sub: 1, prefix: `${folder}/${n3}`, sep: "_", pad: 3, ext: "jpg" },
        { url: `${folder}/${n3}__01.jpg`, sub: 1, prefix: `${folder}/${n3}`, sep: "__", pad: 2, ext: "jpg" },
        { url: `${folder}/${n3}_01.jpg`, sub: 1, prefix: `${folder}/${n3}`, sep: "_", pad: 2, ext: "jpg" },
        { url: `${folder}/${n3}__1.jpg`, sub: 1, prefix: `${folder}/${n3}`, sep: "__", pad: 1, ext: "jpg" },
        { url: `${folder}/${n3}_1.jpg`, sub: 1, prefix: `${folder}/${n3}`, sep: "_", pad: 1, ext: "jpg" },
        { url: `${folder}/${n2}.jpg`, sub: 0 },
        { url: `${folder}/${n2}__01.jpg`, sub: 1, prefix: `${folder}/${n2}`, sep: "__", pad: 2, ext: "jpg" },
        { url: `${folder}/${n2}_01.jpg`, sub: 1, prefix: `${folder}/${n2}`, sep: "_", pad: 2, ext: "jpg" },
        { url: `${folder}/${n1}.jpg`, sub: 0 },
        { url: `${folder}/${n3}.png`, sub: 0 },
        { url: `${folder}/${n3}__001.png`, sub: 1, prefix: `${folder}/${n3}`, sep: "__", pad: 3, ext: "png" },
        { url: `${folder}/${n3}_001.png`, sub: 1, prefix: `${folder}/${n3}`, sep: "_", pad: 3, ext: "png" },
        { url: `${folder}/${n3}.webp`, sub: 0 },
        { url: `${folder}/${n3}__001.webp`, sub: 1, prefix: `${folder}/${n3}`, sep: "__", pad: 3, ext: "webp" },
        { url: `${folder}/${n3}_001.webp`, sub: 1, prefix: `${folder}/${n3}`, sep: "_", pad: 3, ext: "webp" }
    ];

    let percobaanKe = parseInt(imgEl.getAttribute("data-try") || "0");
    if (percobaanKe < daftarKandidat.length) {
        const kandidat = daftarKandidat[percobaanKe];
        imgEl.setAttribute("data-try", (percobaanKe + 1).toString());

        if (kandidat.sub === 1) {
            imgEl.setAttribute("data-subpart", "1");
            imgEl.setAttribute("data-prefix", kandidat.prefix);
            imgEl.setAttribute("data-sep", kandidat.sep);
            imgEl.setAttribute("data-pad", kandidat.pad.toString());
            imgEl.setAttribute("data-ext", kandidat.ext);
        } else {
            imgEl.removeAttribute("data-subpart");
        }

        imgEl.src = kandidat.url;
        return;
    }

    imgEl.style.display = "none";
}

// Jika halaman memiliki pecahan __001 atau _001, otomatis sisipkan __002, __003, dst. tepat di bawahnya
function cekSubHalamanKomik(imgEl) {
    const subpart = parseInt(imgEl.getAttribute("data-subpart") || "0");
    if (!subpart || imgEl.getAttribute("data-expanded") === "1") return;

    imgEl.setAttribute("data-expanded", "1");

    const prefix = imgEl.getAttribute("data-prefix");
    const sep = imgEl.getAttribute("data-sep") || "__";
    const pad = parseInt(imgEl.getAttribute("data-pad") || "3");
    const ext = imgEl.getAttribute("data-ext") || "jpg";
    const nextSub = subpart + 1;
    const nextSubStr = pad > 1 ? nextSub.toString().padStart(pad, "0") : nextSub.toString();
    const nextUrl = `${prefix}${sep}${nextSubStr}.${ext}`;

    const nextImg = document.createElement("img");
    nextImg.src = nextUrl;
    nextImg.className = "comic-page-img";
    nextImg.setAttribute("data-subpart", nextSub.toString());
    nextImg.setAttribute("data-prefix", prefix);
    nextImg.setAttribute("data-sep", sep);
    nextImg.setAttribute("data-pad", pad.toString());
    nextImg.setAttribute("data-ext", ext);

    nextImg.onload = function() {
        cekSubHalamanKomik(this);
    };
    nextImg.onerror = function() {
        this.remove();
    };

    imgEl.insertAdjacentElement("afterend", nextImg);
}

function cobaFormatSampulLain(imgEl, pathAwal) {
    if (imgEl.getAttribute("data-tried")) return;
    imgEl.setAttribute("data-tried", "1");
    if (pathAwal.endsWith("001.jpg")) imgEl.src = pathAwal.replace("001.jpg", "01.jpg");
    else if (pathAwal.endsWith("01.jpg")) imgEl.src = pathAwal.replace("01.jpg", "1.jpg");
}

async function muatHalamanDariCbz(urlCbz) {
    try {
        if (typeof JSZip === "undefined") return null;
        const response = await fetch(urlCbz);
        if (!response.ok) return null;
        const dataBuffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(dataBuffer);
        const daftarFileGambar = Object.keys(zip.files).filter(nama =>
            nama.match(/\.(jpg|jpeg|png|webp)$/i) && !nama.startsWith("__MACOSX")
        ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

        const urls = await Promise.all(
            daftarFileGambar.map(async (namaFile) => {
                const blob = await zip.file(namaFile).async("blob");
                return URL.createObjectURL(blob);
            })
        );
        return urls.map((u, i) => ({ urlUtama: u, folder: "", nomor: i + 1 }));
    } catch (err) {
        return null;
    }
}

async function mulaiBacaChapter(idBuku, idxChap) {
    const buku = koleksiBuku.find(b => b.id === idBuku);
    if (!buku) return;

    const chap = buku.chapters[idxChap];
    const keyChap = `${buku.id}_${chap.idChap || idxChap}`;
    const sudahPernahDibaca = dataPengguna.chapterDibacaIds.includes(keyChap);

    if (!dataPengguna.isLoggedIn && !sudahPernahDibaca && dataPengguna.chapterDibacaIds.length >= BATAS_BACA_GUEST) {
        tutupModalChapter();
        tutupReader();
        alert(`Batas Mode Tamu (${dataPengguna.nama}) tercapai!\n\nAnda telah membaca maksimal ${BATAS_BACA_GUEST} chapter gratis. Silakan Login atau Daftar Akun terlebih dahulu untuk melanjutkan membaca.`);
        bukaModalProfil();
        bukaModalAkun();
        return;
    }

    bukuSedangDibuka = buku;
    indexChapterAktif = idxChap;
    const noChap = chap.nomorChapter || (idxChap + 1);
    const labelVolChap = formatLabelVolumeChapter(buku, idxChap);

    tutupModalChapter();
    tutupModalProfil();
    hentikanAutoScroll();
    document.getElementById("readerQuickSettings").style.display = "none";

    document.getElementById("readerFloatingTop")?.classList.remove("hidden-ui");
    document.getElementById("readerFloatingBottom")?.classList.remove("hidden-ui");

    dataPengguna.jumlahBacaBuku[buku.id] = (dataPengguna.jumlahBacaBuku[buku.id] || 0) + 1;

    if (!sudahPernahDibaca) {
        dataPengguna.chapterDibacaIds.push(keyChap);
    }

    if (hitungChapterBelumDibaca(buku) === 0 && !dataPengguna.bukuTamatIds.includes(buku.id)) {
        dataPengguna.bukuTamatIds.push(buku.id);
    }

    catatHistoryBaca(buku, idxChap, `${labelVolChap} - ${chap.judulChapter}`);
    simpanDataPengguna();
    tampilkanBuku();

    document.getElementById("readerTitle").innerText = buku.judul;
    document.getElementById("readerChapShort").innerText = `Ch ${noChap}`;
    document.getElementById("btnPrevChap").disabled = (idxChap <= 0);
    document.getElementById("btnNextChap").disabled = (idxChap >= buku.chapters.length - 1);

    perbaruiTombolBookmarkUI();

    const body = document.getElementById("readerBody");
    const screen = document.getElementById("readerScreen");
    if (screen) screen.style.display = "flex";
    if (body) body.scrollTop = 0;

    mulaiTimerBaca();

    if (chap.fileCbz) {
        body.innerHTML = `<p style="text-align:center; padding:80px 20px; color:var(--text-secondary);">Memuat halaman komik...</p>`;
        const gambarCbz = await muatHalamanDariCbz(chap.fileCbz);
        if (gambarCbz && gambarCbz.length > 0) {
            tipeKontenSedangDibaca = "komik";
            daftarHalamanKomikAktif = gambarCbz;
            renderKontenBacaan();
            return;
        }
    }

    const gambarBiasa = ambilDaftarGambarKomik(chap);
    if (gambarBiasa && gambarBiasa.length > 0) {
        tipeKontenSedangDibaca = "komik";
        daftarHalamanKomikAktif = gambarBiasa;
        renderKontenBacaan();
        return;
    }

    tipeKontenSedangDibaca = "teks";
    body.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 80px 20px;">Memuat naskah cerita...</p>`;

    try {
        let paragrafArray = [];
        if (chap.fileUrl) {
            const response = await fetch(chap.fileUrl);
            if (!response.ok) throw new Error("Gagal mengambil file .txt");
            const textMentah = await response.text();
            paragrafArray = textMentah
                .split(/\r?\n\r?\n/)
                .map(p => p.trim())
                .filter(p => p.length > 0)
                .map(p => {
                    if (p.startsWith("<img") || p.includes("<img")) {
                        return `<div class="novel-img-wrapper">${p}</div>`;
                    }
                    return `<p style="margin-bottom: 16px; text-indent: 24px;">${p}</p>`;
                });
        } else {
            paragrafArray = [chap.konten || "<p>Isi chapter kosong.</p>"];
        }

        daftarHalamanTeksAktif = paragrafArray;
        renderKontenBacaan();
    } catch (e) {
        body.innerHTML = `
            <div style="text-align:center; padding: 80px 16px;">
                <p style="color:#F43F5E; font-weight:700;">Gagal memuat file teks chapter!</p>
                <small style="color:var(--text-secondary);">Pastikan jalur file <code>${chap.fileUrl}</code> sudah tepat di Spck Editor.</small>
            </div>
        `;
    }
}

function renderKontenBacaan() {
    const body = document.getElementById("readerBody");
    if (!body || !bukuSedangDibuka) return;

    const chap = bukuSedangDibuka.chapters[indexChapterAktif];
    const labelVolChap = formatLabelVolumeChapter(bukuSedangDibuka, indexChapterAktif);

    if (tipeKontenSedangDibaca === "komik") {
        body.style.padding = "0";
        const deretanGambar = daftarHalamanKomikAktif.map((item, idx) => {
            const urlGambar = typeof item === "string" ? item : item.urlUtama;
            const folder = typeof item === "object" ? item.folder : "";
            const nomor = typeof item === "object" ? item.nomor : (idx + 1);
            return `
                <img src="${urlGambar}" 
                     data-folder="${folder}" 
                     data-nomor="${nomor}" 
                     onload="cekSubHalamanKomik(this)"
                     onerror="cobaFormatGambarKomikLain(this)"
                     class="comic-page-img" 
                     alt="Halaman ${idx + 1}">
            `;
        }).join("");

        body.innerHTML = `
            <div class="comic-webtoon-container">
                ${deretanGambar}
            </div>
        `;
    } else {
        body.style.padding = "84px 18px 110px";
        body.innerHTML = `
            <div style="max-width: 660px; margin: 0 auto; font-family: 'Georgia', serif;">
                <div style="margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid var(--border-soft);">
                    <span class="vol-chap-badge">${labelVolChap}</span>
                    <h3 style="margin: 6px 0 0;">${chap.judulChapter}</h3>
                </div>
                ${daftarHalamanTeksAktif.join("")}
            </div>
        `;
    }
}

function toggleReaderFloatingUI(event) {
    if (event.target.tagName === "BUTTON" || event.target.tagName === "INPUT") return;
    const topBar = document.getElementById("readerFloatingTop");
    const bottomBar = document.getElementById("readerFloatingBottom");
    const pop = document.getElementById("readerQuickSettings");

    if (pop) pop.style.display = "none";
    topBar?.classList.toggle("hidden-ui");
    bottomBar?.classList.toggle("hidden-ui");
}

function toggleReaderQuickSettings() {
    const pop = document.getElementById("readerQuickSettings");
    if (!pop) return;
    const isHidden = pop.style.display === "none" || pop.style.display === "";
    pop.style.display = isHidden ? "block" : "none";
    document.getElementById("btnReaderGear")?.classList.toggle("active", isHidden);
}

// =========================================================================
// FITUR AUTO SCROLL
// =========================================================================
function toggleJalankanAutoScroll() {
    if (autoScrollInterval) hentikanAutoScroll();
    else mulaiAutoScroll();
}

function mulaiAutoScroll() {
    hentikanAutoScroll();
    const body = document.getElementById("readerBody");
    const btn = document.getElementById("btnPlayAutoScroll");
    const icon = document.getElementById("iconPlayScroll");

    if (btn) btn.classList.add("active");
    if (icon) {
        icon.innerHTML = `<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>`;
    }

    autoScrollInterval = setInterval(() => {
        if (!body) return;
        body.scrollTop += kecepatanAutoScroll;
        if (body.scrollTop + body.clientHeight >= body.scrollHeight - 2) {
            hentikanAutoScroll();
        }
    }, 28);
}

function hentikanAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
    const btn = document.getElementById("btnPlayAutoScroll");
    const icon = document.getElementById("iconPlayScroll");
    if (btn) btn.classList.remove("active");
    if (icon) {
        icon.innerHTML = `<polygon points="6 4 20 12 6 20 6 4" fill="currentColor"/>`;
    }
}

function ubahKecepatanAutoScroll(val) {
    kecepatanAutoScroll = parseInt(val) || 3;
    localStorage.setItem("perline_scrollspeed", kecepatanAutoScroll);
    const slider = document.getElementById("sliderAutoScroll");
    const label = document.getElementById("labelSpeedScroll");
    const select = document.getElementById("selectSpeedScrollSetting");
    if (slider) slider.value = kecepatanAutoScroll;
    if (label) label.innerText = `${kecepatanAutoScroll}x`;
    if (select) select.value = kecepatanAutoScroll;
}

function navigasiChapter(arah) {
    if (!bukuSedangDibuka) return;
    const target = indexChapterAktif + arah;
    if (target >= 0 && target < bukuSedangDibuka.chapters.length) {
        mulaiBacaChapter(bukuSedangDibuka.id, target);
    }
}

function bukaDaftarIsiDariReader() {
    if (!bukuSedangDibuka) return;
    bukaModalChapter(bukuSedangDibuka.id);
}

function kembaliKeDetailDariReader() {
    tutupReader();
    if (bukuSedangDibuka) bukaModalChapter(bukuSedangDibuka.id);
}

function tutupReaderKeHome() {
    tutupReader();
    pindahMenuBawah("home");
}

function tutupReader() {
    const screen = document.getElementById("readerScreen");
    if (screen) screen.style.display = "none";
    hentikanTimerBaca();
    hentikanAutoScroll();
}

function mulaiTimerBaca() {
    hentikanTimerBaca();
    timerBacaInterval = setInterval(() => {
        dataPengguna.totalDetikBaca += 5;
        simpanDataPengguna();
    }, 5000);
}

function hentikanTimerBaca() {
    if (timerBacaInterval) {
        clearInterval(timerBacaInterval);
        timerBacaInterval = null;
    }
}

// =========================================================================
// FITUR FAVORIT, BOOKMARK, & HISTORY
// =========================================================================
function toggleFavoritBukuAktif() {
    if (!bukuSedangDibuka) return;
    const id = bukuSedangDibuka.id;
    const idx = dataPengguna.favoritIds.indexOf(id);
    if (idx === -1) dataPengguna.favoritIds.push(id);
    else dataPengguna.favoritIds.splice(idx, 1);

    simpanDataPengguna();
    perbaruiTombolFavoritUI();
    tampilkanBuku();
}

function perbaruiTombolFavoritUI() {
    if (!bukuSedangDibuka) return;
    const isFav = dataPengguna.favoritIds.includes(bukuSedangDibuka.id);
    const btnToggle = document.getElementById("btnToggleFav");
    if (btnToggle) btnToggle.innerText = isFav ? "Tersimpan di Favorit" : "Tambah ke Favorit";
}

function toggleBookmarkSaatBaca() {
    if (!bukuSedangDibuka) return;
    const idBuku = bukuSedangDibuka.id;
    const chap = bukuSedangDibuka.chapters[indexChapterAktif];
    const labelVolChap = formatLabelVolumeChapter(bukuSedangDibuka, indexChapterAktif);

    const existingIdx = dataPengguna.bookmarks.findIndex(b => b.idBuku === idBuku && b.indexChap === indexChapterAktif);
    if (existingIdx !== -1) {
        dataPengguna.bookmarks.splice(existingIdx, 1);
    } else {
        dataPengguna.bookmarks.unshift({
            idBuku: idBuku,
            indexChap: indexChapterAktif,
            judulBuku: bukuSedangDibuka.judul,
            judulChap: `${labelVolChap} • ${chap.judulChapter}`,
            waktu: new Date().toLocaleDateString("id-ID")
        });
    }
    simpanDataPengguna();
    perbaruiTombolBookmarkUI();
}

function perbaruiTombolBookmarkUI() {
    if (!bukuSedangDibuka) return;
    const ada = dataPengguna.bookmarks.some(b => b.idBuku === bukuSedangDibuka.id && b.indexChap === indexChapterAktif);
    const btn = document.getElementById("btnBookmarkReader");
    if (btn) {
        btn.classList.toggle("active", ada);
        btn.innerText = ada ? "Chapter Ditandai (Aktif)" : "Tandai Chapter (Bookmark)";
    }
}

function catatHistoryBaca(buku, idxChap, judulChapLengkap) {
    dataPengguna.history = dataPengguna.history.filter(h => !(h.idBuku === buku.id && h.indexChap === idxChap));
    dataPengguna.history.unshift({
        idBuku: buku.id,
        indexChap: idxChap,
        judulBuku: buku.judul,
        judulChap: judulChapLengkap,
        waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    });
    if (dataPengguna.history.length > 30) dataPengguna.history.pop();
}

function bersihkanHistory() {
    dataPengguna.history = [];
    simpanDataPengguna();
    renderHalamanHistoryUtama();
}

// =========================================================================
// ALUR NAVIGASI PROFIL & SETTINGS
// =========================================================================
function bukaModalProfil() {
    perbaruiUIProfilDanGelar();
    tampilkanLevelProfil(1, "Profil Pengguna");
    const modal = document.getElementById("profileModal");
    if (modal) modal.style.display = "flex";
}

function tutupModalProfil() {
    const modal = document.getElementById("profileModal");
    if (modal) modal.style.display = "none";
}

function tampilkanLevelProfil(level, judulHeader = "Profil Pengguna") {
    levelNavigasiProfil = level;
    const setDisp = (id, show) => {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? "block" : "none";
    };

    setDisp("profileHomeView", level === 1);
    setDisp("settingsMenuView", level === 2);
    setDisp("settingsDetailView", level === 3);
    setDisp("accountEditView", level === 4);

    const btnBack = document.getElementById("btnBackToProfile");
    if (btnBack) btnBack.style.visibility = (level > 1) ? "visible" : "hidden";

    const titleEl = document.getElementById("profileTopBarTitle");
    if (titleEl) titleEl.innerText = judulHeader;
}

function kembaliKeLevelSebelumnya() {
    if (levelNavigasiProfil === 3) {
        tampilkanLevelProfil(2, "Settings");
    } else {
        tampilkanLevelProfil(1, "Profil Pengguna");
    }
}

function bukaMenuSettingsUtama() {
    tampilkanLevelProfil(2, "Settings");
}

function bukaLamanDetailSetting(kodePane, judulHeader) {
    tampilkanLevelProfil(3, judulHeader);
    document.querySelectorAll(".setting-pane").forEach(p => p.classList.remove("active"));

    const mapPane = {
        sampaikan: "paneSampaikan",
        tema: "paneTema",
        statistik: "paneStatistik"
    };
    const targetEl = document.getElementById(mapPane[kodePane]);
    if (targetEl) targetEl.classList.add("active");
}

function switchSampaikanTab(mode) {
    const isKritik = (mode === "kritik");
    document.getElementById("tabBtnKritik")?.classList.toggle("active", isKritik);
    document.getElementById("tabBtnRequest")?.classList.toggle("active", !isKritik);
    document.getElementById("boxFormKritik").style.display = isKritik ? "block" : "none";
    document.getElementById("boxFormRequest").style.display = isKritik ? "none" : "block";
}

// =========================================================================
// SISTEM LOGIN VALID, DAFTAR AKUN (REGISTER), & VERIFIKASI EMAIL (OTP)
// =========================================================================
function tampilkanPesanErrorAuth(pesan) {
    const box = document.getElementById("authErrorMsg");
    if (!box) return;
    if (!pesan) {
        box.style.display = "none";
        box.innerText = "";
    } else {
        box.style.display = "block";
        box.innerText = pesan;
    }
}

function switchAuthTab(mode) {
    tampilkanPesanErrorAuth("");
    document.getElementById("tabBtnModeLogin")?.classList.toggle("active", mode === "login");
    document.getElementById("tabBtnModeRegister")?.classList.toggle("active", mode === "register");

    document.getElementById("formPanelLogin").style.display = (mode === "login") ? "block" : "none";
    document.getElementById("formPanelRegister").style.display = (mode === "register") ? "block" : "none";
    document.getElementById("formPanelVerify").style.display = (mode === "verify") ? "block" : "none";
}

function bukaModalAkun() {
    avatarSementaraBase64 = "";
    tampilkanPesanErrorAuth("");

    const boxAuth = document.getElementById("boxRequireAuth");
    const boxEdit = document.getElementById("boxEditProfileLogged");

    if (!dataPengguna.isLoggedIn) {
        if (boxAuth) boxAuth.style.display = "block";
        if (boxEdit) boxEdit.style.display = "none";
        switchAuthTab("login");
        tampilkanLevelProfil(4, "Login / Daftar Akun");
    } else {
        if (boxAuth) boxAuth.style.display = "none";
        if (boxEdit) boxEdit.style.display = "block";
        document.getElementById("inEditName").value = dataPengguna.nama || "";
        document.getElementById("loggedEmailInfo").innerText = dataPengguna.email;
        const fileInput = document.getElementById("inAccAvatarFile");
        if (fileInput) fileInput.value = "";
        perbaruiUIProfilDanGelar();
        tampilkanLevelProfil(4, "Edit Foto & Profil");
    }
}

function validasiFormatEmail(email) {
    const pola = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return pola.test(email);
}

async function prosesDaftarAkunBaru() {
    tampilkanPesanErrorAuth("");
    const nama = document.getElementById("inRegName").value.trim();
    const email = document.getElementById("inRegEmail").value.trim().toLowerCase();
    const pass = document.getElementById("inRegPass").value;

    if (nama.length < 3) {
        tampilkanPesanErrorAuth("Username minimal harus terdiri dari 3 karakter.");
        return;
    }
    if (!validasiFormatEmail(email)) {
        tampilkanPesanErrorAuth("Format alamat email tidak valid. Gunakan email asli (contoh: nama@gmail.com).");
        return;
    }
    if (pass.length < 6) {
        tampilkanPesanErrorAuth("Kata sandi minimal harus 6 karakter.");
        return;
    }

    const sudahAda = akunTerdaftar.find(acc => acc.email === email && acc.verified);
    if (sudahAda) {
        tampilkanPesanErrorAuth("Email ini sudah terdaftar. Silakan masuk melalui tab Login.");
        return;
    }

    const kodeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerifikasiAkun = {
        nama: nama,
        email: email,
        pass: pass,
        otp: kodeOtp,
        avatarUrl: ""
    };

    const btn = document.getElementById("btnSubmitRegister");
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Mengirim Kode...";
    }

    try {
        await fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                Tipe: "Verifikasi Pendaftaran Akun PERLINE",
                Username: nama,
                EmailPendaftar: email,
                KodeVerifikasiOTP: kodeOtp
            })
        });
    } catch (e) {
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Kirim Kode Verifikasi";
        }
    }

    document.getElementById("txtVerifyTargetEmail").innerText = `Kami telah mengirimkan kode verifikasi 6 digit ke ${email}. Masukkan kode tersebut di bawah ini:`;
    document.getElementById("simulatedInboxBox").innerHTML = `
        <span>Pesan Verifikasi Email Masuk:</span><br>
        Kode OTP Anda adalah <strong style="font-size:15px; color:var(--accent-main); letter-spacing:2px;">${kodeOtp}</strong>
    `;
    document.getElementById("inVerifyOtpCode").value = "";
    switchAuthTab("verify");
}

function prosesVerifikasiKodeOtp() {
    tampilkanPesanErrorAuth("");
    if (!pendingVerifikasiAkun) {
        switchAuthTab("register");
        return;
    }

    const kodeInput = document.getElementById("inVerifyOtpCode").value.trim();
    if (kodeInput !== pendingVerifikasiAkun.otp) {
        tampilkanPesanErrorAuth("Kode verifikasi 6 digit tidak sesuai! Periksa kembali kode OTP Anda.");
        return;
    }

    akunTerdaftar = akunTerdaftar.filter(a => a.email !== pendingVerifikasiAkun.email);

    const akunBaru = {
        nama: pendingVerifikasiAkun.nama,
        email: pendingVerifikasiAkun.email,
        pass: pendingVerifikasiAkun.pass,
        avatarUrl: "",
        verified: true,
        waktuDaftar: Date.now()
    };

    akunTerdaftar.push(akunBaru);
    simpanDatabaseAkun();

    dataPengguna.nama = akunBaru.nama;
    dataPengguna.email = akunBaru.email;
    dataPengguna.avatarUrl = akunBaru.avatarUrl;
    dataPengguna.isLoggedIn = true;
    pendingVerifikasiAkun = null;
    simpanDataPengguna();

    alert("Verifikasi Email Berhasil! Akun Anda kini telah aktif.");
    bukaModalAkun();
}

function prosesLoginValid() {
    tampilkanPesanErrorAuth("");
    const email = document.getElementById("inLoginEmail").value.trim().toLowerCase();
    const pass = document.getElementById("inLoginPass").value;

    if (!validasiFormatEmail(email) || !pass) {
        tampilkanPesanErrorAuth("Masukkan alamat email yang valid dan kata sandi Anda.");
        return;
    }

    const akunCocok = akunTerdaftar.find(a => a.email === email && a.verified);
    if (!akunCocok) {
        tampilkanPesanErrorAuth("Email belum terdaftar atau belum diverifikasi! Silakan pilih tab 'Daftar Akun Baru' terlebih dahulu.");
        return;
    }

    if (akunCocok.pass !== pass) {
        tampilkanPesanErrorAuth("Kata sandi yang Anda masukkan salah!");
        return;
    }

    dataPengguna.nama = akunCocok.nama;
    dataPengguna.email = akunCocok.email;
    dataPengguna.avatarUrl = akunCocok.avatarUrl || "";
    dataPengguna.isLoggedIn = true;
    simpanDataPengguna();

    bukaModalAkun();
}

function pratinjauFotoProfil(inputEl) {
    if (!inputEl.files || inputEl.files.length === 0) return;
    const file = inputEl.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            const ukuran = 200;
            canvas.width = ukuran;
            canvas.height = ukuran;
            const ctx = canvas.getContext("2d");

            const sisiMin = Math.min(img.width, img.height);
            const sx = (img.width - sisiMin) / 2;
            const sy = (img.height - sisiMin) / 2;

            ctx.drawImage(img, sx, sy, sisiMin, sisiMin, 0, 0, ukuran, ukuran);
            avatarSementaraBase64 = canvas.toDataURL("image/jpeg", 0.82);

            const prev = document.getElementById("previewAvatarEdit");
            if (prev) prev.innerHTML = `<img src="${avatarSementaraBase64}" alt="Preview">`;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function simpanPerubahanProfil() {
    if (!dataPengguna.isLoggedIn) {
        alert("Anda harus login terlebih dahulu.");
        return;
    }

    const namaBaru = document.getElementById("inEditName").value.trim();
    if (namaBaru.length < 3) {
        alert("Nama pengguna minimal 3 karakter.");
        return;
    }

    dataPengguna.nama = namaBaru;
    if (avatarSementaraBase64) {
        dataPengguna.avatarUrl = avatarSementaraBase64;
    }

    const idxAkun = akunTerdaftar.findIndex(a => a.email === dataPengguna.email);
    if (idxAkun !== -1) {
        akunTerdaftar[idxAkun].nama = dataPengguna.nama;
        akunTerdaftar[idxAkun].avatarUrl = dataPengguna.avatarUrl;
        simpanDatabaseAkun();
    }

    simpanDataPengguna();
    tampilkanLevelProfil(1, "Profil Pengguna");
}

function logoutAkunPengguna() {
    dataPengguna.isLoggedIn = false;
    dataPengguna.email = "";
    dataPengguna.avatarUrl = "";
    dataPengguna.nama = buatNamaGuestRandom();
    simpanDataPengguna();
    tampilkanLevelProfil(1, "Profil Pengguna");
}

// =========================================================================
// INTEGRASI FORMSPREE (KRITIK & SARAN + REQUEST NOVEL)
// =========================================================================
async function kirimKritikSaran() {
    const inputArea = document.getElementById("inFeedbackText");
    if (!inputArea) return;
    const teks = inputArea.value.trim();

    if (!teks) {
        alert("Silakan tulis kritik atau saran terlebih dahulu.");
        return;
    }

    const rankEl = document.getElementById("profRankTitle");
    const payload = {
        Tipe: "Kritik & Saran",
        Pengirim: dataPengguna.nama,
        Email: dataPengguna.email || "Guest",
        Gelar: rankEl ? rankEl.innerText : "Pembaca",
        Pesan: teks,
        Tanggal: new Date().toLocaleString("id-ID")
    };

    const tombolKirim = document.getElementById("btnSubmitFeedback");
    if (tombolKirim) {
        tombolKirim.disabled = true;
        tombolKirim.innerText = "Mengirim...";
    }

    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            inputArea.value = "";
            alert("Terima kasih! Masukan Anda telah terkirim.");
        } else {
            alert("Gagal mengirim pesan. Coba lagi nanti.");
        }
    } catch (error) {
        alert("Terjadi kendala jaringan saat menghubungi server.");
    } finally {
        if (tombolKirim) {
            tombolKirim.disabled = false;
            tombolKirim.innerText = "Kirim Kritik & Saran";
        }
    }
}

async function kirimRequestNovel() {
    const inputJudul = document.getElementById("inReqJudul");
    const inputCatatan = document.getElementById("inReqCatatan");
    if (!inputJudul) return;

    const judul = inputJudul.value.trim();
    const catatan = inputCatatan ? (inputCatatan.value.trim() || "Request Pembaca") : "Request Pembaca";

    if (!judul) {
        alert("Masukkan judul karya yang ingin di-request.");
        return;
    }

    const payload = {
        Tipe: "Request Novel / Komik",
        Pengirim: dataPengguna.nama,
        JudulRequest: judul,
        CatatanGenre: catatan,
        Tanggal: new Date().toLocaleString("id-ID")
    };

    const tombolKirim = document.getElementById("btnSubmitRequest");
    if (tombolKirim) {
        tombolKirim.disabled = true;
        tombolKirim.innerText = "Mengirim...";
    }

    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            inputJudul.value = "";
            if (inputCatatan) inputCatatan.value = "";
            alert(`Request "${judul}" berhasil dikirim ke developer!`);
        } else {
            alert("Gagal mengirim request.");
        }
    } catch (error) {
        alert("Terjadi gangguan jaringan saat mengirim request.");
    } finally {
        if (tombolKirim) {
            tombolKirim.disabled = false;
            tombolKirim.innerText = "Kirim Request";
        }
    }
}

// =========================================================================
// PENGATURAN 3 TEMA, BAHASA, DAN MODE LAYAR
// =========================================================================
function ubahTemaAplikasi(tema) {
    temaAktif = tema;
    document.body.classList.remove("theme-dark", "theme-light", "theme-violet");
    document.body.classList.add(`theme-${tema}`);
    localStorage.setItem("perline_theme", tema);

    document.getElementById("btnThemeDark")?.classList.toggle("active", tema === "dark");
    document.getElementById("btnThemeLight")?.classList.toggle("active", tema === "light");
    document.getElementById("btnThemeViolet")?.classList.toggle("active", tema === "violet");
}

function ubahModeLayar(mode) {
    const container = document.getElementById("appContainer");
    if (!container) return;
    container.classList.remove("force-mobile", "force-desktop");
    if (mode === "mobile") container.classList.add("force-mobile");
    if (mode === "desktop") container.classList.add("force-desktop");
    localStorage.setItem("perline_layout", mode);
}

function ubahBahasa(lang) {
    bahasaAktif = lang;
    localStorage.setItem("perline_lang", lang);

    const isEn = (lang === "en");
    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    };

    const homeSearch = document.getElementById("homeSearchInput");
    if (homeSearch) homeSearch.placeholder = isEn ? "Search novel, manga, manhwa, or author..." : "Cari judul novel, manga, manhwa, atau penulis...";

    setTxt("txtSectionRak", isEn ? "Latest Updates" : "Update Terbaru");
    setTxt("txtExploreTitle", isEn ? "Explore Catalog" : "Jelajahi Katalog");
    setTxt("txtHistoryTitle", isEn ? "Reading History" : "Riwayat Membaca");
    setTxt("txtLibraryTitle", isEn ? "My Library" : "Library Saya");

    tampilkanBuku();
}

// =========================================================================
// INISIALISASI SAAT APLIKASI DIBUKA
// =========================================================================
window.addEventListener("DOMContentLoaded", async () => {
    muatDropdownGenreLengkap();
    ubahTemaAplikasi(temaAktif);

    const savedLayout = localStorage.getItem("perline_layout") || "auto";
    const selectLayout = document.getElementById("selectLayoutMode");
    if (selectLayout) selectLayout.value = savedLayout;
    ubahModeLayar(savedLayout);

    ubahKecepatanAutoScroll(kecepatanAutoScroll);

    const selectLang = document.getElementById("selectBahasa");
    if (selectLang) selectLang.value = bahasaAktif;

    await muatSemuaFileIdentitasBuku();

    ubahBahasa(bahasaAktif);
    perbaruiUIProfilDanGelar();
    pindahMenuBawah("home");

    setInterval(() => {
        if (menuBawahAktif === "home") tampilkanBukuHome();
        else if (menuBawahAktif === "explore") tampilkanBukuExplore();
    }, 60000);
});