# Kesesuaian 7 Layer — BC_CCS (Blockchain)

Referensi: [ANALISIS_7_LAYER_2_DIMENSI.md](../../ANALISIS_7_LAYER_2_DIMENSI.md) di root monorepo.  
Pembaruan: **19 Mei 2026**

## Ringkasan

| Layer | Status | Catatan |
|-------|--------|---------|
| **2 — Contract** | ✅ Partial (~75%) | `DocumentRegistry.sol` aktif; belum `EnhancedDocumentRegistry` / `validatePlanting` |
| **4 — Consensus** | ✅ Partial (~60%) | Validasi via jaringan EVM; multi-sig / `ConsensusValidation` di BE belum terhubung ke chain |
| **5 — Network** | ✅ Partial (~70%) | REST + broadcast log; belum WebSocket P2P |
| **6 — Data** | ⚠️ Partial (~40%) | Hash on-chain; IPFS dependency ada, endpoint upload belum |
| **7 — Physical** | ⚠️ Partial (~50%) | Skrip deploy/start; backup node IPFS belum |

---

## Layer 2 — Contract Layer

### Yang direncanakan (simplified)
- Perluas `DocumentRegistry` dengan validasi geotag & survival rate (`EnhancedDocumentRegistry`).

### Implementasi saat ini
- **File:** `contracts/DocumentRegistry.sol`
- **Fungsi:** `storeDocument`, `getDocument`, `getDocumentCount`
- **Service:** `server.js` memanggil kontrak via `ethers` + `DocumentRegistry.abi.json`

### Gap
- Tidak ada `validatePlantingRecord`, mapping `plantingRecords`, atau event `PlantingValidated`.
- Metadata geotag/survival disimpan sebagai string JSON di field `metadata`, bukan struct terpisah on-chain.

### Rekomendasi
1. Deploy kontrak extended atau tambah fungsi view/validate tanpa migrasi data besar.
2. Sinkronkan ABI di root `BC_CCS` setelah compile Hardhat.

---

## Layer 4 — Consensus Layer

### Implementasi saat ini
- Finalitas transaksi mengandalkan konsensus jaringan Polygon Amoy `80002` sebagai default di `server.js`.
- Model `ConsensusValidation` ada di **BE_CCS** (database), belum dipanggil dari `BC_CCS`.

### Gap
- Multi-signature / collective validation off-chain belum diekspos ke API blockchain service.

---

## Layer 5 — Network Layer

### Implementasi saat ini
- HTTP API port **4000**
- Backend Laravel memanggil service ini (biasanya via `ActivityBlockchainService` / env `BLOCKCHAIN_SERVICE_URL`)

### Gap
- Tidak ada `socket.io` / WebSocket di `BC_CCS` (rencana simplified: broadcast `activity_update`).

---

## Layer 6 — Data Layer

### Implementasi saat ini
- **Hash:** `docHash` disimpan on-chain; pencarian `/document-by-hash/:docHash`
- **Metadata:** JSON string (bisa berisi geotag dari BE)

### Gap
- `ipfs-http-client` di `package.json` tidak digunakan di `server.js`
- Tidak ada pipeline upload file → IPFS → hash

---

## Layer 7 — Physical Layer

### Implementasi saat ini
- `start-blockchain-production.sh`, `start-service.bat`
- Konfigurasi RPC fallback via env (`BLOCKCHAIN_FALLBACK_RPC_URLS`)

### Gap
- Backup IPFS node / redundancy tidak terdokumentasi di skrip repo

---

## Checklist tindak lanjut (BC_CCS)

- [ ] Implementasi atau hapus dependency IPFS (hindari drift)
- [ ] Satukan dokumentasi jaringan aktif (Amoy vs Mainnet) di `.env.example` dan `DEPLOYMENT_ADDRESSES.md`
- [ ] Kontrak extended untuk validasi planting (opsional, fase 2)
- [ ] Endpoint health yang menyertakan `chainId` dan nama jaringan
