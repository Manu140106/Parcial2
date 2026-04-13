let contadorExp = 0;

document.addEventListener('DOMContentLoaded', () => {
  if (HojaDeVida.experienciaLaboral.length > 0) {
    HojaDeVida.experienciaLaboral.forEach(e => agregarExperiencia(e));
  } else {
    agregarExperiencia(); // Iniciar con 1 vacío
  }
});

function agregarExperiencia(datos = null) {
  contadorExp++;
  const id  = contadorExp;
  const etiqueta = id === 1 ? 'Empleo actual / Contrato vigente' : `Empleo o contrato anterior ${id - 1}`;
  const div = document.createElement('div');
  div.className = 'bloque-dinamico';
  div.id = `exp-${id}`;
  div.innerHTML = `
    <div class="bloque-num">${etiqueta}</div>
    <button class="btn btn-danger btn-remove" onclick="eliminarBloque('exp-${id}')">✕ Quitar</button>
    <div class="form-grid">
      <div class="form-group span-2">
        <label>Empresa / Entidad <span class="req">*</span></label>
        <input type="text" id="exp-empresa-${id}" placeholder="Nombre de la empresa o entidad" />
        <span class="msg-error" id="err-exp-empresa-${id}"></span>
      </div>
      <div class="form-group">
        <label>Tipo</label>
        <div class="radio-group">
          <label class="radio-btn"><input type="radio" name="exp-tipo-${id}" value="publica" /> Pública</label>
          <label class="radio-btn"><input type="radio" name="exp-tipo-${id}" value="privada" /> Privada</label>
        </div>
      </div>
      <div class="form-group">
        <label>País</label>
        <select id="exp-pais-${id}"></select>
      </div>
      <div class="form-group">
        <label>Departamento</label>
        <select id="exp-depto-${id}"></select>
      </div>
      <div class="form-group">
        <label>Municipio</label>
        <input type="text" id="exp-municipio-${id}" placeholder="Ej: Armenia" />
      </div>
      <div class="form-group">
        <label>Correo Entidad</label>
        <input type="text" id="exp-email-${id}" placeholder="correo@entidad.com" />
        <span class="msg-error" id="err-exp-email-${id}"></span>
      </div>
      <div class="form-group">
        <label>Teléfono Entidad</label>
        <input type="text" id="exp-tel-${id}" placeholder="Ej: 6062123456" maxlength="10" />
        <span class="msg-error" id="err-exp-tel-${id}"></span>
      </div>
      <div class="form-group">
        <label>Fecha de Ingreso <span class="req">*</span></label>
        <input type="date" id="exp-ingreso-${id}" />
        <span class="msg-error" id="err-exp-ingreso-${id}"></span>
      </div>
      <div class="form-group">
        <label>Fecha de Retiro <span id="lbl-retiro-${id}">(si aplica)</span></label>
        <input type="date" id="exp-retiro-${id}" />
        <span class="msg-error" id="err-exp-retiro-${id}"></span>
      </div>
      <div class="form-group span-2">
        <label>Cargo / Contrato <span class="req">*</span></label>
        <input type="text" id="exp-cargo-${id}" placeholder="Ej: Desarrollador Junior" />
        <span class="msg-error" id="err-exp-cargo-${id}"></span>
      </div>
      <div class="form-group">
        <label>Dependencia</label>
        <input type="text" id="exp-dependencia-${id}" placeholder="Ej: Dirección de TI" />
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input type="text" id="exp-direccion-${id}" placeholder="Dirección de la entidad" />
      </div>
    </div>
  `;
  document.getElementById('contenedor-experiencias').appendChild(div);
  poblarSelect(`exp-pais-${id}`,  PAISES,              '-- País --');
  poblarSelect(`exp-depto-${id}`, DEPARTAMENTOS_COL,   '-- Depto --');

  if (datos) {
    document.getElementById(`exp-empresa-${id}`).value    = datos.empresa     || '';
    document.getElementById(`exp-municipio-${id}`).value  = datos.municipio   || '';
    document.getElementById(`exp-email-${id}`).value      = datos.email       || '';
    document.getElementById(`exp-tel-${id}`).value        = datos.telefono    || '';
    document.getElementById(`exp-ingreso-${id}`).value    = datos.fechaIngreso || '';
    document.getElementById(`exp-retiro-${id}`).value     = datos.fechaRetiro || '';
    document.getElementById(`exp-cargo-${id}`).value      = datos.cargo       || '';
    document.getElementById(`exp-dependencia-${id}`).value = datos.dependencia || '';
    document.getElementById(`exp-direccion-${id}`).value  = datos.direccion   || '';
    if (datos.pais)  document.getElementById(`exp-pais-${id}`).value  = datos.pais;
    if (datos.depto) document.getElementById(`exp-depto-${id}`).value = datos.depto;
    if (datos.tipo) {
      const r = document.querySelector(`input[name="exp-tipo-${id}"][value="${datos.tipo}"]`);
      if (r) r.checked = true;
    }
  }
}

function eliminarBloque(idBloque) {
  const el = document.getElementById(idBloque);
  if (el) el.remove();
}

