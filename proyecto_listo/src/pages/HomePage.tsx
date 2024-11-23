import React, { useEffect } from "react";
import logo from "../img/logo.jpeg"
import joya2 from "../img/products/joya2.jpeg";
import joya from "../img/products/joya.jpeg";
import joya4 from "../img/products/joya4.jpeg";
import joya5 from "../img/products/joya5.jpeg";
import joya3 from "../img/products/joya3.jpeg";
import joya6 from "../img/products/joya6.jpeg";
import joya10 from "../img/products/joya10.jpeg";
import personas from "../img/personas.jpg";
import momo from "../img/momo.jpg";
import instagramIcon from "../img/instagram-new.png";

export default function HomePage() {
  useEffect(() => {
    const altura = document.body.scrollHeight - window.innerHeight;
    const fondo = document.getElementById("fondo");

    const handleScroll = () => {
      const anchoFondo = (window.pageYOffset / altura) * 700;
      if (fondo && anchoFondo <= 100) {
        fondo.style.width = `${anchoFondo}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="contenido-header relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${logo})` }}>
        <div id="fondo" className="fondo absolute top-0 left-0 h-full bg-purple-900 w-0 transition-all"></div>
      </div>

      {/* Navigation */}
      <nav className="menu sticky top-0 bg-purple-700 text-gray-200 flex justify-center space-x-10 py-4 z-50">
        <a href="#nosotros" className="hover:text-gray-100 transition">NOSOTROS</a>
        <a href="#productos" className="hover:text-gray-100 transition">SERVICIOS</a>
        <a href="#contacto" className="hover:text-gray-100 transition">CONTACTOS</a>
      </nav>

      {/* Main Content */}
      <main id="nosotros" className="container mx-auto py-10 px-4">
        {/* Nosotros */}
        <section className="text-center mb-16">
          <h2 className="subtitulo text-lg font-bold uppercase text-purple-800 bg-gray-200 inline-block px-4 py-2 mb-4">¿Quiénes somos?</h2>
          <h3 className="titulo text-3xl font-semibold text-gray-900">Somos parte de tu momento especial</h3>
          <p className="mt-4 text-lg text-gray-700">
            Descubre la elegancia con nuestros joyeros artesanales y joyas de acero.<br />
            Cada pieza es un viaje de creatividad y artesanía, diseñada para capturar tu estilo único.<br />
            ¡Ven y encuentra tu brillo con nosotros!
          </p>
        </section>

        {/* Productos */}
        <section id="productos" className="productos bg-gray-100 py-10">
          <h2 className="subtitulo text-lg font-bold uppercase text-purple-800 bg-gray-200 inline-block px-4 py-2 mb-4">Nuestro catálogo</h2>
          <h3 className="titulo text-3xl font-semibold text-gray-900 text-center">Nuestros Productos</h3>
          <p className="text-center mt-4 text-lg text-gray-700">
            En nuestra tienda, cada producto tiene un toque único y personal. <br />
            ¡Explora nuestra colección y descubre la joya que te está esperando!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[{ img: joya2, desc: "Lindos brazaletes para pareja" }, { img: joya, desc: "Brazaletes de colores para regalar" }, { img: joya4, desc: "Lindos aretes con diseños especiales" }, { img: joya5, desc: "Collares de colores para regalar" }].map((item, idx) => (
              <div key={idx} className="relative group">
                <img src={item.img} alt={item.desc} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-purple-800 opacity-0 group-hover:opacity-80 flex items-center justify-center transition-opacity">
                  <p className="text-white text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Separador */}
      <section className="separador bg-cover bg-center h-64 text-center flex items-center justify-center text-gray-900" style={{ backgroundImage: `url(${joya5})` }}>
        <p className="text-2xl italic">"Brilla con estilo, brilla con nosotros"</p>
      </section>

      {/* Acerca de */}
      <section className="container mx-auto py-10 px-4">
        <div className="row acerc-de justify-content-center grid grid-cols-1 sm:grid-cols-2 gap-8">
          <article>
            <figure className="text-center">
              <img src={personas} alt="Grupo de especialistas" />
              <figcaption>
                <p>
                  <strong className="mb-5">Grupo de especialistas</strong><br />
                  Nuestro equipo de especialistas, dedicados a seleccionar y crear las joyas más exquisitas para ti.
                </p>
              </figcaption>
            </figure>
          </article>
          <article>
            <figure className="text-center">
              <img src={momo} alt="Un relato de servicio" />
              <figcaption>
                <p>
                  <strong className="mb-5">Un relato de servicio</strong><br />
                  Nuestra historia está marcada por un compromiso inquebrantable con el servicio.
                </p>
              </figcaption>
            </figure>
          </article>
        </div>
      </section>

      {/* Galería */}
      <div className="galeria grid grid-cols-3 gap-0">
        {[joya3, joya6, joya10].map((img, idx) => (
          <div key={idx} className="col-span-1">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Contacto */}
      <section id="contacto" className="contacto bg-gray-100 py-10 text-center">
        <h2 className="subtitulo text-lg font-bold uppercase text-purple-800 bg-gray-200 inline-block px-4 py-2 mb-4">Contáctanos</h2>
        <p className="text-lg text-gray-700">
          <img src="../img/celu.jpg" alt="Teléfono" className="inline-block w-6 h-6 mr-2" />
          Tel: 970503563
        </p>
      </section>

      {/* Footer */}
      <footer className="redes bg-purple-900 text-gray-100 py-8 text-center">
        <a href="https://www.instagram.com/yeru_peru/">
          <img src={instagramIcon} alt="Instagram" className="w-8 h-8 inline-block mx-2" />
        </a>
      </footer>
    </div>
  );
}