/**
 * qr-heart.ts
 *
 * Generates a heart-shaped QR code as an SVG data URL.
 *
 * Design:
 *   • The QR square is rendered rotated 45 ° → diamond shape.
 *   • Two semicircles are attached to the upper-left and upper-right edges
 *     of the diamond, completing the classic heart silhouette.
 *   • The bumps carry optional text (name + dates) in the system gold colour.
 *   • Optional solid background colour and a URL label above the heart.
 *
 * The result can be used as `src` on any <img> or downloaded directly.
 */

import QRCode from "qrcode";

interface HeartQrOptions {
  /** Pixels per QR module. Default: 8 */
  moduleSize?: number;
  /** Quiet-zone margin in modules. Default: 2 */
  marginModules?: number;
  /** Dark module colour. Default: "#0b0f0f" */
  dark?: string;
  /** Light module / heart fill colour. Default: "#ffffff" */
  light?: string;
  /**
   * Optional text overlaid inside the two circular heart bumps.
   *   Left bump  → name + birth date
   *   Right bump → death date
   */
  overlay?: {
    /** Line 1 in the left bump (e.g. person's short name) */
    leftLine1?: string;
    /** Line 2 in the left bump (e.g. "✦ DD/MM/AAAA") */
    leftLine2?: string;
    /** Line 1 in the right bump (e.g. "✝") */
    rightLine1?: string;
    /** Line 2 in the right bump (e.g. "DD/MM/AAAA") */
    rightLine2?: string;
    /** Accent colour for bump text. Default: "#e9c349" (system gold) */
    color?: string;
  };
  /** URL label shown at the top of the SVG (e.g. "www.preservandomemorias.com.br") */
  bottomUrl?: string;
  /** Solid background colour for the entire canvas (e.g. "#0b1120" or "#f9f6ef") */
  bgColor?: string;
  /** Colour of the URL text at the top. Default: "#e9c349" */
  urlColor?: string;
}

/** Escape characters that are special inside SVG text content. */
function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Returns a `data:image/svg+xml;base64,...` string for the heart QR.
 * Runs synchronously on Node.js (no canvas required).
 */
