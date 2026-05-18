<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

echo "=== Testing API Retry Endpoint ===\n\n";

// Find a confirmed transaction to verify data exists
$confirmedLog = DB::table('blockchain_transaction_logs')
    ->where('blockchain_status', 'confirmed')
    ->first();

if ($confirmedLog) {
    echo "✅ Found confirmed transaction:\n";
    echo "   ID: {$confirmedLog->id}\n";
    echo "   Status: {$confirmedLog->blockchain_status}\n";
    echo "   TxHash: " . substr($confirmedLog->blockchain_tx_hash ?? '', 0, 20) . "...\n";
    echo "   DocHash: " . substr($confirmedLog->blockchain_doc_hash ?? '', 0, 20) . "...\n\n";
} else {
    echo "⚠️  No confirmed transactions found.\n\n";
}

echo "Broadcaster Health Check:\n";
try {
    $response = Http::timeout(5)->get('http://localhost:4000/health');
    if ($response->successful()) {
        $data = $response->json();
        echo "✅ Broadcaster Online\n";
        echo "   Status: " . $data['status'] . "\n";
        echo "   Wallet: " . $data['wallet'] . "\n";
        echo "   Contract: " . $data['contract'] . "\n";
    } else {
        echo "❌ Broadcaster Error: " . $response->status() . "\n";
    }
} catch (\Exception $e) {
    echo "❌ Broadcaster Offline: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "Database Transaction Logs Summary:\n";
$summary = DB::table('blockchain_transaction_logs')
    ->selectRaw('blockchain_status, COUNT(*) as count, SUM(CASE WHEN blockchain_tx_hash IS NOT NULL THEN 1 ELSE 0 END) as with_txhash')
    ->groupBy('blockchain_status')
    ->get();

foreach ($summary as $row) {
    $status = strtoupper($row->blockchain_status);
    $count = $row->count;
    $withHash = $row->with_txhash ?? 0;
    echo "$status: $count (with txHash: $withHash)\n";
}

$total = DB::table('blockchain_transaction_logs')->count();
echo "\nTotal Logs: $total\n";
