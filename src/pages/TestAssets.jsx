import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useEffect, useState } from 'react';
import { resolveImageUrl, isImgurUrl } from '../utils/imageUtils';

const SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const RANGE = 'Works!A2:F';
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

function extractImageUrl(rawUrl) {
  if (!rawUrl) return '';
  const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i);
  if (match) {
    return match[1].trim();
  }
  return rawUrl.trim();
}

export default function TestAssets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error fetching data');
        const data = await res.json();
        const rows = data.values || [];
        const out = [];
        for (const row of rows) {
          const [title = '', date = '', description = '', type = '', imageUrls = '', linkUrl = ''] = row;
          const paths = (imageUrls || '').split(',').map(s => s.trim()).filter(Boolean);
          for (const p of paths) {
            const raw = extractImageUrl(p);
            if (!raw) continue;
            const resolved = resolveImageUrl(p, import.meta.env.BASE_URL);
            out.push({ title, date, type, raw, resolved, isImgur: isImgurUrl(raw) });
          }
        }
        setItems(out);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = items.filter(x => !filter || x.raw.toLowerCase().includes(filter.toLowerCase()) || x.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="container">
      <main className="content">
        <section className="works-section">
          <h2>assets test</h2>
          <div style={{margin:'1rem 0'}}>
            <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="filter by path or title" style={{padding:'0.4rem', width:'100%', maxWidth:400}} />
          </div>
          {error && <p style={{color:'red'}}>{error}</p>}
          {loading ? <p>loading...</p> : (
            <table className="works-table" style={{width:'100%', maxWidth:1000}}>
              <thead>
                <tr>
                  <th>title</th>
                  <th>path</th>
                  <th>url</th>
                  <th>preview</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it, idx) => (
                  <tr key={idx} style={it.isImgur ? {backgroundColor: '#fff3cd'} : {}}>
                    <td>{it.title}</td>
                    <td>
                      <code>{it.raw}</code>
                      {it.isImgur && <span style={{color:'#856404', marginLeft:'0.5rem', fontSize:'0.85em'}}>⚠️ imgur (proxied)</span>}
                    </td>
                    <td><a href={it.resolved} target="_blank" rel="noopener noreferrer">{it.resolved}</a></td>
                    <td>
                      {it.resolved.match(/\.(mp4)$/i) ? (
                        <span>video</span>
                      ) : (
                        <img src={it.resolved} alt={it.title} style={{width:80, height:80, objectFit:'cover'}} onError={(e) => { e.target.style.border = '2px solid red'; e.target.alt = 'Failed to load'; }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
} 