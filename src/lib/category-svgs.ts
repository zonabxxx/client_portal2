// ============================================
// Profesionálne SVG ilustrácie pre kategórie produktov
// Každé SVG: detailné vektorové ilustrácie s bézierovými krivkami
// Optimalizované pre zobrazenie v tmavom UI s currentColor
// ============================================

// ═══════════════════════════════════════════════
// POLEPY ÁUT — Dodávka s celopolepom, bočný pohľad
// ═══════════════════════════════════════════════
export const vehicleWrapSvg = `<svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tieň pod vozidlom -->
  <ellipse cx="200" cy="195" rx="160" ry="8" fill="currentColor" opacity="0.05"/>
  <ellipse cx="200" cy="195" rx="120" ry="5" fill="currentColor" opacity="0.04"/>

  <!-- ═══ PODVOZOK ═══ -->
  <path d="M42 175 L358 175" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
  <path d="M55 180 L75 175" stroke="currentColor" stroke-width="1" opacity="0.15"/>
  <path d="M130 180 L110 175" stroke="currentColor" stroke-width="1" opacity="0.15"/>
  <path d="M280 180 L300 175" stroke="currentColor" stroke-width="1" opacity="0.15"/>
  <path d="M345 180 L325 175" stroke="currentColor" stroke-width="1" opacity="0.15"/>

  <!-- ═══ KAROSÉRIA — Nákladný priestor ═══ -->
  <!-- Hlavný tvar karosérie s plynulými krivkami -->
  <path d="M32 172 L32 52 C32 38 40 28 55 25 L240 25 C248 25 252 30 252 38 L252 172"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.03" stroke-linejoin="round"/>
  <!-- Strecha — zaoblená s jemnými hranami -->
  <path d="M32 52 C32 30 50 18 72 15 L220 15 C238 15 252 22 252 38"
    stroke="currentColor" stroke-width="2.5" fill="none"/>
  <!-- Odkvap strechy -->
  <path d="M28 52 L32 52" stroke="currentColor" stroke-width="2" opacity="0.5"/>
  <path d="M252 38 L256 38" stroke="currentColor" stroke-width="2" opacity="0.5"/>

  <!-- Bočný panel — drážky/záhyby karosérie -->
  <path d="M32 145 L252 145" stroke="currentColor" stroke-width="1" opacity="0.12"/>
  <path d="M32 155 L252 155" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>

  <!-- ═══ KABÍNA (predná časť) ═══ -->
  <path d="M252 172 L252 82 C252 78 254 76 258 76 L290 76
    C300 76 310 78 318 84 L350 112 C360 120 365 132 365 142 L365 172"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.04" stroke-linejoin="round"/>

  <!-- Kapota — horná línia kabíny -->
  <path d="M252 82 C252 72 256 68 265 68 L290 68 C302 68 312 72 320 80"
    stroke="currentColor" stroke-width="1.5" opacity="0.3" fill="none"/>

  <!-- ═══ PREDNÉ OKNO (čelné sklo) — s krivkou ═══ -->
  <path d="M262 80 L262 120 C262 122 264 124 266 125 L345 158
    C348 160 350 158 350 155 L350 140 C350 132 346 124 340 118
    L318 96 C310 88 300 82 290 80 Z"
    stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.06"
    stroke-linejoin="round"/>
  <!-- Odraz na skle -->
  <path d="M268 84 C272 90 274 98 274 108" stroke="currentColor" stroke-width="1" opacity="0.08" fill="none"/>
  <path d="M280 84 C284 92 286 102 286 115" stroke="currentColor" stroke-width="0.8" opacity="0.05" fill="none"/>
  <!-- Stierač -->
  <path d="M300 110 L330 135" stroke="currentColor" stroke-width="1" opacity="0.12"/>

  <!-- Bočné okno kabíny -->
  <rect x="256" y="84" width="22" height="28" rx="3" stroke="currentColor" stroke-width="1.8" opacity="0.5"
    fill="currentColor" fill-opacity="0.04"/>
  <!-- Odraz na bočnom okne -->
  <path d="M260 88 L262 96" stroke="currentColor" stroke-width="0.6" opacity="0.06"/>

  <!-- Stĺpik B (medzi oknami) -->
  <path d="M258 116 L280 116" stroke="currentColor" stroke-width="2" opacity="0.3"/>

  <!-- ═══ DELIACA ČIARA KABÍNA / NÁKLAD ═══ -->
  <line x1="252" y1="25" x2="252" y2="175" stroke="currentColor" stroke-width="2" opacity="0.35"/>

  <!-- ═══ DVERE NÁKLADNÉHO PRIESTORU ═══ -->
  <!-- Zadné dvere -->
  <line x1="145" y1="30" x2="145" y2="170" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <!-- Predné posuvné dvere -->
  <line x1="200" y1="30" x2="200" y2="170" stroke="currentColor" stroke-width="1" opacity="0.12"/>

  <!-- Kľučky dverí -->
  <rect x="148" y="100" width="8" height="3" rx="1.5" fill="currentColor" opacity="0.2"/>
  <rect x="203" y="100" width="8" height="3" rx="1.5" fill="currentColor" opacity="0.18"/>

  <!-- ═══ POLEP — Grafická oblasť na bočnom paneli ═══ -->
  <!-- Oblasť polepu 1 (zadná časť) -->
  <rect x="42" y="38" width="98" height="95" rx="4"
    stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.15"
    fill="currentColor" fill-opacity="0.03"/>
  <!-- Logo firmy na polep -->
  <circle cx="72" cy="62" r="15" stroke="currentColor" stroke-width="1.8" opacity="0.2"/>
  <circle cx="72" cy="62" r="8" stroke="currentColor" stroke-width="1" opacity="0.12"/>
  <path d="M68 62 L72 56 L76 62 L72 68 Z" fill="currentColor" opacity="0.12"/>
  <!-- Názov firmy -->
  <line x1="95" y1="55" x2="132" y2="55" stroke="currentColor" stroke-width="3" opacity="0.18" stroke-linecap="round"/>
  <line x1="95" y1="64" x2="128" y2="64" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>
  <line x1="95" y1="72" x2="118" y2="72" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <!-- Webová adresa -->
  <line x1="50" y1="115" x2="130" y2="115" stroke="currentColor" stroke-width="1.5" opacity="0.1" stroke-linecap="round"/>
  <!-- Telefón -->
  <line x1="50" y1="124" x2="110" y2="124" stroke="currentColor" stroke-width="1.2" opacity="0.07" stroke-linecap="round"/>

  <!-- Oblasť polepu 2 (predná časť) -->
  <rect x="152" y="38" width="94" height="95" rx="4"
    stroke="currentColor" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.15"
    fill="currentColor" fill-opacity="0.03"/>
  <!-- Obrázok na polep -->
  <rect x="160" y="46" width="40" height="30" rx="3" fill="currentColor" opacity="0.06"/>
  <rect x="165" y="50" width="30" height="22" rx="2" fill="currentColor" opacity="0.04"/>
  <!-- Text pod obrázkom -->
  <line x1="160" y1="86" x2="238" y2="86" stroke="currentColor" stroke-width="2.5" opacity="0.12" stroke-linecap="round"/>
  <line x1="160" y1="96" x2="228" y2="96" stroke="currentColor" stroke-width="1.8" opacity="0.08" stroke-linecap="round"/>
  <line x1="160" y1="105" x2="215" y2="105" stroke="currentColor" stroke-width="1.2" opacity="0.06" stroke-linecap="round"/>

  <!-- ═══ PREDNÝ NÁRAZNÍK ═══ -->
  <path d="M365 150 L375 150 C380 150 384 154 384 158 L384 175 L365 175"
    stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
  <!-- Mriežka chladiča -->
  <rect x="368" y="152" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.2" opacity="0.3"/>
  <line x1="372" y1="152" x2="372" y2="160" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
  <line x1="376" y1="152" x2="376" y2="160" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>

  <!-- ZADNÝ NÁRAZNÍK -->
  <path d="M32 168 L22 168 C18 168 15 164 15 160 L15 155 C15 152 17 150 20 150 L32 150"
    stroke="currentColor" stroke-width="2" opacity="0.4"/>

  <!-- ═══ SVETLÁ ═══ -->
  <!-- Predné svetlo -->
  <path d="M370 135 L380 135 L382 142 L370 145 Z" fill="currentColor" opacity="0.3"/>
  <path d="M372 137 L378 137 L379 141 L372 143 Z" fill="currentColor" opacity="0.15"/>
  <!-- Smerovka predná -->
  <rect x="370" y="147" width="8" height="3" rx="1" fill="currentColor" opacity="0.2"/>
  <!-- Zadné svetlo -->
  <rect x="24" y="138" width="7" height="14" rx="2" fill="currentColor" opacity="0.25"/>
  <rect x="26" y="140" width="3" height="5" rx="1" fill="currentColor" opacity="0.12"/>
  <rect x="26" y="147" width="3" height="3" rx="1" fill="currentColor" opacity="0.1"/>

  <!-- ═══ SPÄTNÉ ZRKADLO ═══ -->
  <path d="M252 72 L242 64 C240 62 238 62 238 64 L238 72 C238 74 240 76 242 76 L252 76"
    stroke="currentColor" stroke-width="1.5" opacity="0.4" fill="currentColor" fill-opacity="0.04"/>

  <!-- ═══ KOLESÁ — detailné s ráfikmi ═══ -->
  <!-- Zadné koleso -->
  <circle cx="98" cy="180" r="24" stroke="currentColor" stroke-width="2.5"/>
  <circle cx="98" cy="180" r="20" stroke="currentColor" stroke-width="1" opacity="0.25"/>
  <circle cx="98" cy="180" r="15" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
  <circle cx="98" cy="180" r="9" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
  <circle cx="98" cy="180" r="3" fill="currentColor" opacity="0.4"/>
  <!-- Špice ráfika — zadné -->
  <line x1="98" y1="162" x2="98" y2="171" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="98" y1="189" x2="98" y2="198" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="80" y1="180" x2="89" y2="180" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="107" y1="180" x2="116" y2="180" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="85" y1="167" x2="91" y2="173" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="105" y1="187" x2="111" y2="193" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="85" y1="193" x2="91" y2="187" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="105" y1="167" x2="111" y2="173" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <!-- Pneumatika profil -->
  <circle cx="98" cy="180" r="22" stroke="currentColor" stroke-width="0.5" opacity="0.1" stroke-dasharray="3 3"/>

  <!-- Predné koleso -->
  <circle cx="320" cy="180" r="24" stroke="currentColor" stroke-width="2.5"/>
  <circle cx="320" cy="180" r="20" stroke="currentColor" stroke-width="1" opacity="0.25"/>
  <circle cx="320" cy="180" r="15" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
  <circle cx="320" cy="180" r="9" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
  <circle cx="320" cy="180" r="3" fill="currentColor" opacity="0.4"/>
  <!-- Špice ráfika — predné -->
  <line x1="320" y1="162" x2="320" y2="171" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="320" y1="189" x2="320" y2="198" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="302" y1="180" x2="311" y2="180" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="329" y1="180" x2="338" y2="180" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="307" y1="167" x2="313" y2="173" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="327" y1="187" x2="333" y2="193" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="307" y1="193" x2="313" y2="187" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="327" y1="167" x2="333" y2="173" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <circle cx="320" cy="180" r="22" stroke="currentColor" stroke-width="0.5" opacity="0.1" stroke-dasharray="3 3"/>

  <!-- ═══ BLATNÍKY ═══ -->
  <path d="M70 175 C70 160 82 150 98 150 C114 150 126 160 126 175"
    stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
  <path d="M292 175 C292 160 304 150 320 150 C336 150 348 160 348 175"
    stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>

  <!-- ═══ DETAILY ═══ -->
  <!-- Prah dverí -->
  <path d="M32 170 L252 170" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <!-- Odkvapová lišta -->
  <path d="M30 22 L252 22" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <!-- ŠPZ vzadu -->
  <rect x="60" y="152" width="26" height="12" rx="2" stroke="currentColor" stroke-width="1.2" opacity="0.2"/>
  <line x1="65" y1="158" x2="81" y2="158" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>
</svg>`;


