#!/usr/bin/env python3
"""Erzeugt handbuch/playbook.md aus standards/leitorientierungen.md und den Zeilen
„Leitorientierung:" der Dokumente in handbuch/. Aufruf aus dem Wurzelordner: python3 tools/playbook.py"""
import glob, re, datetime
kopf = open('standards/leitorientierungen.md', encoding='utf8').read()
teil = lambda t: re.search(r'(?ms)^## ' + t + r'\n\n(.*?)(?=^## |\Z)', kopf).group(1).strip()
kapitel = {}
for z in open('handbuch/gliederung.md', encoding='utf8'):
    m = re.match(r'\| (\d+) \| ([^|]+) \| 1 \|', z)
    if m: kapitel[m.group(1)] = m.group(2).strip()
docs = []
for f in sorted(glob.glob('handbuch/*.md')):
    s = open(f, encoding='utf8').read()
    lo = re.search(r'(?m)^Leitorientierung: (.+)$', s)
    if not lo or f.endswith('playbook.md'): continue
    get = lambda k: (re.search(r'(?m)^' + k + r': *"?([^"\n]*)"?$', s) or [None, ''])[1]
    kap = re.search(r'(?m)^Kapitel: (\d+)', s)
    docs.append((kap.group(1) if kap else '', get('kennung'), get('titel'), lo.group(1), get('status')))
key = lambda d: ([int(x) for x in re.findall(r'\d+', d[1])] if d[1] else [int(d[0] or 0), 0, 0, 0], d[1].startswith('F'), d[1], d[2])
heute = datetime.date.today().strftime('%d.%m.%Y')
out = ['---', 'titel: Playbook QM', 'textart: Zusammenfassung der Leitorientierungen', 'prozesse: alle Prozesse', 'revision: "001"',
       'stand: ' + heute, 'status: Entwurf', 'erstellt: OFFEN', 'geprueft: QMB', 'freigegeben: Geschäftsführung', '---', '',
       '# Playbook QM', '', 'Kapitel: QM-Handbuch · Leitorientierungen auf einen Blick', '', 'Zugeordnete Prozesse: alle Prozesse', '',
       '## 1 Oberster Grundsatz', '', teil('Oberster Grundsatz'), '', '## 2 Leitsätze', '', teil('Leitsätze'), '', '## 3 Leitlinie', '', teil('Leitlinie'), '',
       '## 4 Festlegungen in Kürze', '', teil('Festlegungen in Kürze'), '', '## 5 Dokumente in Kürze', '']
for k in sorted({d[0] for d in docs}, key=lambda x: int(x or 0)):
    out += ['### Kapitel ' + k + ' ' + kapitel.get(k, ''), '', '| Dokument | Leitorientierung |', '|---|---|']
    for d in sorted([d for d in docs if d[0] == k], key=key):
        name = (d[1] + ' ' + d[2]).strip() + (' (Entwurf)' if d[4] == 'Entwurf' else '')
        out.append('| ' + name + ' | ' + d[3] + ' |')
    out.append('')
out += ['Kapitel ohne Eintrag sind noch nicht überführt; ihre Leitorientierungen folgen mit der Überführung.', '',
        '## Risikobetrachtung', '', 'Risiko: Leitorientierung und Dokument weichen voneinander ab.', '',
        'Risikominimierung: Das Playbook wird aus den Dokumenten erzeugt und nicht von Hand geändert.', '',
        '## Reflexion und Weiterentwicklung', '', 'Leitfrage zur Reflexion des Handelns:', '',
        '1. Arbeitet das QM für die Praxis, oder arbeitet die Praxis für das QM?', '',
        'Erzeugt aus `standards/leitorientierungen.md` und den Leitorientierungen der Dokumente; nicht von Hand ändern.', '']
open('handbuch/playbook.md', 'w', encoding='utf8').write('\n'.join(out))
print('geschrieben: handbuch/playbook.md,', len(docs), 'Dokumente')
