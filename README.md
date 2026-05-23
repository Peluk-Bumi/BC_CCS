# BC_CCS — Blockchain Service (V2)

Layanan Node.js untuk Peluk Bumi CCS: penyimpanan hash aktivitas di smart contract `DocumentRegistry` secara dinamis, proxy transaksi ke jaringan EVM (Polygon/Sepolia), dan integrasi dengan backend Laravel (`BE_CCS`).

## Peran dalam monorepo

| Komponen | Port default | Peran |
|----------|--------------|--------|
| **FE_CCS** | 5173 | Dashboard React, verifikasi publik (QR) |
| **BE_CCS** | 8000 | API Laravel, orkestrasi blockchain & intelijen |
| **BC_CCS** | 4000 | Eksekusi transaksi on-chain (Activity-based) |

## Quick start

```bash
cd BC_CCS
npm install
cp .env.example .env
# Sesuaikan network di .env (Polygon Mainnet/Sepolia/Amoy)
npm run dev
```

Health check: `GET http://localhost:4000/health`

## Fitur V2 (Activity-based)

- **Dynamic Activity Logging**: Tidak hanya menyimpan dokumen, tapi mencatat setiap aktivitas (Perencanaan, Implementasi, Monitoring) sebagai entry unik.
- **Smart Contract V2**: Mendukung method `storeActivity` dan `getActivity` untuk audit trail yang lebih detail.
- **Multi-Network Support**: Konfigurasi siap pakai untuk Polygon Mainnet, Ethereum Sepolia, dan Polygon Amoy.
- **Auto-Broadcaster**: Terintegrasi dengan queue Laravel untuk pemrosesan transaksi asinkron.

## Struktur utama

```
BC_CCS/
├── contracts/DocumentRegistry.sol
├── server.js
├── DocumentRegistry.abi.json
├── scripts/              # Deploy & verifikasi (Hardhat)
├── docs/                 # Dokumentasi detail
├── testing/              # Skrip diagnostik PHP
├── README.md
└── CHANGELOG.md
```

## Dokumentasi

| Dokumen | Isi |
|---------|-----|
| [docs/README.md](docs/README.md) | Overview layanan & API |
| [docs/SETUP.md](docs/SETUP.md) | Instalasi & environment |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploy kontrak & produksi |
| [docs/DEPLOYMENT_ADDRESSES.md](docs/DEPLOYMENT_ADDRESSES.md) | Alamat kontrak per jaringan |
| [docs/SEVEN_LAYER_ALIGNMENT.md](docs/SEVEN_LAYER_ALIGNMENT.md) | Kesesuaian 7 layer (blockchain) |

## Scripts

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Server dengan `--watch` |
| `npm start` | Produksi |
| `start-service.bat` | Windows — start service |
| `start-blockchain-production.sh` | Linux — produksi |

Deploy kontrak (Hardhat): lihat [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Riwayat perubahan

Lihat [CHANGELOG.md](CHANGELOG.md).

## Lisensi

MIT
