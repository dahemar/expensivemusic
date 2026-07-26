import '../styles.css';
import '../sidebar.css';
import '../glitch.css';
import { useEffect, useState } from 'react';

const SPREADSHEET_ID = '1RTrPB8qONlXQG37mRzPJ8aanTlxLGLy3MeYpsyKnmBk';
const API_KEY = 'AIzaSyAKYKOA8prGrSMgWAifEvjLJq9lUqsULzQ';
const RANGE = 'Contact!A1:Z2';
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets/';

function Contact() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${BASE_URL}${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const rows = data.values || [];
        if (rows.length < 2) return;
        const values = rows[1];

        const name = (values[0] || 'jonas justen').trim();
        const email = (values[1] || 'jonas.justen@gmx.de').trim();
        const instaRaw = (values[2] || '@jjuusten').trim();
        const instaUser = instaRaw.replace(/^@/, '');

        const extraLinks = [];
        for (let c = 3; c < values.length; c++) {
          const urlVal = (values[c] || '').trim();
          if (urlVal) {
            extraLinks.push({ url: urlVal });
          }
        }

        setContact({
          name,
          email,
          instaUrl: `https://www.instagram.com/${instaUser}/`,
          instaText: instaRaw,
          extraLinks,
        });
      } catch (err) {
        setContact({
          name: 'jonas justen',
          email: 'jonas.justen@gmx.de',
          instaUrl: 'https://www.instagram.com/jjuusten/',
          instaText: '@jjuusten',
          extraLinks: [],
        });
      }
    }
    fetchData();
  }, []);

  if (!contact) {
    return (
      <div className="container">
        <main className="content">
          <div className="section-content">
            <div className="music-projects">
              <div className="music-project">
                <div className="music-project-info" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="content">
        <div className="section-content">
          <div className="music-projects">
            <div className="music-project">
              <div className="music-project-info">
                <h2>{contact.name}</h2>
                <p>mail. <a href={`mailto:${contact.email}`} className="music-link">{contact.email}</a></p>
                <p>insta. <a href={contact.instaUrl} target="_blank" rel="noopener noreferrer" className="music-link">{contact.instaText}</a></p>
                {contact.extraLinks.map((link, i) => (
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
