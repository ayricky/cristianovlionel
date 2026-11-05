"""Fetch YouTube's own storyboard sheets for a clip so a goal's timestamp can be read off by eye. argv: outdir id..."""
import json, pathlib, subprocess, sys, urllib.request
out = pathlib.Path(sys.argv[1])
for vid in sys.argv[2:]:
    r = subprocess.run(['uv', 'run', '--with', 'yt-dlp', 'yt-dlp', '--no-warnings', '-J', '--skip-download', f'https://www.youtube.com/watch?v={vid}'], capture_output=True, text=True)
    if r.returncode:
        print(vid, 'ERR', r.stderr[-120:]); continue
    d = json.loads(r.stdout)
    sb = [f for f in d['formats'] if f.get('format_note') == 'storyboard']
    if not sb:
        print(vid, 'no storyboard'); continue
    f = sb[-1] if sb[-1].get('height', 0) >= sb[0].get('height', 0) else sb[0]
    best = max(sb, key=lambda x: (x.get('width') or 0))
    frags = best.get('fragments') or []
    print(vid, d['title'][:60], d['duration'], 'embed', d.get('playable_in_embed'), best['format_id'], best.get('rows'), best.get('columns'), len(frags), round(frags[0].get('duration', 0)) if frags else '')
    for i, fr in enumerate(frags[:24]):
        p = out / f'{vid}_{i}.jpg'
        try:
            p.write_bytes(urllib.request.urlopen(urllib.request.Request(fr['url'], headers={'User-Agent': 'Mozilla/5.0'}), timeout=20).read())
        except Exception as e:
            print('  frag fail', i, type(e).__name__)
