// Word-Ausgabe eines QM-Dokuments aus der Markdown-Quelle.
// Aufruf: node tools/export-docx.js handbuch/<datei>.md export/<datei>.docx
// Voraussetzungen: npm-Paket "docx", Mermaid-CLI "mmdc" für Flussdiagramme.
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  AlignmentType, ImageRun, Header, Footer, PageNumber, BorderStyle, VerticalAlign, LevelFormat } = require('docx');

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('Aufruf: node tools/export-docx.js quelle.md ziel.docx'); process.exit(1); }

// Gestaltung: Blau des Trägerlogos, helle Tönung, feine Linien
const FONT = 'Calibri', W = 9070;
const BLAU = '33448C', HELL = 'EEF1F8', LINIE = 'C5CBE0', GRAU = '5F6470', TEXT = '1F2433', OFFEN_BG = 'FFF3D1', OFFEN_LN = 'E0A100';

const text = fs.readFileSync(src, 'utf8').replace(/\r/g, '');
const fm = {}; let body = text;
const m = text.match(/^---\n([\s\S]*?)\n---\n/);
if (m) { body = text.slice(m[0].length);
  for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) fm[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, ''); } }
for (const k of ['kennung', 'titel', 'revision', 'stand', 'status']) if (!fm[k]) console.warn('Kopfangabe fehlt: ' + k);
if (!fm.prozesse) console.warn('Kopfangabe fehlt: prozesse – Zugeordnete Prozesse: OFFEN');
const val = k => fm[k] || 'OFFEN';

