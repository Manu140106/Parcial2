let contadorEstudios = 0;
let contadorIdiomas  = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Siempre iniciar con al menos 1 estudio y 1 idioma
  agregarEstudio();
  agregarIdioma();

  // Restaurar datos si ya existen
  if (HojaDeVida.formacionAcademica.educacionSuperior.length > 0) {
    // Limpiar los placeholder y recargar
    document.getElementById('contenedor-superior').innerHTML = '';
    document.getElementById('contenedor-idiomas').innerHTML  = '';
    contadorEstudios = 0;
    contadorIdiomas  = 0;
    HojaDeVida.formacionAcademica.educacionSuperior.forEach(e => agregarEstudio(e));
    HojaDeVida.formacionAcademica.idiomas.forEach(i => agregarIdioma(i));
    if (HojaDeVida.formacionAcademica.educacionBasica) {
      const b = HojaDeVida.formacionAcademica.educacionBasica;
      if (b.grado) {
        const r = document.querySelector(`input[name="grado"][value="${b.grado}"]`);
        if (r) r.checked = true;
      }
      document.getElementById('nivelBasica').value       = b.nivel       || '';
      document.getElementById('tituloBasica').value      = b.titulo      || '';
      document.getElementById('fechaGradoBasica').value  = b.fechaGrado  || '';
    }
  }
});

// ─── ESTUDIOS SUPERIORES ────

function agregarEstudio(datos = null) {
  contadorEstudios++;
  const id = contadorEstudios;
  const div = document.createElement('div');
  div.className = 'bloque-dinamico';
  div.id = `estudio-${id}`;
  div.innerHTML = `
    <div class="bloque-num">Estudio ${id}</div>
    <button class="btn btn-danger btn-remove" onclick="eliminarBloque('estudio-${id}')">✕ Quitar</button>
    <div class="form-grid cols-3">
      <div class="form-group">
        <label>Modalidad Académica <span class="req">*</span></label>
        <select id="est-modalidad-${id}">
          <option value="">-- Seleccione --</option>
        </select>
        <span class="msg-error" id="err-est-modalidad-${id}"></span>
      </div>
      <div class="form-group">
        <label>N° Semestres Aprobados <span class="req">*</span></label>
        <input type="number" id="est-semestres-${id}" min="1" max="20" placeholder="Ej: 8" />
        <span class="msg-error" id="err-est-semestres-${id}"></span>
      </div>
      <div class="form-group">
        <label>Graduado <span class="req">*</span></label>
        <div class="radio-group">
          <label class="radio-btn"><input type="radio" name="est-grad-${id}" value="SI" /> Sí</label>
          <label class="radio-btn"><input type="radio" name="est-grad-${id}" value="NO" /> No</label>
        </div>
        <span class="msg-error" id="err-est-grad-${id}"></span>
      </div>
      <div class="form-group span-2">
        <label>Nombre del Estudio / Título Obtenido <span class="req">*</span></label>
        <input type="text" id="est-titulo-${id}" placeholder="Ej: Ingeniería de Sistemas" />
        <span class="msg-error" id="err-est-titulo-${id}"></span>
      </div>
      <div class="form-group">
        <label>Terminación (MM/AAAA)</label>
        <input type="month" id="est-termina-${id}" />
        <span class="msg-error" id="err-est-termina-${id}"></span>
      </div>
      <div class="form-group">
        <label>N° Tarjeta Profesional</label>
        <input type="text" id="est-tarjeta-${id}" placeholder="Si aplica" />
        <span class="msg-error" id="err-est-tarjeta-${id}"></span>
      </div>
    </div>
  `;
  document.getElementById('contenedor-superior').appendChild(div);
  poblarSelect(`est-modalidad-${id}`, MODALIDADES_ACADEMICAS, '-- Modalidad --');

  // Cargar datos si vienen del objeto guardado
  if (datos) {
    document.getElementById(`est-modalidad-${id}`).value = datos.modalidad  || '';
    document.getElementById(`est-semestres-${id}`).value = datos.semestres  || '';
    document.getElementById(`est-titulo-${id}`).value    = datos.titulo     || '';
    document.getElementById(`est-termina-${id}`).value   = datos.terminacion || '';
    document.getElementById(`est-tarjeta-${id}`).value   = datos.tarjeta    || '';
    if (datos.graduado) {
      const r = document.querySelector(`input[name="est-grad-${id}"][value="${datos.graduado}"]`);
      if (r) r.checked = true;
    }
  }
}

// ─── IDIOMAS ────

