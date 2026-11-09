# OH-VERTHINKING — Proposal Desain Carousel

**Format:** Instagram feed carousel, 6 slide, 1080 × 1350 px (4:5)
**Bahasa:** Indonesia, casual-edukatif
**Status:** proposal + wireframe. Belum ada produksi Canva.

---

## 1. Konsep

**"Satu kata, seribu kemungkinan."**

Satu balasan `"oh"` memicu ruang penuh pertanyaan. Enam slide kemudian mengembalikan kata itu ke ukuran aslinya: satu kata, tanpa makna tersembunyi.

Alurnya sengaja memakai satu objek yang sama di awal dan akhir:

1. `oh` besar, penuh tekanan.
2. Pertanyaan yang saling tumpuk.
3. Nama polanya: **Mind Reading**.
4. Tiga langkah keluar.
5. `oh` kecil lagi. Lega.
6. Ajakan cerita di kolom komentar.

Ini bukan carousel infografis. Ini halaman jurnal yang dibuat oleh orang yang baru selesai overthinking. Pembaca jadi subjek, bukan penonton.

---

## 2. Arah Visual

**Editorial psychology.** Kertas, tinta, dan satu warna aksen yang berani. Referensi: carousel @indonesia.citizens (LDR) — bidang kertas terang, lavender lembut, potongan cobalt, headline serif raksasa, body rata kiri, margin lebar.

Yang diambil dari referensi: sistem warna dan keberanian skala tipografi.
Yang tidak diambil: foto cutout orang, layout dua kolom referensi, gaya caption referensi.

Keputusan penting: **tanpa stok foto.** Subjek carousel ini adalah isi kepala pembaca, jadi tipografi dan elemen UI (notifikasi, bubble chat, composer komentar) yang jadi gambar. Satu-satunya aset fotografis adalah notifikasi bawaan user.

### Palet

| Token | HEX | Pakai |
|---|---|---|
| Paper | `#F5F5FA` | Latar utama slide 1–4, 6 |
| Ink | `#14151B` | Teks utama, garis |
| Cobalt | `#2B3BEE` | Aksen, kata `oh`, slide 5 penuh |
| Periwinkle | `#AEB7F2` | Bidang sekunder, siluet kepala |
| Mist | `#E2E5FA` | Kartu, bubble, isian |
| Bone | `#F1EDE4` | Bubble `oh`, elemen kontras di atas cobalt |

Kontras terverifikasi (WCAG):

- Ink / Paper — **16.76:1**
- White / Cobalt — **7.09:1**
- Bone / Cobalt — **6.07:1**
- Ink / Periwinkle — **9.42:1**
- Cobalt / Paper — **6.52:1**

Semua kombinasi teks lolos AA, mayoritas lolos AAA.

### Tipografi

Dua keluarga, tidak lebih.

- **DM Serif Display** — headline, kata `oh`, penekanan emosional. Italic dipakai untuk suara batin, bukan untuk hiasan.
- **Plus Jakarta Sans** — body, label, metadata, tombol, footer. Bobot 400/500/600 saja.

Skala:

| Peran | Ukuran | Catatan |
|---|---|---|
| Hero `oh` | 306 px | italic, tracking −4.5% |
| Headline | 76 px | DM Serif Display, line-height 1.02 |
| Quote | 108 px | slide 5 |
| Body | 34 px | line-height 1.55 |
| Support | 32 px | maks 2 baris |
| Meta / label | 20 px | uppercase, tracking +14% |

### Grid

- Kanvas 1080 × 1350.
- Margin luar 80 px. Lebar konten 920 px.
- Meta bar di y=62, rule di y=104, footer di y≈1270.
- Ritme vertikal kelipatan 8 px.
- Body selalu rata kiri. Tidak ada teks tengah kecuali elemen UI.
- Satu ide per slide. Maksimum 45 kata body per slide.

---

## 3. Inventaris Aset

| Aset | Detail | Pakai |
|---|---|---|
| `asset/notification pop out.png` | 2172 × 724, PNG transparan, 717 KB. Isi terverifikasi OCR: pengirim **"Bubub"**, waktu **"sekarang"**, pesan **"Oh"** | Slide 1 (kartu penuh), slide 6 (callback) |
| `references/WhatsApp Image ... (6 file)` | 1280 × 1600 JPEG, carousel @indonesia.citizens | Referensi arah saja, tidak masuk desain final |

