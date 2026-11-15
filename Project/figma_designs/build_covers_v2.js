const fs = require('fs');
const path = require('path');

// Read images
const logoBuf = fs.readFileSync('frontend/public/images/logoElysiumFix.png');
const logoB64 = 'data:image/png;base64,' + logoBuf.toString('base64');

const heroBuf = fs.readFileSync('frontend/public/images/hero-gaming-room.jpg');
const heroB64 = 'data:image/jpeg;base64,' + heroBuf.toString('base64');

const hallBuf = fs.readFileSync('frontend/public/images/gaming-hall.jpg');
const hallB64 = 'data:image/jpeg;base64,' + hallBuf.toString('base64');

const pcBuf = fs.readFileSync('frontend/public/images/pc-category.jpg');
const pcB64 = 'data:image/jpeg;base64,' + pcBuf.toString('base64');

function getHexPoints(cx, cy, r) {
  const pts = [];
  for (let k = 0; k < 6; k++) {
    const angle = (k * 60) * Math.PI / 180;
    const x = cx + r * Math.sin(angle);
    const y = cy - r * Math.cos(angle);
    pts.push(x.toFixed(1) + ',' + y.toFixed(1));
  }
  return pts.join(' ');
}

// Points for Front Cover Hexagons
const hex1Points = getHexPoints(920, 920, 360);
const hex2Points = getHexPoints(630, 1140, 190);
const hex3Points = getHexPoints(830, 1370, 140);

