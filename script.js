/* ========================================
   🎯 HERO ANIMATION INITIALIZATION
   Performance-Optimized Circular Ripple System
   ======================================== */

(function() {
    'use strict';
    
    /* =====================================
       CONFIGURATION (Sync with CSS vars)
       ===================================== */
    const CONFIG = {
        gridGap: 34,           // 32px SVG + 2px gap = 34px spacing
        dotSize: 32,           // Increased SVG size
        rippleRings: 6,        // Reduced rings
        delayPerRing: 100,     // Slightly slower - balanced speed
        circleRings: 2,        // Reduced from 3 for better performance
        circleDelayPerRing: 800 // ms delay between circle rings
    };
    
    /* =====================================
       UTILITY: Calculate Euclidean Distance
       ===================================== */
    function calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /* =====================================
       UTILITY: Map Distance to Ring Number
       ===================================== */
    function getRingNumber(distance, maxDistance, totalRings) {
        // Normalize distance to 0-1 range
        const normalized = distance / maxDistance;
        // Map to ring number (0 to totalRings - 1)
        const ring = Math.floor(normalized * totalRings);
        return Math.min(ring, totalRings - 1);
    }
    
    /* =====================================
       INITIALIZE ANIMATED GRID
       ===================================== */
    function initializeGrid() {
        const gridContainer = document.getElementById('heroGrid');
        if (!gridContainer) return;
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // PERFORMANCE: Limit grid size to visible area only (no extra padding)
        const cols = Math.ceil(viewportWidth / CONFIG.gridGap);
        const rows = Math.ceil(viewportHeight / CONFIG.gridGap);
        
        // Calculate center position
        const centerX = Math.floor(cols / 2);
        const centerY = Math.floor(rows / 2);
        
        // Calculate maximum possible distance (corner to center)
        const maxDistance = calculateDistance(0, 0, centerX, centerY);
        
        // Create document fragment for performance (single reflow)
        const fragment = document.createDocumentFragment();
        const dots = [];
        
        // Generate grid dots with position data
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Calculate distance from center
                const distance = calculateDistance(col, row, centerX, centerY);
                
                // Determine ring number
                const ring = getRingNumber(distance, maxDistance, CONFIG.rippleRings);
                
                // Calculate delay based on ring
                const delay = ring * CONFIG.delayPerRing;
                
                // Create dot element
                const dot = document.createElement('div');
                dot.className = 'grid__dot';
                
                // Insert the custom SVG with updated color scheme
                dot.innerHTML = `<svg height="24.793" viewBox="0 0 24.793 24.793" width="24.793" xmlns="http://www.w3.org/2000/svg"><path d="m7.726 17.877v-14.354l-6.5 6.908-1.226-1.304 8.593-9.127.607.649.615.649 7.367 7.829-1.226 1.3-6.496-6.904v14.354z" fill="#191E29" stroke="#191E29" stroke-width="1.2" transform="matrix(.70710678 .70710678 -.70710678 .70710678 12.641 0)"/></svg>`;
                
                // Set custom CSS variable for animation delay
                dot.style.setProperty('--ring-delay', `${delay}ms`);
                
                // Position dot using CSS Grid or absolute positioning
                dot.style.position = 'absolute';
                dot.style.left = `${col * CONFIG.gridGap}px`;
                dot.style.top = `${row * CONFIG.gridGap}px`;
                
                dots.push(dot);
                fragment.appendChild(dot);
            }
        }
        
        // Single DOM insertion (minimize reflow)
        gridContainer.appendChild(fragment);
        
        // Optional: Log performance metrics
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Grid initialized: ${dots.length} dots, ${CONFIG.rippleRings} rings`);
        }
    }
    
    /* =====================================
       INITIALIZE OUTER CIRCLES
       ===================================== */
    function initializeCircles() {
        const circlesContainer = document.getElementById('heroCircles');
        if (!circlesContainer) return;
        
        const fragment = document.createDocumentFragment();
        
        // Create multiple circle rings with staggered delays
        for (let i = 0; i < CONFIG.circleRings; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle__ring';
            
            // Calculate delay for this circle ring
            const delay = i * CONFIG.circleDelayPerRing;
            circle.style.setProperty('--circle-delay', `${delay}ms`);
            
            fragment.appendChild(circle);
        }
        
        // Single DOM insertion
        circlesContainer.appendChild(fragment);
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Circles initialized: ${CONFIG.circleRings} rings`);
        }
    }
    
    /* =====================================
       RESPONSIVE: Update on Resize (Debounced)
       ===================================== */
    let resizeTimeout;
    function handleResize() {
        // Clear existing timeout
        clearTimeout(resizeTimeout);
        
        // Debounce resize event (wait 300ms after last resize)
        resizeTimeout = setTimeout(() => {
            // Clear existing grid
            const gridContainer = document.getElementById('heroGrid');
            if (gridContainer) {
                gridContainer.innerHTML = '';
                initializeGrid();
            }
        }, 300);
    }
    
    /* =====================================
       INITIALIZE ON DOM READY
       ===================================== */
    function init() {
        // Ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Initialize grid and circles
        initializeGrid();
        initializeCircles();
        
        // Optional: Handle window resize (commented out for performance)
        // Uncomment if you need responsive grid regeneration
        // window.addEventListener('resize', handleResize, { passive: true });
        
        // Performance marker
        if (window.performance && window.performance.mark) {
            performance.mark('hero-animation-ready');
        }
    }
    
    // Start initialization
    init();
    
})();

/* ========================================
   📊 OPTIONAL: PERFORMANCE MONITORING
   ======================================== */

// Uncomment for performance debugging
/*
(function() {
    if (!window.performance) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            console.log(`🎬 FPS: ${fps}`);
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
})();
*/

/* ========================================
   ⚡ MICRO-OPTIMIZATIONS FOR LOW-END DEVICES
   ======================================== */

/*
OPTIONAL OPTIMIZATIONS IF PERFORMANCE BECOMES AN ISSUE:

1. **Reduce Grid Density**
   - Increase CONFIG.gridGap to 50-60px on mobile
   - Fewer dots = less GPU overhead

2. **Use CSS Containment**
   - Add `contain: layout style paint;` to .hero
   - Isolates rendering work

3. **Intersection Observer**
   - Pause animations when hero is off-screen
   - Resume when visible

4. **Reduce Circle Rings**
   - Set CONFIG.circleRings to 2-3 on low-end devices
   - Detect via navigator.hardwareConcurrency

5. **Simplify Animation Easing**
   - Use 'linear' instead of cubic-bezier
   - Slightly better performance

6. **Remove will-change After Animation Starts**
   - Dynamically remove will-change after first frame
   - Reduces memory pressure

7. **Use CSS content-visibility**
   - Add `content-visibility: auto;` to hero
   - Browser skips rendering when off-screen

8. **Throttle Animation Duration**
   - Increase --ripple-duration to 3500ms
   - Fewer animation cycles per second

9. **Device Detection**
   - Detect low-end devices via:
     - navigator.hardwareConcurrency < 4
     - navigator.deviceMemory < 4
   - Disable animations or reduce complexity

10. **Prefers-reduced-motion**
    - Already implemented in CSS
    - Respects user preferences

Example: Device-based optimization
*/

/*
(function() {
    // Detect low-end device
    const isLowEnd = (
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        (navigator.deviceMemory && navigator.deviceMemory < 4)
    );
    
    if (isLowEnd) {
        document.documentElement.style.setProperty('--ripple-rings', '5');
        document.documentElement.style.setProperty('--circle-rings', '2');
        document.documentElement.style.setProperty('--grid-gap', '50px');
    }
})();
*/
