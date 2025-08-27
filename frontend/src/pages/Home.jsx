import React from "react";
import "../styles.css";
import imgBaba from "../assets/images/alexander-grey-42AQP6w8uyI-unsplash.jpg";
import imgPasseio from "../assets/images/mikita-yo-q8tP-9LYP4o-unsplash.jpg";
import imgHospedagem from "../assets/images/hale-tat-7nWfU3_M4ns-unsplash.jpg";
import heroImg from "../assets/images/andrew-s-ouo1hbizWwo-unsplash.jpg";

export default function Home() {
  const services = [
    { id: 1, img: imgBaba, title: "Babá de Pets", desc: "Cuidado completo para o seu pet no conforto do lar." },
    { id: 2, img: imgPasseio, title: "Passeios", desc: "Atividades seguras e divertidas para o seu pet gastar energia." },
    { id: 3, img: imgHospedagem, title: "Hospedagem", desc: "Hospede seu pet por dias, semanas ou mês." },
  ];

  const benefits = [
    { id: 1, title: "Segurança", desc: "Profissionais qualificados e confiáveis para cuidar do seu pet." },
    { id: 2, title: "Praticidade", desc: "Reserve serviços de forma rápida e prática pelo site ou app." },
    { id: 3, title: "Carinho", desc: "Cada atendimento é feito com atenção e cuidado individual." },
  ];

  return (
    <main className="home-page">
      {/* Banner hero simplificado */}
      <section className="home-hero-simple">
        <div className="home-hero">
          <img src={heroImg} alt="Cachorro e gato" className="home-hero-img" />
          <div className="home-hero-overlay">
            <h1>Cuidando dos seus pets com carinho</h1>
            <p>Contrate serviços de babá, passeios e visitas para seu pet, de forma segura e prática.</p>
            <a href="/services" className="btn-cta">Conheça nossos serviços</a>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="home-services">
        <h2 className="section-title">Nossos Serviços</h2>
        <div className="home-list-grid">
          {services.map((service) => (
            <div className="home-card" key={service.id}>
              <div className="home-img-wrapper">
                <img src={service.img} alt={service.title} className="home-img" />
              </div>
              <div className="home-content">
                <h3 className="home-title">{service.title}</h3>
                <p className="home-text">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="home-benefits">
        <h2 className="section-title">Por que escolher PetCare?</h2>
        <div className="benefits-grid">
          {benefits.map((item) => (
            <div className="benefit-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer call-to-action */}
      <div className="about-footer">
        <p className="about-goal">
          Nosso propósito é oferecer <strong>tranquilidade</strong> e <strong>bem-estar</strong> para seu pet, com serviços pensados para cada necessidade.
        </p>
        <a href="/services" className="about-btn">Contrate agora</a>
      </div>
    </main>
  );
}

// import hero from "../assets/images/hero.png";

// export default function Home(){
//   return (
//     <section className="hero">
//       <div className="hero-text">
//         <h1>Cuidando dos seus pets</h1>
//         <p>Contrate hoje mesmo serviços de babá para cães e gatos.</p>
//         <a className="btn-cta" href="/services">Saiba mais</a>
//       </div>

//       <div className="hero-media">
//         <img src={hero} alt="Cachorro e gato" />
//       </div>
//     </section>
//   );
// }
