import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useEffect, useState } from 'react';
import { resolveImageUrl } from '../utils/imageUtils';

const SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const RANGE = 'Music!A2:F';
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

function Music() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImg, setModalImg] = useState(null);
  const [modalAlt, setModalAlt] = useState('');

  useEffect(() => {
    async function fetchMusic() {
      try {
        const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching music data');
        const data = await response.json();
        const rows = (data.values || []).map(row => ({
          name: row[0] || '',
          bandcampUrl: row[1] || '',
          soundcloudUrl: row[2] || '',
          ninaUrl: row[3] || '',
          description: row[4] || '',
          thumbnail: row[5] || '',
        })).filter(project => project.name);
        setProjects(rows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMusic();
  }, []);

  const openModal = (src, alt) => {
    setModalImg(src);
    setModalAlt(alt);
  };
  const closeModal = () => setModalImg(null);
  return (
    <div className="container">
      <main className="content">
        <div className="section-content">
          {error && <p style={{color: 'red'}}>{error}</p>}
          {!loading && !error && (
            <div className="music-projects">
              {projects.map((project, index) => {
                const thumbnail = resolveImageUrl(project.thumbnail, import.meta.env.BASE_URL);
                return (
                  <div className="music-project" key={`${project.name}-${index}`}>
                    <div className="music-project-info">
                      <h2>{project.name}</h2>
                      {project.bandcampUrl && <p><a href={project.bandcampUrl} target="_blank" className="music-link" rel="noopener noreferrer">bandcamp</a></p>}
                      {project.soundcloudUrl && <p><a href={project.soundcloudUrl} target="_blank" className="music-link" rel="noopener noreferrer">soundcloud</a></p>}
                      {project.ninaUrl && <p><a href={project.ninaUrl} target="_blank" className="music-link" rel="noopener noreferrer">nina</a></p>}
                    </div>
                    {thumbnail && (
                      <div className="music-thumbnail-container">
                        <img src={thumbnail} alt={project.description || project.name} className="music-thumbnail" style={{cursor:'zoom-in'}} onClick={() => openModal(thumbnail, project.description || project.name)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {modalImg && (
          <div className="image-modal-overlay" onClick={closeModal}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <img src={modalImg} alt={modalAlt} className="image-modal-full" style={{maxHeight:'80vh',maxWidth:'95vw'}} onClick={closeModal} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Music; 