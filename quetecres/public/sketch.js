let particles = [];
let particleCount = 100;
let mic;
let fft;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Initialize microphone input
    mic = new p5.AudioIn();
    mic.start();

    // Initialize FFT analyzer
    fft = new p5.FFT();
    fft.setInput(mic);

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let particleSlider = select('#particleCount');
    particleSlider.input(() => {
        particleCount = particleSlider.value();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    });
}

function draw() {
    background(0);

    // Get audio spectrum
    let spectrum = fft.analyze();
    
    for (let particle of particles) {
        particle.update(spectrum);
        particle.show();
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
    }

    update(spectrum) {
        // Map frequency data to particle movement
        let freq = int(random(0, spectrum.length));
        let amp = spectrum[freq];

        this.pos.x += map(amp, 0, 255, -1, 1) * this.vel.x;
        this.pos.y += map(amp, 0, 255, -1, 1) * this.vel.y;

        // Keep particles within canvas
        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }

    show() {
        noStroke();
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
