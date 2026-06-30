# BC_CCS Changelog

Perubahan pada layanan blockchain CCS (`BC_CCS`).

Format mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

---

## [2.0.0] - 2026-07-01

### Ditambahkan
- **Smart Contract v2 (Activity-based)**:
  - Upgrade `DocumentRegistry.sol` dengan stage methods khusus (`recordPlanning`, `recordImplementation`, `recordMonitoring`, `recordVerification`) untuk kejelasan audit trail.
  - Penambahan event `ActivityStored` untuk mempermudah indexing riwayat aktivitas.
- **REST API Endpoint Pemetaan Bahasa Indonesia**:
  - `server.js` diperbarui untuk mendukung `/store-activity` dengan kompatibilitas kata kunci bahasa Indonesia (`PERENCANAAN`, `IMPLEMENTASI`, `VERIFIKASI`) dan mapping otomatis ke method smart contract terkait.

### Diubah & Direfaktor
- **Dukungan Multi-Network**:
  - Sinkronisasi konfigurasi Hardhat (`hardhat.config.js`) untuk mempermudah verifikasi kontrak (Etherscan/Polygonscan) di Polygon Mainnet, Sepolia Testnet, dan Localhost.

### Dokumentasi & Pengarsipan (Pembersihan)
- Penyelarasan referensi jaringan (Sepolia vs Polygon Amoy) di dokumentasi.
- Menambahkan pemetaan arsitektur blockchain (`docs/SEVEN_LAYER_ALIGNMENT.md`).
- Memindahkan launcher scripts usang (`start-service.bat`, `start-broadcaster.bat`, `start-blockchain-production.sh`), `DEPLOY_ADDRESS.txt`, dan file pengujian PHP ke `/archive/BC_CCS/` demi kebersihan kode.
- Mengonfigurasi `.gitignore` untuk mengabaikan output kompilasi lokal Hardhat (`/artifacts/` dan `/cache/`).

---

## [1.0.0] - 2026-05-19

### Ditambahkan
- Konsolidasi blockchain dari `FE_CCS` dan `BE_CCS/blockchain-service` ke `BC_CCS`
- `contracts/DocumentRegistry.sol` — registry hash dokumen
- `server.js` — Express API: `/health`, `/store-document`, `/document/:id`, `/document-by-hash/:hash`, `/transaction/:hash`
- `docs/` — SETUP, DEPLOYMENT, DEPLOYMENT_ADDRESSES, README
- `testing/` — skrip diagnostik blockchain
- Skrip start: `start-service.bat`, `start-blockchain-production.sh`

### Diubah
- Variabel environment terstandar: `BLOCKCHAIN_RPC_URL`, `BLOCKCHAIN_CONTRACT_ADDRESS`, `BLOCKCHAIN_CHAIN_ID`
- Dukungan legacy: `RPC_URL`, `CONTRACT_ADDRESS`

### Catatan teknis
- Dependency `ipfs-http-client` tersedia; upload IPFS belum diimplementasi di `server.js` (rencana Layer 6 / Physical).
