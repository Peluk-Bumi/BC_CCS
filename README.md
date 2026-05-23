# 🔗 BC_CCS — Peluk Bumi EMS Blockchain (V2)

Layanan Node.js untuk **Peluk Bumi Environmental Monitoring System (EMS)**. Bertanggung jawab untuk penyimpanan hash aktivitas ke smart contract `DocumentRegistry` di jaringan EVM (Polygon Amoy/Mainnet), menyediakan audit trail yang tidak dapat diubah (immutable) untuk setiap tahapan proses bisnis.

## 📌 Peran dalam Ekosistem

| Komponen | Port | Peran |
|----------|------|-------|
| **BE_CCS** | 8000 | Backend Laravel (Orkestrator & Logika Bisnis) |
| **BC_CCS** | 4000 | Blockchain Service (Eksekusi Transaksi On-chain) |
| **FE_CCS** | 5173 | Frontend Dashboard & Verifikasi Publik |

---

## 🏗️ Arsitektur & Teknologi

- **Smart Contract**: Solidity 0.8.19 (`DocumentRegistry.sol`)
- **Framework**: Hardhat & Express.js
- **Library**: Ethers.js v6
- **Network**: Polygon Amoy (Default Testnet), Polygon Mainnet (Production)

### Struktur Proyek Utama
- `contracts/`: Smart contract Solidity.
- `scripts/`: Script deployment dan verifikasi build.
- `server.js`: API Server utama untuk interaksi blockchain.
- `DocumentRegistry.abi.json`: ABI kontrak untuk komunikasi server-to-contract.

---

## 🔄 Alur Proses Bisnis & Jejak Hash

Setiap tahapan dalam proses bisnis (Perencanaan, Implementasi, Monitoring) memiliki **jejak hash** tersendiri di blockchain.

1. **Jejak Hash per Tahap**: Setiap aktivitas menghasilkan `docHash` (SHA-256 dari data/dokumen).
2. **Method Utama**:
   - `POST /store-activity`: Mengirim hash dan metadata ke blockchain.
   - **Smart Methods** (Terdeteksi otomatis di Explorer):
     - `recordPlanning`: Untuk tahap Perencanaan.
     - `recordImplementation`: Untuk tahap Implementasi.
     - `recordMonitoring`: Untuk tahap Monitoring.
     - `recordVerification`: Untuk tahap Verifikasi.
     - `storeActivity`: Fallback untuk tipe aktivitas lainnya.
3. **Bukti Transaksi**: Setiap penyimpanan menghasilkan `txHash` unik sebagai bukti permanen bahwa data tersebut telah divalidasi pada waktu tertentu.

---

## 🚀 Quick Start

### 1. Instalasi
```bash
npm install
cp .env.example .env
```

### 2. Konfigurasi
Edit `.env` dan pastikan variabel berikut terisi:
- `BLOCKCHAIN_RPC_URL`: URL RPC provider (misal: Alchemy/Infura)
- `PRIVATE_KEY`: Wallet private key (dengan saldo gas)
- `BLOCKCHAIN_CONTRACT_ADDRESS`: Alamat kontrak yang sudah di-deploy

### 3. Menjalankan Service
- **Development**: `npm run dev`
- **Production**: `npm start` atau `./start-blockchain-production.sh`

---

## 📡 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/health` | `GET` | Cek status koneksi wallet & blockchain |
| `/store-activity` | `POST` | Simpan hash aktivitas ke blockchain |
| `/transaction/:hash` | `GET` | Ambil detail transaksi berdasarkan TX Hash |
| `/document/:docId` | `GET` | Ambil data aktivitas berdasarkan ID internal contract |

---

## 🛠️ Troubleshooting: Status "Modified" di Git

Jika Anda melihat banyak file berstatus `modified` setelah melakukan `git pull`, hal ini biasanya disebabkan oleh **perbedaan Line Endings (LF vs CRLF)** antara sistem operasi (Windows vs macOS/Linux).

**Solusi:**
1. Reset file yang termodifikasi:
   ```bash
   git checkout .
   ```
2. Atur git agar menangani line endings secara otomatis:
   ```bash
   git config core.autocrlf input  # Untuk macOS/Linux
   # atau
   git config core.autocrlf true   # Untuk Windows
   ```

---

## 📜 Lisensi
MIT — Peluk Bumi Project
