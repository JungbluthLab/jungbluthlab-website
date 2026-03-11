function initScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = document.querySelectorAll<HTMLElement>('[data-animate]');

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target as HTMLElement;
        const type = el.dataset.animate;

        if (type === 'stagger') {
          const children = Array.from(el.children) as HTMLElement[];
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('animated'), i * 100);
          });
        } else {
          el.classList.add('animated');
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => {
    if (el.dataset.animate === 'stagger') {
      Array.from(el.children).forEach((child) => {
        (child as HTMLElement).style.opacity = '0';
        (child as HTMLElement).style.transform = 'translateY(16px)';
        (child as HTMLElement).style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
      });
    }
    observer.observe(el);
  });
}

initScrollAnimations();
document.addEventListener('astro:after-swap', initScrollAnimations);