// ═══════════════════════════════════════════════
// TLAČOVÉ PRODUKTY — Vizitky, kniha, leták, brožúra
// ═══════════════════════════════════════════════
export const printProductsSvg = `<svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tieň pod objektmi -->
  <ellipse cx="200" cy="248" rx="150" ry="8" fill="currentColor" opacity="0.04"/>

  <!-- ═══ KNIHA (vzadu naľavo, stojí šikmo) ═══ -->
  <!-- Predný obal -->
  <path d="M22 25 L118 18 L118 175 L22 182 Z"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05"/>
  <!-- Chrbát knihy -->
  <path d="M22 25 L10 28 L10 185 L22 182 Z"
    stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.08"/>
  <!-- Hrúbka strán -->
  <path d="M10 28 L10 185" stroke="currentColor" stroke-width="2.5" opacity="0.4"/>
  <line x1="12" y1="30" x2="12" y2="183" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>
  <line x1="14" y1="30" x2="14" y2="183" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <line x1="16" y1="29" x2="16" y2="183" stroke="currentColor" stroke-width="0.5" opacity="0.06"/>
  <line x1="18" y1="28" x2="18" y2="183" stroke="currentColor" stroke-width="0.5" opacity="0.04"/>
  <!-- Titulok na obálke -->
  <line x1="38" y1="50" x2="102" y2="46" stroke="currentColor" stroke-width="3.5" opacity="0.2" stroke-linecap="round"/>
  <line x1="38" y1="62" x2="95" y2="58" stroke="currentColor" stroke-width="2.5" opacity="0.12" stroke-linecap="round"/>
  <!-- Obrázok na obálke -->
  <rect x="35" y="78" width="68" height="48" rx="3" fill="currentColor" opacity="0.06"
    transform="rotate(-0.5 69 102)"/>
  <rect x="40" y="83" width="58" height="38" rx="2" fill="currentColor" opacity="0.04"/>
  <!-- Autor -->
  <line x1="38" y1="142" x2="85" y2="139" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>
  <line x1="38" y1="154" x2="72" y2="152" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <!-- ISBN čiarový kód dole -->
  <rect x="68" y="162" width="35" height="12" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.12"/>
  <line x1="71" y1="164" x2="71" y2="172" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <line x1="74" y1="164" x2="74" y2="172" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <line x1="77" y1="164" x2="77" y2="172" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <line x1="79" y1="164" x2="79" y2="172" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <line x1="82" y1="164" x2="82" y2="172" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <line x1="85" y1="164" x2="85" y2="172" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <line x1="88" y1="164" x2="88" y2="172" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <line x1="91" y1="164" x2="91" y2="172" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <line x1="94" y1="164" x2="94" y2="172" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>
  <line x1="97" y1="164" x2="97" y2="172" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <line x1="100" y1="164" x2="100" y2="172" stroke="currentColor" stroke-width="0.5" opacity="0.08"/>

  <!-- ═══ OTVORENÁ BROŽÚRA/KATALÓG (stred) ═══ -->
  <!-- Ľavá strana -->
  <path d="M130 42 C130 38 134 36 138 38 L220 32 L220 195 L138 202 C134 203 130 200 130 196 Z"
    stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.04"/>
  <!-- Pravá strana -->
  <path d="M220 32 L310 42 C314 43 316 46 316 50 L316 200 C316 204 313 205 310 204 L220 195 Z"
    stroke="currentColor" stroke-width="2" fill="currentColor" fill-opacity="0.03"/>
  <!-- Chrbát (stredný ohyb) -->
  <path d="M220 32 L220 195" stroke="currentColor" stroke-width="2.5" opacity="0.4"/>
  <!-- Tieň v ohybe -->
  <path d="M218 35 L218 192" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <path d="M222 35 L222 192" stroke="currentColor" stroke-width="1" opacity="0.08"/>

  <!-- Obsah ľavej strany -->
  <!-- Nadpis -->
  <line x1="142" y1="55" x2="208" y2="48" stroke="currentColor" stroke-width="3" opacity="0.18" stroke-linecap="round"/>
  <line x1="142" y1="66" x2="200" y2="60" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>
  <!-- Obrázok -->
  <rect x="142" y="80" width="65" height="42" rx="3" fill="currentColor" opacity="0.06"/>
  <!-- Text pod obrázkom -->
  <line x1="142" y1="132" x2="210" y2="128" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <line x1="142" y1="142" x2="205" y2="138" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="142" y1="152" x2="198" y2="148" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="142" y1="162" x2="190" y2="158" stroke="currentColor" stroke-width="1.5" opacity="0.05" stroke-linecap="round"/>
  <!-- Číslo strany -->
  <line x1="175" y1="185" x2="185" y2="184" stroke="currentColor" stroke-width="1" opacity="0.08"/>

  <!-- Obsah pravej strany -->
  <!-- Nadpis -->
  <line x1="232" y1="50" x2="305" y2="55" stroke="currentColor" stroke-width="3" opacity="0.18" stroke-linecap="round"/>
  <!-- Text stĺpce -->
  <line x1="232" y1="68" x2="270" y2="70" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <line x1="232" y1="78" x2="268" y2="80" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="232" y1="88" x2="265" y2="90" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="232" y1="98" x2="260" y2="100" stroke="currentColor" stroke-width="1.5" opacity="0.05" stroke-linecap="round"/>
  <!-- Obrázok vpravo -->
  <rect x="275" y="68" width="30" height="35" rx="2" fill="currentColor" opacity="0.05"/>
  <!-- Tabuľka dole -->
  <rect x="232" y="115" width="75" height="55" rx="2" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="232" y1="130" x2="307" y2="130" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <line x1="232" y1="145" x2="307" y2="145" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <line x1="232" y1="155" x2="307" y2="155" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <line x1="260" y1="115" x2="260" y2="170" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <line x1="285" y1="115" x2="285" y2="170" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>

  <!-- ═══ LETÁK / FLYER (vpredu, prekrývajúci) ═══ -->
  <path d="M250 130 L360 125 L365 245 L255 250 Z"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05"/>
  <!-- Fotka na letáku -->
  <rect x="262" y="138" width="82" height="42" rx="3" fill="currentColor" opacity="0.07"
    transform="rotate(-0.5 303 159)"/>
  <!-- Veľký headline -->
  <line x1="262" y1="192" x2="348" y2="190" stroke="currentColor" stroke-width="3.5" opacity="0.18" stroke-linecap="round"/>
  <line x1="262" y1="205" x2="335" y2="203" stroke="currentColor" stroke-width="2.5" opacity="0.1" stroke-linecap="round"/>
  <!-- Body text -->
  <line x1="262" y1="218" x2="350" y2="216" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="262" y1="226" x2="342" y2="224" stroke="currentColor" stroke-width="1.5" opacity="0.05" stroke-linecap="round"/>
  <!-- CTA button -->
  <rect x="285" y="233" width="55" height="14" rx="7" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
  <line x1="296" y1="240" x2="329" y2="240" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>

  <!-- ═══ VIZITKY (dole naľavo, rozhodené) ═══ -->
  <!-- Vizitka 1 (spodná) -->
  <rect x="20" y="198" width="110" height="55" rx="4" stroke="currentColor" stroke-width="2"
    fill="currentColor" fill-opacity="0.05" transform="rotate(-8 75 225)"/>
  <!-- Logo na vizitke 1 -->
  <circle cx="48" cy="218" r="8" stroke="currentColor" stroke-width="1.5" opacity="0.2" transform="rotate(-8 48 218)"/>
  <circle cx="48" cy="218" r="3" fill="currentColor" opacity="0.1" transform="rotate(-8 48 218)"/>
  <!-- Text vizitky 1 -->
  <line x1="64" y1="212" x2="112" y2="208" stroke="currentColor" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
  <line x1="64" y1="222" x2="105" y2="218" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <line x1="64" y1="230" x2="98" y2="227" stroke="currentColor" stroke-width="1.2" opacity="0.06" stroke-linecap="round"/>

  <!-- Vizitka 2 (horná, natočená) -->
  <rect x="60" y="190" width="110" height="55" rx="4" stroke="currentColor" stroke-width="2"
    fill="currentColor" fill-opacity="0.04" transform="rotate(5 115 218)"/>
  <!-- Logo na vizitke 2 -->
  <rect x="72" y="200" width="16" height="16" rx="3" fill="currentColor" opacity="0.08" transform="rotate(5 80 208)"/>
  <!-- Text vizitky 2 -->
  <line x1="95" y1="204" x2="158" y2="208" stroke="currentColor" stroke-width="2.5" opacity="0.12" stroke-linecap="round"/>
  <line x1="95" y1="214" x2="148" y2="217" stroke="currentColor" stroke-width="1.5" opacity="0.07" stroke-linecap="round"/>
  <line x1="95" y1="224" x2="140" y2="226" stroke="currentColor" stroke-width="1.2" opacity="0.05" stroke-linecap="round"/>
  <!-- Email/web na vizitke -->
  <line x1="72" y1="238" x2="152" y2="241" stroke="currentColor" stroke-width="1" opacity="0.06" stroke-linecap="round"/>
</svg>`;


