# BC_CCS — Blockchain Service

Layanan Node.js untuk Peluk Bumi CCS: penyimpanan hash dokumen di smart contract `DocumentRegistry`, proxy transaksi ke jaringan EVM (Sepolia / Polygon Amoy), dan integrasi dengan backend Laravel (`BE_CCS`).

## Peran dalam monorepo

| Komponen | Port default | Peran |
|----------|--------------|--------|
| **FE_CCS** | 5173 | Dashboard React, verifikasi publik (QR) |
| **BE_CCS** | 8000 | API Laravel, orkestrasi blockchain |
| **BC_CCS** | 4000 | Eksekusi transaksi on-chain |

## Quick start

```bash
cd BC_CCS
npm install
cp .env.example .env
# Isi PRIVATE_KEY, BLOCKCHAIN_RPC_URL, BLOCKCHAIN_CONTRACT_ADDRESS
npm run dev
```

Health check: `GET http://localhost:4000/health`

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
