import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useState } from 'react';

function Commercial() {
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
        <section className="works-section">
          <h2>commercial work</h2>
          <div id="commercial-posts" className="blog-container">
            {[1,2,3,4,5,6,7,8,9,10].map(num => {
              const imgSrc = `${import.meta.env.BASE_URL}commercial/${num}.webp`;
              return (
                <div className="blog-post" key={num}>
                  <img src={imgSrc} alt={`commercial ${num}`} style={{cursor:'zoom-in'}} onClick={() => openModal(imgSrc, `commercial ${num}`)} />
                </div>
              );
            })}
          </div>
          {modalImg && (
            <div className="image-modal-overlay" onClick={closeModal}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <img src={modalImg} alt={modalAlt} className="image-modal-full" style={{maxHeight:'80vh',maxWidth:'95vw'}} onClick={closeModal} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Commercial; 