const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let rect = canvas.getBoundingClientRect();
const colors = ['#ff598c', '#42e695', '#3bb2b8', '#f9d423', '#6e8efb'];
if (window.innerWidth<=425){
    rect = canvas.getBoundingClientRect();
    canvas.width=window.innerWidth
    canvas.height=800
    console.log(window.innerWidth)
}else{
    rect = canvas.getBoundingClientRect();
    canvas.width = 1000;
    canvas.height = 800;
}
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.opacity = 1;
        this.decay = Math.random() * 0.03 + 0.02;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.size > 0.3) {
            this.size -= 0.1;
        }
        this.opacity -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.opacity, 0);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
canvas.addEventListener('mousemove', (e) => {
    rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouseX, mouseY));
    }
});
canvas.addEventListener('touchmove',(e)=>{
    rect = canvas.getBoundingClientRect();
    e.preventDefault();
    [...e.touches].forEach(l=>{
        const mouseX = l.clientX - rect.left;
        const mouseY = l.clientY - rect.top;
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouseX, mouseY));
    }
    })
})
const  animate=()=> {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0 || particles[i].size <= 0.3) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}
animate();
window.addEventListener("resize", ()=>{
    let w=window.innerWidth<=425?window.innerWidth:1000;
    let h=800;
    canvas.width=w;
    canvas.height=h
     rect = canvas.getBoundingClientRect();
})