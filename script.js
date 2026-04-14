const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

const revealElements = document.querySelectorAll("[data-reveal]");
const magneticElements = document.querySelectorAll("[data-magnetic]");
const tiltElements = document.querySelectorAll("[data-tilt]");
const parallaxElements = document.querySelectorAll("[data-depth]");

const setupReveal = () => {
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((item) => observer.observe(item));
};

const setupCursor = () => {
  if (prefersReducedMotion.matches || isCoarsePointer) {
    document.querySelectorAll(".cursor").forEach((cursor) => cursor.remove());
    return;
  }

  const ring = document.querySelector(".cursor-ring");
  const dot = document.querySelector(".cursor-dot");
  const activeTargets = document.querySelectorAll("a, button, [data-tilt], [data-magnetic]");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;

  const updateActive = (value) => {
    ring.classList.toggle("is-active", value);
    dot.classList.toggle("is-active", value);
  };

  const render = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dotX += (mouseX - dotX) * 0.34;
    dotY += (mouseY - dotY) * 0.34;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    requestAnimationFrame(render);
  };

  document.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  activeTargets.forEach((target) => {
    target.addEventListener("pointerenter", () => updateActive(true));
    target.addEventListener("pointerleave", () => updateActive(false));
  });

  requestAnimationFrame(render);
};

const setupMagnetic = () => {
  if (prefersReducedMotion.matches || isCoarsePointer) {
    return;
  }

  magneticElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const moveX = event.clientX - rect.left - rect.width / 2;
      const moveY = event.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(${moveX * 0.12}px, ${moveY * 0.12}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
};

const setupTilt = () => {
  if (prefersReducedMotion.matches || isCoarsePointer) {
    return;
  }

  tiltElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;

      element.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
};

const setupParallax = () => {
  if (prefersReducedMotion.matches) {
    return;
  }

  const update = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    parallaxElements.forEach((element) => {
      const depth = Number(element.dataset.depth || 0);
      element.style.transform = `translateY(${scrollY * depth}px)`;
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
};

const setupOrbitalField = () => {
  if (prefersReducedMotion.matches) {
    return;
  }

  const canvas = document.getElementById("orbital-field");

  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  const particles = [];
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let width = 0;
  let height = 0;
  const total = 52;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * window.devicePixelRatio);
    canvas.height = Math.floor(height * window.devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    particles.length = 0;

    for (let index = 0; index < total; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.4 + 0.6,
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 160) {
        particle.x -= dx * 0.0008;
        particle.y -= dy * 0.0008;
      }

      context.beginPath();
      context.fillStyle = "rgba(255,255,255,0.42)";
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const sibling = particles[next];
        const gap = Math.hypot(particle.x - sibling.x, particle.y - sibling.y);

        if (gap > 110) {
          continue;
        }

        context.beginPath();
        context.strokeStyle = `rgba(144, 241, 255, ${0.08 - gap / 1700})`;
        context.lineWidth = 1;
        context.moveTo(particle.x, particle.y);
        context.lineTo(sibling.x, sibling.y);
        context.stroke();
      }
    });

    requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", resize);
  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { passive: true }
  );
};

const setupSplineMount = () => {
  window.mountSplineScene = (node) => {
    const stage = document.querySelector("[data-spline-stage]");

    if (!stage || !node) {
      return false;
    }

    const existing = stage.querySelector(".spline-live-layer");

    if (existing) {
      existing.remove();
    }

    const wrapper = document.createElement("div");
    wrapper.className = "spline-live-layer";
    wrapper.style.position = "absolute";
    wrapper.style.inset = "0";
    wrapper.style.zIndex = "2";
    wrapper.appendChild(node);

    stage.appendChild(wrapper);
    return true;
  };
};

setupReveal();
setupCursor();
setupMagnetic();
setupTilt();
setupParallax();
setupOrbitalField();
setupSplineMount();
