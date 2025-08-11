import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';

const SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const RANGE = 'Works!A2:F';
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function slugify(input) {
  return (input || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function buildSlug(title, date, type) {
  const parts = [title || '', date || '', type || ''];
  return slugify(parts.filter(Boolean).join('-')) || slugify(`${title || 'untitled'}-${date || ''}`);
}

const columns = [
  { key: 'title', label: 'title' },
  { key: 'date', label: 'date' },
  { key: 'description', label: 'description' },
  { key: 'type', label: 'type' },
];

function Works() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState({ col: 'date', dir: 'desc', userClicked: false });
  const [modalImg, setModalImg] = useState(null);
  const [modalAlt, setModalAlt] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching data');
        const data = await response.json();
        setRows(data.values || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Ordenar los datos
  let sortedRows = [...rows];
  if (!isMobile && sort.col) {
    sortedRows.sort((a, b) => {
      const idx = columns.findIndex(c => c.key === sort.col);
      if (idx === 1) { // date
        const aDate = a[1] ? new Date(a[1]) : new Date(0);
        const bDate = b[1] ? new Date(b[1]) : new Date(0);
        return sort.dir === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        const av = (a[idx] || '').toLowerCase();
        const bv = (b[idx] || '').toLowerCase();
        if (av < bv) return sort.dir === 'asc' ? -1 : 1;
        if (av > bv) return sort.dir === 'asc' ? 1 : -1;
        return 0;
      }
    });
  }

  const arrow = sort.dir === 'asc' ? '↓' : '↑';

  return (
    <div className="container">
      <main className="content content-works">
        <section className="works-section" id="works">
          <div id="works-table-container" className="works-table-container">
            {error && <p style={{color: 'red'}}>{error}</p>}
            {!loading && !error && (
              <Fragment>
              <table className="works-table">
                <thead>
                  <tr>
                    {isMobile ? (
                      <>
                        <th>title</th>
                        <th>description</th>
                      </>
                    ) : (
                      <>
                        {columns.map(col => (
                          <th
                            key={col.key}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSort(s => ({ col: col.key, dir: s.col === col.key ? (s.dir === 'asc' ? 'desc' : 'asc') : 'asc', userClicked: true }))}
                          >
                            {col.label}
                            {sort.col === col.key && sort.userClicked && <span className="sort-arrow"> {arrow}</span>}
                          </th>
                        ))}
                        <th>𓁹</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row, i) => {
                    const [title = '', date = '', description = '', type = '', imageUrls = '', linkUrl = ''] = row;
                    const isVideoLink = linkUrl && (linkUrl.match(/\.(mp4)$/i) || linkUrl.includes('youtube.com') || linkUrl.includes('youtu.be') || linkUrl.includes('vimeo.com'));
                    const useExternal = linkUrl && !isVideoLink;
                    const slug = buildSlug(title, date, type);
                    // Extra: thumbnails para commissions
                    const images = (imageUrls || '').split(',').map(x => x.trim()).filter(Boolean);
                    if (isMobile) {
                      // Móvil: solo dos columnas
                      let descType = description;
                      if (type) descType = descType ? descType + ', ' + type : type;
                      return (
                        <tr key={i}>
                          <td className="mobile-title">
                            <button className="view-work" onClick={() => navigate(`/work/${encodeURIComponent(slug)}`)} style={{textDecoration: 'underline', background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: 0, font: 'inherit'}}>
                              {title || 'untitled'}
                            </button>
                            {/* Thumbnails commissions en móvil */}
                            {type.toLowerCase() === 'commissions' && images.length > 0 && (
                              <div style={{marginTop:'0.5rem', display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                                {images.map((img, idx) => {
                                  const imgSrc = img.startsWith('http') ? img : `${import.meta.env.BASE_URL}${img.replace(/^\//, '')}`;
                                  return <img key={idx} src={imgSrc} alt={title} style={{width:60, height:60, objectFit:'cover', cursor:'zoom-in', borderRadius:0}} onClick={() => { setModalImg(imgSrc); setModalAlt(title); }} />;
                                })}
                              </div>
                            )}
                          </td>
                          <td>{descType}</td>
                        </tr>
                      );
                    } else {
                      // Desktop: tabla completa
                      return (
                        <tr key={i}>
                          <td>{title}</td>
                          <td>{date}</td>
                          <td>{description}</td>
                          <td>{type}
                            {/* Thumbnails commissions en desktop */}
                            {type.toLowerCase() === 'commissions' && images.length > 0 && (
                              <div style={{marginTop:'0.5rem', display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                                {images.map((img, idx) => {
                                  const imgSrc = img.startsWith('http') ? img : `${import.meta.env.BASE_URL}${img.replace(/^\//, '')}`;
                                  return <img key={idx} src={imgSrc} alt={title} style={{width:60, height:60, objectFit:'cover', cursor:'zoom-in', borderRadius:0}} onClick={() => { setModalImg(imgSrc); setModalAlt(title); }} />;
                                })}
                              </div>
                            )}
                          </td>
                          <td>
                            <button className="view-work" onClick={() => navigate(`/work/${encodeURIComponent(slug)}`)}>
                              view
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
              {/* Modal para ampliar imágenes */}
              {modalImg && (
                <div className="image-modal-overlay" onClick={() => setModalImg(null)}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                    <img src={modalImg} alt={modalAlt} className="image-modal-full" style={{maxHeight:'80vh',maxWidth:'95vw'}} onClick={e => e.stopPropagation()} />
                  </div>
                </div>
              )}
              </Fragment>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Works; 