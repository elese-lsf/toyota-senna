// Lee minutas/*.md y genera minutas/index.json. Sin dependencias (Node 18+).
import fs from 'node:fs';
import path from 'node:path';

const dir = 'minutas';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'));

function parse(f) {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
  const meta = {};
  let body = raw;
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    body = m[2];
  }
  const base = f.replace(/\.md$/, '');
  let parte = null;
  const resumen = [];
  const items = [];
  for (const l of body.split('\n')) {
    const h = l.match(/^##\s+(.*)$/);
    if (h) {
      const t = h[1].toLowerCase();
      parte = t.includes('senna') ? 'Senna' : (t.includes('elabs') ? 'eLabs' : null);
      continue;
    }
    if (l.trim().startsWith('|')) {
      if (!parte) continue;
      const c = l.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
      if (c.every(x => /^:?-{2,}:?$/.test(x))) continue;
      if (/^compromiso$/i.test(c[0])) continue;
      items.push({
        parte,
        txt: c[0] || '',
        resp: c[1] || '',
        cuando: c[2] || '',
        estado: /^(hecho|cumplido|listo|ok)/i.test(c[3] || '') ? 'hecho' : 'pendiente'
      });
    } else if (!parte && l.trim()) {
      resumen.push(l.trim());
    }
  }
  const fecha = meta.fecha || base.slice(0, 10);
  const [y, mo, d] = fecha.split('-');
  return {
    id: 'minuta-' + base,
    fecha,
    fechaTxt: `${d}/${mo}/${y}`,
    titulo: meta.titulo || base,
    origen: meta.origen || '',
    proxima: meta.proxima || '',
    proxima_tema: meta.proxima_tema || '',
    resumen: resumen.join(' '),
    items,
    pdf: fs.existsSync(path.join(dir, base + '.pdf')) ? `minutas/${base}.pdf` : ''
  };
}

const out = files.map(parse).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify(out, null, 2));
console.log(`${out.length} minutas procesadas`);
