from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
root = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.refs=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f"Duplicate id: {attrs['id']}"
            self.ids.add(attrs['id'])
        for key in ['src','href']:
            if key in attrs: self.refs.append(attrs[key])
p=Page(); p.feed((root/'index.html').read_text())
for ref in p.refs:
    u=urlparse(ref)
    if u.scheme or u.netloc: continue
    if u.path: assert (root/u.path).is_file(), f'Missing asset: {ref}'
    elif u.fragment: assert u.fragment in p.ids, f'Missing anchor: {ref}'
print('PASS: local links, assets and unique anchors')