function agregarIdioma(datos = null) {
  contadorIdiomas++;
  const id = contadorIdiomas;
  const div = document.createElement('div');
  div.className = 'bloque-dinamico';
  div.id = `idioma-${id}`;

  const nivelesHtml = (prefijo) =>
    NIVELES_IDIOMA.map(n =>
      `<label class="radio-btn"><input type="radio" name="${prefijo}-${id}" value="${n}" /> ${n}</label>`
    ).join('');

  div.innerHTML = `
    <div class="bloque-num">Idioma ${id}</div>
    <button class="btn btn-danger btn-remove" onclick="eliminarBloque('idioma-${id}')">✕ Quitar</button>
    <div class="form-grid cols-3">
      <div class="form-group">
        <label>Idioma <span class="req">*</span></label>
        <select id="id-nombre-${id}">
          <option value="">-- Seleccione --</option>
        </select>
        <span class="msg-error" id="err-id-nombre-${id}"></span>
      </div>
      <div class="form-group">
        <label>Lo habla <span class="req">*</span></label>
        <div class="radio-group">${nivelesHtml('id-habla')}</div>
        <span class="msg-error" id="err-id-habla-${id}"></span>
      </div>
      <div class="form-group">
        <label>Lo lee <span class="req">*</span></label>
        <div class="radio-group">${nivelesHtml('id-lee')}</div>
        <span class="msg-error" id="err-id-lee-${id}"></span>
      </div>
      <div class="form-group span-3">
        <label>Lo escribe <span class="req">*</span></label>
        <div class="radio-group">${nivelesHtml('id-escribe')}</div>
        <span class="msg-error" id="err-id-escribe-${id}"></span>
      </div>
    </div>
  `;
  document.getElementById('contenedor-idiomas').appendChild(div);
  poblarSelect(`id-nombre-${id}`, IDIOMAS_COMUNES, '-- Idioma --');

  if (datos) {
    document.getElementById(`id-nombre-${id}`).value = datos.nombre || '';
    ['habla','lee','escribe'].forEach(tipo => {
      if (datos[tipo]) {
        const r = document.querySelector(`input[name="id-${tipo}-${id}"][value="${datos[tipo]}"]`);
        if (r) r.checked = true;
      }
    });
  }
}

// ─── ELIMINAR BLOQUE ────

function eliminarBloque(idBloque) {
  const el = document.getElementById(idBloque);
  if (el) el.remove();
}

// ─── RECOGER DATOS ─────

function recogerDatos() {
  const gradoR = document.querySelector('input[name="grado"]:checked');
  const educBasica = {
    grado:      gradoR ? gradoR.value : '',
    nivel:      document.getElementById('nivelBasica').value,
    titulo:     document.getElementById('tituloBasica').value.trim(),
    fechaGrado: document.getElementById('fechaGradoBasica').value,
  };

  // Recoger estudios superiores activos
  const estudiosEl = document.querySelectorAll('#contenedor-superior .bloque-dinamico');
  const estudios = [];
  estudiosEl.forEach(el => {
    const n = el.id.split('-')[1];
    const gradR = document.querySelector(`input[name="est-grad-${n}"]:checked`);
    estudios.push({
      modalidad:   document.getElementById(`est-modalidad-${n}`)?.value || '',
      semestres:   document.getElementById(`est-semestres-${n}`)?.value || '',
      graduado:    gradR ? gradR.value : '',
      titulo:      document.getElementById(`est-titulo-${n}`)?.value.trim() || '',
      terminacion: document.getElementById(`est-termina-${n}`)?.value || '',
      tarjeta:     document.getElementById(`est-tarjeta-${n}`)?.value.trim() || '',
    });
  });

  // Recoger idiomas activos
  const idiomasEl = document.querySelectorAll('#contenedor-idiomas .bloque-dinamico');
  const idiomas = [];
  idiomasEl.forEach(el => {
    const n = el.id.split('-')[1];
    const hb = document.querySelector(`input[name="id-habla-${n}"]:checked`);
    const le = document.querySelector(`input[name="id-lee-${n}"]:checked`);
    const es = document.querySelector(`input[name="id-escribe-${n}"]:checked`);
    idiomas.push({
      nombre:  document.getElementById(`id-nombre-${n}`)?.value || '',
      habla:   hb ? hb.value : '',
      lee:     le ? le.value : '',
      escribe: es ? es.value : '',
    });
  });

  return { educBasica, estudios, idiomas };
}

// ─── VALIDACIÓN ────

