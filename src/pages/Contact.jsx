import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useEffect, useState } from 'react';

const SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const RANGE = 'Contact!A1:Z2';
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

function Contact() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.values || [];
        if (rows.length < 2) return;
        const headers = rows[0];
        const values = rows[1];
        const extra = [];
        for (let c = 3; c < Math.max(headers.length, values.length); c++) {
          const urlVal = (values[c] || '').trim();
          if (urlVal) {
            extra.push({ url: urlVal });
          }
        }
        setLinks(extra);
      } catch (err) {
        console.error('Error fetching contact links:', err);
      }
    }
    fetchLinks();
  }, []);

  return (
    <div className="container">
      <main className="content">
        <div className="section-content">
          <div className="music-projects">
            <div className="music-project">
              <div className="music-project-info">
                <h2>jonas justen</h2>
                <p>mail. <a href="mailto:jonas.justen@gmx.de" className="music-link">jonas.justen@gmx.de</a></p>
                <p>insta. <a href="https://www.instagram.com/jjuusten/" target="_blank" rel="noopener noreferrer" className="music-link">@jjuusten</a></p>
                {links.map((link, i) => (
                  <p key={i}><a href={link.url} target="_blank" rel="noopener noreferrer" className="music-link">{link.url}</a></p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact; 