// ═══════════════════════════════════════════════
// SVETELNÁ REKLAMA — 3D kazetové písmená na budove
// ═══════════════════════════════════════════════
export const illuminatedSignSvg = `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- ═══ BUDOVA / FASÁDA ═══ -->
  <rect x="10" y="5" width="380" height="230" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.15"
    fill="currentColor" fill-opacity="0.015"/>
  <!-- Textúra steny — tehlový vzor -->
  <line x1="10" y1="50" x2="390" y2="50" stroke="currentColor" stroke-width="0.3" opacity="0.04"/>
  <line x1="10" y1="95" x2="390" y2="95" stroke="currentColor" stroke-width="0.3" opacity="0.04"/>
  <line x1="10" y1="140" x2="390" y2="140" stroke="currentColor" stroke-width="0.3" opacity="0.04"/>
  <line x1="10" y1="185" x2="390" y2="185" stroke="currentColor" stroke-width="0.3" opacity="0.04"/>
  <!-- Vertikálne tehly (vybrané) -->
  <line x1="60" y1="5" x2="60" y2="50" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="130" y1="5" x2="130" y2="50" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="200" y1="5" x2="200" y2="50" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="270" y1="5" x2="270" y2="50" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="340" y1="5" x2="340" y2="50" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="95" y1="50" x2="95" y2="95" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="165" y1="50" x2="165" y2="95" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="235" y1="50" x2="235" y2="95" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>
  <line x1="305" y1="50" x2="305" y2="95" stroke="currentColor" stroke-width="0.3" opacity="0.02"/>

  <!-- ═══ GLOW EFEKT za písmenami ═══ -->
  <ellipse cx="200" cy="58" rx="140" ry="40" fill="currentColor" opacity="0.04"/>
  <ellipse cx="200" cy="58" rx="100" ry="28" fill="currentColor" opacity="0.03"/>
  <ellipse cx="200" cy="58" rx="60" ry="18" fill="currentColor" opacity="0.02"/>

  <!-- ═══ SVETELNÝ BOX — rám ═══ -->
  <rect x="40" y="20" width="320" height="72" rx="5" stroke="currentColor" stroke-width="3"
    fill="currentColor" fill-opacity="0.04"/>
  <!-- Vnútorný rám -->
  <rect x="48" y="28" width="304" height="56" rx="3" stroke="currentColor" stroke-width="1" opacity="0.15"/>

  <!-- ═══ 3D KAZETOVÉ PÍSMENÁ (ADSUN) ═══ -->
  <!-- Písmeno A — s 3D efektom -->
  <!-- 3D bočná strana -->
  <path d="M72 78 L70 80 L86 80 L88 78" fill="currentColor" opacity="0.08"/>
  <path d="M72 78 L70 80 L60 80 L62 78" fill="currentColor" opacity="0.06"/>
  <!-- Hlavný tvar -->
  <path d="M62 78 L78 32 L88 32 L104 78" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="68" y1="62" x2="98" y2="62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <!-- Vnútorný obrys (hĺbka) -->
  <path d="M66 75 L80 36 L86 36 L100 75" stroke="currentColor" stroke-width="1" opacity="0.15" fill="none"/>
  <line x1="72" y1="60" x2="94" y2="60" stroke="currentColor" stroke-width="1" opacity="0.1"/>

  <!-- Písmeno D -->
  <path d="M118 80 L116 82 L116 80" fill="currentColor" opacity="0.06"/>
  <line x1="118" y1="32" x2="118" y2="78" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M118 32 C120 32 135 32 145 38 C155 44 158 55 155 62 C152 72 142 78 130 78 L118 78"
    stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Vnútorný D -->
  <line x1="122" y1="36" x2="122" y2="74" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <path d="M122 36 C130 36 140 40 146 48 C150 54 150 64 144 70 C138 76 128 76 122 74"
    stroke="currentColor" stroke-width="1" opacity="0.1" fill="none"/>

  <!-- Písmeno S -->
  <path d="M190 38 C182 34 172 34 168 40 C164 46 170 52 178 54
    C186 56 194 60 194 68 C194 76 186 82 176 80 C170 78 166 74 166 74"
    stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- Vnútorné S -->
  <path d="M186 40 C180 38 174 38 172 42 C170 46 174 50 180 52
    C186 54 190 58 190 64 C190 72 184 76 178 76"
    stroke="currentColor" stroke-width="1" opacity="0.1" fill="none"/>

  <!-- Písmeno U -->
  <path d="M212 32 L212 62 C212 74 220 82 232 82 C244 82 252 74 252 62 L252 32"
    stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- Vnútorné U -->
  <path d="M216 36 L216 62 C216 70 222 76 232 76 C242 76 248 70 248 62 L248 36"
    stroke="currentColor" stroke-width="1" opacity="0.1" fill="none"/>

  <!-- Písmeno N -->
  <line x1="270" y1="78" x2="270" y2="32" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M270 32 L270 35 L305 75 L305 78" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="305" y1="78" x2="305" y2="32" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Vnútorné N -->
  <line x1="274" y1="74" x2="274" y2="36" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <line x1="301" y1="74" x2="301" y2="36" stroke="currentColor" stroke-width="1" opacity="0.1"/>

  <!-- ═══ MONTÁŽNE BODY ═══ -->
  <circle cx="52" cy="25" r="2.5" fill="currentColor" opacity="0.15"/>
  <circle cx="348" cy="25" r="2.5" fill="currentColor" opacity="0.15"/>
  <circle cx="52" cy="87" r="2.5" fill="currentColor" opacity="0.15"/>
  <circle cx="348" cy="87" r="2.5" fill="currentColor" opacity="0.15"/>

  <!-- ═══ LÚČE SVETLA NADOL ═══ -->
  <path d="M70 92 L60 130" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <path d="M85 92 L82 135" stroke="currentColor" stroke-width="0.8" opacity="0.07"/>
  <path d="M120 92 L120 140" stroke="currentColor" stroke-width="0.8" opacity="0.07"/>
  <path d="M180 92 L180 145" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <path d="M232 92 L232 145" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <path d="M290 92 L290 140" stroke="currentColor" stroke-width="0.8" opacity="0.07"/>
  <path d="M330 92 L340 130" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>

  <!-- ═══ KÁBLE ═══ -->
  <path d="M40 92 L32 100 C28 105 28 110 28 118 L28 160" stroke="currentColor" stroke-width="1.2" opacity="0.12" fill="none"/>
  <path d="M360 92 L368 100 C372 105 372 110 372 118 L372 160" stroke="currentColor" stroke-width="1.2" opacity="0.12" fill="none"/>

  <!-- ═══ DVERE BUDOVY ═══ -->
  <rect x="160" y="155" width="80" height="80" rx="3" stroke="currentColor" stroke-width="2" opacity="0.2"/>
  <!-- Dvojkrídlové dvere -->
  <line x1="200" y1="155" x2="200" y2="235" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
  <!-- Sklo v dverách -->
  <rect x="165" y="160" width="30" height="40" rx="2" stroke="currentColor" stroke-width="1" opacity="0.1"
    fill="currentColor" fill-opacity="0.02"/>
  <rect x="205" y="160" width="30" height="40" rx="2" stroke="currentColor" stroke-width="1" opacity="0.1"
    fill="currentColor" fill-opacity="0.02"/>
  <!-- Kľučky -->
  <circle cx="192" cy="200" r="2.5" fill="currentColor" opacity="0.15"/>
  <circle cx="208" cy="200" r="2.5" fill="currentColor" opacity="0.15"/>
  <!-- Prah -->
  <line x1="155" y1="235" x2="245" y2="235" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>

  <!-- ═══ OKNÁ BUDOVY ═══ -->
  <rect x="40" y="155" width="55" height="45" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
  <line x1="67" y1="155" x2="67" y2="200" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <line x1="40" y1="178" x2="95" y2="178" stroke="currentColor" stroke-width="1" opacity="0.08"/>

  <rect x="305" y="155" width="55" height="45" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
  <line x1="332" y1="155" x2="332" y2="200" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <line x1="305" y1="178" x2="360" y2="178" stroke="currentColor" stroke-width="1" opacity="0.08"/>

  <!-- ═══ SVETELNÁ VÝSTRČKA NA BOKU ═══ -->
  <!-- Konzola -->
  <path d="M390 45 L390 75" stroke="currentColor" stroke-width="2.5" opacity="0.4"/>
  <path d="M390 45 L390 42 L400 42" stroke="currentColor" stroke-width="2" opacity="0.35"/>
  <!-- Výstrčka — kruhová s logom -->
  <circle cx="400" cy="60" r="18" stroke="currentColor" stroke-width="2.5" opacity="0.5"/>
  <circle cx="400" cy="60" r="12" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <circle cx="400" cy="60" r="5" fill="currentColor" opacity="0.15"/>
</svg>`;


