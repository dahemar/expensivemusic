import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useState } from 'react';

function Music() {
  const [modalImg, setModalImg] = useState(null);
  const [modalAlt, setModalAlt] = useState('');
  const openModal = (src, alt) => {
    setModalImg(src);
    setModalAlt(alt);
  };
  const closeModal = () => setModalImg(null);
  return (
    <div className="container">
      <main className="content">
        <div className="section-content">
          <div className="music-projects">
            <div className="music-project">
              <div className="music-project-info">
                <h2>angelito</h2>
                <p><a href="https://angelito17.bandcamp.com/album/malice-roadshow-starting-a-fight" target="_blank" className="music-link" rel="noopener noreferrer">bandcamp</a></p>
                <p><a href="https://on.soundcloud.com/ULwhgDYD9dbYHwFsQe" target="_blank" className="music-link" rel="noopener noreferrer">soundcloud</a></p>
                <p><a href="https://www.ninaprotocol.com/releases/angelito-malice-roadshow-starting-a-fight" target="_blank" className="music-link" rel="noopener noreferrer">nina</a></p>
              </div>
              <div className="music-thumbnail-container">
                <img src={`${import.meta.env.BASE_URL}music/malice.jpg`} alt="angelito malice" className="music-thumbnail" style={{cursor:'zoom-in'}} onClick={() => openModal(`${import.meta.env.BASE_URL}music/malice.jpg`, 'angelito malice')} />
              </div>
            </div>
            <div className="music-project">
              <div className="music-project-info">
                <h2>babyfloating</h2>
                <p><a href="https://babyfloating.bandcamp.com/album/babysmoking" target="_blank" className="music-link" rel="noopener noreferrer">bandcamp</a></p>
                <p><a href="https://on.soundcloud.com/XdokOAao7QmTZtzJTd" target="_blank" className="music-link" rel="noopener noreferrer">soundcloud</a></p>
                <p><a href="https://www.ninaprotocol.com/releases/babyfloating-babysmoking?ref=joni" target="_blank" className="music-link" rel="noopener noreferrer">nina</a></p>
              </div>
              <div className="music-thumbnail-container">
                <img src={`${import.meta.env.BASE_URL}music/babysmoking.jpg`} alt="babyfloating babysmoking" className="music-thumbnail" style={{cursor:'zoom-in'}} onClick={() => openModal(`${import.meta.env.BASE_URL}music/babysmoking.jpg`, 'babyfloating babysmoking')} />
              </div>
            </div>
            <div className="music-project">
              <div className="music-project-info">
                <h2>club prizren</h2>
                <p><a href="https://clubprizren.bandcamp.com/album/club-prizren" target="_blank" className="music-link" rel="noopener noreferrer">bandcamp</a></p>
                <p><a href="https://on.soundcloud.com/5TynDngvW5TnY4UzwR" target="_blank" className="music-link" rel="noopener noreferrer">soundcloud</a></p>
                <p><a href="https://www.ninaprotocol.com/releases/club-prizren-club-prizren" target="_blank" className="music-link" rel="noopener noreferrer">nina</a></p>
              </div>
              <div className="music-thumbnail-container">
                <img src={`${import.meta.env.BASE_URL}music/club.jpg`} alt="club prizren" className="music-thumbnail" style={{cursor:'zoom-in'}} onClick={() => openModal(`${import.meta.env.BASE_URL}music/club.jpg`, 'club prizren')} />
              </div>
            </div>
          </div>
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