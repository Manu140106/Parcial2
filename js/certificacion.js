// ─── VARIABLES DEL CANVAS ───
let canvas, ctx, dibujando = false, firmaRealizada = false;
let ultimoX = 0, ultimoY = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Precargar nombre desde datos personales
  if (HojaDeVida.datosPersonales) {
    const d = HojaDeVida.datosPersonales;
    document.getElementById('nombreFirmante').value =
      `${d.nombres} ${d.primerApellido} ${d.segundoApellido || ''}`.trim();
  }

  // Fecha de hoy por defecto
  document.getElementById('fechaCert').value = new Date().toISOString().split('T')[0];

  // Restaurar datos si ya existen
  if (HojaDeVida.certificacion.nombreFirmante) {
    document.getElementById('nombreFirmante').value = HojaDeVida.certificacion.nombreFirmante;
    document.getElementById('fechaCert').value      = HojaDeVida.certificacion.fecha;
    document.getElementById('chkJuramento').checked = HojaDeVida.certificacion.juramento;
  }

  iniciarCanvas();
  construirResumen();
  consultarEstado();
});

// ─── CANVAS DE FIRMA ────

function iniciarCanvas() {
  canvas = document.getElementById('firmaCanvas');
  ctx    = canvas.getContext('2d');

  ctx.strokeStyle = '#1a3a5c';
  ctx.lineWidth   = 2;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  // Eventos mouse
  canvas.addEventListener('mousedown',  iniciarTrazo);
  canvas.addEventListener('mousemove',  dibujar);
  canvas.addEventListener('mouseup',    terminarTrazo);
  canvas.addEventListener('mouseleave', terminarTrazo);

  // Eventos touch (móvil)
  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); iniciarTrazo(e.touches[0]); }, { passive: false });
  canvas.addEventListener('touchmove',  (e) => { e.preventDefault(); dibujar(e.touches[0]); },     { passive: false });
  canvas.addEventListener('touchend',   terminarTrazo);
}

function getPosicion(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top)  * scaleY
  };
}

function iniciarTrazo(e) {
  dibujando = true;
  const pos = getPosicion(e);
  ultimoX = pos.x;
  ultimoY = pos.y;
  canvas.classList.add('activo');
  canvas.classList.remove('error-canvas');
  document.getElementById('err-firma').textContent = '';
}

function dibujar(e) {
  if (!dibujando) return;
  const pos = getPosicion(e);
  ctx.beginPath();
  ctx.moveTo(ultimoX, ultimoY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ultimoX = pos.x;
  ultimoY = pos.y;
  firmaRealizada = true;
}

function terminarTrazo() {
  dibujando = false;
  canvas.classList.remove('activo');
}

function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  firmaRealizada = false;
  canvas.classList.remove('error-canvas');
  document.getElementById('err-firma').textContent = '';
}

function validarFirma() {
  if (!firmaRealizada) {
    canvas.classList.add('error-canvas');
    document.getElementById('err-firma').textContent = 'Por favor dibuje su firma antes de enviar.';
    return false;
  }
  return true;
}

// ─── RESUMEN COMPLETO ───

function construirResumen() {
  construirResumenPersonales();
  construirResumenFormacion();
  construirResumenExperiencia();
  construirResumenTiempo();
}

function pi(label, valor) {
  if (!valor || String(valor).trim() === '' || valor === 'undefined undefined') return '';
  return `<div class="preview-item"><span class="pk">${label}</span><span class="pv">${valor}</span></div>`;
}

function construirResumenPersonales() {
  const d    = HojaDeVida.datosPersonales;
  const cont = document.getElementById('resumen-personales');
  if (!d) { cont.innerHTML = '<p class="resumen-vacio">Sin datos. <a href="index.html">Ir a Datos Personales →</a></p>'; return; }

  const sexo = d.sexo === 'F' ? 'Femenino' : d.sexo === 'M' ? 'Masculino' : '';
  const nac  = d.nacimiento ? `${d.nacimiento.dia}/${d.nacimiento.mes}/${d.nacimiento.anio} — ${d.nacimiento.municipio || ''}, ${d.nacimiento.depto || ''}, ${d.nacimiento.pais || ''}` : '';
  const corr = d.correspondencia ? `${d.correspondencia.municipio || ''}, ${d.correspondencia.depto || ''}, ${d.correspondencia.pais || ''}` : '';

  let html = `
    ${pi('Nombre completo', `${d.nombres || ''} ${d.primerApellido || ''} ${d.segundoApellido || ''}`.trim())}
    ${pi('Documento', `${d.tipoDoc || ''} ${d.numDoc || ''}`)}
    ${pi('Sexo', sexo)}
    ${pi('Nacionalidad', d.nacionalidad === 'COL' ? 'Colombiana' : 'Extranjera')}
    ${pi('País de nacionalidad', d.paisNac)}
    ${pi('Fecha y lugar de nacimiento', nac)}
    ${pi('Dirección de correspondencia', corr)}
    ${pi('Teléfono', d.correspondencia?.telefono)}
    ${pi('Email', d.correspondencia?.email)}
  `;
  if (d.sexo === 'M' && d.libreta?.numero) {
    html += `
      ${pi('Libreta Militar – Clase', d.libreta.clase === '1' ? 'Primera Clase' : 'Segunda Clase')}
      ${pi('Libreta Militar – Número', d.libreta.numero)}
      ${pi('Distrito Militar', d.libreta.distrito)}
    `;
  }
  cont.innerHTML = html;
}