// ═══════════════════════════════════════════════
// POLEP OKIEN A STIEN — Výklad obchodu s fóliou
// ═══════════════════════════════════════════════
export const windowWrapSvg = `<svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Zem / chodník -->
  <line x1="0" y1="232" x2="400" y2="232" stroke="currentColor" stroke-width="1.5" opacity="0.12"/>
  <rect x="0" y="232" width="400" height="8" fill="currentColor" opacity="0.02"/>

  <!-- ═══ BUDOVA — FASÁDA ═══ -->
  <rect x="20" y="8" width="360" height="224" rx="3" stroke="currentColor" stroke-width="2"
    fill="currentColor" fill-opacity="0.015"/>

  <!-- Atika / parapet -->
  <rect x="15" y="5" width="370" height="12" rx="2" stroke="currentColor" stroke-width="2" opacity="0.4"
    fill="currentColor" fill-opacity="0.03"/>

  <!-- ═══ NÁPIS OBCHODU ═══ -->
  <rect x="110" y="22" width="180" height="22" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
  <line x1="130" y1="33" x2="270" y2="33" stroke="currentColor" stroke-width="3.5" opacity="0.2" stroke-linecap="round"/>

  <!-- ═══ MARKÍZA ═══ -->
  <path d="M30 52 L370 52 L378 68 L22 68 Z"
    stroke="currentColor" stroke-width="1.5" opacity="0.35" fill="currentColor" fill-opacity="0.04"/>
  <!-- Záhyby markízy -->
  <path d="M80 52 L76 68" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
  <path d="M140 52 L136 68" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
  <path d="M200 52 L196 68" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
  <path d="M260 52 L256 68" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
  <path d="M320 52 L316 68" stroke="currentColor" stroke-width="0.8" opacity="0.1"/>
  <!-- Vlnka markízy -->
  <path d="M22 68 C40 72 58 68 76 72 C94 76 112 68 130 72 C148 76 166 68 184 72
    C202 76 220 68 238 72 C256 76 274 68 292 72 C310 76 328 68 346 72 C364 76 374 70 378 68"
    stroke="currentColor" stroke-width="1" opacity="0.15" fill="none"/>

  <!-- ═══ ĽAVÉ VÝKLADNÉ OKNO ═══ -->
  <rect x="32" y="78" width="140" height="110" rx="3" stroke="currentColor" stroke-width="2.5"/>
  <!-- Rám okna — dvojitý -->
  <rect x="36" y="82" width="132" height="102" rx="2" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <!-- Výplň — fólia na okne -->
  <rect x="38" y="84" width="128" height="98" rx="1" fill="currentColor" opacity="0.06"/>

  <!-- Grafika polepu na ľavom okne -->
  <!-- Logo firmy -->
  <circle cx="68" cy="115" r="18" stroke="currentColor" stroke-width="2" opacity="0.3"/>
  <circle cx="68" cy="115" r="10" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <path d="M62 115 L68 105 L74 115 L68 125 Z" fill="currentColor" opacity="0.12"/>
  <!-- Názov firmy -->
  <line x1="94" y1="108" x2="155" y2="108" stroke="currentColor" stroke-width="3" opacity="0.2" stroke-linecap="round"/>
  <line x1="94" y1="118" x2="148" y2="118" stroke="currentColor" stroke-width="2" opacity="0.12" stroke-linecap="round"/>
  <line x1="94" y1="126" x2="135" y2="126" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <!-- Akciový popis -->
  <rect x="48" y="145" width="55" height="22" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.2"
    fill="currentColor" fill-opacity="0.04"/>
  <line x1="55" y1="156" x2="96" y2="156" stroke="currentColor" stroke-width="2" opacity="0.12"/>
  <!-- Otváracie hodiny -->
  <line x1="48" y1="172" x2="110" y2="172" stroke="currentColor" stroke-width="1" opacity="0.06"/>

  <!-- Odraz na skle ľavom -->
  <path d="M40 86 L55 105" stroke="currentColor" stroke-width="0.8" opacity="0.06" fill="none"/>
  <path d="M46 86 L58 100" stroke="currentColor" stroke-width="0.5" opacity="0.04" fill="none"/>

  <!-- ═══ DVERE (stred) ═══ -->
  <rect x="180" y="78" width="45" height="154" rx="3" stroke="currentColor" stroke-width="2.5"/>
  <!-- Sklo dverí (horná časť) -->
  <rect x="185" y="83" width="35" height="65" rx="2" stroke="currentColor" stroke-width="1.2" opacity="0.3"
    fill="currentColor" fill-opacity="0.03"/>
  <!-- Odraz na skle dverí -->
  <path d="M188 86 L195 100" stroke="currentColor" stroke-width="0.6" opacity="0.05"/>
  <!-- Kľučka -->
  <rect x="210" y="165" width="4" height="14" rx="2" fill="currentColor" opacity="0.3"/>
  <!-- Prah dverí -->
  <line x1="180" y1="228" x2="225" y2="228" stroke="currentColor" stroke-width="2" opacity="0.15"/>
  <!-- "OPEN" / "OTVORENÉ" ceduľka -->
  <rect x="192" y="115" width="22" height="10" rx="2" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
  <line x1="196" y1="120" x2="210" y2="120" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <!-- Push bar -->
  <line x1="190" y1="195" x2="215" y2="195" stroke="currentColor" stroke-width="1.5" opacity="0.12"/>

  <!-- ═══ PRAVÉ VÝKLADNÉ OKNO ═══ -->
  <rect x="233" y="78" width="140" height="110" rx="3" stroke="currentColor" stroke-width="2.5"/>
  <rect x="237" y="82" width="132" height="102" rx="2" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <rect x="239" y="84" width="128" height="98" rx="1" fill="currentColor" opacity="0.06"/>

  <!-- Grafika polepu na pravom okne -->
  <!-- Produktová fotka -->
  <rect x="248" y="92" width="50" height="38" rx="3" fill="currentColor" opacity="0.08"/>
  <rect x="252" y="96" width="42" height="30" rx="2" fill="currentColor" opacity="0.04"/>
  <!-- Popis produktu -->
  <line x1="308" y1="96" x2="358" y2="96" stroke="currentColor" stroke-width="2.5" opacity="0.18" stroke-linecap="round"/>
  <line x1="308" y1="106" x2="352" y2="106" stroke="currentColor" stroke-width="1.8" opacity="0.1" stroke-linecap="round"/>
  <line x1="308" y1="114" x2="342" y2="114" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <line x1="308" y1="122" x2="335" y2="122" stroke="currentColor" stroke-width="1" opacity="0.06" stroke-linecap="round"/>
  <!-- Cena -->
  <rect x="248" y="140" width="40" height="18" rx="2" stroke="currentColor" stroke-width="1.5" opacity="0.2"
    fill="currentColor" fill-opacity="0.05"/>
  <line x1="255" y1="149" x2="281" y2="149" stroke="currentColor" stroke-width="2.5" opacity="0.15"/>
  <!-- QR kód -->
  <rect x="330" y="142" width="28" height="28" rx="2" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <rect x="334" y="146" width="8" height="8" rx="1" fill="currentColor" opacity="0.08"/>
  <rect x="346" y="146" width="8" height="8" rx="1" fill="currentColor" opacity="0.08"/>
  <rect x="334" y="158" width="8" height="8" rx="1" fill="currentColor" opacity="0.08"/>
  <rect x="346" y="158" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.06"/>
  <rect x="350" y="162" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.06"/>

  <!-- Odraz na skle pravom -->
  <path d="M242 86 L256 104" stroke="currentColor" stroke-width="0.8" opacity="0.06" fill="none"/>

  <!-- ═══ FASÁDA — dekoratívne prvky ═══ -->
  <!-- Muriva pod oknami -->
  <rect x="32" y="192" width="140" height="36" rx="1" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <rect x="233" y="192" width="140" height="36" rx="1" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <!-- Ventilačná mriežka -->
  <rect x="58" y="200" width="30" height="8" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.08"/>
  <line x1="62" y1="200" x2="62" y2="208" stroke="currentColor" stroke-width="0.5" opacity="0.05"/>
  <line x1="68" y1="200" x2="68" y2="208" stroke="currentColor" stroke-width="0.5" opacity="0.05"/>
  <line x1="74" y1="200" x2="74" y2="208" stroke="currentColor" stroke-width="0.5" opacity="0.05"/>
  <line x1="80" y1="200" x2="80" y2="208" stroke="currentColor" stroke-width="0.5" opacity="0.05"/>
</svg>`;


