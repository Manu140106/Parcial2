// ─── COLECCIONES PREDETERMINADAS ──────

const DISTRITOS_MILITARES = [
  { id: 'DM01', nombre: 'Distrito Militar No. 1 – Bogotá' },
  { id: 'DM02', nombre: 'Distrito Militar No. 2 – Medellín' },
  { id: 'DM03', nombre: 'Distrito Militar No. 3 – Cali' },
  { id: 'DM04', nombre: 'Distrito Militar No. 4 – Barranquilla' },
  { id: 'DM05', nombre: 'Distrito Militar No. 5 – Bucaramanga' },
  { id: 'DM06', nombre: 'Distrito Militar No. 6 – Manizales' },
  { id: 'DM07', nombre: 'Distrito Militar No. 7 – Pereira' },
  { id: 'DM08', nombre: 'Distrito Militar No. 8 – Ibagué' },
  { id: 'DM09', nombre: 'Distrito Militar No. 9 – Pasto' },
  { id: 'DM10', nombre: 'Distrito Militar No. 10 – Cúcuta' },
  { id: 'DM11', nombre: 'Distrito Militar No. 11 – Villavicencio' },
  { id: 'DM12', nombre: 'Distrito Militar No. 12 – Montería' },
];

const TIPOS_DOCUMENTO = [
  { valor: 'CC',  texto: 'Cédula de Ciudadanía (C.C)' },
  { valor: 'CE',  texto: 'Cédula de Extranjería (C.E)' },
  { valor: 'PAS', texto: 'Pasaporte (PAS)' },
];

const PAISES = [
  'Colombia', 'Venezuela', 'Ecuador', 'Perú', 'Brasil', 'Argentina',
  'México', 'España', 'Estados Unidos', 'Otro'
];

const DEPARTAMENTOS_COL = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá',
  'Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba',
  'Cundinamarca','Guainía','Guaviare','Huila','La Guajira','Magdalena',
  'Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda',
  'San Andrés','Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada'
];

const MODALIDADES_ACADEMICAS = [
  { valor: 'TC',  texto: 'TC – Técnica' },
  { valor: 'TL',  texto: 'TL – Tecnológica' },
  { valor: 'TE',  texto: 'TE – Tecnológica Especializada' },
  { valor: 'UN',  texto: 'UN – Universitaria' },
  { valor: 'ES',  texto: 'ES – Especialización' },
  { valor: 'MG',  texto: 'MG – Maestría / Magíster' },
  { valor: 'DOC', texto: 'DOC – Doctorado / PhD' },
];

const IDIOMAS_COMUNES = [
  'Inglés', 'Francés', 'Portugués', 'Italiano', 'Alemán',
  'Mandarín', 'Árabe', 'Japonés', 'Otro'
];

const NIVELES_IDIOMA = ['R', 'B', 'MB'];
const ESTADOS_HV     = ['diligenciada', 'aceptada', 'rechazada'];

// ─── CLAVE DE LOCALSTORAGE ────
const LS_KEY_HV      = 'hoja_vida_datos';
const LS_KEY_COL     = 'hoja_vida_coleccion';

// ─── ESTRUCTURA BASE DE LA HOJA DE VIDA ──
const HV_BASE = {
  datosPersonales: null,
  formacionAcademica: {
    educacionBasica: null,
    educacionSuperior: [],
    idiomas: []
  },
  experienciaLaboral: [],
  tiempoExperiencia: {
    servidorPublico: { anios: 0, meses: 0 },
    sectorPrivado:   { anios: 0, meses: 0 },
    trabajadorIndep: { anios: 0, meses: 0 },
    total:           { anios: 0, meses: 0 }
  },
  certificacion: {
    juramento: false,
    nombreFirmante: '',
    fecha: ''
  },
  estado: 'diligenciada'
};

// ─── CARGAR / GUARDAR EN LOCALSTORAGE ─────

/**
 * Carga la HV desde localStorage. Si no existe, usa la estructura base.
 */
function cargarHVdeStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY_HV);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(HV_BASE));
  } catch (e) {
    return JSON.parse(JSON.stringify(HV_BASE));
  }
}

/**
 * Guarda el objeto HojaDeVida completo en localStorage.
 */
function guardarHVenStorage() {
  try {
    localStorage.setItem(LS_KEY_HV, JSON.stringify(HojaDeVida));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }
}

/**
 * Carga la colección de HV del administrador desde localStorage.
 */
function cargarColeccionDeStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY_COL);
    return raw ? JSON.parse(raw) : [...COLECCION_BASE];
  } catch (e) {
    return [...COLECCION_BASE];
  }
}

/**
 * Guarda la colección de HV en localStorage.
 */
function guardarColeccionEnStorage() {
  try {
    localStorage.setItem(LS_KEY_COL, JSON.stringify(ColeccionHV));
  } catch (e) {
    console.warn('No se pudo guardar colección en localStorage:', e);
  }
}

