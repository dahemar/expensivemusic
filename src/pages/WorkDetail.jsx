import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

function WorkDetail() {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullImage, setFullImage] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching data');
        const data = await response.json();
        const rows = data.values || [];
        // Find by slug built from title/date/type
        const targetSlug = decodeURIComponent(id || '').toLowerCase();
        const found = rows.find(row => {
          const [title = '', date = '', description = '', type = ''] = row;
          return buildSlug(title, date, type) === targetSlug;
        });
        if (!found) throw new Error('Work not found');
        setWork(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    if (isMobile) {
      return <main className="content"><div className="work-detail-mobile blog-post"><Link to="/works" className="back-button">&larr;</Link><p>loading...</p></div></main>;
    } else {
      return <main className="content"><div className="work-detail-block" style={{textAlign:'center',padding:'4rem 0'}}><p></p></div></main>;
    }
  }
  if (error) {
    if (isMobile) {
      return <main className="content"><div className="work-detail-mobile blog-post"><Link to="/works" className="back-button">&larr;</Link><p style={{color: 'red'}}>{error}</p></div></main>;
    } else {
      return <main className="content"><div className="work-detail-block" style={{textAlign:'center',padding:'4rem 0'}}><p style={{color: 'red'}}>{error}</p></div></main>;
    }
  }

  const [title = '', date = '', description = '', type = '', imageUrls = '', linkUrl = ''] = work;
  const images = imageUrls
    .split(',')
    .map(url => extractImageUrl(url.trim()))
    .filter(Boolean)
    .map(url => {
      if (url.startsWith('http')) return url;
      return `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`;
    });

  if (isMobile) {
    return (
      <main className="content content-work-detail">
        <div className="work-detail-mobile blog-post">
          <Link to="/works" className="back-button">&larr;</Link>
          {title && <div className="work-detail-title-small" style={{ fontWeight: 'normal', fontSize: '1rem', marginBottom: '0.2rem', fontFamily: 'inherit', color: '#181818' }}>title: {title}</div>}
          {date && <div className="work-detail-date-small" style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 'normal', fontFamily: 'inherit' }}>{date}</div>}
          {type && <div className="work-detail-type" style={{ color: '#888', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 'normal', fontFamily: 'inherit' }}>{type}</div>}
          {description && <div className="work-detail-description" style={{ fontWeight: 'normal', fontFamily: 'inherit', fontSize: '1rem', color: '#181818' }}>{description}</div>}
          {linkUrl ? (
            <div className="work-detail-video-embed" style={{marginTop:'1rem'}}>
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">{linkUrl}</a>
            </div>
          ) : (
            images.map((resourceUrl, idx) => {
              if (resourceUrl.match(/\.(mp4)$/i)) {
                return (
                  <video className="work-detail-image" controls preload="metadata" style={{background:'#000'}} key={idx}>
                    <source src={resourceUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                );
              } else if (resourceUrl.includes('youtube.com') || resourceUrl.includes('youtu.be')) {
                // Extraer videoId para embed (más robusto)
                let videoId = '';
                try {
                  // 1. youtu.be/VIDEOID
                  let match = resourceUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{8,})/);
                  if (match) videoId = match[1];
                  // 2. youtube.com/watch?v=VIDEOID
                  if (!videoId) {
                    match = resourceUrl.match(/[?&]v=([a-zA-Z0-9_-]{8,})/);
                    if (match) videoId = match[1];
                  }
                  // 3. youtube.com/shorts/VIDEOID
                  if (!videoId) {
                    match = resourceUrl.match(/shorts\/([a-zA-Z0-9_-]{8,})/);
                    if (match) videoId = match[1];
                  }
                  // 4. youtube.com/embed/VIDEOID
                  if (!videoId) {
                    match = resourceUrl.match(/embed\/([a-zA-Z0-9_-]{8,})/);
                    if (match) videoId = match[1];
                  }
                  // 5. Si aún no, intenta extraer tras último /
                  if (!videoId) {
                    const parts = resourceUrl.split('/');
                    videoId = parts[parts.length - 1];
                    // Elimina parámetros
                    videoId = videoId.split('?')[0].split('&')[0];
                  }
                  // Elimina cualquier carácter extraño
                  videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
                } catch (e) {}
                // Log temporal para depuración
                console.warn('YouTube resourceUrl:', resourceUrl, 'videoId:', videoId);
                if (videoId && videoId.length >= 8) {
                  return (
                    <div className="work-detail-video-embed" key={idx}>
                      <iframe width="100%" height="220" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen loading="lazy"></iframe>
                    </div>
                  );
                } else {
                  return (
                    <div className="work-detail-video-embed" key={idx}>
                      <a href={resourceUrl} target="_blank" rel="noopener noreferrer">see video on youtube</a>
                    </div>
                  );
                }
              } else if (resourceUrl.includes('vimeo.com')) {
                // Extraer el ID de Vimeo y usar player.vimeo.com/video/ID
                let vimeoId = '';
                const match = resourceUrl.match(/vimeo.com\/(\d+)/);
                if (match) vimeoId = match[1];
                if (vimeoId) {
                  return (
                    <div className="work-detail-video-embed" key={idx}>
                      <iframe width="100%" height="220" src={`https://player.vimeo.com/video/${vimeoId}`} frameBorder="0" allowFullScreen loading="lazy"></iframe>
                    </div>
                  );
                } else {
                  return (
                    <div className="work-detail-video-embed" key={idx}>
                      <a href={resourceUrl} target="_blank" rel="noopener noreferrer">see video on vimeo</a>
                    </div>
                  );
                }
              } else if (resourceUrl) {
                return (
                  <img src={resourceUrl} alt={title} className="work-detail-image" key={idx} onClick={() => setFullImage(resourceUrl)} style={{cursor:'zoom-in'}} />
                );
              } else {
                return null;
              }
            })
          )}
          {fullImage && (
            <div className="image-modal-overlay" onClick={() => setFullImage(null)}>
              <img src={fullImage} alt="full" className="image-modal-full" onClick={() => setFullImage(null)} />
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="container">
      <main className="content content-work-detail">
        <div className="work-detail-header">
          {/* Solo renderizar la flecha cuando loading y error son false */}
          <Link to="/works" className="back-button">&larr;</Link>
        </div>
        <div className="work-detail-container">
          <div className="work-detail-block">
            <div className="work-detail-meta" style={{marginTop: 0, paddingTop: 0}}>
              {title && <div className="work-detail-title-small" style={{ fontWeight: 'normal', fontSize: '1rem', marginBottom: '0.2rem', marginTop: 0, fontFamily: 'inherit', color: '#181818' }}>title: {title}</div>}
              {date && <div className="work-detail-date-small" style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 'normal', fontFamily: 'inherit' }}>{date}</div>}
              {type && <div className="work-detail-type" style={{ color: '#888', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 'normal', fontFamily: 'inherit' }}>{type}</div>}
              {description && <div className="work-detail-description" style={{ fontWeight: 'normal', fontFamily: 'inherit', fontSize: '1rem', color: '#181818' }}>{description}</div>}
            </div>
            {linkUrl ? (
              <div className="work-detail-video-embed" style={{marginTop:'1rem'}}>
                <a href={linkUrl} target="_blank" rel="noopener noreferrer">{linkUrl}</a>
              </div>
            ) : (
              images.map((resourceUrl, idx) => {
                if (resourceUrl.match(/\.(mp4)$/i)) {
                  return (
                    <video className="work-detail-image" controls preload="metadata" style={{background:'#000'}} key={idx}>
                      <source src={resourceUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else if (resourceUrl.includes('youtube.com') || resourceUrl.includes('youtu.be')) {
                  // Extraer videoId para embed (más robusto)
                  let videoId = '';
                  try {
                    // 1. youtu.be/VIDEOID
                    let match = resourceUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{8,})/);
                    if (match) videoId = match[1];
                    // 2. youtube.com/watch?v=VIDEOID
                    if (!videoId) {
                      match = resourceUrl.match(/[?&]v=([a-zA-Z0-9_-]{8,})/);
                      if (match) videoId = match[1];
                    }
                    // 3. youtube.com/shorts/VIDEOID
                    if (!videoId) {
                      match = resourceUrl.match(/shorts\/([a-zA-Z0-9_-]{8,})/);
                      if (match) videoId = match[1];
                    }
                    // 4. youtube.com/embed/VIDEOID
                    if (!videoId) {
                      match = resourceUrl.match(/embed\/([a-zA-Z0-9_-]{8,})/);
                      if (match) videoId = match[1];
                    }
                    // 5. Si aún no, intenta extraer tras último /
                    if (!videoId) {
                      const parts = resourceUrl.split('/');
                      videoId = parts[parts.length - 1];
                      // Elimina parámetros
                      videoId = videoId.split('?')[0].split('&')[0];
                    }
                    // Elimina cualquier carácter extraño
                    videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
                  } catch (e) {}
                  // Log temporal para depuración
                  console.warn('YouTube resourceUrl:', resourceUrl, 'videoId:', videoId);
                  if (videoId && videoId.length >= 8) {
                    return (
                      <div className="work-detail-video-embed" key={idx}>
                        <iframe width="100%" height="400" src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allowFullScreen loading="lazy"></iframe>
                      </div>
                    );
                  } else {
                    return (
                      <div className="work-detail-video-embed" key={idx}>
                        <a href={resourceUrl} target="_blank" rel="noopener noreferrer">see video on youtube</a>
                      </div>
                    );
                  }
                } else if (resourceUrl.includes('vimeo.com')) {
                  // Extraer el ID de Vimeo y usar player.vimeo.com/video/ID
                  let vimeoId = '';
                  const match = resourceUrl.match(/vimeo.com\/(\d+)/);
                  if (match) vimeoId = match[1];
                  if (vimeoId) {
                    return (
                      <div className="work-detail-video-embed" key={idx}>
                        <iframe width="100%" height="400" src={`https://player.vimeo.com/video/${vimeoId}`} frameBorder="0" allowFullScreen loading="lazy"></iframe>
                      </div>
                    );
                  } else {
                    return (
                      <div className="work-detail-video-embed" key={idx}>
                        <a href={resourceUrl} target="_blank" rel="noopener noreferrer">see video on vimeo</a>
                      </div>
                    );
                  }
                } else if (resourceUrl) {
                  return (
                    <img src={resourceUrl} alt={title} className="work-detail-image" key={idx} onClick={() => setFullImage(resourceUrl)} style={{cursor:'zoom-in'}} />
                  );
                } else {
                  return null;
                }
              })
            )}
            {fullImage && (
              <div className="image-modal-overlay" onClick={() => setFullImage(null)}>
                <img src={fullImage} alt="full" className="image-modal-full" onClick={() => setFullImage(null)} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default WorkDetail; 