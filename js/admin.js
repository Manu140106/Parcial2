let hvSeleccionadaId = null;

document.addEventListener('DOMContentLoaded', () => {
  filtrarHV();
});

// ─── FILTRAR Y RENDERIZAR TABLA ────

function filtrarHV() {
  const filtro = document.getElementById('filtroEstado').value;
  const lista  = filtro
    ? ColeccionHV.filter(hv => hv.estado === filtro)
    : ColeccionHV;

  const tbody = document.getElementById('cuerpo-tabla');

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;color:var(--gris-medio);padding:2rem">
          No hay hojas de vida con el estado seleccionado.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = lista.map(hv => `
    <tr>
      <td>${hv.id}</td>
      <td><strong>${hv.nombres}</strong> ${hv.apellidos}</td>
      <td>${hv.documento}</td>
      <td>${formatFecha(hv.fecha)}</td>
      <td><span class="badge badge-${hv.estado}">${hv.estado.toUpperCase()}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="cargarHV(${hv.id})">👁️ Ver / Editar</button>
      </td>
    </tr>
  `).join('');
}

// ─── CARGAR HV ESPECÍFICA ───

function cargarHV(id) {
  const hv = ColeccionHV.find(h => h.id === id);
  if (!hv) { mostrarAlerta('error', 'Hoja de vida no encontrada.'); return; }

  hvSeleccionadaId = id;

  // Armar HTML con la información
  const d = hv.hv?.datosPersonales;
  const f = hv.hv?.formacionAcademica;
  const t = hv.hv?.tiempoExperiencia?.total;
  const exps = hv.hv?.experienciaLaboral || [];

  let html = `
    <div style="margin-bottom:1.2rem">
      <span class="badge badge-${hv.estado}" style="font-size:.85rem;padding:.4rem 1rem">${hv.estado.toUpperCase()}</span>
    </div>`;

  if (d) {
    html += `
      <h3 style="font-family:'Playfair Display',serif;color:var(--azul);margin-bottom:.8rem">
        ${d.nombres} ${d.primerApellido} ${d.segundoApellido || ''}
      </h3>
      <div class="preview-grid" style="margin-bottom:1rem">
        <div class="preview-item"><span class="pk">Documento</span><span class="pv">${d.tipoDoc} ${d.numDoc}</span></div>
        <div class="preview-item"><span class="pk">Sexo</span><span class="pv">${d.sexo === 'F' ? 'Femenino' : 'Masculino'}</span></div>
        <div class="preview-item"><span class="pk">Teléfono</span><span class="pv">${d.correspondencia?.telefono || 'N/A'}</span></div>
        <div class="preview-item"><span class="pk">Email</span><span class="pv">${d.correspondencia?.email || 'N/A'}</span></div>
        <div class="preview-item"><span class="pk">Nacimiento</span><span class="pv">${d.nacimiento?.dia}/${d.nacimiento?.mes}/${d.nacimiento?.anio}</span></div>
        <div class="preview-item"><span class="pk">Residencia</span><span class="pv">${d.correspondencia?.municipio || ''}, ${d.correspondencia?.depto || ''}</span></div>
      </div>`;
  }

  if (f?.educacionSuperior?.length > 0) {
    html += `<hr style="margin:.8rem 0;border:none;border-top:1px solid var(--gris-claro)">
      <strong style="font-size:.8rem;color:var(--azul);letter-spacing:.5px">FORMACIÓN ACADÉMICA</strong>
      <div class="preview-grid" style="margin-top:.6rem">`;
    f.educacionSuperior.forEach((e, i) => {
      html += `<div class="preview-item"><span class="pk">Estudio ${i+1}</span><span class="pv">${e.modalidad} – ${e.titulo}</span></div>`;
    });
    html += `</div>`;
  }

  if (exps.length > 0) {
    html += `<hr style="margin:.8rem 0;border:none;border-top:1px solid var(--gris-claro)">
      <strong style="font-size:.8rem;color:var(--azul);letter-spacing:.5px">EXPERIENCIA LABORAL (${exps.length} registro/s)</strong>
      <div class="preview-grid" style="margin-top:.6rem">`;
    exps.forEach((e, i) => {
      html += `<div class="preview-item"><span class="pk">${i+1}. ${e.empresa}</span><span class="pv">${e.cargo} · ${formatFecha(e.fechaIngreso)} – ${e.fechaRetiro ? formatFecha(e.fechaRetiro) : 'Actual'}</span></div>`;
    });
    html += `</div>`;
  }

  if (t) {
    html += `<hr style="margin:.8rem 0;border:none;border-top:1px solid var(--gris-claro)">
      <strong style="font-size:.8rem;color:var(--azul);letter-spacing:.5px">TIEMPO TOTAL</strong>
      <div style="margin-top:.5rem;font-size:1.1rem;color:var(--azul);font-weight:700">${t.anios} años, ${t.meses} meses</div>`;
  }

  if (!d) {
    html = `<div class="alerta alerta-info visible"><span>ℹ️ Esta hoja de vida fue generada con datos de ejemplo. No tiene información detallada disponible.</span></div>`;
  }

  document.getElementById('detalle-contenido').innerHTML = html;
  document.getElementById('nuevoEstado').value = hv.estado;

  // Mostrar detalle, ocultar lista
  document.getElementById('panel-lista').style.display   = 'none';
  document.getElementById('panel-detalle').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── CAMBIAR ESTADO ────

function cambiarEstado() {
  const hv = ColeccionHV.find(h => h.id === hvSeleccionadaId);
  if (!hv) return;

  const nuevoEstado = document.getElementById('nuevoEstado').value;
  const anterior    = hv.estado;
  hv.estado = nuevoEstado;

  // Si es la HV del usuario actual en memoria, también actualizar
  if (HojaDeVida.datosPersonales?.numDoc === hv.documento) {
    HojaDeVida.estado = nuevoEstado;
  }

  mostrarAlerta('exito', `✅ Estado cambiado de "${anterior}" a "${nuevoEstado}".`);

  // Actualizar badge en el detalle
  const badge = document.querySelector('#detalle-contenido .badge');
  if (badge) {
    badge.className = `badge badge-${nuevoEstado}`;
    badge.textContent = nuevoEstado.toUpperCase();
  }
}

// ─── CERRAR DETALLE ────

function cerrarDetalle() {
  hvSeleccionadaId = null;
  document.getElementById('panel-detalle').style.display = 'none';
  document.getElementById('panel-lista').style.display   = 'block';
  filtrarHV();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}