function recogerDatos() {
  const exps = [];
  document.querySelectorAll('#contenedor-experiencias .bloque-dinamico').forEach(el => {
    const n = el.id.split('-')[1];
    const tipoR = document.querySelector(`input[name="exp-tipo-${n}"]:checked`);
    exps.push({
      empresa:      document.getElementById(`exp-empresa-${n}`)?.value.trim()     || '',
      tipo:         tipoR ? tipoR.value : '',
      pais:         document.getElementById(`exp-pais-${n}`)?.value               || '',
      depto:        document.getElementById(`exp-depto-${n}`)?.value              || '',
      municipio:    document.getElementById(`exp-municipio-${n}`)?.value.trim()   || '',
      email:        document.getElementById(`exp-email-${n}`)?.value.trim()       || '',
      telefono:     document.getElementById(`exp-tel-${n}`)?.value.trim()         || '',
      fechaIngreso: document.getElementById(`exp-ingreso-${n}`)?.value            || '',
      fechaRetiro:  document.getElementById(`exp-retiro-${n}`)?.value             || '',
      cargo:        document.getElementById(`exp-cargo-${n}`)?.value.trim()       || '',
      dependencia:  document.getElementById(`exp-dependencia-${n}`)?.value.trim() || '',
      direccion:    document.getElementById(`exp-direccion-${n}`)?.value.trim()   || '',
    });
  });
  return exps;
}

function validarFormulario() {
  let valido = true;
  const bloques = document.querySelectorAll('#contenedor-experiencias .bloque-dinamico');

  if (bloques.length === 0) {
    document.getElementById('err-experiencias').textContent = 'Agregue al menos una experiencia laboral.';
    return false;
  }
  document.getElementById('err-experiencias').textContent = '';

  bloques.forEach(el => {
    const n = el.id.split('-')[1];

    const emp = document.getElementById(`exp-empresa-${n}`)?.value.trim();
    if (!requerido(emp)) {
      mostrarError(`exp-empresa-${n}`, 'El nombre de la empresa es obligatorio.');
      valido = false;
    } else { mostrarError(`exp-empresa-${n}`, ''); }

    const ing = document.getElementById(`exp-ingreso-${n}`)?.value;
    if (!requerido(ing)) {
      mostrarError(`exp-ingreso-${n}`, 'La fecha de ingreso es obligatoria.');
      valido = false;
    } else { mostrarError(`exp-ingreso-${n}`, ''); }

    const cargo = document.getElementById(`exp-cargo-${n}`)?.value.trim();
    if (!requerido(cargo)) {
      mostrarError(`exp-cargo-${n}`, 'El cargo es obligatorio.');
      valido = false;
    } else { mostrarError(`exp-cargo-${n}`, ''); }

    // Email y teléfono son opcionales, pero si se ingresan, deben ser válidos
    const em = document.getElementById(`exp-email-${n}`)?.value.trim();
    if (requerido(em) && !esEmail(em)) {
      mostrarError(`exp-email-${n}`, 'Formato de email inválido.');
      valido = false;
    } else { mostrarError(`exp-email-${n}`, ''); }

    const tel = document.getElementById(`exp-tel-${n}`)?.value.trim();
    if (requerido(tel) && !esTelefono(tel)) {
      mostrarError(`exp-tel-${n}`, 'Ingrese entre 7 y 10 dígitos.');
      valido = false;
    } else { mostrarError(`exp-tel-${n}`, ''); }

    // Validar que retiro sea posterior a ingreso
    const ret = document.getElementById(`exp-retiro-${n}`)?.value;
    if (requerido(ing) && requerido(ret) && ret < ing) {
      mostrarError(`exp-retiro-${n}`, 'La fecha de retiro debe ser posterior al ingreso.');
      valido = false;
    } else { mostrarError(`exp-retiro-${n}`, ''); }
  });

  return valido;
}

function verPrevia() {
  const exps = recogerDatos();
  let html = '';
  exps.forEach((e, i) => {
    html += `
      <div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--gris-claro)">
        <div class="preview-grid">
          <div class="preview-item"><span class="pk">${i === 0 ? 'Empleo actual' : `Anterior ${i}`}</span><span class="pv">${e.empresa}</span></div>
          <div class="preview-item"><span class="pk">Cargo</span><span class="pv">${e.cargo}</span></div>
          <div class="preview-item"><span class="pk">Ingreso</span><span class="pv">${formatFecha(e.fechaIngreso)}</span></div>
          <div class="preview-item"><span class="pk">Retiro</span><span class="pv">${e.fechaRetiro ? formatFecha(e.fechaRetiro) : 'Actual'}</span></div>
          <div class="preview-item"><span class="pk">Municipio</span><span class="pv">${e.municipio || 'N/A'}, ${e.depto || ''}</span></div>
        </div>
      </div>`;
  });
  document.getElementById('preview-contenido').innerHTML = html || '<p style="color:var(--gris-medio)">Sin experiencias ingresadas.</p>';
  document.getElementById('preview').classList.add('visible');
  document.getElementById('preview').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function guardarYSiguiente() {
  if (!validarFormulario()) {
    mostrarAlerta('error', '⚠️ Por favor corrija los errores antes de continuar.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  HojaDeVida.experienciaLaboral = recogerDatos();
  guardarHVenStorage();
  mostrarAlerta('exito', '✅ Experiencia laboral guardada.');
  setTimeout(() => { window.location.href = 'tiempo.html'; }, 800);
}