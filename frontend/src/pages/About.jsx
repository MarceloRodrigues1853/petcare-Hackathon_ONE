import React from "react";
import "./About.css";
import bannerImg from "../assets/images/krista-mangulsone-9gz3wfHr65U-unsplash.jpg";
import missionImg from "../assets/images/shane-ORANl-unsplash-banner-about.jpg";

export default function About() {
  return (
    <section className="about-section">

      {/* Banner full-width */}
      <div className="about-banner">
        <img src={bannerImg} alt="Equipe" className="about-banner-img" />
        <div className="about-banner-overlay">
          <h1>Quem Somos</h1>
          <p>Conheça nossa história, missão e propósito</p>
        </div>
      </div>

      {/* Nossa História */}
      <div className="about-block">
        <h2>Nossa História</h2>
        <p>
          Nossa jornada começou com o propósito de transformar vidas por meio do
          cuidado e dedicação. Desde o início, acreditamos que cada passo deve
          ser guiado por valores sólidos, transparência e paixão pelo que
          fazemos.
        </p>
      </div>

      {/* Missão (imagem full-width acima do texto) */}
      <div className="about-block">
        <div className="about-mission-img">
          <img src={missionImg} alt="Missão" />
        </div>
        <div className="about-block-content">
          <h2>Missão</h2>
          <p>
            Nossa missão é oferecer soluções que gerem impacto positivo na vida
            das pessoas e seus pets, garantindo qualidade, confiança e atenção
            individualizada em cada serviço prestado.
          </p>
        </div>
      </div>

      {/* Propósito / Valores */}
      <div className="about-block">
        <h2>Nosso Propósito</h2>
        <p>
          Trabalhamos para criar conexões genuínas e fortalecer a relação entre
          humanos e animais, sempre com ética, responsabilidade e paixão pelo
          cuidado.
        </p>
      </div>

    </section>
  );
}