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
  /** Light module / background colour. Default: "#ffffff" */
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
    /** Accent colour. Default: "#e9c349" (system gold) */
    color?: string;
  };
  /** Optional URL label shown in small text below the heart (e.g. "www.preservandomemorias.com.br") */
  bottomUrl?: string;
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
  } = opts;

  // ── QR module matrix (synchronous) ─────────────────────────────────────────
  // QRCode.create is exported by the runtime but not in @types/qrcode; cast needed.
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
  //
  // The circle passes EXACTLY through both edge endpoints, so it smoothly
  // joins the diamond at those vertices — no gap, no overlap artefact.

  const s = (size + marginModules * 2) * moduleSize; // QR image side
  const r = (s * Math.SQRT2) / 2; // half-diagonal of the diamond
  const circleR = s / 2; // heart-bump circle radius  (= r / √2)

  // Canvas must be wide enough for the widest points of the circles.
  // Each circle centre is at cx ± r/2, and the circle has radius circleR,
  // so the extreme x-extents are cx ± (r/2 + circleR).
  const pad = Math.round(moduleSize * 2);
  const heartHalfW = r / 2 + circleR; // half-width of heart (wider than diamond!)
  const canvasW = Math.round(2 * heartHalfW + pad * 2);
  const topReach = r / 2 + circleR; // distance from diamond centre → top of circles
  const footerFontSize = bottomUrl ? Math.max(8, Math.round(circleR / 11)) : 0;
  const footerH = bottomUrl ? Math.round(footerFontSize * 2.8) : 0;
  const canvasH = Math.round(topReach + r + pad * 2 + footerH);

  // Diamond centre in canvas space
  const cx = canvasW / 2;
  const cy = topReach + pad;

  // Bump circle centres (midpoints of upper-left / upper-right diamond edges)
  const cLx = cx - r / 2;
  const cLy = cy - r / 2;
  const cRx = cx + r / 2;
  const cRy = cy - r / 2; // same y as cLy

  // ── Dark-module rectangles (run-length merged per row for smaller SVG) ──────
  const marginPx = marginModules * moduleSize;
  const rects: string[] = [];

  for (let row = 0; row < size; row++) {
    let col = 0;
    while (col < size) {
      if (data[row * size + col]) {
        // Find horizontal run length
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

  // Transform: translate QR centre to canvas centre, rotate 45 °, then offset
  // so the top-left of the QR image lands at the right position.
  const transform = `translate(${cx},${cy}) rotate(45) translate(${-s / 2},${-s / 2})`;

  // ── Overlay text inside the bumps ───────────────────────────────────────────
  // Each bump is the half of a circle that sits ABOVE the diagonal chord
  // (= upper diamond edge).  The chord passes through each circle centre, so
  // the visible bump spans exactly circleR pixels above the centre.
  //
  // Text is placed at the vertical mid-point of each bump:
  //   bumpMidY = cLy − circleR × 0.5
  //
  // The bump constraint limits the symmetric half-width of horizontally-
  // centred text to circleR / 2, so font sizes are proportional and the
  // caller should truncate long names (≈ 13 chars max at moduleSize 8).

  let overlayText = "";

  if (overlay) {
    const textColor = overlay.color ?? "#e9c349";

    // Font sizes proportional to bump radius
    const fontSize1 = Math.round(circleR / 7.5); // name / symbol   (larger)
    const fontSize2 = Math.round(circleR / 9.5); // date            (smaller)

    // Vertical mid-point of the visible bump (same y for both bumps)
    const bumpMidY = cLy - circleR * 0.5;

    // Half-gap between two lines when both are present
    const halfGap = Math.round(fontSize1 * 0.85);

    /** Returns a <g> with up to two text lines centred at (bx, bumpMidY). */
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

  const footerSvg = bottomUrl
    ? `<text x="${cx}" y="${cy + r + pad + footerFontSize}" ` +
      `text-anchor="middle" dominant-baseline="middle" ` +
      `font-family="Georgia,'Times New Roman',serif" ` +
      `font-size="${footerFontSize}" fill="${overlay?.color ?? "#1c1b1b"}" opacity="0.55" letter-spacing="0.3">` +
      escXml(bottomUrl) +
      `</text>`
    : "";

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

  <!-- Heart background (white) — no stroke; shape is self-defining on dark bg -->
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

  <!-- Name / dates in the two bumps (gold accent, Georgia serif) -->
  ${overlayText}

  <!-- Website URL label below the heart -->
  ${footerSvg}
</svg>`;

  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
}