// ═══════════════════════════════════════════════
// VEĽKOFORMÁTOVÁ TLAČ — Roll-up banner + veľký plagát + rolka
// ═══════════════════════════════════════════════
export const largeFormatSvg = `<svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tieň -->
  <ellipse cx="200" cy="268" rx="160" ry="8" fill="currentColor" opacity="0.04"/>

  <!-- ═══ ROLL-UP BANNER (hlavný prvok, naľavo) ═══ -->
  <!-- Základňa roll-upu -->
  <rect x="35" y="248" width="110" height="12" rx="3" stroke="currentColor" stroke-width="2.5"
    fill="currentColor" fill-opacity="0.06"/>
  <!-- Drážky na základni -->
  <line x1="50" y1="254" x2="130" y2="254" stroke="currentColor" stroke-width="1" opacity="0.1"/>

  <!-- Teleskopická tyč -->
  <line x1="90" y1="248" x2="90" y2="15" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
  <!-- Spoj tyče -->
  <circle cx="90" cy="130" r="3" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>

  <!-- Háčik/koncovka hore -->
  <path d="M86 15 L90 8 L94 15" stroke="currentColor" stroke-width="2" opacity="0.3"/>

  <!-- Plátno banneru -->
  <rect x="42" y="12" width="96" height="236" rx="3"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.04"/>

  <!-- Obsah banneru — fotka hore -->
  <rect x="52" y="25" width="76" height="55" rx="4" fill="currentColor" opacity="0.08"/>
  <rect x="56" y="29" width="68" height="47" rx="3" fill="currentColor" fill-opacity="0.03"/>

  <!-- Hlavný headline -->
  <line x1="52" y1="95" x2="128" y2="95" stroke="currentColor" stroke-width="4" opacity="0.2" stroke-linecap="round"/>
  <line x1="52" y1="108" x2="122" y2="108" stroke="currentColor" stroke-width="3" opacity="0.12" stroke-linecap="round"/>

  <!-- Oddeľovač -->
  <line x1="70" y1="122" x2="110" y2="122" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>

  <!-- Body text -->
  <line x1="52" y1="136" x2="128" y2="136" stroke="currentColor" stroke-width="1.5" opacity="0.07" stroke-linecap="round"/>
  <line x1="52" y1="146" x2="124" y2="146" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="52" y1="156" x2="118" y2="156" stroke="currentColor" stroke-width="1.5" opacity="0.05" stroke-linecap="round"/>
  <line x1="52" y1="166" x2="125" y2="166" stroke="currentColor" stroke-width="1.5" opacity="0.05" stroke-linecap="round"/>
  <line x1="52" y1="176" x2="110" y2="176" stroke="currentColor" stroke-width="1.5" opacity="0.04" stroke-linecap="round"/>

  <!-- Logo dole na banneri -->
  <circle cx="90" cy="210" r="15" stroke="currentColor" stroke-width="2" opacity="0.15"/>
  <circle cx="90" cy="210" r="7" stroke="currentColor" stroke-width="1" opacity="0.08"/>

  <!-- Kontakt -->
  <line x1="60" y1="232" x2="120" y2="232" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>

  <!-- Nožičky -->
  <line x1="40" y1="260" x2="30" y2="270" stroke="currentColor" stroke-width="2" opacity="0.2"/>
  <line x1="140" y1="260" x2="150" y2="270" stroke="currentColor" stroke-width="2" opacity="0.2"/>

  <!-- ═══ VEĽKÝ PLAGÁT (vzadu vpravo, naklopený) ═══ -->
  <rect x="185" y="20" width="140" height="200" rx="3"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.03"
    transform="rotate(4 255 120)"/>

  <!-- Obsah plagátu -->
  <!-- Hero obrázok -->
  <rect x="198" y="35" width="114" height="72" rx="4" fill="currentColor" opacity="0.06"
    transform="rotate(4 255 71)"/>
  <!-- Hlavný text -->
  <line x1="198" y1="120" x2="310" y2="124" stroke="currentColor" stroke-width="4" opacity="0.15" stroke-linecap="round"/>
  <line x1="198" y1="135" x2="295" y2="138" stroke="currentColor" stroke-width="3" opacity="0.1" stroke-linecap="round"/>
  <!-- Podtext -->
  <line x1="198" y1="155" x2="310" y2="158" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="198" y1="165" x2="300" y2="168" stroke="currentColor" stroke-width="1.5" opacity="0.05" stroke-linecap="round"/>
  <line x1="198" y1="175" x2="285" y2="178" stroke="currentColor" stroke-width="1.5" opacity="0.05" stroke-linecap="round"/>
  <!-- CTA -->
  <rect x="220" y="190" width="70" height="18" rx="9" stroke="currentColor" stroke-width="1.5" opacity="0.12"
    transform="rotate(4 255 199)"/>

  <!-- ═══ ROLKA MÉDIA (dole vpravo) ═══ -->
  <!-- Rolka z boku (elipsa) -->
  <ellipse cx="340" cy="245" rx="40" ry="18" stroke="currentColor" stroke-width="2" opacity="0.3"
    fill="currentColor" fill-opacity="0.03"/>
  <ellipse cx="340" cy="245" rx="25" ry="11" stroke="currentColor" stroke-width="1.5" opacity="0.18"/>
  <ellipse cx="340" cy="245" rx="12" ry="5" stroke="currentColor" stroke-width="1.2" opacity="0.12"/>
  <ellipse cx="340" cy="245" rx="4" ry="2" fill="currentColor" opacity="0.15"/>
  <!-- Papier vychádzajúci z rolky -->
  <path d="M300 245 C295 240 290 230 290 218 L290 180"
    stroke="currentColor" stroke-width="1.5" opacity="0.12" fill="none"/>
  <!-- Tieň pod rolkou -->
  <ellipse cx="340" cy="265" rx="35" ry="4" fill="currentColor" opacity="0.04"/>
</svg>`;


