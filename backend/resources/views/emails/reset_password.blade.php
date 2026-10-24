<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - Elysium Arena</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0b0e;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #d4d4d8;
    }
    .container {
      max-width: 580px;
      margin: 30px auto;
      background-color: #121217;
      border: 1px solid #27272a;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      background: linear-gradient(135deg, #1c0a0c 0%, #121217 100%);
      padding: 32px 30px;
      text-align: center;
      border-bottom: 2px solid #e31e24;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: rgba(227, 30, 36, 0.15);
      border: 1px solid rgba(227, 30, 36, 0.4);
      border-radius: 9999px;
      color: #e31e24;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin: 0;
    }
    .subtitle {
      color: #a1a1aa;
      font-size: 12px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-top: 6px;
      font-weight: 600;
    }
    .content {
      padding: 36px 32px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 14px;
    }
    .text {
      font-size: 14px;
      line-height: 1.65;
      color: #a1a1aa;
      margin-bottom: 24px;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background-color: #e31e24;
      color: #ffffff !important;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 6px 20px rgba(227, 30, 36, 0.35);
    }
    .btn:hover {
      background-color: #c4151b;
    }
    .notice-box {
      background-color: #18181b;
      border-left: 3px solid #e31e24;
      padding: 14px 16px;
      border-radius: 0 8px 8px 0;
      margin-bottom: 24px;
    }
    .notice-box p {
      margin: 0;
      font-size: 12px;
      color: #d4d4d8;
      line-height: 1.5;
    }
    .url-fallback {
      font-size: 11px;
      color: #71717a;
      word-break: break-all;
      background-color: #0d0d11;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #27272a;
    }
    .footer {
      background-color: #09090c;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #27272a;
      font-size: 11px;
      color: #71717a;
      line-height: 1.6;
    }
    .footer strong {
      color: #a1a1aa;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="badge">Security & Access Portal</div>
      <h1 class="title">Elysium Arena</h1>
      <div class="subtitle">Surga Para Gamer • Sumedang</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Halo, {{ $userName }}!</div>
      
      <p class="text">
        Kami menerima permintaan untuk mengatur ulang kata sandi (reset password) akun member Elysium Arena Anda.
        Silakan klik tombol di bawah untuk membuat kata sandi baru:
      </p>

      <div class="btn-container">
        <a href="{{ $resetUrl }}" target="_blank" class="btn">
          Atur Ulang Password Saya
        </a>
      </div>

      <div class="notice-box">
        <p>
          ⏱️ <strong>Batas Waktu:</strong> Tautan di atas hanya berlaku selama <strong>{{ $expiresInMinutes }} menit</strong> terhitung sejak email ini dikirimkan.
        </p>
      </div>

      <p class="text" style="font-size: 12px; color: #71717a;">
        Jika Anda tidak merasa mengajukan permintaan ini, Anda dapat mengabaikan email ini dengan aman. Kata sandi akun Anda tidak akan berubah tanpa tautan di atas.
      </p>

      <p class="text" style="font-size: 12px; margin-bottom: 8px;">
        Jika tombol di atas tidak berfungsi, salin dan buka tautan berikut di peramban (browser) Anda:
      </p>
      <div class="url-fallback">
        <a href="{{ $resetUrl }}" style="color: #e31e24; text-decoration: underline;">{{ $resetUrl }}</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <strong>ELYSIUM ARENA SUMEDANG</strong><br>
      Jl. Mayor Abdurahman No.209, Kotakaler, Kec. Sumedang Utara, Sumedang<br>
      Hotline WhatsApp CS: +62 838-6900-2070 • Email: elysiumarena1@gmail.com
    </div>
  </div>
</body>
</html>
