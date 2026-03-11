import heroPic from '../assets/img/side-view-smiley-doctor-taking-notes.jpg';

export default function Hero() {
  return (
  <div className="w-full login-hero">
    <img
      src={heroPic}
      alt="Clínica"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
    <div className="absolute inset-0 bg-black/20" />
  </div>
  );
}