/**
 * Limpia todos los datos de la hoja de vida del localStorage.
 * Útil para empezar de cero.
 */
function limpiarStorage() {
  localStorage.removeItem(LS_KEY_HV);
  HojaDeVida.datosPersonales = null;
  HojaDeVida.formacionAcademica = { educacionBasica: null, educacionSuperior: [], idiomas: [] };
  HojaDeVida.experienciaLaboral = [];
  HojaDeVida.tiempoExperiencia = JSON.parse(JSON.stringify(HV_BASE.tiempoExperiencia));
  HojaDeVida.certificacion = { juramento: false, nombreFirmante: '', fecha: '' };
  HojaDeVida.estado = 'diligenciada';
}

// ─── COLECCIÓN PREDETERMINADA (ejemplos del admin) ────
const COLECCION_BASE = [
  { id: 1, nombres: 'María Fernanda', apellidos: 'Torres Ríos',     documento: '1094887321', estado: 'aceptada',     fecha: '2026-03-10', hv: null },
  { id: 2, nombres: 'Carlos Andrés',  apellidos: 'Mejía Castaño',   documento: '1094556712', estado: 'diligenciada', fecha: '2026-03-18', hv: null },
  { id: 3, nombres: 'Luisa Valentina',apellidos: 'Ospina García',   documento: '1095001234', estado: 'rechazada',    fecha: '2026-03-05', hv: null },
  { id: 4, nombres: 'Juan Pablo',     apellidos: 'Arango López',    documento: '1094320099', estado: 'diligenciada', fecha: '2026-03-22', hv: null },
  { id: 5, nombres: 'Daniela',        apellidos: 'Vargas Montoya',  documento: '1093882200', estado: 'aceptada',     fecha: '2026-02-28', hv: null },
];

// ─── OBJETO GLOBAL (se inicializa desde localStorage) ────
const HojaDeVida  = cargarHVdeStorage();
const ColeccionHV = cargarColeccionDeStorage();

// ─── FUNCIONES UTILITARIAS ────

function poblarSelect(selectId, opciones, placeholder = '-- Seleccione --') {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = `<option value="">${placeholder}</option>`;
  opciones.forEach(op => {
    const opt = document.createElement('option');
    if (typeof op === 'string') { opt.value = op; opt.textContent = op; }
    else { opt.value = op.valor ?? op.id; opt.textContent = op.texto ?? op.nombre; }
    sel.appendChild(opt);
  });
}

function mostrarError(campoId, msg) {
  const campo = document.getElementById(campoId);
  const errEl = document.getElementById('err-' + campoId);
  if (!campo) return;
  if (msg) {
    campo.classList.add('error');
    campo.classList.remove('valido');
    if (errEl) errEl.textContent = msg;
  } else {
    campo.classList.remove('error');
    campo.classList.add('valido');
    if (errEl) errEl.textContent = '';
  }
}

function limpiarErrores(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.valido').forEach(el => el.classList.remove('valido'));
  form.querySelectorAll('.msg-error').forEach(el => el.textContent = '');
}

function requerido(valor) {
  return valor !== null && valor !== undefined && String(valor).trim() !== '';
}

function esEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor).trim());
}

function soloLetras(valor) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(String(valor).trim());
}

function esDocumento(valor) {
  return /^\d{6,12}$/.test(String(valor).trim());
}

function esTelefono(valor) {
  return /^\d{7,10}$/.test(String(valor).trim());
}

function calcularTotalExperiencia(sp, priv, ind) {
  let totalMeses =
    (parseInt(sp?.anios   || 0) * 12 + parseInt(sp?.meses   || 0)) +
    (parseInt(priv?.anios || 0) * 12 + parseInt(priv?.meses || 0)) +
    (parseInt(ind?.anios  || 0) * 12 + parseInt(ind?.meses  || 0));
  return { anios: Math.floor(totalMeses / 12), meses: totalMeses % 12 };
}

function formatFecha(fecha) {
  if (!fecha) return '';
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

function marcarNavActivo() {
  const pagina = window.location.pathname.split('/').pop();
  document.querySelectorAll('nav ul li a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === pagina || (pagina === '' && href === 'index.html')) {
      a.classList.add('activo');
    }
  });
}

function mostrarAlerta(tipo, mensaje) {
  const alerta = document.getElementById('alerta-global');
  if (!alerta) return;
  alerta.className = `alerta alerta-${tipo} visible`;
  alerta.querySelector('span')
    ? (alerta.querySelector('span').textContent = mensaje)
    : (alerta.textContent = mensaje);
  setTimeout(() => alerta.classList.remove('visible'), 4000);
}

document.addEventListener('DOMContentLoaded', marcarNavActivo);