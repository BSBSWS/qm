// Word-Ausgabe eines QM-Dokuments aus der Markdown-Quelle.
// Aufruf: node tools/export-docx.js handbuch/<datei>.md export/<datei>.docx
// Voraussetzungen: npm-Paket "docx", Mermaid-CLI "mmdc" für Flussdiagramme.
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const D = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, ImageRun, Header, Footer, PageNumber, BorderStyle, VerticalAlign, LevelFormat } = D;

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('Aufruf: node tools/export-docx.js quelle.md ziel.docx'); process.exit(1); }
const FONT = 'Calibri', W = 9070, GELB = 'FFFFCC';
const text = fs.readFileSync(src, 'utf8').replace(/\r/g, '');

// Kopfangaben
const fm = {}; let body = text;
const m = text.match(/^---\n([\s\S]*?)\n---\n/);
if (m) { body = text.slice(m[0].length);
  for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) fm[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, ''); } }
for (const k of ['kennung', 'titel', 'revision', 'stand', 'status']) if (!fm[k]) console.warn('Kopfangabe fehlt: ' + k);
if (!fm.prozesse) console.warn('Kopfangabe fehlt: prozesse – Zugeordnete Prozesse: OFFEN');

const clean = s => s.replace(/`/g, '').trim();
const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 20, ...o });
const para = (t, o = {}, ro = {}) => new Paragraph({ spacing: { after: 80 }, ...o, children: [run(clean(t), ro)] });
const border = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (children, w, o = {}) => new TableCell({ borders, width: { size: w, type: WidthType.DXA },
  margins: { top: 50, bottom: 50, left: 90, right: 90 }, ...o, children });
const offen = t => new Paragraph({ spacing: { after: 80 }, children: [
  run('OFFEN: ', { bold: true, highlight: 'yellow' }), run(clean(t.slice(6)), { highlight: 'yellow' })] });

function widths(head, n) {
  if (n === 2) return [2268, W - 2268];
  if (head[0] === 'Nr.' && n === 4) return [500, 4600, 1985, 1985];
  if (head[0] === 'Revision' && n === 4) return [1400, 1100, 4070, 2500];
  const w = Math.floor(W / n); return Array.from({ length: n }, (_, i) => i === n - 1 ? W - w * (n - 1) : w);
}
function table(rows) {
  const head = rows[0], n = head.length, w = widths(head, n), noHead = head.every(c => c === '');
  const trs = [];
  if (!noHead) trs.push(new TableRow({ tableHeader: true, children: head.map((c, i) =>
    cell([new Paragraph({ children: [run(c, { bold: true, size: 18 })] })], w[i], { shading: { type: ShadingType.CLEAR, fill: GELB } })) }));
  for (const r of rows.slice(1)) trs.push(new TableRow({ cantSplit: true, children: r.map((c, i) =>
    cell((head[0] === 'Nr.' ? c.split(/;\s+/) : [c]).map(p => new Paragraph({ alignment: noHead && i === 0 ? AlignmentType.RIGHT : AlignmentType.LEFT,
      children: [run(clean(p) + (noHead && i === 0 ? ':' : ''))] })), w[i])) }));
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w, rows: trs });
}
function diagram(code) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qm-'));
  const mmd = path.join(tmp, 'd.mmd'), png = path.join(tmp, 'd.png'), cfg = path.join(tmp, 'p.json');
  fs.writeFileSync(mmd, code); fs.writeFileSync(cfg, '{"args":["--no-sandbox"]}');
  execFileSync('mmdc', ['-p', cfg, '-i', mmd, '-o', png, '-b', 'white', '-s', '3'], { stdio: 'ignore' });
  const buf = fs.readFileSync(png), pw = buf.readUInt32BE(16), ph = buf.readUInt32BE(20);
  let w = 600, h = Math.round(600 * ph / pw); if (h > 760) { h = 760; w = Math.round(760 * pw / ph); }
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 120 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: w, height: h } })] });
}

// Rumpf
const lines = body.split('\n'), kids = []; let kapitel = [], prozesse = fm.prozesse || 'OFFEN';
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (!l.trim() || l.startsWith('# ')) continue;
  if (l.startsWith('Kapitel:')) { kapitel = l.replace('Kapitel:', '').split(' · ').slice(0, 2).map(s => s.trim()); continue; }
  if (l.startsWith('Zugeordnete Prozesse:')) continue;
  if (l.startsWith('## ')) { kids.push(new Paragraph({ keepNext: true, spacing: { before: 240, after: 100 },
    children: [run(l.slice(3), { bold: true, size: 22 })] })); continue; }
  if (l.startsWith('```mermaid')) { const c = []; while (!lines[++i].startsWith('```')) c.push(lines[i]); kids.push(diagram(c.join('\n'))); continue; }
  if (l.startsWith('|')) { const rows = [];
    while (i < lines.length && lines[i].startsWith('|')) { if (!/^\|[\s|:-]*-[\s|:-]*\|$/.test(lines[i])) rows.push(lines[i].slice(1, -1).split('|').map(c => c.trim())); i++; }
    i--;
    kids.push(table(rows), new Paragraph({ spacing: { after: 60 }, children: [] })); continue; }
  if (/^\d+\. /.test(l)) { kids.push(new Paragraph({ numbering: { reference: 'num', level: 0 }, spacing: { after: 60 },
    children: [run(clean(l.replace(/^\d+\. /, '')))] })); continue; }
  if (l.startsWith('OFFEN:')) { kids.push(offen(l)); continue; }
  const lab = l.match(/^(Risiko|Risikominimierung):/);
  if (lab) { kids.push(new Paragraph({ spacing: { after: 80 }, children: [run(lab[0], { underline: {} }), run(l.slice(lab[0].length))] })); continue; }
  kids.push(para(l, l.endsWith(':') ? { keepNext: true } : {}, l.startsWith('Vorlagen:') || l.startsWith('Zeichen:') ? { size: 16 } : {}));
}

// Titelfeld mit Prozesszeile
const titel = new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2268, W - 2268], rows: [
  new TableRow({ children: [cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(fm.titel || '', { bold: true, size: 28 })] })],
    W, { columnSpan: 2, shading: { type: ShadingType.CLEAR, fill: GELB } })] }),
  new TableRow({ children: [cell([new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('Zugeordnete Prozesse:')] })], 2268),
    cell([new Paragraph({ children: [run(prozesse, prozesse === 'OFFEN' ? { bold: true, highlight: 'yellow' } : {})] })], W - 2268)] })] });

// Kopf- und Fußzeile nach der Vorlage
const hr = (children, o = {}) => cell([new Paragraph({ alignment: AlignmentType.RIGHT, children })], 5101, o);
const s9 = { size: 18 };
const logo = new ImageRun({ type: 'jpg', data: fs.readFileSync(path.join(__dirname, 'logo-sws.jpeg')), transformation: { width: 230, height: 54 } });
const header = new Header({ children: [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3969, 5101], rows: [
  new TableRow({ children: [cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [logo] })], 3969, { rowSpan: 4, verticalAlign: VerticalAlign.CENTER }),
    hr([run(kapitel[0] || '', s9)])] }),
  new TableRow({ children: [hr([run(kapitel[1] || '', s9)])] }),
  new TableRow({ children: [hr([run(`${fm.kennung || ''} ${fm.titel || ''}`, { size: 18, bold: true })])] }),
  new TableRow({ children: [hr([run('Seite ', s9), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 }),
    run(' von ', s9), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 18 })])] })] }),
  new Paragraph({ children: [] })] });
const fw = [2267, 2268, 2268, 2267];
const fc = (t, i, o = {}) => cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [run(t, { size: 18, ...o })] })], fw[i]);
const val = k => fm[k] || 'OFFEN';
const footer = new Footer({ children: [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: fw, rows: [
  new TableRow({ children: [fc('erstellt: ' + val('erstellt'), 0), fc('geprüft: ' + val('geprueft'), 1), fc('freigegeben: ' + val('freigegeben'), 2), fc('Revision ' + val('revision'), 3)] }),
  new TableRow({ children: [fc('Unterschrift', 0, { color: '808080' }), fc('Unterschrift', 1, { color: '808080' }), fc('Unterschrift', 2, { color: '808080' }),
    fc(`Stand ${val('stand')} · ${val('status')}`, 3)] })] })] });

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  numbering: { config: [{ reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 400, hanging: 400 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1418, right: 1418, bottom: 1134, left: 1418, header: 709, footer: 709 } } },
    headers: { default: header }, footers: { default: footer },
    children: [titel, new Paragraph({ spacing: { after: 60 }, children: [] }), ...kids] }] });
Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('geschrieben: ' + out); });