const clean = s => s.replace(/`/g, '').trim();
const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: 20, color: TEXT, ...o });
const P = (children, o = {}) => new Paragraph({ spacing: { after: 100, line: 276 }, ...o, children });
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const line = (c = LINIE, s = 4) => ({ style: BorderStyle.SINGLE, size: s, color: c });
const cell = (children, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA },
  borders: { top: none, left: none, right: none, bottom: line() },
  margins: { top: 80, bottom: 80, left: 110, right: 110 }, ...o, children });
const fill = c => ({ type: ShadingType.CLEAR, fill: c, color: 'auto' });
const gap = (a = 80) => new Paragraph({ spacing: { after: a }, children: [] });

const offen = t => new Paragraph({ spacing: { before: 60, after: 100, line: 276 }, shading: fill(OFFEN_BG), indent: { left: 120 },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: OFFEN_LN, space: 6 } },
  children: [run('OFFEN  ', { bold: true, color: '8A6100' }), run(clean(t.slice(6)))] });

function widths(head, n) {
  if (n === 2 && !head[0].startsWith('Nr.')) return [2268, W - 2268];
  if (head[0] === 'Nr.' && n === 4) return [520, 4580, 1985, 1985];
  if (head[0].startsWith('Nr.') && n === 3) return [1500, 3000, W - 4500];
  if (head[0].startsWith('Nr.') && n === 2) return [1500, W - 1500];
  if (head[0] === 'Revision' && n === 4) return [1300, 1300, 3970, 2500];
  const w = Math.floor(W / n); return Array.from({ length: n }, (_, i) => i === n - 1 ? W - w * (n - 1) : w);
}
function table(rows) {
  const head = rows[0], n = head.length, w = widths(head, n), noHead = head.every(c => c === '');
  const trs = [];
  if (!noHead) trs.push(new TableRow({ tableHeader: true, children: head.map((c, i) =>
    cell([new Paragraph({ children: [run(c, { bold: true, size: 18, color: 'FFFFFF' })] })], w[i],
      { shading: fill(BLAU), borders: { top: none, left: none, right: none, bottom: none } })) }));
  rows.slice(1).forEach((r, k) => trs.push(new TableRow({ cantSplit: true, children: r.map((c, i) => {
    const label = noHead && i === 0, nr = head[0] === 'Nr.' && i === 0;
    return cell((head[0] === 'Nr.' ? c.split(/;\s+/) : [c]).map(p => new Paragraph({ spacing: { line: 264 },
      children: [run(clean(p), label ? { bold: true, color: BLAU, size: 18 } : nr ? { bold: true, color: BLAU } : {})] })), w[i],
      { shading: label ? fill(HELL) : undefined, ...(noHead && k === 0 ? { borders: { top: line(), left: none, right: none, bottom: line() } } : {}) }); }) })));
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w, rows: trs });
}
function diagram(code) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qm-'));
  const f = n => path.join(tmp, n);
  fs.writeFileSync(f('d.mmd'), code); fs.writeFileSync(f('p.json'), '{"args":["--no-sandbox"]}');
  fs.writeFileSync(f('c.json'), JSON.stringify({ theme: 'base', flowchart: { curve: 'linear', nodeSpacing: 40, rankSpacing: 40, htmlLabels: true },
    themeVariables: { fontFamily: 'Calibri, Carlito, Arial, sans-serif', fontSize: '15px', primaryColor: '#' + HELL, primaryBorderColor: '#' + BLAU,
      primaryTextColor: '#' + TEXT, lineColor: '#' + BLAU, edgeLabelBackground: '#FFFFFF', tertiaryColor: '#FFFFFF' } }));
  execFileSync('mmdc', ['-p', f('p.json'), '-c', f('c.json'), '-i', f('d.mmd'), '-o', f('d.png'), '-b', 'white', '-s', '3'], { stdio: 'ignore' });
  const buf = fs.readFileSync(f('d.png')), pw = buf.readUInt32BE(16), ph = buf.readUInt32BE(20);
  let w = 600, h = Math.round(600 * ph / pw); if (h > 600) { h = 600; w = Math.round(600 * pw / ph); }
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 120 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: w, height: h } })] });
}

// Rumpf
const lines = body.split('\n'), kids = []; let kapitel = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (!l.trim() || l.startsWith('# ') || l.startsWith('Zugeordnete Prozesse:')) continue;
  if (l.startsWith('Kapitel:')) { kapitel = l.replace('Kapitel:', '').split(' · ').slice(0, 2).map(s => s.trim()); continue; }
  if (l.startsWith('### ')) { kids.push(new Paragraph({ keepNext: true, spacing: { before: 200, after: 100 }, children: [run(l.slice(4), { bold: true, size: 21, color: BLAU })] })); continue; }
  if (l.startsWith('## ')) { kids.push(new Paragraph({ keepNext: true, spacing: { before: 320, after: 120 },
    children: [run(l.slice(3), { bold: true, size: 24, color: BLAU })] })); continue; }
  if (l.startsWith('```mermaid')) { const c = []; while (!lines[++i].startsWith('```')) c.push(lines[i]); kids.push(diagram(c.join('\n'))); continue; }
  if (l.startsWith('|')) { const rows = [];
    while (i < lines.length && lines[i].startsWith('|')) { if (!/^\|[\s|:-]*-[\s|:-]*\|$/.test(lines[i])) rows.push(lines[i].slice(1, -1).split('|').map(c => c.trim())); i++; }
    i--; kids.push(table(rows), gap(60)); continue; }
  if (/^\d+\. /.test(l)) { kids.push(P([run(clean(l.replace(/^\d+\. /, '')))], { numbering: { reference: 'num', level: 0 }, spacing: { after: 70, line: 276 } })); continue; }
  if (l.startsWith('OFFEN:')) { kids.push(offen(l)); continue; }
  const lab = l.match(/^(Risiko|Risikominimierung):/);
  if (lab) { kids.push(P([run(lab[1] + '  ', { bold: true, color: BLAU }), run(l.slice(lab[0].length).trim())])); continue; }
  const klein = l.startsWith('Vorlagen:') || l.startsWith('Vorlage:') || l.startsWith('Zeichen:') || l.startsWith('Lesart:');
  kids.push(P([run(clean(l), klein ? { size: 16, color: GRAU } : {})], l.endsWith(':') ? { keepNext: true } : {}));
}

// Titelfeld mit Prozesszeile
const nb = { top: none, left: none, right: none, bottom: none };
const titel = new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [2268, W - 2268], rows: [
  new TableRow({ children: [cell([
      new Paragraph({ spacing: { after: 20 }, children: [run((kapitel[1] || kapitel[0] || '').toUpperCase(), { size: 15, color: 'D5DAEE', characterSpacing: 20 })] }),
      new Paragraph({ children: [run(val('kennung') + '  ', { size: 30, color: 'D5DAEE' }), run(fm.titel || '', { bold: true, size: 30, color: 'FFFFFF' })] })],
    W, { columnSpan: 2, shading: fill(BLAU), borders: nb, margins: { top: 160, bottom: 160, left: 200, right: 200 } })] }),
  new TableRow({ children: [
    cell([new Paragraph({ children: [run('Zugeordnete Prozesse', { bold: true, size: 18, color: BLAU })] })], 2268, { shading: fill(HELL), borders: nb, margins: { top: 90, bottom: 90, left: 200, right: 110 } }),
    cell([new Paragraph({ children: [run(val('prozesse'), { bold: true })] })], W - 2268, { shading: fill(HELL), borders: nb })] })] });

// Kopfzeile: Logo links, Angaben rechts, blaue Linie
const s8 = { size: 16, color: GRAU };
const R = children => new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 10 }, children });
const logo = new ImageRun({ type: 'jpg', data: fs.readFileSync(path.join(__dirname, 'logo-sws.jpeg')), transformation: { width: 196, height: 46 } });
const hb = { top: none, left: none, right: none, bottom: line(BLAU, 8) };
const header = new Header({ children: [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3600, W - 3600], rows: [new TableRow({ children: [
  cell([new Paragraph({ children: [logo] })], 3600, { borders: hb, verticalAlign: VerticalAlign.CENTER, margins: { top: 0, bottom: 80, left: 0, right: 0 } }),
  cell([R([run(kapitel.join(' · '), s8)]),
        R([run(`${val('kennung')} ${fm.titel || ''}`, { size: 17, bold: true, color: BLAU })]),
        R([run('Seite ', s8), new TextRun({ children: [PageNumber.CURRENT], font: FONT, ...s8 }), run(' von ', s8), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, ...s8 })])],
    W - 3600, { borders: hb, verticalAlign: VerticalAlign.CENTER, margins: { top: 0, bottom: 80, left: 0, right: 0 } })] })] }),
  gap(120)] });

// Fußzeile: Lenkungsangaben nach der Vorlage
const fw = [2267, 2268, 2268, 2267], ft = { top: line(LINIE, 6), left: none, right: none, bottom: none };
const fc = (label, value, i) => cell([
  new Paragraph({ spacing: { after: 0 }, children: [run(label.toUpperCase(), { size: 13, color: GRAU, characterSpacing: 15 })] }),
  new Paragraph({ children: [run(value, { size: 17, bold: value !== 'OFFEN', color: value === 'OFFEN' ? '8A6100' : TEXT })] })],
  fw[i], { borders: ft, margins: { top: 90, bottom: 0, left: i ? 110 : 0, right: 60 } });
const footer = new Footer({ children: [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: fw, rows: [new TableRow({ children: [
  fc('erstellt', val('erstellt'), 0), fc('geprüft', val('geprueft'), 1), fc('freigegeben', val('freigegeben'), 2),
  fc('Revision', `${val('revision')} · ${val('status')} · ${val('stand')}`, 3)] })] })] });

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 20, color: TEXT } } } },
  numbering: { config: [{ reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1', alignment: AlignmentType.LEFT,
    style: { run: { bold: true, color: BLAU, font: FONT }, paragraph: { indent: { left: 420, hanging: 420 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1900, right: 1418, bottom: 1500, left: 1418, header: 709, footer: 600 } } },
    headers: { default: header }, footers: { default: footer },
    children: [titel, gap(120), ...kids] }] });
Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log('geschrieben: ' + out); });
