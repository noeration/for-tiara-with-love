## 14. Dashboard admin (`/admin`)

Buka <http://localhost:3000/admin> setelah `npm run dev`.

- **Mode lokal:** `ADMIN_DEV_BYPASS=true` di `.env.local` membuka dashboard tanpa login. Jangan aktifkan variabel ini di produksi.
- **Mode Supabase:** isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` di `.env.local`, jalankan `supabase-schema.sql`, lalu buat user admin di **Supabase Dashboard → Authentication → Users**. Login lewat <http://localhost:3000/admin/login>.
- **Upload foto:** tombol **Upload photo** / **Upload image** menyimpan ke Supabase Storage bila service role key tersedia. Tanpa key, file disimpan ke `public/uploads/` (khusus development; Vercel tidak bisa menulis file).
- **Bucket Supabase:** buat bucket `memories`, `artworks`, dan `audio` dengan public read + authenticated write.
- **Draft vs publish:** tombol **Save Draft** menulis `data/draft.json` (atau tabel `draft_content`). Tombol **Publish** menyalin draft ke `data/published.json` (atau tabel `published_content`), lalu situs publik membacanya.
- **Karya seni:** hanya ada **satu slot karya**. Admin dan situs publik selalu memakai `artworks.items[0]`.
- **Introsi gambar:** kini ada tombol **Upload portrait** di halaman editor konten yang membuka file chooser dan menyimpan gambar ke `public/uploads/artworks/` (atau Supabase bila dikonfigurasi).

---\n\nDibuat dengan cinta, untuk Tiara. ♡