import '../styles.css';
import '../sidebar.css';
import '../glitch.css';

function Radio() {
  return (
    <div className="container">
      <main className="content content-radio">
        <div className="section-content">
          <iframe
            width="100%"
            height="300"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2012490777&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
            title="SoundCloud Radio"
          ></iframe>
        </div>
      </main>
    </div>
  );
}

export default Radio; 