#!/usr/bin/env python3
"""Render a private, standalone comment review page. Standard library only."""
import argparse
import json
from pathlib import Path
import re


def build(data):
    if not isinstance(data, dict) or not isinstance(data.get('items'), list):
        raise ValueError('Queue must be an object with an items array')
    if not isinstance(data.get('id'), str) or not data['id'].strip():
        raise ValueError('Queue needs a stable nonempty id for saved edits')
    ids = set()
    for item in data['items']:
        for field in ('id', 'title', 'url', 'community', 'summary', 'draft'):
            if not isinstance(item.get(field), str) or not item[field].strip():
                raise ValueError(f'Every item needs a nonempty {field}')
        if item['id'] in ids:
            raise ValueError('Item IDs must be unique')
        ids.add(item['id'])
        if not re.match(r'^https://[^\s/]+/', item['url']):
            raise ValueError('Thread URLs must be absolute HTTPS URLs')
    template = Path(__file__).resolve().parents[1] / 'assets' / 'review-queue.html'
    payload = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
    return re.sub(r'(?<=<script id="queue-data" type="application/json">).*?(?=</script>)',
                  lambda _: payload, template.read_text(), count=1, flags=re.S)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('queue', type=Path, help='JSON queue described in references/review-queue.md')
    parser.add_argument('--out', type=Path, required=True, help='Output HTML, outside the installed skill')
    args = parser.parse_args()
    html = build(json.loads(args.queue.read_text()))
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(html)
    print(f'Created {args.out}')


if __name__ == '__main__':
    main()