// ═══════════════════════════════════════════════
// OBLEČENIE — Tričko na vešiaku s potlačou
// ═══════════════════════════════════════════════
export const clothingSvg = `<svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- ═══ VEŠIAK ═══ -->
  <!-- Háčik -->
  <path d="M200 4 C200 0 204 0 204 4 L204 14 C204 18 200 18 200 14 Z"
    stroke="currentColor" stroke-width="2" opacity="0.3" fill="currentColor" fill-opacity="0.05"/>
  <circle cx="202" cy="4" r="5" stroke="currentColor" stroke-width="2" opacity="0.25"/>
  <!-- Tyčka vešiaka -->
  <line x1="202" y1="18" x2="202" y2="32" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
  <!-- Ramená vešiaka -->
  <path d="M105 68 L202 32 L300 68"
    stroke="currentColor" stroke-width="3" opacity="0.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ═══ TRIČKO — HLAVNÝ TVAR ═══ -->
  <!-- Ľavý rukáv -->
  <path d="M105 68 L55 95 C48 99 42 108 40 118 L38 130
    C38 134 40 136 44 135 L72 128 C76 127 80 124 82 120
    L95 92 L115 80"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.03"
    stroke-linejoin="round"/>
  <!-- Záhyb na ľavom rukáve -->
  <path d="M65 110 C68 108 72 112 70 116" stroke="currentColor" stroke-width="0.8" opacity="0.06" fill="none"/>
  <path d="M55 118 C58 115 62 118 60 122" stroke="currentColor" stroke-width="0.6" opacity="0.04" fill="none"/>

  <!-- Pravý rukáv -->
  <path d="M300 68 L350 95 C357 99 363 108 365 118 L367 130
    C367 134 365 136 361 135 L333 128 C329 127 325 124 323 120
    L310 92 L290 80"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.03"
    stroke-linejoin="round"/>
  <!-- Záhyb na pravom rukáve -->
  <path d="M340 110 C337 108 333 112 335 116" stroke="currentColor" stroke-width="0.8" opacity="0.06" fill="none"/>

  <!-- Hlavné telo trička -->
  <path d="M115 80 L115 252 C115 258 120 262 126 262 L278 262
    C284 262 290 258 290 252 L290 80"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.025"/>

  <!-- ═══ GOLIER (crew neck) ═══ -->
  <path d="M162 48 C170 38 185 32 202 32 C219 32 234 38 242 48"
    stroke="currentColor" stroke-width="2.5" opacity="0.5" fill="none"/>
  <!-- Vnútorný okraj goliera -->
  <path d="M166 52 C174 44 188 38 202 38 C216 38 230 44 238 52"
    stroke="currentColor" stroke-width="1.5" opacity="0.2" fill="none"/>
  <!-- Golier — pás -->
  <path d="M162 48 C170 42 185 36 202 36 C219 36 234 42 242 48
    L242 55 C234 47 219 42 202 42 C185 42 170 47 162 55 Z"
    fill="currentColor" opacity="0.04" stroke="currentColor" stroke-width="1" opacity="0.15"/>

  <!-- ═══ ŠVY ═══ -->
  <!-- Ramenné švy -->
  <path d="M115 80 L162 48" stroke="currentColor" stroke-width="1.2" opacity="0.1"
    stroke-dasharray="4 3"/>
  <path d="M290 80 L242 48" stroke="currentColor" stroke-width="1.2" opacity="0.1"
    stroke-dasharray="4 3"/>
  <!-- Švy rukávov -->
  <path d="M44 135 L82 120" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <path d="M361 135 L323 120" stroke="currentColor" stroke-width="1" opacity="0.08"/>
  <!-- Bočné švy -->
  <path d="M115 82 L115 252" stroke="currentColor" stroke-width="0.8" opacity="0.04"
    stroke-dasharray="6 4"/>
  <path d="M290 82 L290 252" stroke="currentColor" stroke-width="0.8" opacity="0.04"
    stroke-dasharray="6 4"/>

  <!-- ═══ POTLAČ NA HRUDI ═══ -->
  <!-- Oblasť potlače — prerušovaný rámček -->
  <rect x="145" y="85" width="115" height="80" rx="5"
    stroke="currentColor" stroke-width="1.8" stroke-dasharray="8 5" opacity="0.2"/>

  <!-- Grafický dizajn potlače -->
  <!-- Logo kruh -->
  <circle cx="178" cy="115" r="18" stroke="currentColor" stroke-width="2" opacity="0.2"/>
  <circle cx="178" cy="115" r="10" stroke="currentColor" stroke-width="1.2" opacity="0.12"/>
  <path d="M172 115 L178 105 L184 115 L178 125 Z" fill="currentColor" opacity="0.1"/>

  <!-- Text potlače -->
  <line x1="204" y1="105" x2="250" y2="105" stroke="currentColor" stroke-width="3" opacity="0.15" stroke-linecap="round"/>
  <line x1="204" y1="116" x2="245" y2="116" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>
  <line x1="204" y1="125" x2="238" y2="125" stroke="currentColor" stroke-width="1.5" opacity="0.07" stroke-linecap="round"/>

  <!-- Slogan pod logom -->
  <line x1="155" y1="148" x2="250" y2="148" stroke="currentColor" stroke-width="2" opacity="0.08" stroke-linecap="round"/>

  <!-- ═══ ZÁHYBY LÁTKY ═══ -->
  <path d="M155 175 C156 180 154 190 155 200 C156 210 154 225 155 240"
    stroke="currentColor" stroke-width="0.6" opacity="0.04" fill="none"/>
  <path d="M202 175 C203 182 201 195 202 208 C203 220 201 235 202 250"
    stroke="currentColor" stroke-width="0.6" opacity="0.04" fill="none"/>
  <path d="M248 175 C249 180 247 192 248 205 C249 218 247 230 248 245"
    stroke="currentColor" stroke-width="0.6" opacity="0.04" fill="none"/>

  <!-- ═══ SPODNÝ LEM ═══ -->
  <path d="M115 250 L290 250" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>
  <path d="M115 255 L290 255" stroke="currentColor" stroke-width="0.8" opacity="0.05"/>

  <!-- ═══ CEDULKA NA KRKU (vnútri) ═══ -->
  <rect x="192" y="52" width="20" height="12" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.1"
    fill="currentColor" fill-opacity="0.03"/>
  <line x1="196" y1="58" x2="208" y2="58" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
</svg>`;


