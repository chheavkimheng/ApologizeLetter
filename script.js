const sunflowerTemplate = document.getElementById('sunflowerTemplate');
const garden = document.querySelector('.garden');
const forgiveBtn = document.getElementById('forgiveBtn');
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas
function fitCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
}
fitCanvas();
window.addEventListener('resize', fitCanvas);

// Plant exactly 13 sunflowers
function plantSunflowers() {
  const count = 13; 
  for (let i = 0; i < count; i++) {
    const clone = sunflowerTemplate.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.position = 'absolute';
    clone.style.left = (i / count) * 100 + '%';
    clone.style.bottom = '0';
    clone.style.transform = `scale(${0.7 + Math.random()*0.5})`;
    garden.appendChild(clone);
  }
}
plantSunflowers();

// Petal particles
const petals = [];
function spawnPetal(x, y) {
  petals.push({x, y, vx:(Math.random()-0.5)*2, vy:-2-Math.random()*2, r:6+Math.random()*6, rot:0});
}
function burstPetals(n=25) {
  const cx = window.innerWidth/2 * devicePixelRatio;
  const cy = window.innerHeight/2 * devicePixelRatio;
  for (let i=0;i<n;i++) spawnPetal(cx, cy);
}
function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = "#ffcf33";
  ctx.beginPath();
  ctx.ellipse(0,0,p.r*devicePixelRatio*0.5,p.r*devicePixelRatio,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}
function tick() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  for (let i=petals.length-1;i>=0;i--) {
    const p=petals[i];
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; p.rot+=0.02;
    drawPetal(p);
    if(p.y>canvas.height) petals.splice(i,1);
  }
  requestAnimationFrame(tick);
}
tick();

// Floating hearts
function popHearts(x,y) {
  const emojis=['💛','🌻','🤍'];
  for(let i=0;i<10;i++) {
    const span=document.createElement('span');
    span.className='heart';
    span.textContent=emojis[i%emojis.length];
    span.style.left=(x+(Math.random()*60-30))+"px";
    span.style.top=(y+(Math.random()*20-10))+"px";
    span.style.fontSize=(18+Math.random()*14)+"px";
    document.body.appendChild(span);
    setTimeout(()=>span.remove(),2600);
  }
}

// 🌻 Sunflower popup
function popSunflower(x,y) {
  const clone = sunflowerTemplate.cloneNode(true);
  clone.removeAttribute('id');
  clone.style.position = 'fixed';
  clone.style.left = x + 'px';
  clone.style.top = y + 'px';
  clone.style.transform = 'scale(0.5)';
  clone.style.zIndex = 9999;
  clone.style.pointerEvents = 'none';
  document.body.appendChild(clone);

  // animate up & fade
  clone.animate([
    { transform: 'scale(0.5) translateY(0)', opacity: 1 },
    { transform: 'scale(0.7) translateY(-120px)', opacity: 0 }
  ], {
    duration: 2000,
    easing: 'ease-out'
  });

  setTimeout(()=>clone.remove(),2000);
}

// Button actions
forgiveBtn.addEventListener('click', e=>{
  popHearts(e.clientX, e.clientY);
  burstPetals(40);
  popSunflower(e.clientX, e.clientY);
});
