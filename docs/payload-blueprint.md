# Blockchain Payload Blueprint (Proof-of-Existence)

Dokumen ini mendefinisikan standar payload untuk dikirimkan ke Smart Contract pada **BC_CCS**. Desain ini dirancang khusus untuk memenuhi arsitektur 7-Lapis (*Seven-Layer Architecture*) pada **Data Layer** dan mendukung model **Proof-of-Existence** untuk sistem konservasi.

## Konsep Utama (Sesuai Proposal Penelitian)
1. **Proof-of-Existence**: Memvalidasi bukti fisik tanaman.
2. **Kriptografi & Timestamp**: Setiap payload wajib memiliki `timestamp` (waktu pencatatan) dan `geotagging`.
3. **Penyimpanan Terdesentralisasi (IPFS)**: Payload mengakomodasi pengikatan (binding) *hash IPFS* dari foto bukti fisik, bukan sekadar URL terpusat.

## Struktur Payload Universal
Setiap aktivitas (Perencanaan, Implementasi, Monitoring, Evaluasi) **wajib** mengikuti kerangka JSON berikut sebelum di-hash menggunakan SHA3-256:

```json
{
  "metadata": {
    "activity_type": "STRING", // e.g., "IMPLEMENTASI"
    "activity_id": "STRING",   // Menggunakan UUID untuk eksposur publik (bukan integer ID)
    "timestamp": "ISO8601_STRING" // Penanda waktu mutlak (Wajib untuk Data Layer)
  },
  "location_data": {
    "lat": "FLOAT",
    "long": "FLOAT",
    "geotagging": "STRING",      // Format standar koordinat eksak
    "lokasi": "STRING",          // Nama lokasi / nama TWA
    "identitas_blok": "STRING"   // Identitas blok penanaman
  },
  "evidence": {
    "dokumentasi_count": "INTEGER",
    "ipfs_hashes": ["STRING"]    // Hash IPFS dari foto bukti lapangan (Wajib untuk Proof-of-Existence)
  },
  "phase_data": {
    // Berisi data spesifik sesuai fase
  }
}
```

## Standarisasi Nomenklatur (Database & Payload)
Berdasarkan kesepakatan, seluruh *key* dalam database dan payload akan diseragamkan menggunakan **Bahasa Inggris** untuk menghindari ambiguitas (seperti *nama_perusahaan* vs *nama_lembaga*), sementara *label* di Frontend tetap menggunakan Bahasa Indonesia.

Selain itu, relasi ID antar tabel (seperti `perencanaan_id`, `implementasi_id`) **dihilangkan** dari payload blockchain, karena payload hanya berfokus pada data lapangan yang relevan, dan hash tersebut nantinya sudah menempel pada *row* database yang tepat.

## Rincian `phase_data` per Aktivitas (Updated Nomenclature)

### 1. PLANNING (Perencanaan)
```json
"phase_data": {
  "institution_name": "STRING", // Sebelumnya: nama_perusahaan / nama_lembaga
  "pic_name": "STRING",         // Sebelumnya: nama_pic
  "contact_person": "STRING",   // Sebelumnya: narahubung
  "project_type": "STRING",     // Sebelumnya: jenis_kegiatan
  "target_seedlings": "INTEGER",// Sebelumnya: jumlah_bibit
  "tree_species": "STRING",     // Sebelumnya: jenis_bibit
  "execution_date": "ISO8601_STRING" // Sebelumnya: tanggal_pelaksanaan
}
```

### 2. IMPLEMENTATION (Implementasi)
Catatan: Atribut di dalam `actual_realization` bersifat dinamis dan hanya akan di-hash/dikirim jika nilai `compliance`-nya bernilai `false` (tidak sesuai rencana). Ini menjaga agar *payload* dan database tetap bersih tanpa duplikasi data.
```json
"phase_data": {
  "field_coordinator": "STRING", 
  "compliance": {
    "location": "BOOLEAN",
    "date": "BOOLEAN",
    "tree_species": "BOOLEAN",
    "seedling_amount": "BOOLEAN"
  },
  "actual_realization": {
    // Hanya dicatat (muncul) jika compliance = false pada bagian terkait
    "date": "ISO8601_STRING",
    "latitude": "FLOAT",
    "longitude": "FLOAT",
    "location_name": "STRING",
    "tree_species": "STRING",
    "seedling_amount": "INTEGER"
  }
}
```

### 3. MONITORING
*Sesuai dengan metrik kelangsungan hidup tanaman di proposal.*
```json
"phase_data": {
  "monitoring_round": "INTEGER",   // Sebelumnya: round_number
  "planted_seedlings": "INTEGER",  // Sebelumnya: jumlah_bibit_ditanam
  "dead_seedlings": "INTEGER",     // Sebelumnya: jumlah_bibit_mati
  "seedling_height_cm": "FLOAT",   // Sebelumnya: tinggi_bibit
  "stem_diameter_cm": "FLOAT",     // Sebelumnya: diameter_batang
  "leaf_count": "INTEGER",         // Sebelumnya: jumlah_daun
  "survival_rate": "FLOAT"
}
```

### 4. EVALUATION (Evaluasi)
```json
"phase_data": {
  "survival_rate": "FLOAT",
  "average_height_cm": "FLOAT",    // Sebelumnya: tinggi_bibit_rata
  "average_diameter_cm": "FLOAT",  // Sebelumnya: diameter_batang_rata
  "health_condition": "STRING"     // e.g., "Excellent", "Critical"
}
```

## Alur Enkripsi (Data Layer)
1. Data JSON utuh (seperti struktur di atas) di-serialize.
2. Di-hash menggunakan **SHA3-256** menghasilkan `docHash`.
3. `docHash` dikirim ke **Contract Layer** (Smart Contract) via fungsi `storeActivity`.
4. Blockchain menerbitkan `tx_hash` yang mengikat *Proof-of-Existence* selamanya.
