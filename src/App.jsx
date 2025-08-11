import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './styles.css';
import './sidebar.css';
import './glitch.css';
import Works from './pages/Works';
import Music from './pages/Music';
import Radio from './pages/Radio';
import Contact from './pages/Contact';
import WorkDetail from './pages/WorkDetail';
import { useState, useEffect } from 'react';

function SidebarWithLocation() {
  const location = useLocation();
  return (
    <nav className="sidebar">
      <ul>
        <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : undefined}>blog</NavLink></li>
        <li><NavLink to="/works" className={() => (location.pathname.startsWith('/works') || location.pathname.startsWith('/work/')) ? 'active' : undefined}>works</NavLink></li>
        <li><NavLink to="/music" className={({ isActive }) => isActive ? 'active' : undefined}>music</NavLink></li>
        <li><NavLink to="/radio" className={({ isActive }) => isActive ? 'active' : undefined}>radio</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : undefined}>contact</NavLink></li>
      </ul>
    </nav>
  );
}

const BLOG_SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const BLOG_API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const BLOG_RANGE = 'Blog!A2:D';
const BLOG_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

function extractImageUrl(rawUrl) {
  if (!rawUrl) return '';
  const match = rawUrl.match(/\[img\](.+?)\[\/img\]/i);
  if (match) {
    return match[1].trim();
  }
  return rawUrl.trim();
}

function Blog({ onImageClick, blogPosts }) {
  return (
    <main className="content">
      <div id="blog-posts" className="blog-container">
        {blogPosts.map((post, idx) => {
          const cleanUrl = extractImageUrl(post.imageUrl);
          // Usar BASE_URL para rutas relativas
          const imgSrc = cleanUrl.startsWith('http') ? cleanUrl : `${import.meta.env.BASE_URL}${cleanUrl.replace(/^\//, '')}`;
          return (
            <div className="blog-post" key={idx} data-description={post.description || ''}>
              <img src={imgSrc} alt={post.title || `blog ${idx+1}`} className="work-detail-image" onClick={e => onImageClick(imgSrc, post.title || '', post.description || '')} style={{cursor:'zoom-in'}} />
              {post.title && <h3>{post.title}</h3>}
              {post.date && <p className="date">{post.date}</p>}
            </div>
          );
        })}
      </div>
    </main>
  );
}

const COMMERCIAL_SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const COMMERCIAL_API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const COMMERCIAL_RANGE = 'Commercial!A2:C';
const COMMERCIAL_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

function Commercial({ commercialPosts, onImageClick }) {
  return (
    <div className="container">
      <main className="content content-commercial">
        <section className="works-section">
          {/* <h2>commercial work</h2> */}
          <div id="commercial-posts" className="blog-container">
            {commercialPosts.map((post, idx) => {
              let cleanUrl = extractImageUrl(post.imageUrl);
              // Usar BASE_URL para rutas relativas
              const imgSrc = cleanUrl.startsWith('http') ? cleanUrl : `${import.meta.env.BASE_URL}${cleanUrl.replace(/^\//, '')}`;
              return (
                <div className="blog-post" key={idx} data-description={post.description || ''}>
                  <img src={imgSrc} alt={post.altText || `commercial ${idx+1}`} className="work-detail-image" style={{cursor:'zoom-in'}} onClick={() => onImageClick(imgSrc, post.altText || `commercial ${idx+1}`, post.description || '')} />
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function linkify(text) {
  if (!text) return '';
  // Regex para detectar URLs
  return text.replace(/(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

function App() {
  const location = useLocation();
  const [modalImg, setModalImg] = useState(null);
  const [modalAlt, setModalAlt] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [commercialPosts, setCommercialPosts] = useState([]);
  useEffect(() => {
    let title = 'expensivemusic.com';
    if (location.pathname === '/works') title = 'expensivemusic.com - works';
    else if (location.pathname === '/music') title = 'expensivemusic.com - music';
    else if (location.pathname === '/radio') title = 'expensivemusic.com - radio';
    else if (location.pathname === '/contact') title = 'expensivemusic.com - contact';
    else if (location.pathname === '/commercial-work') title = 'expensivemusic.com - commercial work';
    else if (location.pathname.startsWith('/work/')) title = 'expensivemusic.com - work detail';
    document.title = title;
  }, [location.pathname]);
  useEffect(() => {
    async function fetchBlog() {
      try {
        const url = `${BLOG_BASE_URL}${BLOG_SPREADSHEET_ID}/values/${BLOG_RANGE}?key=${BLOG_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching blog data');
        const data = await response.json();
        const posts = (data.values || []).map(row => ({
          date: row[0] || '',
          title: row[1] || '',
          description: row[2] || '',
          imageUrl: row[3] || '',
        })).filter(post => extractImageUrl(post.imageUrl));
        setBlogPosts(posts);
      } catch (e) {
        setBlogPosts([]);
      }
    }
    fetchBlog();
  }, []);
  useEffect(() => {
    async function fetchCommercial() {
      try {
        const url = `${COMMERCIAL_BASE_URL}${COMMERCIAL_SPREADSHEET_ID}/values/${COMMERCIAL_RANGE}?key=${COMMERCIAL_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error fetching commercial data');
        const data = await response.json();
        const posts = (data.values || []).map(row => ({
          imageUrl: row[0] || '',
          altText: row[1] || '',
          description: row[2] || '',
        })).filter(post => extractImageUrl(post.imageUrl));
        setCommercialPosts(posts);
      } catch (e) {
        setCommercialPosts([]);
      }
    }
    fetchCommercial();
  }, []);
  const openModal = (src, alt, desc) => {
    setModalImg(src);
    setModalAlt(alt);
    setModalDesc(desc);
  };
  const closeModal = () => setModalImg(null);
  return (
    <div className="container">
      <SidebarWithLocation />
      <Routes>
        <Route path="/" element={<Blog onImageClick={openModal} blogPosts={blogPosts} />} />
        <Route path="/works" element={<Works />} />
        <Route path="/music" element={<Music />} />
        <Route path="/radio" element={<Radio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/commercial-work" element={<Commercial commercialPosts={commercialPosts} onImageClick={openModal} />} />
        <Route path="/work/:id" element={<WorkDetail />} />
      </Routes>
      {modalImg && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <img src={modalImg} alt={modalAlt} className="image-modal-full" style={{maxHeight:'80vh',maxWidth:'95vw'}} onClick={closeModal} />
            {modalDesc && <div className="modal-desc" dangerouslySetInnerHTML={{__html: linkify(modalDesc)}} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