// ═══════════════════════════════════════════════
// SAMOLEPKY — Arch samolepiek s odlepovaním
// ═══════════════════════════════════════════════
export const stickersSvg = `<svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tieň -->
  <ellipse cx="185" cy="268" rx="140" ry="6" fill="currentColor" opacity="0.04"/>

  <!-- ═══ ARCH SAMOLEPIEK (podkladový papier) ═══ -->
  <rect x="25" y="10" width="280" height="250" rx="6"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.025"/>

  <!-- Ohnutý roh -->
  <path d="M280 10 L305 10 L305 35 Z" fill="currentColor" opacity="0.04"/>
  <path d="M280 10 L305 35" stroke="currentColor" stroke-width="2" opacity="0.15"/>
  <path d="M282 10 C290 10 300 15 305 25 L305 35 C295 30 285 20 282 10"
    fill="currentColor" opacity="0.02"/>

  <!-- ═══ RIADOK 1 — Kruhové samolepky ═══ -->
  <!-- Samolepka 1 -->
  <circle cx="72" cy="58" r="28" stroke="currentColor" stroke-width="2" opacity="0.5"
    fill="currentColor" fill-opacity="0.04"/>
  <circle cx="72" cy="58" r="18" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <circle cx="72" cy="58" r="8" stroke="currentColor" stroke-width="1" opacity="0.1"/>
  <circle cx="72" cy="58" r="3" fill="currentColor" opacity="0.12"/>
  <!-- Samolepka 2 -->
  <circle cx="148" cy="58" r="28" stroke="currentColor" stroke-width="2" opacity="0.5"
    fill="currentColor" fill-opacity="0.04"/>
  <line x1="132" y1="55" x2="164" y2="55" stroke="currentColor" stroke-width="2.5" opacity="0.12" stroke-linecap="round"/>
  <line x1="136" y1="64" x2="160" y2="64" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <!-- Samolepka 3 -->
  <circle cx="225" cy="58" r="28" stroke="currentColor" stroke-width="2" opacity="0.5"
    fill="currentColor" fill-opacity="0.04"/>
  <path d="M215 58 L225 45 L235 58 L225 71 Z" stroke="currentColor" stroke-width="1.5" opacity="0.15"
    fill="currentColor" fill-opacity="0.05"/>

  <!-- ═══ RIADOK 2 — Oválne/pilulkové samolepky ═══ -->
  <rect x="40" y="102" width="80" height="36" rx="18" stroke="currentColor" stroke-width="2" opacity="0.45"
    fill="currentColor" fill-opacity="0.03"/>
  <line x1="55" y1="120" x2="105" y2="120" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>

  <rect x="130" y="102" width="80" height="36" rx="18" stroke="currentColor" stroke-width="2" opacity="0.45"
    fill="currentColor" fill-opacity="0.03"/>
  <line x1="145" y1="117" x2="195" y2="117" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>
  <line x1="150" y1="126" x2="188" y2="126" stroke="currentColor" stroke-width="1.2" opacity="0.06" stroke-linecap="round"/>

  <rect x="220" y="102" width="80" height="36" rx="18" stroke="currentColor" stroke-width="2" opacity="0.45"
    fill="currentColor" fill-opacity="0.03"/>
  <circle cx="260" cy="120" r="8" stroke="currentColor" stroke-width="1.2" opacity="0.12"/>

  <!-- ═══ RIADOK 3 — Štvorcové samolepky s logami ═══ -->
  <rect x="40" y="155" width="52" height="52" rx="6" stroke="currentColor" stroke-width="2" opacity="0.4"
    fill="currentColor" fill-opacity="0.03"/>
  <circle cx="66" cy="175" r="10" stroke="currentColor" stroke-width="1.2" opacity="0.15"/>
  <line x1="54" y1="195" x2="78" y2="195" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>

  <rect x="102" y="155" width="52" height="52" rx="6" stroke="currentColor" stroke-width="2" opacity="0.4"
    fill="currentColor" fill-opacity="0.03"/>
  <rect x="114" y="167" width="28" height="14" rx="2" fill="currentColor" opacity="0.06"/>
  <line x1="112" y1="192" x2="144" y2="192" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <line x1="116" y1="200" x2="140" y2="200" stroke="currentColor" stroke-width="1" opacity="0.05" stroke-linecap="round"/>

  <rect x="164" y="155" width="52" height="52" rx="6" stroke="currentColor" stroke-width="2" opacity="0.4"
    fill="currentColor" fill-opacity="0.03"/>
  <path d="M182 175 L190 165 L198 175 L190 185 Z" fill="currentColor" opacity="0.08"/>

  <!-- Prázdne miesto — samolepka bola odlepená -->
  <rect x="226" y="155" width="52" height="52" rx="6"
    stroke="currentColor" stroke-width="1.5" opacity="0.12" stroke-dasharray="6 4"/>

  <!-- ═══ RIADOK 4 — Malé štítky ═══ -->
  <rect x="40" y="222" width="70" height="28" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.35"
    fill="currentColor" fill-opacity="0.03"/>
  <line x1="50" y1="236" x2="100" y2="236" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>

  <rect x="120" y="222" width="70" height="28" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.35"
    fill="currentColor" fill-opacity="0.03"/>
  <line x1="130" y1="236" x2="180" y2="236" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>

  <rect x="200" y="222" width="70" height="28" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.3"
    fill="currentColor" fill-opacity="0.02"/>

  <!-- ═══ REZACIE LÍNIE (perforácia) ═══ -->
  <line x1="32" y1="92" x2="298" y2="92" stroke="currentColor" stroke-width="0.5" opacity="0.04"
    stroke-dasharray="2 4"/>
  <line x1="32" y1="148" x2="298" y2="148" stroke="currentColor" stroke-width="0.5" opacity="0.04"
    stroke-dasharray="2 4"/>
  <line x1="32" y1="215" x2="298" y2="215" stroke="currentColor" stroke-width="0.5" opacity="0.04"
    stroke-dasharray="2 4"/>

  <!-- ═══ ODLEPENÁ SAMOLEPKA (letí preč) ═══ -->
  <!-- Tieň pod odlepenou -->
  <ellipse cx="355" cy="210" rx="35" ry="5" fill="currentColor" opacity="0.05"/>
  <!-- Samolepka — otočená a zdvihnutá -->
  <rect x="325" y="140" width="62" height="55" rx="8"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05"
    transform="rotate(-15 356 168)"/>
  <!-- Logo na odlepenej samolepke -->
  <circle cx="350" cy="160" r="10" stroke="currentColor" stroke-width="1.5" opacity="0.25"
    transform="rotate(-15 350 160)"/>
  <circle cx="350" cy="160" r="4" fill="currentColor" opacity="0.15"
    transform="rotate(-15 350 160)"/>
  <!-- Text na odlepenej -->
  <line x1="338" y1="180" x2="368" y2="178" stroke="currentColor" stroke-width="2" opacity="0.12"
    transform="rotate(-15 353 179)"/>

  <!-- Efekt odlepenia — krivka spojenia -->
  <path d="M278 175 C290 170 310 155 325 150"
    stroke="currentColor" stroke-width="1.2" opacity="0.1" fill="none" stroke-dasharray="4 3"/>
</svg>`;


// ═══════════════════════════════════════════════
// BILLBOARD — Reklamná plocha na konštrukcii
// ═══════════════════════════════════════════════
export const billboardSvg = `<svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Zem -->
  <line x1="0" y1="252" x2="400" y2="252" stroke="currentColor" stroke-width="1" opacity="0.1"/>

  <!-- ═══ KONŠTRUKCIA — STĹPY ═══ -->
  <line x1="90" y1="145" x2="90" y2="248" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
  <line x1="310" y1="145" x2="310" y2="248" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
  <!-- Pätky -->
  <rect x="72" y="245" width="36" height="8" rx="2" stroke="currentColor" stroke-width="2" opacity="0.4"
    fill="currentColor" fill-opacity="0.04"/>
  <rect x="292" y="245" width="36" height="8" rx="2" stroke="currentColor" stroke-width="2" opacity="0.4"
    fill="currentColor" fill-opacity="0.04"/>
  <!-- Vzpery -->
  <line x1="90" y1="200" x2="130" y2="145" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
  <line x1="310" y1="200" x2="270" y2="145" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
  <!-- Priečne vzpery -->
  <line x1="90" y1="175" x2="310" y2="175" stroke="currentColor" stroke-width="2" opacity="0.15"/>
  <line x1="90" y1="215" x2="310" y2="215" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>

  <!-- ═══ BILLBOARD TABUĽA ═══ -->
  <!-- Rám tabuľe -->
  <rect x="20" y="12" width="360" height="132" rx="5"
    stroke="currentColor" stroke-width="3" fill="currentColor" fill-opacity="0.05"/>
  <!-- Vnútorný rám -->
  <rect x="28" y="20" width="344" height="116" rx="3"
    stroke="currentColor" stroke-width="1" opacity="0.15"/>

  <!-- ═══ OBSAH BILLBOARDU ═══ -->
  <!-- Veľká produktová fotka naľavo -->
  <rect x="38" y="30" width="110" height="82" rx="4" fill="currentColor" opacity="0.08"/>
  <rect x="44" y="36" width="98" height="70" rx="3" fill="currentColor" fill-opacity="0.03"/>
  <!-- Silueta produktu vo fotke -->
  <circle cx="93" cy="65" r="22" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>
  <circle cx="93" cy="65" r="12" stroke="currentColor" stroke-width="1" opacity="0.06"/>

  <!-- Headline -->
  <line x1="162" y1="38" x2="355" y2="38" stroke="currentColor" stroke-width="5" opacity="0.2" stroke-linecap="round"/>
  <line x1="162" y1="54" x2="330" y2="54" stroke="currentColor" stroke-width="4" opacity="0.12" stroke-linecap="round"/>
  <!-- Subheadline -->
  <line x1="162" y1="72" x2="350" y2="72" stroke="currentColor" stroke-width="2" opacity="0.08" stroke-linecap="round"/>
  <line x1="162" y1="84" x2="320" y2="84" stroke="currentColor" stroke-width="2" opacity="0.06" stroke-linecap="round"/>
  <!-- CTA / Telefón -->
  <rect x="162" y="98" width="100" height="22" rx="4" stroke="currentColor" stroke-width="1.5" opacity="0.2"
    fill="currentColor" fill-opacity="0.04"/>
  <line x1="175" y1="109" x2="248" y2="109" stroke="currentColor" stroke-width="2.5" opacity="0.12" stroke-linecap="round"/>
  <!-- Web -->
  <line x1="280" y1="109" x2="355" y2="109" stroke="currentColor" stroke-width="2" opacity="0.08" stroke-linecap="round"/>

  <!-- ═══ OSVETLENIE — Reflektory hore ═══ -->
  <rect x="80" y="6" width="12" height="8" rx="2" fill="currentColor" opacity="0.15"/>
  <rect x="194" y="6" width="12" height="8" rx="2" fill="currentColor" opacity="0.15"/>
  <rect x="308" y="6" width="12" height="8" rx="2" fill="currentColor" opacity="0.15"/>
  <!-- Lúče svetla -->
  <path d="M86 14 L75 30" stroke="currentColor" stroke-width="0.8" opacity="0.05"/>
  <path d="M86 14 L90 30" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <path d="M200 14 L190 30" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <path d="M200 14 L210 30" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <path d="M314 14 L310 30" stroke="currentColor" stroke-width="0.8" opacity="0.06"/>
  <path d="M314 14 L325 30" stroke="currentColor" stroke-width="0.8" opacity="0.05"/>
</svg>`;


