// ============================================================
//  CONFIGURACIÓN — CAMBIAR SOLO AQUÍ
// ============================================================
const WHATSAPP_NUMERO   = "573105241126";   // Número con código de país, sin espacios ni +
const WHATSAPP_RESERVA  = "Hola, quiero reservar una mesa en Aroli Restaurant 🍽️";
const WHATSAPP_CONTACTO = "Hola, me gustaría obtener más información sobre Aroli Restaurant";
// ============================================================


// ================= SCROLL SUAVE =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return; // Saltar los botones de WhatsApp
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});


// ================= MENÚ HAMBURGUESA =================
document.addEventListener('DOMContentLoaded', () => {
    const burger   = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Cerrar menú al tocar un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});


// ================= NAVBAR EFECTO SCROLL =================
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.style.background    = "rgba(0,0,0,0.95)";
        header.style.boxShadow     = "0 2px 20px rgba(0,0,0,0.6)";
    } else {
        header.style.background    = "rgba(0,0,0,0.6)";
        header.style.boxShadow     = "none";
    }
});


// ================= REVEAL ANIMATION =================
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Pequeño delay escalonado para elementos en la misma sección
            setTimeout(() => {
                entry.target.classList.add("active");
            }, 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
});

revealEls.forEach(el => revealObserver.observe(el));


// ================= FILTROS DEL MENÚ =================
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const filtro = btn.getAttribute("data-filter");

        // Activar botón
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Mostrar / ocultar grids
        document.querySelectorAll(".menu-grid").forEach(grid => {
            if (grid.id === `cat-${filtro}`) {
                grid.classList.remove("hidden");
                // Re-activar animaciones reveal para los nuevos items visibles
                grid.querySelectorAll(".reveal:not(.active)").forEach(el => {
                    setTimeout(() => el.classList.add("active"), 80);
                });
            } else {
                grid.classList.add("hidden");
            }
        });

        // Scroll al inicio del menú en móvil
        const menuSection = document.querySelector("#menu");
        if (menuSection && window.innerWidth <= 768) {
            setTimeout(() => {
                menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        }
    });
});


// ================= BOTONES WHATSAPP =================
function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}

// Botón flotante
const whatsappFlotante = document.querySelector(".whatsapp-flotante");
if (whatsappFlotante) {
    whatsappFlotante.addEventListener("click", (e) => {
        e.preventDefault();
        abrirWhatsApp(WHATSAPP_CONTACTO);
    });
}

// Botones de reserva
document.querySelectorAll(".whatsapp-reserva").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        abrirWhatsApp(WHATSAPP_RESERVA);
    });
});

// Botones genéricos con texto "reservar"
document.querySelectorAll(".btn").forEach(btn => {
    if (btn.textContent.toLowerCase().includes("reservar") &&
        !btn.classList.contains("whatsapp-reserva")) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            abrirWhatsApp(WHATSAPP_RESERVA);
        });
    }
});


// ================= EFECTO APARICIÓN INICIAL =================
// Fallback de seguridad: ocultar splash máximo a los 3s pase lo que pase
setTimeout(() => {
    const splash = document.getElementById("splash");
    if (splash) splash.classList.add("hidden");
}, 3000);

window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    // Ocultar splash screen después de 1.8s
    setTimeout(() => {
        const splash = document.getElementById("splash");
        if (splash) splash.classList.add("hidden");
    }, 1800);

    // Mostrar tooltip WhatsApp después de 6 segundos
    setTimeout(() => {
        const whatsapp = document.querySelector(".whatsapp-flotante");
        if (whatsapp) {
            whatsapp.classList.add("show-tooltip");
            setTimeout(() => whatsapp.classList.remove("show-tooltip"), 4000);
        }
    }, 6000);
});


// ================= ESTADO ABIERTO / CERRADO =================
function calcularEstadoRestaurante() {
    // Horario Aroli: Mar-Jue 12-15 y 18:30-21:30 | Vie-Sab 12-15 y 18:30-22 | Dom 12-15 | Lun cerrado
    const ahora = new Date();
    // Colombia UTC-5
    const utc    = ahora.getTime() + ahora.getTimezoneOffset() * 60000;
    const col    = new Date(utc - 5 * 3600000);
    const dia    = col.getDay(); // 0=Dom, 1=Lun ... 6=Sab
    const horas  = col.getHours() + col.getMinutes() / 60;

    let abierto = false;

    if (dia === 1) {
        // Lunes cerrado
        abierto = false;
    } else if (dia >= 2 && dia <= 4) {
        // Martes a Jueves
        abierto = (horas >= 12 && horas < 15) || (horas >= 18.5 && horas < 21.5);
    } else if (dia === 5 || dia === 6) {
        // Viernes y Sábado
        abierto = (horas >= 12 && horas < 15) || (horas >= 18.5 && horas < 22);
    } else if (dia === 0) {
        // Domingo
        abierto = horas >= 12 && horas < 15;
    }

    return abierto;
}