// ==========================================
// 1. FRONT COVER SVG
// ==========================================
const frontCoverSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1240" height="1754" viewBox="0 0 1240 1754" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Background Red Gradient -->
    <linearGradient id="redBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C00A27"/>
      <stop offset="35%" stop-color="#B8001F"/>
      <stop offset="70%" stop-color="#9C0018"/>
      <stop offset="100%" stop-color="#800012"/>
    </linearGradient>

    <!-- Subtle Architectural Building Overlay Lines -->
    <pattern id="buildingLines" width="60" height="60" patternTransform="rotate(-25 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="60" y2="0" stroke="#000000" stroke-width="1.2" stroke-opacity="0.12"/>
      <line x1="0" y1="0" x2="0" y2="60" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.04"/>
    </pattern>

    <!-- Watermark Logo Gradient -->
    <linearGradient id="watermarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60000B" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#400006" stop-opacity="0.10"/>
    </linearGradient>

    <!-- Hexagon Clip Paths -->
    <clipPath id="clipHex1">
      <polygon points="${hex1Points}"/>
    </clipPath>
    <clipPath id="clipHex2">
      <polygon points="${hex2Points}"/>
    </clipPath>
    <clipPath id="clipHex3">
      <polygon points="${hex3Points}"/>
    </clipPath>
  </defs>

  <!-- ==================== 1. BASE BACKGROUND LAYERS ==================== -->
  <g id="Background_Base">
    <!-- Solid Red Gradient -->
    <rect width="1240" height="1754" fill="url(#redBgGrad)"/>
    <!-- Subtle Architectural Overlay Pattern -->
    <rect width="1240" height="1754" fill="url(#buildingLines)"/>

    <!-- Subtle Diagonal Perspective Ray/Beam -->
    <polygon points="0,0 800,0 350,1754 0,1754" fill="#FFFFFF" fill-opacity="0.025"/>
    <polygon points="700,0 1240,0 1240,600 200,1754" fill="#000000" fill-opacity="0.08"/>

    <!-- GIANT WATERMARK CONTROLLER LOGO (Lower Left Background) -->
    <g id="Watermark_Controller" transform="translate(320, 1020) scale(4.2)">
      <!-- Left Body -->
      <path d="M -15 -85 L -55 -85 C -85 -85 -115 -60 -125 -25 L -142 55 C -147 78 -135 100 -115 100 C -98 100 -88 88 -82 72 L -68 35 L -40 35 L -52 75 L -10 75 L -2 -10 L -30 -10 L -25 -42 L -15 -42 Z"
            fill="url(#watermarkGrad)"/>
      <!-- Right Body -->
      <path d="M 18 -85 L 65 -85 C 95 -85 125 -60 135 -25 L 152 55 C 157 78 145 100 125 100 C 108 100 98 88 92 72 L 78 35 L 50 35 L 56 65 L 20 65 L 14 0 Z"
            fill="url(#watermarkGrad)"/>
      <!-- White/Red Slash -->
      <polygon points="-8,-92 24,-92 -15,102 -46,102" fill="#50000A" fill-opacity="0.25"/>
    </g>
  </g>

  <!-- ==================== 2. RIGHT VERTICAL BLACK COLUMN & PINSTRIPES ==================== -->
  <g id="Right_Sidebar_Black">
    <!-- Solid Black Right Sidebar -->
    <rect x="1010" y="0" width="230" height="1754" fill="#0A0A0E"/>

    <!-- Vertical Accent Pinstripes -->
    <!-- Red Pinstripe -->
    <rect x="990" y="0" width="3" height="1754" fill="#E11D48"/>
    <!-- Black Gap -->
    <!-- White Pinstripe -->
    <rect x="1000" y="0" width="2.5" height="1754" fill="#FFFFFF"/>
    <!-- Red Accent Line right at edge -->
    <rect x="1008" y="0" width="2" height="1754" fill="#B8001F"/>
  </g>

  <!-- ==================== 3. TOP RIGHT HEADER BAR (WITH RED STRIPES & LOGO ICONS) ==================== -->
  <g id="Top_Header_Badge_Bar" transform="translate(0, 90)">
    <!-- 4 Vertical Red Stripe Bars on Left of the White Block -->
    <g id="Top_Red_Stripes">
      <rect x="710" y="0" width="4.5" height="88" fill="#FFFFFF"/>
      <rect x="722" y="0" width="4.5" height="88" fill="#FFFFFF"/>
      <rect x="734" y="0" width="4.5" height="88" fill="#FFFFFF"/>
      <rect x="746" y="0" width="4.5" height="88" fill="#FFFFFF"/>
    </g>

    <!-- White Container Block extending to the right edge -->
    <rect x="760" y="0" width="480" height="88" fill="#FFFFFF"/>

    <!-- 4 Logo Icons inside the white block -->
    <g transform="translate(780, 12)">
      <!-- Icon 1 -->
      <g transform="translate(0, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
      <!-- Icon 2 -->
      <g transform="translate(85, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
      <!-- Icon 3 -->
      <g transform="translate(170, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
      <!-- Icon 4 -->
      <g transform="translate(255, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
    </g>
  </g>

  <!-- ==================== 4. MAIN TYPOGRAPHY (UPPER LEFT) ==================== -->
  <g id="Main_Typography_Hero" transform="translate(110, 360)">
    <!-- Category Mini Tag -->
    <rect x="0" y="-80" width="280" height="28" rx="6" fill="#0A0A0E" fill-opacity="0.6"/>
    <text x="14" y="-62" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" letter-spacing="2">LAPORAN PROJEK AKHIR &amp; UKK</text>

    <!-- ELYSIUM (Giant Extra Bold Sans) -->
    <text x="0" y="40" fill="#FFFFFF" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', sans-serif" font-size="114" font-weight="900" letter-spacing="2">ELYSIUM</text>

    <!-- ARENA (Bold Sans with Wide Tracking) -->
    <text x="5" y="115" fill="#FFFFFF" font-family="'Plus Jakarta Sans', 'Inter', 'Montserrat', sans-serif" font-size="58" font-weight="800" letter-spacing="9">ARENA</text>

    <!-- Gaming Station (Clean Sans) -->
    <text x="6" y="165" fill="#FFFFFF" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="28" font-weight="600" letter-spacing="1">Gaming Station</text>

    <!-- Project Academic Subtitles -->
    <g transform="translate(6, 215)">
      <line x1="0" y1="0" x2="380" y2="0" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.5"/>
      <text x="0" y="24" fill="#FFE4E8" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" letter-spacing="1">SISTEM MANAJEMEN SMART GAMING LOUNGE</text>
      <text x="0" y="46" fill="#FFC2CC" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">&amp; OTOMASI WORKSTATION SMART LOCK</text>
      <text x="0" y="70" fill="#FFA6B6" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500">SMK Negeri 1 Sumedang — Rekayasa Perangkat Lunak (PPLG)</text>
    </g>
  </g>

  <!-- ==================== 5. SIGNATURE INTERLOCKING HEXAGONS ==================== -->
  <g id="Signature_Hexagons">

    <!-- HEXAGON 1 (MAIN / LARGE - TOP RIGHT) -->
    <g id="Hexagon_1_Main">
      <!-- Shadow Backplate -->
      <polygon points="${hex1Points}" fill="#000000" opacity="0.45" filter="drop-shadow(0px 25px 35px rgba(0,0,0,0.6))"/>

      <!-- Image Inside Hexagon 1 (Elysium Arena Gaming Hall) -->
      <g clip-path="url(#clipHex1)">
        <image href="${hallB64}" x="560" y="560" width="720" height="720" preserveAspectRatio="xMidYMid slice"/>
        <!-- Subtle Red Vignette on image -->
        <rect x="560" y="560" width="720" height="720" fill="#B8001F" opacity="0.12"/>
      </g>

      <!-- Multi-Layer Border System (Black + White + Red) -->
      <!-- Thick Outer Black Border -->
      <polygon points="${hex1Points}" fill="none" stroke="#0A0A0E" stroke-width="18" stroke-linejoin="miter"/>
      <!-- Mid White Precision Border -->
      <polygon points="${hex1Points}" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="miter"/>
      <!-- Inner Red Accent Line -->
      <polygon points="${getHexPoints(920, 920, 350)}" fill="none" stroke="#B8001F" stroke-width="2" stroke-linejoin="miter"/>
    </g>

    <!-- HEXAGON 2 (MEDIUM - MIDDLE LEFT) -->
    <g id="Hexagon_2_Medium">
      <!-- Shadow Backplate -->
      <polygon points="${hex2Points}" fill="#000000" opacity="0.5" filter="drop-shadow(0px 20px 30px rgba(0,0,0,0.7))"/>

      <!-- Image Inside Hexagon 2 (VIP Suite Gaming Setup) -->
      <g clip-path="url(#clipHex2)">
        <image href="${heroB64}" x="440" y="950" width="380" height="380" preserveAspectRatio="xMidYMid slice"/>
      </g>

      <!-- Multi-Layer Border System -->
      <polygon points="${hex2Points}" fill="none" stroke="#0A0A0E" stroke-width="15" stroke-linejoin="miter"/>
      <polygon points="${hex2Points}" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="miter"/>
      <polygon points="${getHexPoints(630, 1140, 182)}" fill="none" stroke="#B8001F" stroke-width="2" stroke-linejoin="miter"/>
    </g>

    <!-- HEXAGON 3 (SMALL - BOTTOM RIGHT OF CLUSTER) -->
    <g id="Hexagon_3_Small">
      <!-- Shadow Backplate -->
      <polygon points="${hex3Points}" fill="#000000" opacity="0.55" filter="drop-shadow(0px 15px 25px rgba(0,0,0,0.8))"/>

      <!-- Image Inside Hexagon 3 (Custom Liquid Cooled Rig) -->
      <g clip-path="url(#clipHex3)">
        <image href="${pcB64}" x="690" y="1230" width="280" height="280" preserveAspectRatio="xMidYMid slice"/>
      </g>

      <!-- Multi-Layer Border System -->
      <polygon points="${hex3Points}" fill="none" stroke="#0A0A0E" stroke-width="13" stroke-linejoin="miter"/>
      <polygon points="${hex3Points}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="miter"/>
      <polygon points="${getHexPoints(830, 1370, 133)}" fill="none" stroke="#B8001F" stroke-width="1.8" stroke-linejoin="miter"/>
    </g>
  </g>

  <!-- ==================== 6. BOTTOM LEFT INFO & AUTHOR SECTION ==================== -->
  <g id="Bottom_Left_Info_Block" transform="translate(110, 1420)">
    <!-- Contact Info (Style: 123-456-7890) -->
    <text x="0" y="0" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="900" letter-spacing="1.5">+62 821-2345-6789</text>

    <!-- Website URL (Style: WWW.REALLYGREATSITE.COM) -->
    <text x="0" y="32" fill="#FFFFFF" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="17" font-weight="900" letter-spacing="2">WWW.ELYSIUM-ARENA.VERCEL.APP</text>

    <!-- Student Author Metadata -->
    <g transform="translate(0, 68)">
      <line x1="0" y1="0" x2="380" y2="0" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1"/>
      <text x="0" y="24" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" letter-spacing="1">PENYUSUN: ROBI PURNAMA</text>
      <text x="0" y="44" fill="#FFE4E8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600">NISN: 008xxxxxxx // KELAS: XII PPLG / RPL</text>
      <text x="0" y="64" fill="#FFA6B6" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500">SMK NEGERI 1 SUMEDANG — TAHUN 2026/2027</text>
    </g>
  </g>

  <!-- ==================== 7. BOTTOM LEFT DECORATIVE BLOCK ==================== -->
  <g id="Bottom_Decorative_Block" transform="translate(0, 1630)">
    <!-- White block on the bottom-left -->
    <rect x="0" y="0" width="380" height="75" fill="#FFFFFF"/>

    <!-- 4 Vertical Red Stripes on the right of the white block -->
    <g transform="translate(395, 0)">
      <rect x="0" y="0" width="4.5" height="75" fill="#FFFFFF"/>
      <rect x="12" y="0" width="4.5" height="75" fill="#FFFFFF"/>
      <rect x="24" y="0" width="4.5" height="75" fill="#FFFFFF"/>
      <rect x="36" y="0" width="4.5" height="75" fill="#FFFFFF"/>
    </g>

    <!-- Subtle branding inside white block -->
    <text x="60" y="45" fill="#0A0A0E" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" letter-spacing="3">ELYSIUM ARENA // UKK 2026</text>
  </g>
