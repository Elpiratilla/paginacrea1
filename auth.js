const AUTH_USERS_KEY = "sinlimites_users";
const AUTH_SESSION_KEY = "sinlimites_session";
function getUsuarios(){
    try{
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || [];
    }catch(e){
    return [];
    }
}
function guardarUsuarios(usuarios){
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(usuarios));
}
async function hashPassword(password){
    if(window.crypto && window.crypto.subtle){
    try{
        const enc = new TextEncoder().encode(password);
        const buffer = await crypto.subtle.digest("SHA-256", enc);
        return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    }catch(e){
        console.warn("crypto.subtle falló, uso hash de respaldo:", e);
    }
    }
    return hashPasswordRespaldo(password);
}
function hashPasswordRespaldo(password){
    let hash = 0;
    for(let i = 0; i < password.length; i++){
    hash = ((hash << 5) - hash + password.charCodeAt(i)) | 0;
    }
    return "fallback_" + Math.abs(hash).toString(16);
}
function emailValido(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
async function registrarUsuario(nombre, email, password){
    nombre = (nombre || "").trim();
    email = (email || "").trim().toLowerCase();
    if(!nombre || !email || !password){
    return { ok:false, error:"Completá todos los campos." };
    }
    if(!emailValido(email)){
    return { ok:false, error:"El correo no es válido." };
    }
    if(password.length < 6){
    return { ok:false, error:"La contraseña debe tener al menos 6 caracteres." };
    }
    const usuarios = getUsuarios();
    if(usuarios.some(u => u.email === email)){
    return { ok:false, error:"Ya existe una cuenta con ese correo." };
    }
    const passwordHash = await hashPassword(password);
    const nuevoUsuario = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    nombre,
    email,
    passwordHash
    };
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    return {
    ok:true,
    usuario:{ id:nuevoUsuario.id, nombre:nuevoUsuario.nombre, email:nuevoUsuario.email }
    };
}
async function iniciarSesion(email, password){
    email = (email || "").trim().toLowerCase();
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email);
    if(!usuario){
    return { ok:false, error:"No existe una cuenta con ese correo." };
    }
    const passwordHash = await hashPassword(password);
    if(passwordHash !== usuario.passwordHash){
    return { ok:false, error:"Contraseña incorrecta." };
    }
    const sesion = { id:usuario.id, nombre:usuario.nombre, email:usuario.email };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sesion));
    return { ok:true, usuario:sesion };
}
function usuarioActual(){
    try{
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
    }catch(e){
    return null;
    }
}
function cerrarSesion(){
    localStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = "login.html";
}
function protegerPagina(){
    const usuario = usuarioActual();
    if(!usuario){
    sessionStorage.setItem("sinlimites_redirect", window.location.pathname.split("/").pop());
    window.location.href = "login.html";
    }
    return usuario;
}
function pintarUsuarioHeader(contenedorId){
    contenedorId = contenedorId || "authHeaderSlot";
    const usuario = usuarioActual();
    const slot = document.getElementById(contenedorId);
    if(!slot) return;

    if(usuario){
    slot.innerHTML =
        '<span class="auth-saludo"><i class="fas fa-circle-user"></i> ' + usuario.nombre + '</span>' +
        '<button class="auth-logout-btn" id="logoutBtn" title="Cerrar sesión"><i class="fas fa-right-from-bracket"></i></button>';
    document.getElementById("logoutBtn").addEventListener("click", cerrarSesion);
    }else{
    slot.innerHTML = '<a href="login.html" class="auth-login-link"><i class="fas fa-right-to-bracket"></i> Ingresar</a>';
    }
}