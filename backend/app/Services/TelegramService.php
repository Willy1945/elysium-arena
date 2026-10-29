<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Feedback;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected ?string $botToken;
    protected ?string $chatId;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token');
        $this->chatId = config('services.telegram.chat_id');
    }

    public function sendMessage(string $text, ?string $chatId = null): bool
    {
        $targetChatId = $chatId ?: $this->chatId;

        if (empty($this->botToken) || empty($targetChatId)) {
            Log::info("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in .env");
            return false;
        }

        try {
            $url = "https://api.telegram.org/bot{$this->botToken}/sendMessage";
            $response = Http::timeout(5)->post($url, [
                'chat_id' => $targetChatId,
                'text' => $text,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true,
            ]);

            if (! $response->successful()) {
                Log::warning("Telegram API Error ({$response->status()}): " . $response->body());
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error("Failed to send Telegram notification: " . $e->getMessage());
            return false;
        }
    }

    public function sendNewOrderNotification(Order $order): void
    {
        try {
            $order->loadMissing(['user', 'session.device', 'items.product']);

            $customerName = $order->user?->name ?: 'Tamu (Walk-in)';
            $tableOrStation = $order->session?->device?->code
                ? "Stasiun " . $order->session->device->code . " (" . $order->session->device->name . ")"
                : "Meja Kafe / Takeaway";

            $itemsList = "";
            foreach ($order->items as $item) {
                $productName = $item->product?->name ?: 'Item Menu';
                $subtotal = number_format($item->subtotal, 0, ',', '.');
                $itemsList .= "• <b>{$item->quantity}x</b> {$productName} (Rp {$subtotal})\n";
            }

            $totalAmount = number_format($order->total_price, 0, ',', '.');
            $timeNow = now()->setTimezone('Asia/Jakarta')->format('d M Y, H:i') . ' WIB';

            $message = "🍔 <b>PESANAN KAFE & KITCHEN BARU!</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>No. Order:</b> <code>#{$order->order_code}</code>\n";
            $message .= "<b>Lokasi:</b> {$tableOrStation}\n";
            $message .= "<b>Pelanggan:</b> {$customerName}\n\n";
            $message .= "<b>Daftar Menu:</b>\n{$itemsList}\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>Total Pesanan:</b> <b>Rp {$totalAmount}</b>\n";
            $message .= "<b>Status:</b> ⏳ Menunggu Diproses Dapur\n";
            $message .= "🕒 <i>{$timeNow}</i>\n";
            $message .= "\n<i>Segera siapkan dan antarkan pesanan ke stasiun/meja!</i>";

            $this->sendMessage($message);
        } catch (\Throwable $e) {
            Log::warning("Error formatting new order notification: " . $e->getMessage());
        }
    }

    public function sendNewBookingNotification(Booking $booking): void
    {
        try {
            $booking->loadMissing(['user', 'device.deviceType']);

            $customerName = $booking->user?->name ?: 'Pelanggan';
            $customerPhone = $booking->user?->phone ? " ({$booking->user->phone})" : "";
            $deviceCode = $booking->device?->code ?: 'Rig Stasiun';
            $deviceName = $booking->device?->name ?: '';
            $deviceType = $booking->device?->deviceType?->name ?: '';

            $bookingDate = date('d M Y', strtotime($booking->booking_date));
            $startTime = substr($booking->start_time, 0, 5);
            $endTime = substr($booking->end_time, 0, 5);
            $durationHours = $booking->duration / 60;
            $totalPrice = number_format($booking->total_price, 0, ',', '.');
            $timeNow = now()->setTimezone('Asia/Jakarta')->format('d M Y, H:i') . ' WIB';

            $message = "🎮 <b>RESERVASI STASIUN GAMING BARU!</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>Kode Booking:</b> <code>#{$booking->booking_code}</code>\n";
            $message .= "<b>Stasiun:</b> <b>{$deviceCode}</b> - {$deviceName} [{$deviceType}]\n";
            $message .= "<b>Pelanggan:</b> {$customerName}{$customerPhone}\n";
            $message .= "<b>Tanggal:</b> {$bookingDate}\n";
            $message .= "<b>Waktu Sesi:</b> {$startTime} - {$endTime} ({$durationHours} Jam)\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>Total Tarif:</b> <b>Rp {$totalPrice}</b>\n";
            $message .= "<b>Status:</b> ⏳ Menunggu Konfirmasi Kasir\n";
            $message .= "🕒 <i>{$timeNow}</i>\n";
            $message .= "\n<i>Silakan cek daftar booking di sistem admin/kasir.</i>";

            $this->sendMessage($message);
        } catch (\Throwable $e) {
            Log::warning("Error formatting new booking notification: " . $e->getMessage());
        }
    }

    public function sendFeedbackNotification(Feedback $feedback): void
    {
        try {
            $feedback->loadMissing('user');

            $categoryLabels = [
                'complaint' => '⚠️ Kendala Teknis / Komplain',
                'game_request' => '🎮 Request Game Baru',
                'menu_request' => '🍽️ Request Menu Kafe',
                'other' => '💬 Pertanyaan / Saran Umum',
            ];

            $category = $categoryLabels[$feedback->category] ?? ucfirst($feedback->category);
            $sender = $feedback->user?->name ?: 'Pelanggan';
            $subject = htmlspecialchars($feedback->subject);
            $content = htmlspecialchars($feedback->message);
            $timeNow = now()->setTimezone('Asia/Jakarta')->format('d M Y, H:i') . ' WIB';

            $message = "📩 <b>MASUKAN / LAPORAN PELANGGAN!</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>Kategori:</b> {$category}\n";
            $message .= "<b>Pengirim:</b> {$sender}\n";
            $message .= "<b>Subjek:</b> <b>{$subject}</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>Pesan:</b>\n<i>\"{$content}\"</i>\n\n";
            $message .= "🕒 <i>{$timeNow}</i>";

            $this->sendMessage($message);
        } catch (\Throwable $e) {
            Log::warning("Error formatting feedback notification: " . $e->getMessage());
        }
    }

    public function sendPaymentNotification(Transaction $transaction, string $method): void
    {
        try {
            $transaction->loadMissing(['user', 'session.device']);

            $customer = $transaction->user?->name ?: ($transaction->guest_name ?: 'Tamu (Walk-in)');
            $station = $transaction->session?->device?->code ? "Stasiun " . $transaction->session->device->code : 'Transaksi Langsung';
            $methodLabel = strtoupper($method) === 'QRIS' ? '📱 QRIS (Scan Kasir)' : '💵 Tunai / Cash';
            $totalAmount = number_format($transaction->total_amount, 0, ',', '.');
            $timeNow = now()->setTimezone('Asia/Jakarta')->format('d M Y, H:i') . ' WIB';

            $message = "💰 <b>TRANSAKSI KASIR LUNAS!</b>\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>Kode Transaksi:</b> <code>#{$transaction->transaction_code}</code>\n";
            $message .= "<b>Pelanggan:</b> {$customer}\n";
            $message .= "<b>Layanan:</b> {$station}\n";
            $message .= "<b>Metode Bayar:</b> {$methodLabel}\n";
            $message .= "━━━━━━━━━━━━━━━━━━━━\n";
            $message .= "<b>Total Lunas:</b> <b>Rp {$totalAmount}</b>\n";
            $message .= "<b>Status:</b> ✅ LUNAS\n";
            $message .= "🕒 <i>{$timeNow}</i>";

            $this->sendMessage($message);
        } catch (\Throwable $e) {
            Log::warning("Error formatting payment notification: " . $e->getMessage());
        }
    }
}
