# BC_CCS Changelog

Perubahan pada layanan blockchain CCS (`BC_CCS`).

Format mengacu pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Ditambahkan
- `README.md` dan `CHANGELOG.md` di root `BC_CCS`
- `docs/SEVEN_LAYER_ALIGNMENT.md` — pemetaan layer Contract / Consensus / Network

### Dokumentasi
- Penyelarasan referensi jaringan (Sepolia vs Polygon Amoy) di dokumentasi

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
