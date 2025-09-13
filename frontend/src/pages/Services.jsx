import React from "react";
import "./Services.css";
import imgBaba from "../assets/images/dicson--R_7O2nk_6A-unsplash.jpg";
import imgPasseio from "../assets/images/james-kern-wUieL_e_HnY-unsplash.jpg";
import imgHospedagem from "../assets/images/alexander-grey-42AQP6w8uyI-unsplash.jpg";
import bannerImg from "../assets/images/vitaly-gariev-TNjWbTBj0MU-unsplash.jpg";

export default function Services() {
  const services = [
    {
      id: 1,
      img: imgBaba,
      title: "Babá de Pets",
      desc: "Cuidado completo para o seu pet no conforto do lar.",
      price: "A partir de R$50 /visita",
    },
    {
      id: 2,
      img: imgPasseio,
      title: "Passeios",
      desc: "Atividades seguras e divertidas para o seu pet gastar energia.",
      price: "A partir de R$55 /passeio",
    },
    {
      id: 3,
      img: imgHospedagem,
      title: "Hospedagem",
      desc: "Hospede seu pet por dias, semanas ou até meses.",
      price: "A partir de R$60 /dia",
    },
  ];

  return (
    <section className="services-page">
      {/* Banner */}
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

      {/* Footer CTA */}
      <div className="about-footer">
        <p className="about-goal">
          Nosso propósito é oferecer <strong>tranquilidade para você</strong> e{" "}
          <strong>bem-estar para seu pet</strong>, com serviços pensados para cada
          necessidade.
        </p>
        <a href="/register" className="about-btn">
          Contrate nossos serviços
        </a>
      </div>
    </section>
  );
}