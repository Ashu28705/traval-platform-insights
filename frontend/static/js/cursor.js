/* =================================================================
   TRAVELAI — ADVANCED CURSOR TRAIL & INTERACTION SYSTEM
   ================================================================= */
'use strict';

(function initAdvancedCursor() {
    const dots = [];
    const NUM = 20; // Number of trail segments
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // 1. CREATE TRAIL DOTS DYNAMICALLY
    for (let i = 0; i < NUM; i++) {
        const dot = document.createElement("div");
        dot.classList.add("cursor-dot");
        
        // Ensure some base style if CSS is missing
        dot.style.position = "fixed";
        dot.style.pointerEvents = "none";
        dot.style.zIndex = "99999";
        
        document.body.appendChild(dot);

        dots.push({
            el: dot,
            x: mouse.x,
            y: mouse.y
        });
    }

    // 2. TRACK MOUSE
    document.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // 3. ANIMATION LOOP (The "Snake" / "Tail" Effect)
    function animate() {
        let x = mouse.x;
        let y = mouse.y;

        dots.forEach((dot, index) => {
            // Easing behavior
            dot.x += (x - dot.x) * 0.35;
            dot.y += (y - dot.y) * 0.35;

            dot.el.style.left = dot.x + "px";
            dot.el.style.top = dot.y + "px";

            // Size effect (tail shrinking)
            const scale = (NUM - index) / NUM;
            dot.el.style.transform = `translate(-50%, -50%) scale(${scale})`;
            
            // Opacity fade (optional but looks premium)
            dot.el.style.opacity = scale.toString();

            // Store current position for the next dot to follow
            x = dot.x;
            y = dot.y;
        });

        requestAnimationFrame(animate);
    }
    animate();

    // 4. CLICK EFFECT (Custom burst from previous iteration)
    document.addEventListener('mousedown', (e) => {
        burst(e.clientX, e.clientY);
    });

})();

// ─────────────────────────────────────────────────────────────────
// PARTICLE BURST ON CLICK
// ─────────────────────────────────────────────────────────────────
function burst(x, y) {
    const palette = ['#00d2ff','#3a7bd5','#e94560','#ffd700','#a855f7','#00dc64'];
    const count   = 12;
    for (let i = 0; i < count; i++) {
        const p     = document.createElement('span');
        p.className = 'cursor-particle';
        const angle = (i / count) * Math.PI * 2;
        const r     = 40 + Math.random() * 50;
        const color = palette[i % palette.length];
        const size  = 3 + Math.random() * 5;
        p.style.cssText = `
            position: fixed; left:${x}px; top:${y}px;
            width:${size}px; height:${size}px;
            background:${color}; border-radius:50%;
            box-shadow:0 0 10px ${color};
            pointer-events: none; z-index: 99998;
            --tx:${Math.cos(angle) * r}px;
            --ty:${Math.sin(angle) * r}px;
            animation: burst-anim .6s cubic-bezier(0.16,1,0.3,1) forwards;
        `;
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }
}

// Add burst animation to doc if not in CSS
if (!document.getElementById('cursor-anims')) {
    const style = document.createElement('style');
    style.id = 'cursor-anims';
    style.innerHTML = `
        @keyframes burst-anim {
            0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
            100% { opacity:0; transform:translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); }
        }
    `;
    document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────
// MAGNETIC BUTTONS
// ─────────────────────────────────────────────────────────────────
(function initMagnetic() {
    const targets = document.querySelectorAll('button, .nav-links a, .explore-btn, .popular-item, .recommend-card');
    targets.forEach(el => {
        el.addEventListener('mousemove', e => {
            const r  = el.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) * 0.35;
            const dy = (e.clientY - r.top  - r.height / 2) * 0.35;
            el.style.transform  = `translate(${dx}px,${dy}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
            el.style.transform  = '';
            setTimeout(() => el.style.transition = '', 500);
        });
    });
})();

// ─────────────────────────────────────────────────────────────────
// 3-D TILT
// ─────────────────────────────────────────────────────────────────
(function initTilt() {
    const cards = document.querySelectorAll('.card, .explore-card, .destination-card, .home-card, .review-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const r   = card.getBoundingClientRect();
            const dx  = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
            const dy  = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
            card.style.transform = `perspective(1000px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateZ(10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .6s ease';
            card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            setTimeout(() => card.style.transition = '', 600);
        });
    });
})();
