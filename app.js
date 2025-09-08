// ===== Utils =====
const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);
const domains = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
const ok = m => ({ ok: true, msg: m });
const fail = m => ({ ok: false, msg: m });

// ===== Carrito =====
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const setCart = c => localStorage.setItem("cart", JSON.stringify(c));

const addToCart = id => {
  const c = getCart();
  c.push(id);
  setCart(c);
  badge();
  alert("Añadido al carrito");
};

const badge = () => {
  const b = $("#cart-badge");
  if (b) b.textContent = getCart().length;
};

badge();

// ===== Productos iniciales =====
const PRODUCTS = [
  {id:1,n:"Control  Xbox", p:59000, img:"img/xbox.webp"},
  {id:2,n:"Auriculares Logitech",p:60000,img:"img/logi.jpeg"},
  {id:3,n:"Escritorio Cougar",p:150000,img:"img/cougar.avif"},
  {id:4,n:"Teclado HyperX",p:49990,img:"img/teclado.jpg"},
  {id:5,n:"Mouse Glorious",p:24990,img:"img/glorious.jpg"},
  {id:6,n:"Monitor 24",p:159990,img:"img/monitor.jpg"},
  {id:7,n:"Silla Gamer",p:89990,img:"img/silla.jpg"},
  {id:8,n:"RTX 4060",p:399990,img:"img/4060.jpg"},
  {id:9,n:"m.2",p:79990,img:"img/m.2.jpg"},
  {id:10,n:"Fuente de Poder",p:49990,img:"img/fuente.jpg"},
];


// ===== Formato de dinero =====
function money(x) {
  return Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(x);
}

// ===== Render productos en lista =====
function renderProducts(sel, limit = null) {
  const el = $(sel);
  if (!el) return;

  const productos = JSON.parse(localStorage.getItem("productos") || JSON.stringify(PRODUCTS));
  const lista = limit ? productos.slice(0, limit) : productos;

  el.innerHTML = lista.map(pr =>
    `<article class="card">
      <img src="${pr.img}" alt="${pr.n}">
      <strong>${pr.n}</strong>
      <span>${money(pr.p)}</span>
      <div style="display:flex; gap:8px">
        <a class="btn" href="producto.html?id=${pr.id}">Ver</a>
        <button onclick="addToCart(${pr.id})">Añadir</button>
      </div>
    </article>`).join("");
}


// ===== Render producto detalle =====
function renderProducto() {
  const el = $("#detalle");
  if (!el) return;

  const id = Number(params.get("id"));
  const productos = JSON.parse(localStorage.getItem("productos") || JSON.stringify(PRODUCTS));
  const pr = productos.find(x => x.id === id);

  if (!pr) {
    el.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  el.innerHTML = `
    <div class="grid" style="grid-template-columns:1fr 1fr;">
      <img src="${pr.img}" alt="${pr.n}">
      <div>
        <h2>${pr.n}</h2>
        <p style="margin:8px 0">${money(pr.p)}</p>
        <button class="btn" onclick="addToCart(${pr.id})">Añadir al carrito</button>
      </div>
    </div>
  `;
}

// ===== Validaciones formularios =====
function emailVal(v) {
  if (!v) return fail("Requerido");
  if (v.length > 100) return fail("Máx 100");
  if (!domains.some(d => v.endsWith(d))) return fail("Dominio no válido");
  return ok();
}

function passVal(v) {
  if (!v) return fail("Requerido");
  if (v.length < 4 || v.length > 10) return fail("4-10 caracteres");
  return ok();
}

function reqMax(v, mx) {
  if (!v) return fail("Requerido");
  if (v.length > mx) return fail("Máx " + mx);
  return ok();
}

function setErr(id, r) {
  const e = $(id);
  if (!e) return;
  e.textContent = r.ok ? "" : r.msg;
}

// ===== Hook login =====
function hookLogin() {
  const f = $("#form-login");
  if (!f) return;

  f.addEventListener("submit", e => {
    e.preventDefault();
    const r1 = emailVal(f.email.value.trim());
    const r2 = passVal(f.pass.value.trim());
    setErr("#e-email", r1);
    setErr("#e-pass", r2);
    if (r1.ok && r2.ok) {
      alert("Login OK");
      location.href = "index.html";
    }
  });
}

// ===== Hook registro =====
function hookRegistro() {
  const f = $("#form-reg");
  if (!f) return;

  f.addEventListener("submit", e => {
    e.preventDefault();
    const r1 = reqMax(f.nombre.value.trim(), 100);
    const r2 = emailVal(f.email.value.trim());
    const r3 = passVal(f.pass.value.trim());
    setErr("#e-nombre", r1);
    setErr("#e-email", r2);
    setErr("#e-pass", r3);
    if (r1.ok && r2.ok && r3.ok) {
      alert("Registrado");
      location.href = "login.html";
    }
  });
}

// ===== Hook contacto =====
function hookContacto() {
  const f = $("#form-contacto");
  if (!f) return;

  f.addEventListener("submit", e => {
    e.preventDefault();
    const r1 = reqMax(f.nombre.value.trim(), 100);
    const r2 = emailVal(f.email.value.trim());
    const r3 = reqMax(f.msg.value.trim(), 500);
    setErr("#e-nombre", r1);
    setErr("#e-email", r2);
    setErr("#e-msg", r3);
    if (r1.ok && r2.ok && r3.ok) {
      alert("Mensaje enviado");
      f.reset();
    }
  });
}

// ===== Admin usuarios =====
function renderUsuarios() {
  const tbody = document.querySelector("#lista-usuarios");
  if (!tbody) return;

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  tbody.innerHTML = usuarios.map(u => `<tr><td>${u.nombre}</td><td>${u.email}</td></tr>`).join("");
}

function hookFormUsuarios() {
  const f = document.querySelector("#form-usuarios");
  if (!f) return;

  f.addEventListener("submit", e => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    usuarios.push({ nombre: f.nombre.value, email: f.email.value });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    f.reset();
    renderUsuarios();
  });
}

// ===== Admin productos =====
function renderProductosAdmin() {
  const tbody = document.querySelector("#lista-productos");
  if (!tbody) return;

  const productos = JSON.parse(localStorage.getItem("productos") || JSON.stringify(PRODUCTS));
  tbody.innerHTML = productos.map(p => `<tr><td>${p.n}</td><td>${money(p.p)}</td></tr>`).join("");
}

function hookFormProductos() {
  const f = document.querySelector("#form-productos");
  if (!f) return;

  f.addEventListener("submit", e => {
    e.preventDefault();
    const productos = JSON.parse(localStorage.getItem("productos") || JSON.stringify(PRODUCTS));
    productos.push({ id: productos.length + 1, n: f.nombre.value, p: Number(f.precio.value), img: f.img.value });
    localStorage.setItem("productos", JSON.stringify(productos));
    f.reset();
    renderProductosAdmin();
  });
}

// ===== Boot =====
document.addEventListener("DOMContentLoaded", () => {
  renderProducts("#lista");         
  renderProducts("#lista-home", 3);
  hookLogin();
  hookRegistro();
  hookContacto();
  renderUsuarios();
  hookFormUsuarios();
  renderProductosAdmin(); 
  hookFormProductos();
});
