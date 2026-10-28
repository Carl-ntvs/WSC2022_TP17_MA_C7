const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let rect = canvas.getBoundingClientRect();
let strokes = [];
let currentStroke = null;
function setCanvasSize() {
    if (window.innerWidth <= 425) {
        canvas.width = window.innerWidth;
        canvas.height = 800;
    } else {
        canvas.width = 1000;
        canvas.height = 800;
    }
    rect = canvas.getBoundingClientRect();
}
setCanvasSize();
function startStroke(x, y) {
    currentStroke = {
        points: [{ x, y, alpha: 1.0 }]
    };
    strokes.push(currentStroke);
}
function addPointToCurrent(x, y) {
    if (!currentStroke) return;
    currentStroke.points.push({ x, y, alpha: 1.0 });
}

function endStroke() {
    currentStroke = null;
}

// === mouse事件 ===
canvas.addEventListener('mousedown', (e) => {
    rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    startStroke(mouseX, mouseY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!currentStroke) return;
    rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    addPointToCurrent(mouseX, mouseY);
});

window.addEventListener('mouseup', () => {
    endStroke();
});
// ==== touch事件 =====
canvas.addEventListener('touchstart', (e) => {
    rect = canvas.getBoundingClientRect();
    e.preventDefault();
    const t = e.touches[0];
    const touchX = t.clientX - rect.left;
    const touchY = t.clientY - rect.top;
    startStroke(touchX, touchY);
}, { passive: false });
canvas.addEventListener('touchmove', (e) => {
    if (!currentStroke) return;
    rect = canvas.getBoundingClientRect();
    e.preventDefault();
    const t = e.touches[0];
    const touchX = t.clientX - rect.left;
    const touchY = t.clientY - rect.top;
    addPointToCurrent(touchX, touchY);
}, { passive: false });
window.addEventListener('touchend', () => {
    endStroke();
});
const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = strokes.length - 1; i >= 0; i--) {
        let stroke = strokes[i];
        for (let j = 0; j < stroke.points.length; j++) {
            //消逝速度
            stroke.points[j].alpha -= 0.012;
        }
        stroke.points = stroke.points.filter(p => p.alpha > 0);
        if (stroke.points.length === 0) {
            strokes.splice(i, 1);
            continue;
        }
        if (stroke.points.length > 1) {
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (let j = 1; j < stroke.points.length; j++) {
                ctx.beginPath();
                ctx.moveTo(stroke.points[j - 1].x, stroke.points[j - 1].y);
                ctx.lineTo(stroke.points[j].x, stroke.points[j].y);
                ctx.strokeStyle = `rgba(66, 230, 149, ${stroke.points[j].alpha})`;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    setCanvasSize();
});