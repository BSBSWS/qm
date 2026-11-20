#!/bin/sh
# Erzeugt alle Word-Ausgaben und je Prozessdokument das Ablaufblatt (Word, PDF, PNG).
# Aufruf aus dem Wurzelordner des Repositorys: sh tools/export-alle.sh
set -e
for f in handbuch/[0-9]*.md; do
  kennung=$(sed -n 's/^kennung: *"\{0,1\}\([0-9.]*\)"\{0,1\}$/\1/p' "$f")
  name=$(basename "$f" .md)
  node tools/export-docx.js "$f" "export/$name.docx"
  if grep -q '^## [0-9]* *Ablauf' "$f"; then
    node tools/export-docx.js "$f" "export/ablauf/${name}_ablauf.docx" --ablauf
    soffice --headless --convert-to pdf --outdir export/ablauf "export/ablauf/${name}_ablauf.docx" >/dev/null 2>&1
  fi
done
