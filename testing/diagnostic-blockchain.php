#!/usr/bin/env php
<?php
/**
 * Diagnostic script to verify blockchain queue setup
 * Usage: php diagnostic-blockchain.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use App\Models\Perencanaan;

echo "\n";
echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║         BLOCKCHAIN QUEUE SYSTEM DIAGNOSTIC REPORT                  ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";

// ✅ Check 1: Database Connection
echo "\n[1] DATABASE CONNECTION\n";
echo "────────────────────────────────────────────────────────────────────\n";
try {
    $connection = DB::connection()->getPdo();
    echo "✅ Database connected\n";
    echo "   Connection: " . DB::connection()->getName() . "\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}

// ✅ Check 2: Queue Table
echo "\n[2] QUEUE TABLES\n";
echo "────────────────────────────────────────────────────────────────────\n";
try {
    $jobsCount = DB::table('jobs')->count();
    $failedCount = DB::table('failed_jobs')->count();
    echo "✅ Queue tables exist\n";
    echo "   Pending jobs: $jobsCount\n";
    echo "   Failed jobs: $failedCount\n";

    // Show recent jobs
    $recentJobs = DB::table('jobs')->orderBy('created_at', 'desc')->limit(5)->get();
    if ($recentJobs->count() > 0) {
        echo "\n   Recent jobs:\n";
        foreach ($recentJobs as $job) {
            $payload = json_decode($job->payload, true);
            $jobClass = $payload['displayName'] ?? 'Unknown';
            echo "   - $jobClass (attempts: {$job->attempts})\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Queue tables not found: " . $e->getMessage() . "\n";
    echo "   Fix: php artisan queue:table && php artisan migrate\n";
}

// ✅ Check 3: Blockchain Service
echo "\n[3] BLOCKCHAIN SERVICE\n";
echo "────────────────────────────────────────────────────────────────────\n";
$blockchainUrl = config('services.blockchain.url', env('BLOCKCHAIN_API_URL'));
try {
    $response = Http::timeout(5)->get($blockchainUrl . '/health');
    if ($response->successful()) {
        $data = $response->json();
        echo "✅ Blockchain service running at $blockchainUrl\n";
        echo "   Status: " . ($data['status'] ?? 'OK') . "\n";
        echo "   Contract: " . ($data['contract'] ?? 'Unknown') . "\n";
    } else {
        echo "❌ Blockchain service returned: " . $response->status() . "\n";
    }
} catch (Exception $e) {
    echo "❌ Blockchain service unreachable: " . $e->getMessage() . "\n";
    echo "   Expected URL: $blockchainUrl\n";
    echo "   Fix: Ensure blockchain-service is running with: node blockchain-service/server.js\n";
}

// ✅ Check 4: Blockchain Configuration
echo "\n[4] BLOCKCHAIN CONFIGURATION\n";
echo "────────────────────────────────────────────────────────────────────\n";
$config = config('services.blockchain');
echo "✅ Configuration loaded:\n";
echo "   Network: " . ($config['network'] ?? 'Unknown') . "\n";
echo "   Chain ID: " . ($config['chain_id'] ?? 'Unknown') . "\n";
echo "   Contract: " . substr($config['contract_address'] ?? '', 0, 15) . "...\n";
echo "   Queue API URL: " . $blockchainUrl . "\n";

// ✅ Check 5: Perencanaan Records
echo "\n[5] PERENCANAAN BLOCKCHAIN STATUS\n";
echo "────────────────────────────────────────────────────────────────────\n";
try {
    $pending = Perencanaan::where('blockchain_status', 'pending')->count();
    $confirmed = Perencanaan::where('blockchain_status', 'confirmed')->count();
    $failed = Perencanaan::where('blockchain_status', 'failed')->count();

    echo "✅ Blockchain status distribution:\n";
    echo "   Pending: $pending\n";
    echo "   Confirmed: $confirmed\n";
    echo "   Failed: $failed\n";

    // Show recent pending items
    $recentPending = Perencanaan::where('blockchain_status', 'pending')
        ->orderBy('created_at', 'desc')
        ->limit(3)
        ->get();

    if ($recentPending->count() > 0) {
        echo "\n   Recent pending items:\n";
        foreach ($recentPending as $item) {
            $age = now()->diffInSeconds($item->created_at);
            echo "   - #{$item->id}: {$item->nama_perusahaan} (age: {$age}s)\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Failed to query perencanaan: " . $e->getMessage() . "\n";
}

// ✅ Check 6: Job Class
echo "\n[6] JOB CLASS\n";
echo "────────────────────────────────────────────────────────────────────\n";
if (class_exists('App\Jobs\BroadcastPerencanaanToBlockchain')) {
    echo "✅ BroadcastPerencanaanToBlockchain job exists\n";
    $reflection = new ReflectionClass('App\Jobs\BroadcastPerencanaanToBlockchain');
    echo "   File: " . $reflection->getFileName() . "\n";
    echo "   Implements ShouldQueue: " . (is_subclass_of('App\Jobs\BroadcastPerencanaanToBlockchain', 'Illuminate\Contracts\Queue\ShouldQueue') ? 'Yes' : 'No') . "\n";
} else {
    echo "❌ BroadcastPerencanaanToBlockchain job not found\n";
}

// ✅ Check 7: Queue Configuration
echo "\n[7] QUEUE CONFIGURATION\n";
echo "────────────────────────────────────────────────────────────────────\n";
$queueDriver = config('queue.default');
$allConnections = config('queue.connections');
echo "✅ Queue configuration:\n";
echo "   Default driver: $queueDriver\n";
echo "   Available connections: " . implode(', ', array_keys($allConnections)) . "\n";

if ($queueDriver === 'database' && isset($allConnections['database'])) {
    $dbConfig = $allConnections['database'];
    echo "   Database queue table: " . ($dbConfig['table'] ?? 'jobs') . "\n";
}

// ✅ Summary & Recommendations
echo "\n[8] RECOMMENDATIONS\n";
echo "────────────────────────────────────────────────────────────────────\n";
$issues = [];

if ($jobsCount === null) {
    $issues[] = "Queue tables missing - run: php artisan queue:table && php artisan migrate";
}

try {
    $response = Http::timeout(5)->get($blockchainUrl . '/health');
    if (!$response->successful()) {
        $issues[] = "Blockchain service not responding - check if node server.js is running";
    }
} catch (Exception $e) {
    $issues[] = "Blockchain service unreachable - start it with: cd blockchain-service && node server.js";
}

if (empty($issues)) {
    echo "✅ All systems operational!\n\n";
    echo "To start processing jobs, run:\n";
    echo "   php artisan queue:work database --sleep=3 --tries=5\n\n";
} else {
    echo "⚠️ Issues detected:\n\n";
    foreach ($issues as $idx => $issue) {
        echo "   " . ($idx + 1) . ". $issue\n";
    }
    echo "\n";
}

echo "\n╔════════════════════════════════════════════════════════════════════╗\n";
echo "║                      DIAGNOSTIC COMPLETE                           ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";