</svg>`;

// ==========================================
// 2. BACK COVER SVG (COMPANION DESIGN)
// ==========================================
const backHex1Points = getHexPoints(920, 850, 260);
const backHex2Points = getHexPoints(720, 1040, 170);

const backCoverSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1240" height="1754" viewBox="0 0 1240 1754" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Background Red Gradient -->
    <linearGradient id="backRedBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C00A27"/>
      <stop offset="35%" stop-color="#B8001F"/>
      <stop offset="70%" stop-color="#9C0018"/>
      <stop offset="100%" stop-color="#800012"/>
    </linearGradient>

    <!-- Overlay Pattern -->
    <pattern id="backBuildingLines" width="60" height="60" patternTransform="rotate(-25 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="60" y2="0" stroke="#000000" stroke-width="1.2" stroke-opacity="0.12"/>
      <line x1="0" y1="0" x2="0" y2="60" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.04"/>
    </pattern>

    <!-- Hexagon Clip Paths -->
    <clipPath id="clipBackHex1">
      <polygon points="${backHex1Points}"/>
    </clipPath>
    <clipPath id="clipBackHex2">
      <polygon points="${backHex2Points}"/>
    </clipPath>
  </defs>

  <!-- ==================== 1. BASE BACKGROUND ==================== -->
  <g id="Background_Base_Back">
    <rect width="1240" height="1754" fill="url(#backRedBgGrad)"/>
    <rect width="1240" height="1754" fill="url(#backBuildingLines)"/>
  </g>

  <!-- ==================== 2. LEFT VERTICAL BLACK COLUMN & PINSTRIPES ==================== -->
  <g id="Left_Sidebar_Black">
    <!-- Solid Black Left Sidebar -->
    <rect x="0" y="0" width="220" height="1754" fill="#0A0A0E"/>

    <!-- Vertical Accent Pinstripes -->
    <rect x="220" y="0" width="2" height="1754" fill="#B8001F"/>
    <rect x="226" y="0" width="2.5" height="1754" fill="#FFFFFF"/>
    <rect x="234" y="0" width="3" height="1754" fill="#E11D48"/>
  </g>

  <!-- ==================== 3. TOP HEADER BAR ==================== -->
  <g id="Top_Header_Back_Bar" transform="translate(0, 90)">
    <!-- White Container Block starting from left black bar -->
    <rect x="0" y="0" width="620" height="88" fill="#FFFFFF"/>

    <!-- 4 Vertical Red Stripes on Right of the White Block -->
    <g transform="translate(635, 0)">
      <rect x="0" y="0" width="4.5" height="88" fill="#FFFFFF"/>
      <rect x="12" y="0" width="4.5" height="88" fill="#FFFFFF"/>
      <rect x="24" y="0" width="4.5" height="88" fill="#FFFFFF"/>
      <rect x="36" y="0" width="4.5" height="88" fill="#FFFFFF"/>
    </g>

    <!-- 4 Logo Icons inside the white block -->
    <g transform="translate(40, 12)">
      <g transform="translate(0, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
      <g transform="translate(85, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
      <g transform="translate(170, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
      <g transform="translate(255, 0)">
        <rect width="64" height="64" rx="14" fill="#0A0A0E"/>
        <image href="${logoB64}" x="4" y="4" width="56" height="56" preserveAspectRatio="xMidYMid meet"/>
      </g>
    </g>
  </g>

  <!-- ==================== 4. EXECUTIVE SUMMARY & HEADLINE ==================== -->
  <g id="Executive_Summary_Back" transform="translate(290, 240)">
    <!-- Category Mini Tag -->
    <rect x="0" y="0" width="310" height="28" rx="6" fill="#0A0A0E" fill-opacity="0.6"/>
    <text x="14" y="18" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" letter-spacing="2">RINGKASAN EKSEKUTIF // SISTEM</text>

    <!-- Title -->
    <text x="0" y="65" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="36" font-weight="900" letter-spacing="1">TRANSFORMASI GAMING LOUNGE</text>
    <text x="0" y="95" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="700">Digitalisasi Reservasi, Kasir Kafe, &amp; Otomasi Smart Lock</text>

    <!-- Synopsis Paragraphs -->
    <g transform="translate(0, 130)">
      <rect width="840" height="150" rx="14" fill="#0A0A0E" fill-opacity="0.55" stroke="#FFFFFF" stroke-opacity="0.2"/>
      <text x="24" y="34" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="600" width="790">
        <tspan x="24" dy="0">Elysium Arena mengeliminasi kelemahan rental konvensional yang mengandalkan pencatatan waktu manual</tspan>
        <tspan x="24" dy="22">dan pengawasan fisik. Melalui sistem reservasi web interaktif, pelanggan dapat memesan stasiun PS5, PS4,</tspan>
        <tspan x="24" dy="22">maupun PC Rig secara daring, mengecek slot jadwal real-time, dan memesan hidangan kafe dalam 1 transaksi.</tspan>
      </text>
      <text x="24" y="112" fill="#FFE4E8" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="500">
        <tspan x="24" dy="0">Workstation PC secara otomatis dikunci dan dibuka oleh aplikasi desktop C# Smart Lock sesuai durasi sewa billing,</tspan>
        <tspan x="24" dy="20">sementara bot Telegram mengirimkan notifikasi instan untuk transparansi operasional.</tspan>
      </text>
    </g>
  </g>

  <!-- ==================== 5. 4 CORE CAPABILITIES (BENTO CARDS) ==================== -->
  <g id="Bento_Capabilities_Back" transform="translate(290, 560)">
    <!-- Box 1 -->
    <g transform="translate(0, 0)">
      <rect width="260" height="120" rx="12" fill="#0A0A0E" fill-opacity="0.75" stroke="#FFFFFF" stroke-opacity="0.2"/>
      <circle cx="28" cy="28" r="10" fill="#B8001F"/>
      <text x="28" y="32" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900">1</text>
      <text x="46" y="32" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800">Booking Daring</text>
      <text x="18" y="60" fill="#E4E4E7" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="500">
        <tspan x="18" dy="0">Katalog konsol PS5/PS4 &amp; PC</tspan>
        <tspan x="18" dy="16">dengan status ketersediaan</tspan>
        <tspan x="18" dy="16">dan kalender booking transparan.</tspan>
      </text>
    </g>

    <!-- Box 2 -->
    <g transform="translate(280, 0)">
      <rect width="260" height="120" rx="12" fill="#0A0A0E" fill-opacity="0.75" stroke="#FFFFFF" stroke-opacity="0.2"/>
      <circle cx="28" cy="28" r="10" fill="#B8001F"/>
      <text x="28" y="32" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900">2</text>
      <text x="46" y="32" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800">C# Smart Lock</text>
      <text x="18" y="60" fill="#E4E4E7" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="500">
        <tspan x="18" dy="0">Otomasi buka/kunci layar</tspan>
        <tspan x="18" dy="16">komputer client secara aman</tspan>
        <tspan x="18" dy="16">sinkron dengan timer billing.</tspan>
      </text>
    </g>

    <!-- Box 3 -->
    <g transform="translate(0, 140)">
      <rect width="260" height="120" rx="12" fill="#0A0A0E" fill-opacity="0.75" stroke="#FFFFFF" stroke-opacity="0.2"/>
      <circle cx="28" cy="28" r="10" fill="#B8001F"/>
      <text x="28" y="32" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900">3</text>
      <text x="46" y="32" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800">Kasir F&amp;B POS</text>
      <text x="18" y="60" fill="#E4E4E7" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="500">
        <tspan x="18" dy="0">Pesanan makanan meja kafe</tspan>
        <tspan x="18" dy="16">bergabung dengan sewa gaming</tspan>
        <tspan x="18" dy="16">dalam 1 nota invoice digital.</tspan>
      </text>
    </g>

    <!-- Box 4 -->
    <g transform="translate(280, 140)">
      <rect width="260" height="120" rx="12" fill="#0A0A0E" fill-opacity="0.75" stroke="#FFFFFF" stroke-opacity="0.2"/>
      <circle cx="28" cy="28" r="10" fill="#B8001F"/>
      <text x="28" y="32" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900">4</text>
      <text x="46" y="32" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800">Telegram Bot</text>
      <text x="18" y="60" fill="#E4E4E7" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="500">
        <tspan x="18" dy="0">Notifikasi otomatis booking</tspan>
        <tspan x="18" dy="16">dan sistem poin loyalitas</tspan>
        <tspan x="18" dy="16">untuk reward voucher bermain.</tspan>
      </text>
    </g>
  </g>

  <!-- ==================== 6. BACK COVER HEXAGONS (RIGHT SIDE) ==================== -->
  <g id="Back_Cover_Hexagons">
    <!-- Back Hexagon 1 (Top Right) -->
    <g id="Back_Hex_1">
      <polygon points="${backHex1Points}" fill="#000000" opacity="0.45" filter="drop-shadow(0px 20px 30px rgba(0,0,0,0.7))"/>
      <g clip-path="url(#clipBackHex1)">
        <image href="${heroB64}" x="660" y="590" width="520" height="520" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <polygon points="${backHex1Points}" fill="none" stroke="#0A0A0E" stroke-width="16" stroke-linejoin="miter"/>
      <polygon points="${backHex1Points}" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="miter"/>
    </g>

    <!-- Back Hexagon 2 (Middle Right) -->
    <g id="Back_Hex_2">
      <polygon points="${backHex2Points}" fill="#000000" opacity="0.5" filter="drop-shadow(0px 15px 25px rgba(0,0,0,0.8))"/>
      <g clip-path="url(#clipBackHex2)">
        <image href="${pcB64}" x="550" y="870" width="340" height="340" preserveAspectRatio="xMidYMid slice"/>
      </g>
      <polygon points="${backHex2Points}" fill="none" stroke="#0A0A0E" stroke-width="14" stroke-linejoin="miter"/>
      <polygon points="${backHex2Points}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="miter"/>
    </g>
  </g>

  <!-- ==================== 7. TECH STACK BADGES & QR CODE SHOWCASE ==================== -->
  <g id="Tech_Stack_And_QR" transform="translate(290, 1140)">
    <!-- Tech Badges -->
    <text x="0" y="0" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" letter-spacing="1">TUMPUKAN TEKNOLOGI YANG DIGUNAKAN:</text>

    <g transform="translate(0, 16)">
      <g transform="translate(0, 0)">
        <rect width="105" height="30" rx="6" fill="#0A0A0E" stroke="#FFFFFF" stroke-opacity="0.3"/>
        <text x="52" y="19" text-anchor="middle" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">REACT 19</text>
      </g>
      <g transform="translate(115, 0)">
        <rect width="115" height="30" rx="6" fill="#0A0A0E" stroke="#FFFFFF" stroke-opacity="0.3"/>
        <text x="57" y="19" text-anchor="middle" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">LARAVEL 11</text>
      </g>
      <g transform="translate(240, 0)">
        <rect width="130" height="30" rx="6" fill="#0A0A0E" stroke="#FFFFFF" stroke-opacity="0.3"/>
        <text x="65" y="19" text-anchor="middle" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">C# .NET SMART</text>
      </g>
      <g transform="translate(380, 0)">
        <rect width="130" height="30" rx="6" fill="#0A0A0E" stroke="#FFFFFF" stroke-opacity="0.3"/>
        <text x="65" y="19" text-anchor="middle" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">TAILWIND CSS</text>
      </g>
      <g transform="translate(520, 0)">
        <rect width="90" height="30" rx="6" fill="#0A0A0E" stroke="#FFFFFF" stroke-opacity="0.3"/>
        <text x="45" y="19" text-anchor="middle" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">MYSQL</text>
      </g>
      <g transform="translate(620, 0)">
        <rect width="140" height="30" rx="6" fill="#0A0A0E" stroke="#FFFFFF" stroke-opacity="0.3"/>
        <text x="70" y="19" text-anchor="middle" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">TELEGRAM BOT</text>
      </g>
    </g>

    <!-- QR Code & Repository Card -->
    <g transform="translate(0, 75)">
      <rect width="840" height="175" rx="16" fill="#0A0A0E" fill-opacity="0.8" stroke="#FFFFFF" stroke-opacity="0.25"/>

      <!-- Stylized Vector QR Code -->
      <g transform="translate(25, 20)">
        <rect width="135" height="135" rx="10" fill="#FFFFFF"/>
        <!-- QR Corner 1 -->
        <rect x="12" y="12" width="34" height="34" rx="4" fill="#0A0A0E"/>
        <rect x="18" y="18" width="22" height="22" rx="2" fill="#FFFFFF"/>
        <rect x="23" y="23" width="12" height="12" fill="#B8001F"/>
        <!-- QR Corner 2 -->
        <rect x="89" y="12" width="34" height="34" rx="4" fill="#0A0A0E"/>
        <rect x="95" y="18" width="22" height="22" rx="2" fill="#FFFFFF"/>
        <rect x="100" y="23" width="12" height="12" fill="#B8001F"/>
        <!-- QR Corner 3 -->
        <rect x="12" y="89" width="34" height="34" rx="4" fill="#0A0A0E"/>
        <rect x="18" y="95" width="22" height="22" rx="2" fill="#FFFFFF"/>
        <rect x="23" y="100" width="12" height="12" fill="#B8001F"/>
        <!-- Decorative Matrix Pixels -->
        <rect x="56" y="16" width="10" height="10" fill="#0A0A0E"/>
        <rect x="70" y="22" width="8" height="8" fill="#0A0A0E"/>
        <rect x="58" y="38" width="12" height="8" fill="#0A0A0E"/>
        <rect x="18" y="58" width="8" height="12" fill="#0A0A0E"/>
        <rect x="52" y="55" width="14" height="14" rx="2" fill="#B8001F"/>
        <rect x="72" y="50" width="10" height="15" fill="#0A0A0E"/>
        <rect x="95" y="58" width="12" height="10" fill="#0A0A0E"/>
        <rect x="58" y="78" width="10" height="12" fill="#0A0A0E"/>
        <rect x="78" y="72" width="12" height="10" fill="#0A0A0E"/>
        <rect x="55" y="100" width="12" height="10" fill="#0A0A0E"/>
        <rect x="72" y="95" width="8" height="12" fill="#0A0A0E"/>
        <rect x="65" y="112" width="15" height="10" fill="#0A0A0E"/>
        <rect x="88" y="106" width="10" height="12" fill="#0A0A0E"/>
        <rect x="105" y="95" width="14" height="14" fill="#0A0A0E"/>
      </g>

      <!-- Text next to QR -->
      <g transform="translate(185, 30)">
        <text x="0" y="0" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800" letter-spacing="1">PINDAI UNTUK MENGAKSES DEMO LIVE:</text>
        <text x="0" y="28" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="900">HTTPS://ELYSIUM-ARENA.VERCEL.APP</text>
        <text x="0" y="56" fill="#FFE4E8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600">Repositori Sumber Kode (GitHub):</text>
        <text x="0" y="76" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700">https://github.com/Willy1945/elysium-arena</text>
      </g>
    </g>
  </g>

  <!-- ==================== 8. INSTITUTIONAL COLOPHON & FOOTER ==================== -->
  <g id="Colophon_Footer_Back" transform="translate(290, 1435)">
    <line x1="0" y1="0" x2="840" y2="0" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5"/>

    <g transform="translate(0, 30)">
      <text x="0" y="0" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="900" letter-spacing="1">SMK NEGERI 1 SUMEDANG</text>
      <text x="0" y="24" fill="#FFE4E8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12.5" font-weight="600">Konsentrasi Keahlian Pengembangan Perangkat Lunak dan Gim (PPLG / RPL)</text>
      <text x="0" y="44" fill="#FFA6B6" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="500">Jl. Mayor Abdurakhman No. 209, Kotakaler, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45322</text>
      <text x="0" y="64" fill="#FFA6B6" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="500">Website: https://smkn1sumedang.sch.id // Email: info@smkn1sumedang.sch.id</text>
    </g>

    <!-- Barcode & Copyright -->
    <g transform="translate(620, 25)">
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="4" y="0" width="3" height="32" fill="#FFFFFF"/>
        <rect x="9" y="0" width="1" height="32" fill="#FFFFFF"/>
        <rect x="13" y="0" width="5" height="32" fill="#FFFFFF"/>
        <rect x="21" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="26" y="0" width="4" height="32" fill="#FFFFFF"/>
        <rect x="33" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="38" y="0" width="6" height="32" fill="#FFFFFF"/>
        <rect x="47" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="52" y="0" width="4" height="32" fill="#FFFFFF"/>
        <rect x="59" y="0" width="3" height="32" fill="#FFFFFF"/>
        <rect x="65" y="0" width="5" height="32" fill="#FFFFFF"/>
        <rect x="73" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="78" y="0" width="6" height="32" fill="#FFFFFF"/>
        <rect x="87" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="92" y="0" width="4" height="32" fill="#FFFFFF"/>
        <rect x="99" y="0" width="3" height="32" fill="#FFFFFF"/>
        <rect x="105" y="0" width="7" height="32" fill="#FFFFFF"/>
        <rect x="115" y="0" width="3" height="32" fill="#FFFFFF"/>
        <rect x="121" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="126" y="0" width="5" height="32" fill="#FFFFFF"/>
        <rect x="134" y="0" width="4" height="32" fill="#FFFFFF"/>
        <rect x="141" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="146" y="0" width="6" height="32" fill="#FFFFFF"/>
        <rect x="155" y="0" width="3" height="32" fill="#FFFFFF"/>
        <rect x="161" y="0" width="4" height="32" fill="#FFFFFF"/>
        <rect x="168" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="173" y="0" width="5" height="32" fill="#FFFFFF"/>
        <rect x="181" y="0" width="3" height="32" fill="#FFFFFF"/>
        <rect x="187" y="0" width="4" height="32" fill="#FFFFFF"/>
        <rect x="194" y="0" width="2" height="32" fill="#FFFFFF"/>
        <rect x="199" y="0" width="6" height="32" fill="#FFFFFF"/>
        <rect x="208" y="0" width="3" height="32" fill="#FFFFFF"/>
        <text x="0" y="46" fill="#FFFFFF" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700">INV-2026-ELYSIUM-SMK1</text>
        <text x="0" y="60" fill="#FFE4E8" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="500">© 2026 Robi Purnama &amp; Tim Elysium.</text>
      </g>
    </g>
  </g>

  <!-- ==================== 9. BOTTOM RIGHT DECORATIVE BLOCK ==================== -->
  <g id="Bottom_Decorative_Block_Back" transform="translate(860, 1630)">
    <g transform="translate(-50, 0)">
      <rect x="0" y="0" width="4.5" height="75" fill="#FFFFFF"/>
      <rect x="12" y="0" width="4.5" height="75" fill="#FFFFFF"/>
      <rect x="24" y="0" width="4.5" height="75" fill="#FFFFFF"/>
      <rect x="36" y="0" width="4.5" height="75" fill="#FFFFFF"/>
    </g>
    <rect x="0" y="0" width="380" height="75" fill="#FFFFFF"/>
    <text x="50" y="45" fill="#0A0A0E" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" letter-spacing="3">SMKN 1 SUMEDANG // PPLG</text>
  </g>
</svg>`;

// Write Files
const outDir = path.join('Project', 'figma_designs');
fs.writeFileSync(path.join(outDir, 'cover_depan_elysium_arena.svg'), frontCoverSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'cover_belakang_elysium_arena.svg'), backCoverSvg, 'utf8');

// Copy to artifact brain directory too
const brainDir = 'C:/Users/User/.gemini/antigravity/brain/19ea1ec5-1377-44c6-84ae-a3b95b3b84cb';
fs.writeFileSync(path.join(brainDir, 'cover_depan_elysium_arena.svg'), frontCoverSvg, 'utf8');
fs.writeFileSync(path.join(brainDir, 'cover_belakang_elysium_arena.svg'), backCoverSvg, 'utf8');

console.log('Successfully generated new Front & Back SVG covers matching user reference!');