function construirResumenFormacion() {
  const f    = HojaDeVida.formacionAcademica;
  const cont = document.getElementById('resumen-formacion');
  if (!f) return;

  let html = '<div style="padding:1rem">';

  if (f.educacionBasica?.grado) {
    const b = f.educacionBasica;
    html += `<div class="resumen-sub">Educación Básica y Media</div>
    <div class="preview-grid">
      ${pi('Último grado', `${b.grado} – ${b.nivel || ''}`)}
      ${pi('Título', b.titulo || 'N/A')}
      ${pi('Fecha de grado', b.fechaGrado || 'N/A')}
    </div>`;
  }

  if (f.educacionSuperior?.length > 0) {
    html += `<div class="resumen-sub" style="margin-top:1rem">Educación Superior</div>
    <table class="resumen-tabla">
      <thead><tr><th>#</th><th>Modalidad</th><th>Título / Estudio</th><th>Semestres</th><th>Graduado</th><th>Terminación</th></tr></thead>
      <tbody>`;
    f.educacionSuperior.forEach((e, i) => {
      html += `<tr><td>${i+1}</td><td>${e.modalidad||''}</td><td>${e.titulo||''}</td><td>${e.semestres||''}</td><td>${e.graduado||''}</td><td>${e.terminacion||'N/A'}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  if (f.idiomas?.length > 0) {
    html += `<div class="resumen-sub" style="margin-top:1rem">Idiomas</div>
    <table class="resumen-tabla">
      <thead><tr><th>Idioma</th><th>Lo habla</th><th>Lo lee</th><th>Lo escribe</th></tr></thead>
      <tbody>`;
    f.idiomas.forEach(id => {
      html += `<tr><td>${id.nombre||''}</td><td>${id.habla||''}</td><td>${id.lee||''}</td><td>${id.escribe||''}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  html += '</div>';
  cont.innerHTML = html;
}

function construirResumenExperiencia() {
  const exps = HojaDeVida.experienciaLaboral;
  const cont = document.getElementById('resumen-experiencia');
  if (!exps || exps.length === 0) { cont.innerHTML = '<p class="resumen-vacio" style="padding:1rem">Sin datos. <a href="experiencia.html">Ir a Experiencia Laboral →</a></p>'; return; }

  let html = `<div style="padding:1rem">
    <table class="resumen-tabla">
      <thead><tr><th>#</th><th>Empresa</th><th>Cargo</th><th>Tipo</th><th>Ingreso</th><th>Retiro</th><th>Municipio</th></tr></thead>
      <tbody>`;
  exps.forEach((e, i) => {
    html += `<tr>
      <td>${i+1}</td><td>${e.empresa||''}</td><td>${e.cargo||''}</td>
      <td style="text-transform:capitalize">${e.tipo||'N/A'}</td>
      <td>${formatFecha(e.fechaIngreso)}</td>
      <td>${e.fechaRetiro ? formatFecha(e.fechaRetiro) : 'Actual'}</td>
      <td>${e.municipio||''}</td>
    </tr>`;
  });
  html += `</tbody></table></div>`;
  cont.innerHTML = html;
}

function construirResumenTiempo() {
  const t    = HojaDeVida.tiempoExperiencia;
  const cont = document.getElementById('resumen-tiempo');
  if (!t) return;

  const total = t.total || calcularTotalExperiencia(t.servidorPublico, t.sectorPrivado, t.trabajadorIndep);
  cont.style.padding = '1rem';
  cont.innerHTML = `
    ${pi('Servidor Público',         `${t.servidorPublico?.anios||0} años, ${t.servidorPublico?.meses||0} meses`)}
    ${pi('Sector Privado',           `${t.sectorPrivado?.anios||0} años, ${t.sectorPrivado?.meses||0} meses`)}
    ${pi('Trabajador Independiente', `${t.trabajadorIndep?.anios||0} años, ${t.trabajadorIndep?.meses||0} meses`)}
    <div class="preview-item" style="grid-column:1/-1;background:rgba(45,106,159,0.08);border-radius:7px;padding:.5rem .7rem;margin-top:.4rem">
      <span class="pk">⏱️ TOTAL</span>
      <span class="pv" style="font-weight:700;color:var(--azul);font-size:1.05rem">${total.anios} años, ${total.meses} meses</span>
    </div>
  `;
}

// ─── VALIDACIÓN ───

function validarFormulario() {
  let valido = true;

  const nombre = document.getElementById('nombreFirmante').value.trim();
  if (!requerido(nombre)) {
    mostrarError('nombreFirmante', 'Ingrese el nombre del firmante.');
    valido = false;
  } else if (!soloLetras(nombre)) {
    mostrarError('nombreFirmante', 'Solo se permiten letras y espacios.');
    valido = false;
  } else { mostrarError('nombreFirmante', ''); }

  if (!requerido(document.getElementById('fechaCert').value)) {
    mostrarError('fechaCert', 'Ingrese la fecha de firma.');
    valido = false;
  } else { mostrarError('fechaCert', ''); }

  if (!document.getElementById('chkJuramento').checked) {
    document.getElementById('err-chkJuramento').textContent = 'Debe aceptar el juramento para continuar.';
    valido = false;
  } else { document.getElementById('err-chkJuramento').textContent = ''; }

  if (!validarFirma()) valido = false;

  return valido;
}

// ─── ENVIAR HV ──

function enviarHV() {
  if (!validarFormulario()) {
    mostrarAlerta('error', '⚠️ Por favor complete todos los campos y dibuje su firma.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  HojaDeVida.certificacion = {
    juramento:      document.getElementById('chkJuramento').checked,
    nombreFirmante: document.getElementById('nombreFirmante').value.trim(),
    fecha:          document.getElementById('fechaCert').value,
    firma:          canvas.toDataURL(), // guarda la imagen de la firma
  };
  HojaDeVida.estado = 'diligenciada';
  guardarHVenStorage();
  guardarColeccionEnStorage();

  const d = HojaDeVida.datosPersonales;
  ColeccionHV.push({
    id:        ColeccionHV.length + 1,
    nombres:   d ? d.nombres : 'Sin nombre',
    apellidos: d ? `${d.primerApellido} ${d.segundoApellido || ''}`.trim() : '',
    documento: d ? d.numDoc : 'N/A',
    estado:    'diligenciada',
    fecha:     new Date().toISOString().split('T')[0],
    hv:        JSON.parse(JSON.stringify(HojaDeVida)),
  });

  mostrarAlerta('exito', '✅ Hoja de vida enviada correctamente. Estado: Diligenciada.');
  consultarEstado();
}

// ─── CONSULTAR ESTADO ───
function consultarEstado() {
  const cont = document.getElementById('estado-consulta');
  const doc  = HojaDeVida.datosPersonales?.numDoc;
  let hvEncontrada = null;
  if (doc) {
    for (let i = ColeccionHV.length - 1; i >= 0; i--) {
      if (ColeccionHV[i].documento === doc) { hvEncontrada = ColeccionHV[i]; break; }
    }
  }
  if (!hvEncontrada) {
    cont.innerHTML = `<div class="estado-card"><div class="estado-icono" style="background:#f0f0f0">📋</div><div><div style="font-weight:600">Sin registros</div><div style="font-size:.82rem;color:var(--gris-medio)">Complete y envíe la hoja de vida para ver su estado.</div></div></div>`;
    return;
  }
  const C = { diligenciada:{bg:'#e3f0fb',color:'var(--azul-medio)',icono:'📝'}, aceptada:{bg:'#d4f0e2',color:'var(--exito)',icono:'✅'}, rechazada:{bg:'#fde8e6',color:'var(--error)',icono:'❌'} };
  const est = hvEncontrada.estado;
  const c   = C[est] || C.diligenciada;
  cont.innerHTML = `<div class="estado-card" style="border-color:${c.color}">
    <div class="estado-icono" style="background:${c.bg};font-size:1.5rem">${c.icono}</div>
    <div style="flex:1">
      <div style="font-weight:700;font-size:1rem;color:${c.color};text-transform:capitalize">${est}</div>
      <div style="font-size:.83rem;color:var(--gris-medio);margin-top:3px">${hvEncontrada.nombres} ${hvEncontrada.apellidos} · Doc: ${hvEncontrada.documento}</div>
      <div style="font-size:.8rem;color:var(--gris-medio)">Fecha de registro: ${formatFecha(hvEncontrada.fecha)}</div>
    </div>
    <span class="badge badge-${est}">${est.toUpperCase()}</span>
  </div>`;
}