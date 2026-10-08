#!/usr/bin/env python3
"""Offline campaign helpers. No network access, account access or publishing."""
import argparse
import csv
import ipaddress
import sys
from datetime import date
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

SCORES = {'pain': 3, 'intent': 3, 'fit': 3, 'freshness': 2, 'helpfulness': 2}
REQUIRED = ['lead_id', 'thread_url', 'problem_evidence', *SCORES,
            'rules_status', 'rules_url', 'rules_checked_at', 'thread_status',
            'already_contacted']
DERIVED = ['score', 'priority', 'eligibility', 'hold_reason']


def public_https(value):
    try:
        parts = urlsplit(value.strip())
        host = (parts.hostname or '').lower()
        if parts.scheme != 'https' or not host or parts.username or parts.password:
            return False
        if host == 'localhost' or '.' not in host:
            return False
        if host in {'example.com', 'example.org', 'example.net'} or host.endswith(('.example', '.test', '.invalid', '.localhost')):
            return False
        try:
            return ipaddress.ip_address(host).is_global
        except ValueError:
            return True
    except ValueError:
        return False


def key_url(value):
    try:
        parts = urlsplit(value.strip())
        host = (parts.hostname or '').lower()
        if host in {'www.reddit.com', 'old.reddit.com', 'new.reddit.com'}:
            host = 'reddit.com'
        query = '' if host == 'reddit.com' else parts.query
        return urlunsplit((parts.scheme.lower(), host, parts.path.rstrip('/'), query, ''))
    except ValueError:
        return value.strip()


def iso_date(value):
    try:
        return date.fromisoformat(value.strip()) <= date.today()
    except ValueError:
        return False


def evaluate(row):
    reasons, values = [], {}
    for field, limit in SCORES.items():
        value = row.get(field, '').strip()
        if not value.isdigit() or not 0 <= int(value) <= limit:
            reasons.append(f'{field} must be an integer 0-{limit}')
        else:
            values[field] = int(value)
    score = sum(values.values()) if len(values) == len(SCORES) else ''
    if not public_https(row.get('thread_url', '')):
        reasons.append('real public HTTPS thread URL required')
    if row.get('lead_id', '').upper().startswith('SAMPLE'):
        reasons.append('sample row')
    if not row.get('problem_evidence', '').strip():
        reasons.append('problem evidence missing')
    if values.get('fit', 0) < 2:
        reasons.append('insufficient product fit')
    if values.get('helpfulness', 0) < 1:
        reasons.append('useful answer missing')
    if row.get('rules_status', '').strip().lower() != 'allowed':
        reasons.append('rules not verified allowed')
    if not public_https(row.get('rules_url', '')) or not iso_date(row.get('rules_checked_at', '')):
        reasons.append('rules URL and valid check date required')
    if row.get('thread_status', '').strip().lower() != 'open':
        reasons.append('thread not verified open')
    if row.get('already_contacted', '').strip().lower() != 'no':
        reasons.append('existing contact not ruled out')
    if row.get('status', '').strip().lower() in {'posted', 'skipped'}:
        reasons.append('row already posted or skipped')
    priority = 'unknown' if score == '' else 'high' if score >= 10 else 'medium' if score >= 7 else 'low'
    return {**row, 'score': score, 'priority': priority,
            'eligibility': 'hold' if reasons else 'draft-ready',
            'hold_reason': '; '.join(reasons)}


def spreadsheet_safe(value):
    """Prevent source text being interpreted as a spreadsheet formula on import."""
    if isinstance(value, str) and value.lstrip().startswith(('=', '+', '-', '@')):
        return "'" + value
    return value


def rank(input_path, output_path):
    with Path(input_path).open(newline='', encoding='utf-8-sig') as source:
        reader = csv.DictReader(source)
        fields = reader.fieldnames or []
        missing = [field for field in REQUIRED if field not in fields]
        if missing:
            raise ValueError('Missing CSV columns: ' + ', '.join(missing))
        if len(fields) != len(set(fields)):
            raise ValueError('Duplicate CSV columns')
        rows = list(reader)
    seen, ranked = set(), []
    for row in rows:
        if None in row or any(value is None for value in row.values()):
            raise ValueError('Malformed CSV row; check quoting and column count')
        url = key_url(row['thread_url'])
        if url and url in seen:
            continue
        if url:
            seen.add(url)
        ranked.append(evaluate(row))
    ranked.sort(key=lambda row: (row['eligibility'] != 'draft-ready',
                                -(row['score'] if row['score'] != '' else -1),
                                row['lead_id']))
    output_fields = [field for field in fields if field not in DERIVED] + DERIVED
    # Exclusive create keeps source and prior campaign output safe from accidental overwrite.
    with Path(output_path).open('x', newline='', encoding='utf-8') as target:
        writer = csv.DictWriter(target, fieldnames=output_fields)
        writer.writeheader()
        writer.writerows({k: spreadsheet_safe(v) for k, v in row.items()} for row in ranked)
    print(f'Wrote {len(ranked)} unique rows to {output_path}; draft-ready is based on supplied fields, not a live verification. No publication authorized or performed.')


def make_utm(url, source, campaign, content, medium='community'):
    # Placeholder domains are useful for offline link tests, but HTTPS/no credentials remain required.
    parts = urlsplit(url)
    if parts.scheme != 'https' or not parts.hostname or parts.username or parts.password:
        raise ValueError('Use an HTTPS destination with no embedded credentials')
    values = {'utm_source': source, 'utm_medium': medium, 'utm_campaign': campaign, 'utm_content': content}
    if any(not value.strip() for value in values.values()):
        raise ValueError('UTM values must not be blank')
    query = [(key, value) for key, value in parse_qsl(parts.query, keep_blank_values=True) if key not in values]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query + list(values.items())), parts.fragment))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    ranking = commands.add_parser('rank', help='Rank a supplied lead CSV into a new file; no browsing or posting')
    ranking.add_argument('input')
    ranking.add_argument('--out', required=True)
    tracking = commands.add_parser('utm', help='Create a campaign URL locally; does not install analytics')
    tracking.add_argument('url')
    tracking.add_argument('--source', required=True)
    tracking.add_argument('--medium', default='community')
    tracking.add_argument('--campaign', required=True)
    tracking.add_argument('--content', required=True)
    args = parser.parse_args()
    try:
        if args.command == 'rank':
            rank(args.input, args.out)
        else:
            print(make_utm(args.url, args.source, args.campaign, args.content, args.medium))
    except (OSError, ValueError, csv.Error) as error:
        parser.exit(1, f'Error: {error}\n')


if __name__ == '__main__':
    main()
