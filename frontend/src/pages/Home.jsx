import hero from "../assets/images/hero.png";

export default function Home(){
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Cuidando dos seus pets</h1>
        <p>Contrate hoje mesmo serviços de babá para cães e gatos.</p>
        <a className="btn-cta" href="/services">Saiba mais</a>
      </div>

      <div className="hero-media">
        <img src={hero} alt="Cachorro e gato" />
      </div>
    </section>
  );
}