function actualizarEstado() {
    const abierto = calcularEstadoRestaurante();
    const texto = abierto ? "Abierto ahora" : "Cerrado ahora";
    const clase = abierto ? "open" : "closed";

    ["hero-status", "contact-status"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove("open", "closed");
        el.classList.add(clase);
        const span = el.querySelector(".status-text");
        if (span) span.textContent = texto;
    });
}

actualizarEstado();





// ================= LIGHTBOX =================
const galleryImgs = Array.from(document.querySelectorAll(".gallery-img"));
const lightbox    = document.getElementById("lightbox");
const lbImg       = document.getElementById("lightbox-img");
const lbClose     = document.getElementById("lightbox-close");
const lbPrev      = document.getElementById("lightbox-prev");
const lbNext      = document.getElementById("lightbox-next");
const lbCounter   = document.getElementById("lightbox-counter");
let lbIndex = 0;

function openLightbox(index) {
    lbIndex = index;
    lbImg.src = galleryImgs[index].src;
    lbImg.alt = galleryImgs[index].alt;
    lbCounter.textContent = `${index + 1} / ${galleryImgs.length}`;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

function lbNavigate(dir) {
    lbIndex = (lbIndex + dir + galleryImgs.length) % galleryImgs.length;
    lbImg.style.opacity = "0";
    setTimeout(() => {
        lbImg.src = galleryImgs[lbIndex].src;
        lbImg.style.opacity = "1";
        lbCounter.textContent = `${lbIndex + 1} / ${galleryImgs.length}`;
    }, 150);
}

galleryImgs.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(i));
});

if (lbClose) lbClose.addEventListener("click", closeLightbox);
if (lbPrev)  lbPrev.addEventListener("click",  () => lbNavigate(-1));
if (lbNext)  lbNext.addEventListener("click",  () => lbNavigate(1));

if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   lbNavigate(-1);
    if (e.key === "ArrowRight")  lbNavigate(1);
});


// ================= BOTÓN COMPARTIR =================
const shareBtn = document.getElementById("share-btn");
if (shareBtn) {
    shareBtn.addEventListener("click", () => {
        if (navigator.share) {
            navigator.share({
                title: "Aroli Restaurant — Pasto, Nariño",
                text: "¡Descubrí este increíble restaurante de mariscos en Pasto! 🦞",
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                shareBtn.innerHTML = "✅ ¡Link copiado!";
                setTimeout(() => {
                    shareBtn.innerHTML = "<span>📤</span> Compartir restaurante";
                }, 2500);
            }).catch(() => {
                window.open(
                    `https://wa.me/?text=${encodeURIComponent("¡Mira este restaurante en Pasto! " + window.location.href)}`,
                    "_blank"
                );
            });
        }
    });
}


// ================= COUNTER ANIMATION (prueba social) =================
function animateCount(el, target, suffix, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = suffix.replace("{n}", target);
            clearInterval(timer);
        } else {
            el.textContent = suffix.replace("{n}", Math.floor(start));
        }
    }, 16);
}

const proofItems = document.querySelectorAll(".proof-item");
let countersRun = false;

const heroObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersRun) {
        countersRun = true;
        proofItems.forEach(item => {
            const text = item.textContent;
            if (text.includes("4.8")) {
                let v = 0;
                const t = setInterval(() => {
                    v = Math.min(v + 0.1, 4.8);
                    item.textContent = `⭐ ${v.toFixed(1)} en Google`;
                    if (v >= 4.8) clearInterval(t);
                }, 40);
            } else if (text.includes("500")) {
                let v = 0;
                const t = setInterval(() => {
                    v = Math.min(v + 10, 500);
                    item.textContent = `+${v} clientes felices`;
                    if (v >= 500) clearInterval(t);
                }, 20);
            }
        });
    }
}, { threshold: 0.5 });

const heroContent = document.querySelector(".hero-content");
if (heroContent) heroObs.observe(heroContent);