function validarFormulario() {
  let valido = true;

  // Validar básica
  const gradoR = document.querySelector('input[name="grado"]:checked');
  if (!gradoR) {
    document.getElementById('err-gradoBasica').textContent = 'Seleccione el último grado aprobado.';
    valido = false;
  } else { document.getElementById('err-gradoBasica').textContent = ''; }

  if (!requerido(document.getElementById('nivelBasica').value)) {
    mostrarError('nivelBasica', 'Seleccione el nivel educativo.');
    valido = false;
  } else { mostrarError('nivelBasica', ''); }

  if (!requerido(document.getElementById('fechaGradoBasica').value)) {
    mostrarError('fechaGradoBasica', 'Ingrese la fecha de grado.');
    valido = false;
  } else { mostrarError('fechaGradoBasica', ''); }

  // Validar estudios superiores
  const estudiosEl = document.querySelectorAll('#contenedor-superior .bloque-dinamico');
  if (estudiosEl.length === 0) {
    document.getElementById('err-superior').textContent = 'Agregue al menos un estudio superior.';
    valido = false;
  } else { document.getElementById('err-superior').textContent = ''; }

  estudiosEl.forEach(el => {
    const n = el.id.split('-')[1];

    const mod = document.getElementById(`est-modalidad-${n}`)?.value;
    if (!requerido(mod)) {
      mostrarError(`est-modalidad-${n}`, 'Seleccione la modalidad.');
      valido = false;
    } else { mostrarError(`est-modalidad-${n}`, ''); }

    const sem = document.getElementById(`est-semestres-${n}`)?.value;
    if (!requerido(sem) || parseInt(sem) < 1) {
      mostrarError(`est-semestres-${n}`, 'Ingrese el número de semestres aprobados.');
      valido = false;
    } else { mostrarError(`est-semestres-${n}`, ''); }

    const gradR = document.querySelector(`input[name="est-grad-${n}"]:checked`);
    if (!gradR) {
      const err = document.getElementById(`err-est-grad-${n}`);
      if (err) err.textContent = 'Indique si está graduado.';
      valido = false;
    } else {
      const err = document.getElementById(`err-est-grad-${n}`);
      if (err) err.textContent = '';
    }

    const tit = document.getElementById(`est-titulo-${n}`)?.value.trim();
    if (!requerido(tit)) {
      mostrarError(`est-titulo-${n}`, 'Ingrese el nombre del estudio o título.');
      valido = false;
    } else { mostrarError(`est-titulo-${n}`, ''); }
  });

  // Validar idiomas
  const idiomasEl = document.querySelectorAll('#contenedor-idiomas .bloque-dinamico');
  idiomasEl.forEach(el => {
    const n = el.id.split('-')[1];
    const nom = document.getElementById(`id-nombre-${n}`)?.value;
    if (!requerido(nom)) {
      mostrarError(`id-nombre-${n}`, 'Seleccione el idioma.');
      valido = false;
    } else { mostrarError(`id-nombre-${n}`, ''); }

    ['habla','lee','escribe'].forEach(tipo => {
      const r = document.querySelector(`input[name="id-${tipo}-${n}"]:checked`);
      if (!r) {
        const err = document.getElementById(`err-id-${tipo}-${n}`);
        if (err) err.textContent = 'Seleccione un nivel.';
        valido = false;
      } else {
        const err = document.getElementById(`err-id-${tipo}-${n}`);
        if (err) err.textContent = '';
      }
    });
  });

  return valido;
}

// ─── VISTA PREVIA ─────

function verPrevia() {
  const d = recogerDatos();
  let html = `<div class="preview-grid">
    <div class="preview-item"><span class="pk">Último grado básico</span><span class="pv">Grado ${d.educBasica.grado} – ${d.educBasica.nivel}</span></div>
    <div class="preview-item"><span class="pk">Título básico</span><span class="pv">${d.educBasica.titulo || 'N/A'}</span></div>
  </div>
  <hr style="margin:1rem 0;border:none;border-top:1px solid var(--gris-claro);">`;

  if (d.estudios.length > 0) {
    html += '<strong style="font-size:0.82rem;color:var(--azul)">EDUCACIÓN SUPERIOR</strong>';
    d.estudios.forEach((e, i) => {
      html += `<div class="preview-grid" style="margin-top:.7rem">
        <div class="preview-item"><span class="pk">Estudio ${i+1}</span><span class="pv">${e.modalidad} – ${e.titulo}</span></div>
        <div class="preview-item"><span class="pk">Semestres</span><span class="pv">${e.semestres}</span></div>
        <div class="preview-item"><span class="pk">Graduado</span><span class="pv">${e.graduado}</span></div>
        <div class="preview-item"><span class="pk">Terminación</span><span class="pv">${e.terminacion || 'N/A'}</span></div>
      </div>`;
    });
  }

  if (d.idiomas.length > 0) {
    html += '<hr style="margin:1rem 0;border:none;border-top:1px solid var(--gris-claro);"><strong style="font-size:0.82rem;color:var(--azul)">IDIOMAS</strong>';
    d.idiomas.forEach((id, i) => {
      html += `<div class="preview-grid" style="margin-top:.7rem">
        <div class="preview-item"><span class="pk">Idioma ${i+1}</span><span class="pv">${id.nombre}</span></div>
        <div class="preview-item"><span class="pk">Habla / Lee / Escribe</span><span class="pv">${id.habla} / ${id.lee} / ${id.escribe}</span></div>
      </div>`;
    });
  }

  document.getElementById('preview-contenido').innerHTML = html;
  document.getElementById('preview').classList.add('visible');
  document.getElementById('preview').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── GUARDAR Y NAVEGAR ───

function guardarYSiguiente() {
  if (!validarFormulario()) {
    mostrarAlerta('error', '⚠️ Por favor corrija los errores antes de continuar.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const d = recogerDatos();
  HojaDeVida.formacionAcademica.educacionBasica   = d.educBasica;
  HojaDeVida.formacionAcademica.educacionSuperior = d.estudios;
  HojaDeVida.formacionAcademica.idiomas           = d.idiomas;
  guardarHVenStorage();
  mostrarAlerta('exito', '✅ Formación académica guardada.');
  setTimeout(() => { window.location.href = 'experiencia.html'; }, 800);
}