export function generateHeartQr(url: string, opts: HeartQrOptions = {}): string {
  const {
    moduleSize = 8,
    marginModules = 2,
    dark = "#0b0f0f",
    light = "#ffffff",
    overlay,
    bottomUrl,
    bgColor,
    urlColor = "#e9c349",
  } = opts;

  // ── QR module matrix (synchronous) ─────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qr = (QRCode as any).create(url, { errorCorrectionLevel: "M" }) as {
    modules: { size: number; data: Uint8ClampedArray };
  };
  const { size, data } = qr.modules;

  // ── Geometry ────────────────────────────────────────────────────────────────
  // s  = side of the QR image (square) in pixels
  // r  = half-diagonal of the diamond  =  s·√2/2
  // When the s×s square is rotated 45 °, its corners reach ±r from centre in
  // both axes, so the diamond spans 2r × 2r.
  //
  // Heart bumps: a circle centred at the midpoint of each upper diamond edge.
  //   Edge = from TOP vertex to LEFT/RIGHT vertex.
  //   Midpoint (upper-left): (cx − r/2,  cy − r/2)
  //   Circle radius = half-edge-length = s/2   (since edge length = s)

  const s = (size + marginModules * 2) * moduleSize; // QR image side
  const r = (s * Math.SQRT2) / 2;                    // half-diagonal of diamond
  const circleR = s / 2;                             // heart-bump circle radius

  const pad = Math.round(moduleSize * 2);
  const heartHalfW = r / 2 + circleR;
  const canvasW = Math.round(2 * heartHalfW + pad * 2);
  const topReach = r / 2 + circleR; // distance from diamond centre to top of circles

  // Header strip for URL text above the heart
  const urlFontSize = bottomUrl ? Math.max(10, Math.round(circleR / 9)) : 0;
  const headerH = bottomUrl ? Math.round(urlFontSize * 3.5) : 0;
  const canvasH = Math.round(headerH + topReach + r + pad * 2);

  // Diamond centre in canvas space (shifted down by headerH)
  const cx = canvasW / 2;
  const cy = headerH + topReach + pad;

  // Bump circle centres (midpoints of upper-left / upper-right diamond edges)
  const cLx = cx - r / 2;
  const cLy = cy - r / 2;
  const cRx = cx + r / 2;
  const cRy = cy - r / 2;

  // ── Dark-module rectangles (run-length merged per row for smaller SVG) ──────
  const marginPx = marginModules * moduleSize;
  const rects: string[] = [];

  for (let row = 0; row < size; row++) {
    let col = 0;
    while (col < size) {
      if (data[row * size + col]) {
        let len = 1;
        while (col + len < size && data[row * size + col + len]) len++;
        const x = col * moduleSize + marginPx;
        const y = row * moduleSize + marginPx;
        rects.push(
          `<rect x="${x}" y="${y}" width="${len * moduleSize}" height="${moduleSize}"/>`
        );
        col += len;
      } else {
        col++;
      }
    }
  }

  // ── SVG assembly ─────────────────────────────────────────────────────────────
  const diamond = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;

  const transform = `translate(${cx},${cy}) rotate(45) translate(${-s / 2},${-s / 2})`;

  // ── Background rect ─────────────────────────────────────────────────────────
  const bgRect = bgColor
    ? `<rect width="${canvasW}" height="${canvasH}" fill="${escXml(bgColor)}"/>`
    : "";

  // ── URL label above the heart ───────────────────────────────────────────────
  const urlSvg = bottomUrl
    ? `<text x="${cx}" y="${headerH / 2}" ` +
      `text-anchor="middle" dominant-baseline="middle" ` +
      `font-family="Georgia,'Times New Roman',serif" ` +
      `font-size="${urlFontSize}" fill="${escXml(urlColor)}" letter-spacing="0.5">` +
      escXml(bottomUrl) +
      `</text>`
    : "";

  // ── Overlay text inside the bumps ───────────────────────────────────────────
  let overlayText = "";

  if (overlay) {
    const textColor = overlay.color ?? "#e9c349";

    const fontSize1 = Math.round(circleR / 7.5);
    const fontSize2 = Math.round(circleR / 9.5);

    const bumpMidY = cLy - circleR * 0.5;
    const halfGap = Math.round(fontSize1 * 0.85);

    function bumpText(bx: number, line1?: string, line2?: string): string {
      if (!line1 && !line2) return "";
      const hasBoth = !!(line1 && line2);
      let g =
        `<g clip-path="url(#hc)" text-anchor="middle" dominant-baseline="middle"` +
        ` font-family="Georgia,'Times New Roman',serif" fill="${textColor}">`;
      if (line1) {
        const y = hasBoth ? bumpMidY - halfGap : bumpMidY;
        g += `<text x="${bx}" y="${y}" font-size="${fontSize1}" font-weight="bold">${escXml(line1)}</text>`;
      }
      if (line2) {
        const y = hasBoth ? bumpMidY + halfGap : bumpMidY;
        g += `<text x="${bx}" y="${y}" font-size="${fontSize2}">${escXml(line2)}</text>`;
      }
      g += `</g>`;
      return g;
    }

    overlayText =
      bumpText(cLx, overlay.leftLine1, overlay.leftLine2) +
      bumpText(cRx, overlay.rightLine1, overlay.rightLine2);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" \
width="${canvasW}" height="${canvasH}" \
viewBox="0 0 ${canvasW} ${canvasH}">
  <defs>
    <clipPath id="hc">
      <polygon points="${diamond}"/>
      <circle cx="${cLx}" cy="${cLy}" r="${circleR}"/>
      <circle cx="${cRx}" cy="${cRy}" r="${circleR}"/>
    </clipPath>
  </defs>

  ${bgRect}
  ${urlSvg}

  <!-- Heart background (light fill) -->
  <polygon points="${diamond}" fill="${light}"/>
  <circle cx="${cLx}" cy="${cLy}" r="${circleR}" fill="${light}"/>
  <circle cx="${cRx}" cy="${cRy}" r="${circleR}" fill="${light}"/>

  <!-- QR code rotated 45° and clipped to heart -->
  <g clip-path="url(#hc)" fill="${dark}">
    <g transform="${transform}">
      <rect width="${s}" height="${s}" fill="${light}"/>
      ${rects.join("")}
    </g>
  </g>

  <!-- Name / dates in the two bumps (accent colour, Georgia serif) -->
  ${overlayText}
</svg>`;

  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
}