// ═══════════════════════════════════════════════
// PVC PLACHTY / INŠTALÁCIE — Plachta napnutá s očkami
// ═══════════════════════════════════════════════
export const pvcBannerSvg = `<svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- ═══ KONŠTRUKCIA / RÁM ═══ -->
  <rect x="30" y="22" width="340" height="200" rx="3"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.035"/>

  <!-- ═══ OČKÁ na uchytenie ═══ -->
  <!-- Horný rad -->
  <circle cx="30" cy="22" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="30" cy="22" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="115" cy="22" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="115" cy="22" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="200" cy="22" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="200" cy="22" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="285" cy="22" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="285" cy="22" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="370" cy="22" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="370" cy="22" r="3" fill="currentColor" opacity="0.15"/>
  <!-- Spodný rad -->
  <circle cx="30" cy="222" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="30" cy="222" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="115" cy="222" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="115" cy="222" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="200" cy="222" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="200" cy="222" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="285" cy="222" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="285" cy="222" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="370" cy="222" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="370" cy="222" r="3" fill="currentColor" opacity="0.15"/>
  <!-- Bočné -->
  <circle cx="30" cy="122" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="30" cy="122" r="3" fill="currentColor" opacity="0.15"/>
  <circle cx="370" cy="122" r="8" stroke="currentColor" stroke-width="2.5" opacity="0.7"/>
  <circle cx="370" cy="122" r="3" fill="currentColor" opacity="0.15"/>

  <!-- ═══ LANÁ / UCHYTENIA ═══ -->
  <line x1="30" y1="14" x2="22" y2="4" stroke="currentColor" stroke-width="2" opacity="0.35"/>
  <line x1="370" y1="14" x2="378" y2="4" stroke="currentColor" stroke-width="2" opacity="0.35"/>
  <line x1="30" y1="230" x2="22" y2="248" stroke="currentColor" stroke-width="2" opacity="0.35"/>
  <line x1="370" y1="230" x2="378" y2="248" stroke="currentColor" stroke-width="2" opacity="0.35"/>
  <line x1="22" y1="122" x2="10" y2="122" stroke="currentColor" stroke-width="2" opacity="0.3"/>
  <line x1="378" y1="122" x2="390" y2="122" stroke="currentColor" stroke-width="2" opacity="0.3"/>

  <!-- ═══ OBSAH PLACHTY ═══ -->
  <!-- Veľký obrázok/logo -->
  <rect x="52" y="42" width="110" height="80" rx="4" fill="currentColor" opacity="0.07"/>
  <rect x="58" y="48" width="98" height="68" rx="3" fill="currentColor" fill-opacity="0.03"/>

  <!-- Headline -->
  <line x1="180" y1="52" x2="352" y2="52" stroke="currentColor" stroke-width="4.5" opacity="0.22" stroke-linecap="round"/>
  <line x1="180" y1="68" x2="340" y2="68" stroke="currentColor" stroke-width="3" opacity="0.14" stroke-linecap="round"/>
  <line x1="180" y1="82" x2="310" y2="82" stroke="currentColor" stroke-width="2" opacity="0.1" stroke-linecap="round"/>

  <!-- Popis služieb -->
  <line x1="180" y1="98" x2="350" y2="98" stroke="currentColor" stroke-width="1.5" opacity="0.08" stroke-linecap="round"/>
  <line x1="180" y1="108" x2="340" y2="108" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>
  <line x1="180" y1="118" x2="320" y2="118" stroke="currentColor" stroke-width="1.5" opacity="0.06" stroke-linecap="round"/>

  <!-- Telefón a web -->
  <line x1="52" y1="155" x2="175" y2="155" stroke="currentColor" stroke-width="3.5" opacity="0.15" stroke-linecap="round"/>
  <line x1="52" y1="172" x2="155" y2="172" stroke="currentColor" stroke-width="2.5" opacity="0.1" stroke-linecap="round"/>
  <line x1="52" y1="188" x2="145" y2="188" stroke="currentColor" stroke-width="1.8" opacity="0.07" stroke-linecap="round"/>

  <!-- QR kód vpravo dole -->
  <rect x="305" y="152" width="48" height="48" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.15"/>
  <rect x="310" y="157" width="16" height="16" rx="2" fill="currentColor" opacity="0.06"/>
  <rect x="332" y="157" width="16" height="16" rx="2" fill="currentColor" opacity="0.06"/>
  <rect x="310" y="179" width="16" height="16" rx="2" fill="currentColor" opacity="0.06"/>
  <rect x="336" y="183" width="8" height="8" rx="1" fill="currentColor" opacity="0.04"/>
  <rect x="332" y="179" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.05"/>

  <!-- ═══ MONTÁŽ IKONA (kľúč) ═══ -->
  <!-- Francúzsky kľúč -->
  <path d="M320 140 L332 128" stroke="currentColor" stroke-width="2.5" opacity="0.2" stroke-linecap="round"/>
  <circle cx="336" cy="124" r="8" stroke="currentColor" stroke-width="2" opacity="0.2"/>
  <circle cx="336" cy="124" r="3" fill="currentColor" opacity="0.08"/>
  <path d="M315 145 L310 155" stroke="currentColor" stroke-width="2.5" opacity="0.15" stroke-linecap="round"/>
</svg>`;


// ═══════════════════════════════════════════════
// DEFAULT — Izometrická krabica s produktom
// ═══════════════════════════════════════════════
export const defaultProductSvg = `<svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tieň -->
  <ellipse cx="200" cy="260" rx="120" ry="12" fill="currentColor" opacity="0.04"/>

  <!-- ═══ KRABICA — Izometrický pohľad ═══ -->
  <!-- Zadná stena -->
  <path d="M200 20 L350 80 L350 210 L200 260 L50 210 L50 80 Z"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.02"/>
  <!-- Ľavá predná stena -->
  <path d="M50 80 L200 130 L200 260 L50 210 Z"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.04"/>
  <!-- Pravá predná stena -->
  <path d="M350 80 L200 130 L200 260 L350 210 Z"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.02"/>
  <!-- Vrchná strana -->
  <path d="M200 20 L350 80 L200 130 L50 80 Z"
    stroke="currentColor" stroke-width="2.5" fill="currentColor" fill-opacity="0.05"/>

  <!-- Hrany -->
  <line x1="200" y1="130" x2="200" y2="260" stroke="currentColor" stroke-width="2.5" opacity="0.35"/>
  <line x1="50" y1="80" x2="200" y2="130" stroke="currentColor" stroke-width="2" opacity="0.25"/>
  <line x1="350" y1="80" x2="200" y2="130" stroke="currentColor" stroke-width="2" opacity="0.25"/>

  <!-- Páska (tape) na vrchu -->
  <line x1="200" y1="20" x2="200" y2="130" stroke="currentColor" stroke-width="5" opacity="0.1"/>
  <line x1="125" y1="50" x2="200" y2="75" stroke="currentColor" stroke-width="5" opacity="0.06"/>
  <line x1="275" y1="50" x2="200" y2="75" stroke="currentColor" stroke-width="5" opacity="0.06"/>

  <!-- Štítok na ľavej stene -->
  <path d="M75 130 L155 155 L155 195 L75 170 Z"
    stroke="currentColor" stroke-width="1.5" opacity="0.2" fill="currentColor" fill-opacity="0.03"/>
  <!-- Text na štítku -->
  <line x1="85" y1="145" x2="140" y2="158" stroke="currentColor" stroke-width="2" opacity="0.1"/>
  <line x1="85" y1="153" x2="130" y2="163" stroke="currentColor" stroke-width="1.5" opacity="0.07"/>
  <!-- Čiarový kód -->
  <rect x="85" y="165" width="40" height="8" rx="1" stroke="currentColor" stroke-width="0.8" opacity="0.1"
    transform="skewY(14)"/>

  <!-- Šípky "hore" na krabici -->
  <path d="M280 140 L290 125 L300 140 M290 125 L290 155" stroke="currentColor" stroke-width="1.5" opacity="0.1"/>
  <path d="M310 148 L320 133 L330 148 M320 133 L320 163" stroke="currentColor" stroke-width="1.5" opacity="0.08"/>
</svg>`;


// ═══════════════════════════════════════════════
// MAPPER — Mapuje názov kategórie na SVG
// ═══════════════════════════════════════════════
export function getCategorySvg(name: string): string {
  const n = name.toLowerCase();

  if (n.includes('billboard') || (n.includes('reklam') && n.includes('plocha')))
    return billboardSvg;

  if (n.includes('polep') && (n.includes('okien') || n.includes('stien') || n.includes('folio')))
    return windowWrapSvg;

  if (n.includes('polep') && n.includes('aut'))
    return vehicleWrapSvg;

  if (n.includes('tlač') || n.includes('print') || n.includes('tisk'))
    return printProductsSvg;

  if (n.includes('svetel') || n.includes('led') || n.includes('neon') || n.includes('osvetl'))
    return illuminatedSignSvg;

  if (n.includes('veľkoformát') || n.includes('velkoformat') || n.includes('wide'))
    return largeFormatSvg;

  if (n.includes('placht') || n.includes('inštalác') || n.includes('instalac') || n.includes('montáž'))
    return pvcBannerSvg;

  if (n.includes('obleč') || n.includes('oblec') || n.includes('textil') || n.includes('tričk'))
    return clothingSvg;

  if (n.includes('samolep') || n.includes('nálep') || n.includes('etike'))
    return stickersSvg;

  return defaultProductSvg;
}
