# Blockchain Payload Documentation

Dokumen ini menjelaskan struktur data (payload) yang dikirimkan oleh Backend (`BE_CCS`) ke Blockchain Service (`BC_CCS`) untuk di-hash dan direkam secara permanen (immutable) ke dalam Smart Contract.

Sistem mengirimkan data ini melalui HTTP POST ke endpoint `/store-activity`. Data tersebut akan dikemas bersama dengan `activityType` dan `activity_id` kemudian di-hash menggunakan algoritma **SHA3-256** untuk menjamin integritas dan *non-repudiation*.

Berikut adalah struktur **Payload** yang dikirimkan untuk setiap jenis aktivitas (Activity Type):

## 1. PERENCANAAN
Dikirim saat entitas Perencanaan baru dibuat (`PerencanaanController@store`).
**Field yang di-hash:**
- `nama_perusahaan` (String)
- `identitas_blok` (String)
- `nama_pic` (String)
- `narahubung` (String)
- `jenis_kegiatan` (String)
- `lokasi` (String) - *Catatan: Sebelumnya terisi koordinat, namun jika form frontend sudah diperbaiki, akan berisi teks nama lokasi.*
- `jumlah_bibit` (Integer)
- `jenis_bibit` (String)
- `tanggal_pelaksanaan` (Date String)
- `lat` (String/Float)
- `long` (String/Float)
- `created_by` (Integer)

## 2. IMPLEMENTASI
Dikirim saat implementasi diselesaikan dan dikonfirmasi (`ImplementasiController@store`).
**Field yang di-hash:**
- `perencanaan_id` (Integer)
- `pic_koorlap` (String)
- `kesesuaian` (JSON/Array Object) - Berisi boolean kesesuaian berbagai aspek dengan perencanaan.
- `geotagging` (String) - Koordinat/geotag dari field.
- `lat` (String/Float)
- `long` (String/Float)
- `dokumentasi_count` (Integer) - Jumlah foto dokumentasi yang diupload.

## 3. MONITORING
Dikirim setiap kali ada submit hasil monitoring berkala di lapangan (`MonitoringController@store`).
**Field yang di-hash:**
- `implementasi_id` (Integer)
- `round_number` (Integer) - Ronde / urutan monitoring.
- `bulan_monitoring` (Integer/String)
- `jumlah_bibit_ditanam` (Integer)
- `jumlah_bibit_mati` (Integer)
- `tinggi_bibit` (Numeric)
- `diameter_batang` (Numeric)
- `jumlah_daun` (Integer)
- `survival_rate` (Numeric)

## 4. EVALUASI
Dikirim ketika evaluasi dilakukan (bisa secara otomatis setelah monitoring target tercapai, atau dibuat manual) (`EvaluasiController@store` / `MonitoringController@store`).
**Field yang di-hash:**
- `implementasi_id` (Integer)
- `survival_rate` (Numeric)
- `tinggi_bibit_rata` (Numeric)
- `diameter_batang_rata` (Numeric)
- `kondisi_kesehatan` (String) - Kondisi visual / kesimpulan evaluasi.

---
**Penting:**
Karena sifat Blockchain yang *Immutable* (tidak dapat diubah), jika ada field di masa lalu yang dikirimkan dengan isi yang salah (seperti `lokasi` yang terisi koordinat), data pada transaksi ID tersebut akan selamanya di-hash dan diverifikasi dengan data yang salah tersebut. Perbaikan input di Frontend hanya akan mempengaruhi hash dan data pada transaksi-transaksi **baru** ke depannya.
