// frontend/src/pages/Home1.jsx
import React from "react";
import "../styles.css";

import imgBaba from "../assets/images/care-petsitter.png";
import imgPasseio from "../assets/images/carl-campbell-VjWLtqo3J3A-unsplash.jpg";
import imgHospedagem from "../assets/images/care-dog-and-cat.png";
import heroImg from "../assets/images/andrew-s-ouo1hbizWwo-unsplash.jpg";

export default function Home1() {
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

  const petsitterServices = [
    { id: 1, title: "Babá de Pets", desc: "Atenda pets no conforto do lar do cliente com segurança e carinho." },
    { id: 2, title: "Passeios", desc: "Leve pets para passeios divertidos e seguros." },
    { id: 3, title: "Hospedagem", desc: "Hospede pets com todo cuidado e atenção durante dias ou semanas." },
  ];

  return (
    <main className="home-page">
      {/* Banner hero */}
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
          {services.map(service => (
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
          {benefits.map(item => (
            <div className="benefit-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Petsitter */}
      <section className="home-petsitter">
        <h2 className="section-title">Seja um Petsitter</h2>
        <p className="home-subtext">
          Ofereça seus serviços para cuidar de pets, ganhar experiência e renda extra!
        </p>
        <div className="petsitter-grid">
          {petsitterServices.map(service => (
            <div className="petsitter-card" key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>

        <div className="about-footer">
          <a href="/register" className="about-btn">Seja um CareSitter</a>
        </div>
      </section>


      {/* CTA final */}
      <div className="about-footer">
        <p className="about-goal">
          Nosso propósito é oferecer <strong>tranquilidade</strong> e <strong>bem-estar</strong> para seu pet, com serviços pensados para cada necessidade.
        </p>
      </div>
    </main>
  );
}