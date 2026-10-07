#!/usr/bin/env python3
"""Rebuild the kit's six Claude skill uploads and integrity manifest, offline."""
import hashlib
import io
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = {'.md', '.txt', '.csv', '.py', '.html', '.json', '.yaml', '.yml'}


def archive(entries):
    output = io.BytesIO()
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as target:
        for name, content in sorted(entries.items()):
            info = zipfile.ZipInfo(name, date_time=(2026, 10, 7, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            target.writestr(info, content, compresslevel=9)
    return output.getvalue()


def build():
    entries = {}
    for path in sorted(ROOT.rglob('*')):
        relative = path.relative_to(ROOT)
        if any(part.startswith('.') or part in {'__pycache__', 'claude-upload', 'dist'} for part in relative.parts):
            continue
        if path.is_symlink():
            raise ValueError(f'Refusing symlink: {relative}')
        if not path.is_file() or relative.as_posix() == 'CONTENTS.json':
            continue
        if path.suffix not in EXTENSIONS and path.name not in {'LICENSE', 'NOTICE'}:
            raise ValueError(f'Unexpected resource: {relative}')
        entries[relative.as_posix()] = path.read_bytes()
    for skill in sorted((ROOT / 'skills').glob('*/SKILL.md')):
        prefix = f'skills/{skill.parent.name}/'
        content = archive({f'{skill.parent.name}/{name[len(prefix):]}': data
                           for name, data in entries.items() if name.startswith(prefix)})
        name = f'claude-upload/{skill.parent.name}.zip'
        (ROOT / name).parent.mkdir(parents=True, exist_ok=True)
        (ROOT / name).write_bytes(content)
        entries[name] = content
    manifest = {'edition': '2026-10-07', 'pack': 'kit', 'files': [
        {'path': name, 'bytes': len(content), 'sha256': hashlib.sha256(content).hexdigest()}
        for name, content in sorted(entries.items())]}
    (ROOT / 'CONTENTS.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
    print(f'Rebuilt {len(list((ROOT / "skills").glob("*/SKILL.md")))} skill ZIPs; {len(entries)} manifest entries')


if __name__ == '__main__':
    build()
