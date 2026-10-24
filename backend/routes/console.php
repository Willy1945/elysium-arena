<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Http;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Cek pesan masuk bot Telegram untuk menemukan Chat ID / Group ID.
 */
Artisan::command('telegram:updates', function () {
    $botToken = config('services.telegram.bot_token');

    if (empty($botToken)) {
        $this->error("Gagal: TELEGRAM_BOT_TOKEN belum diisi di file backend/.env!");
        $this->line("Dapatkan token bot dengan membuat bot baru via @BotFather di aplikasi Telegram.");
        return 1;
    }

    $this->info("Menghubungi Telegram API untuk memeriksa aktivitas bot...");
    $url = "https://api.telegram.org/bot{$botToken}/getUpdates";

    try {
        $response = Http::timeout(10)->get($url);
        if (! $response->successful()) {
            $this->error("Telegram Error: " . $response->body());
            return 1;
        }

        $data = $response->json();
        $results = $data['result'] ?? [];

        if (empty($results)) {
            $this->warn("Belum ada pesan yang diterima bot.");
            $this->line("Langkah agar Chat ID terdeteksi:");
            $this->line("1. Masukkan bot Anda ke dalam grup Telegram Staf/Kasir.");
            $this->line("2. Kirim pesan sembarang di grup tersebut (misal: 'halo').");
            $this->line("3. Jalankan kembali perintah ini: php artisan telegram:updates");
            return 0;
        }

        $this->info("=== DAFTAR CHAT / GRUP YANG TERDETEKSI ===");
        $foundChats = [];

        foreach ($results as $update) {
            $chat = $update['message']['chat'] ?? ($update['my_chat_member']['chat'] ?? null);
            if ($chat && ! isset($foundChats[$chat['id']])) {
                $foundChats[$chat['id']] = $chat;
                $title = $chat['title'] ?? ($chat['username'] ?? ($chat['first_name'] ?? 'Private Chat'));
                $type = $chat['type'] ?? 'unknown';
                $this->line("• Nama: <fg=yellow>{$title}</> | Tipe: <fg=cyan>{$type}</> | Chat ID: <fg=green;options=bold>{$chat['id']}</>");
            }
        }

        $this->line("");
        $this->info("Salin Chat ID di atas lalu simpan ke TELEGRAM_CHAT_ID di file backend/.env");
        return 0;
    } catch (\Throwable $e) {
        $this->error("Terjadi kesalahan: " . $e->getMessage());
        return 1;
    }
})->purpose('Cek pesan masuk dan temukan Chat ID / Group ID bot Telegram');

/**
 * Uji coba kirim pesan notifikasi bot Telegram.
 */
Artisan::command('telegram:test', function (\App\Services\TelegramService $telegramService) {
    $this->info("Mengirim pesan uji coba ke Telegram Bot Elysium Arena...");

    $botToken = config('services.telegram.bot_token');
    $chatId = config('services.telegram.chat_id');

    if (empty($botToken) || empty($chatId)) {
        $this->error("Gagal: TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diisi di backend/.env!");
        $this->line("Silakan buat bot via @BotFather dan isi Chat ID grup terlebih dahulu.");
        return 1;
    }

    $time = now()->setTimezone('Asia/Jakarta')->format('d M Y, H:i:s') . ' WIB';
    $testMessage = "🚀 <b>TES NOTIFIKASI TELEGRAM BERHASIL!</b>\n";
    $testMessage .= "━━━━━━━━━━━━━━━━━━━━\n";
    $testMessage .= "Sistem backend <b>Elysium Arena</b> berhasil terhubung dengan Bot Telegram.\n";
    $testMessage .= "Mulai sekarang setiap ada:\n";
    $testMessage .= "• 🍔 Order F&B Kafe dari meja stasiun\n";
    $testMessage .= "• 🎮 Booking stasiun baru dari pelanggan\n";
    $testMessage .= "• 💰 Transaksi kasir lunas\n";
    $testMessage .= "• 📩 Laporan kendala teknis / feedback\n";
    $testMessage .= "Notifikasi akan langsung masuk ke grup ini secara instan!\n\n";
    $testMessage .= "🕒 <i>{$time}</i>";

    $success = $telegramService->sendMessage($testMessage);

    if ($success) {
        $this->info("Berhasil! Pesan uji coba berhasil dikirim ke Telegram Chat ID: {$chatId}");
        return 0;
    } else {
        $this->error("Gagal mengirim pesan ke Telegram. Periksa koneksi internet atau pastikan Bot Token & Chat ID benar.");
        return 1;
    }
})->purpose('Uji coba kirim pesan notifikasi bot Telegram');