Aset asli tidak diubah, tidak dipindah, tidak di-rename.

---

## 4. Blueprint per Slide

### Slide 01 — Hook

**Tujuan:** pengenalan. Satu kata memicu seluruh spiral.
**Latar:** Paper.

- Meta kiri: `Catatan Pikiran / 01`. Meta kanan: `Swipe →`.
- Headline: `Cuma dibalas` / `‘oh’` (306 px, cobalt, italic) / `tapi dipikirin sampai mau tidur.`
- Tiga floater kecil di kanan: `?`, `...`, `?` — rotasi 8°, −6°, 12°.
- Support: `Pernah nggak? Padahal cuma satu kata, tapi pikiranmu sudah ke mana-mana.`
- Kanan bawah: kartu notifikasi asli, 560 px, penuh dan tidak terpotong. Anotasi kecil: `aset 01 · notification pop out`.
- Footer: `Overthinking & Mind Reading` / `01 / 06`.

**Kenapa:** kata `oh` jadi gambar utama, bukan ilustrasi. Pembaca langsung mengenali momennya.

---

### Slide 02 — Problem

**Tujuan:** overthinking terasa seperti investigasi.
**Latar:** Paper, dengan ghost word `oh` raksasa di belakang (opasitas rendah).

- Meta kanan: `21.04 ✓✓` — detail kecil yang membuat scene terasa nyata.
- Headline: `Mulai muncul berbagai pertanyaan:`
- Stamp miring: `otak: mode investigasi`.
- Tiga bubble pertanyaan, saling tumpuk, tail kiri/kanan bergantian:
  1. `“Aku salah ngomong, ya?”`
  2. `“Dia lagi marah sama aku?”`
  3. `“Apa dia udah bosan ngobrol sama aku?”`
- Indikator typing tiga titik.
- Closing: `Nah, tanpa sadar kamu mulai **menebak-nebak** isi pikiran orang lain.`

**Kenapa:** tumpukan bubble membuat ruang terasa sesak tanpa perlu grafik "otak penuh".

---

### Slide 03 — Mind Reading

**Tujuan:** memberi nama pola. Otoritas tanpa menggurui.
**Latar:** Paper.

- Wordmark dua warna: `MIND` (ink) / `READING` (cobalt outline), skala besar di atas.
- Body kiri (lebar 500 px):
  - `Dalam psikologi, pola pikir ini punya nama:`
  - `Mind Reading.` — baris sendiri, serif italic, cobalt.
  - `Ini termasuk salah satu bentuk **cognitive distortion** atau distorsi kognitif.`
  - `Sederhananya, kamu merasa tahu apa yang orang lain pikirkan, padahal belum tentu kenyataannya seperti itu.`
  - Pill: `Cognitive distortion`.
- Kanan: siluet kepala garis putus-putus (cobalt) di atas bidang Periwinkle.
- Kartu **Fakta** (solid, x646 y590): `cuma balas “oh”`.
- Kartu **Asumsi** (dashed, x654 y770): `“dia marah”`, `“aku salah ngomong”`, `“dia bosan”`, `“...atau 97 hal lain”` (redup).
- Legend: kotak solid = Fakta, kotak dashed = Asumsi.

**Kenapa:** fakta dan asumsi dipisah secara visual, bukan dijelaskan lewat paragraf. Perbedaan garis solid vs dashed jadi bahasa visual yang dipakai lagi di slide 4.

---

### Slide 04 — Solution

**Tujuan:** langkah keluar. Tiga poin, tersusun sebagai jalur.
**Latar:** Paper.

- Headline: `Kalau mulai mengalami ini, coba ingat tiga hal:`
- Garis dashed cobalt melengkung dari kiri bawah ke kanan atas — jalur yang mengurai, bukan panah lurus.
- Tiga kartu langkah, posisi bertingkat mengikuti jalur:

| No | Label | Isi |
|---|---|---|
| 01 | Pause | Jangan langsung percaya sama asumsi sendiri. |
| 02 | Fact-check | Bedakan fakta dan ketakutanmu. |
| 03 | Ask | Kalau memang mengganggu, lebih baik tanyakan daripada terus menebak. |

