import React from "react";
import "./Services.css";
import imgBaba from "../assets/images/catia-dombaxe-3G9Jb5eMr5E-unsplash.jpg";
import imgPasseio from "../assets/images/edgar-pimenta-iaRuEbnZajc-unsplash.jpg";
import imgVisita from "../assets/images/jonas-vincent-xulIYVIbYIc-unsplash.jpg";
import bannerImg from "../assets/images/bailey-burton-8vlc3e_Tv-w-unsplash.jpg";

export default function Services() {
  const services = [
    {
      id: 1,
      img: imgBaba,
      title: "Babá de Pets",
      desc: "Cuidado completo para o seu pet no conforto do lar.",
      price: "Apartir de R$50 /visita",
    },
    {
      id: 2,
      img: imgPasseio,
      title: "Passeios",
      desc: "Atividades seguras e divertidas para o seu pet gastar energia.",
      price: "Apartir de R$55 /passeio",
    },
    {
      id: 3,
      img: imgVisita,
      title: "Visitas",
      desc: "Check-ins rápidos para alimentação, água e atenção extra.",
      price: "Apartir de R$40 /visita",
    },
  ];

  return (
    <section className="services-page">
      {/* Banner no topo */}
      <div className="services-banner">
        <img src={bannerImg} alt="Banner PetCare" className="services-banner-img" />
        <div className="services-banner-overlay">
          <h1 className="services-banner-title">Encontre o serviço perfeito para seu pet</h1>
          <p className="services-banner-subtitle">
            Segurança, carinho e praticidade para você e seu melhor amigo.
          </p>
        </div>
      </div>

      {/* Lista de serviços */}
      <div className="services-list-grid">
        {services.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="service-img-wrapper">
              <img src={service.img} alt={service.title} className="service-img" />
            </div>
            <div className="service-content">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-text">{service.desc}</p>
              <span className="service-price">{service.price}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="about-footer">
        <p className="about-goal">
          Nosso propósito é oferecer <strong>tranquilidade para você</strong> e{" "}
          <strong>bem-estar para seu pet</strong>, com serviços pensados para cada
          necessidade.
        </p>
        <a href="/contact" className="about-btn">
          Fale Conosco
        </a>
      </div>
    </section>
  );
}