- Ikon garis per langkah: tanda pause, dua dokumen (solid vs dashed), bubble dengan panah keluar.
- Catatan kecil: `asumsi ≠ kenyataan`.

**Kenapa:** langkah 03 paling panjang karena paling sulit. Urutan naik mengikuti jalur, bukan daftar rata.

---

### Slide 05 — Result

**Tujuan:** lega. Satu tarikan napas.
**Latar:** Cobalt penuh. Satu-satunya slide gelap.

- Headline kecil di atas: `Kamu akan belajar bahwa nggak semua respons orang lain punya arti tersembunyi.`
- Tiga lingkaran ripple konsentris (bone, opasitas turun).
- Bubble `oh` kecil (198 × 128) di kiri, bone, sudut asimetris.
- Quote raksasa, bone: `Kadang,` / `‘oh’` (italic) / `ya cuma ‘oh’.`
- Support: `Nggak perlu membuat seribu skenario dari satu kata.`

**Kenapa:** pergantian latar total menandai perubahan emosi. `oh` sekarang kecil — pembaca melihat objek yang sama dengan ukuran berbeda.

---

### Slide 06 — CTA

**Tujuan:** engagement. Ubah pengenalan jadi thread komentar.
**Latar:** Paper.

- Headline: `Jujur, kamu sering *kayak gini* juga nggak?`
- Support: `Coba ceritain hal paling random yang pernah bikin kamu overthinking di kolom komentar!`
- Composer komentar palsu: avatar `k`, placeholder `Tulis ceritamu di sini` + kursor, tombol kirim bone.
- Callback notifikasi: kartu aset yang sama, diletakkan kanan atas (x512), penuh terlihat.
- CTA: `Komentar di bawah ↓`.
- Komentar contoh kecil: `“aku juga pernah...”`.
- Panah tangan ke arah CTA.

**Kenapa:** komentar contoh menurunkan ambang untuk ikut menulis. Callback notifikasi menutup lingkaran cerita.

---

## 5. Wireframe

Render low-fi, teks asli, bukan mockup final.

- Overview: `carousel-proposal/wireframes-overview.png`
- Per slide: `carousel-proposal/wireframe-01.png` … `wireframe-06.png` (2160 × 2700, skala 2×)
- Sumber: `carousel-proposal/wireframes.html`

Yang belum final di wireframe: tekstur kertas, bayangan, dan detail ikon. Semua akan dirapikan di Canva.

---

## 6. Rencana Produksi Canva

1. Upload `notification pop out.png` ke Canva.
2. Buat 6 halaman 1080 × 1350 dalam satu desain, editable.
3. Semua teks sebagai text box Canva, bukan gambar.
4. Font: DM Serif Display + Plus Jakarta Sans (tersedia di Canva).
5. Simbol (`?`, `...`, ikon) sebagai shape/SVG terpisah, bukan bagian dari teks.
6. Export PNG 1× per halaman, urutan `01-hook.png` … `06-cta.png`.
7. Cek akhir: tidak ada teks terpotong, kontras aman, margin konsisten, notifikasi tidak ter-crop.

Catatan jujur: generator Canva bekerja per layout. Beberapa elemen dekoratif mungkin perlu penyesuaian manual setelah generate. Saya tidak akan mengklaim hasilnya 1:1 dengan wireframe.

---

## 7. Keputusan yang Saya Butuhkan

Nama pengirim di notifikasi terbaca **"Bubub"**. Dua pilihan:

- **A.** Pertahankan apa adanya. Paling autentik, terasa seperti screenshot nyata.
- **B.** Ganti jadi nama netral (mis. `Dia`) atau bangun ulang kartu notifikasi versi editable.

Default saya: **A**, karena keasliannya justru jadi kekuatan slide 1.

---

## 8. Gate

Belum ada desain Canva, belum ada export, belum ada kredit AI terpakai.

Kalau arah, copy, dan wireframe sudah oke, balas persis:

```
APPROVED. START DESIGNING.
```

Kalau ada yang mau diubah, sebut nomor slide dan bagiannya.
