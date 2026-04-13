document.addEventListener('DOMContentLoaded', () => {
  // Poblar selects con colecciones predeterminadas
  poblarSelect('paisNac',    PAISES);
  poblarSelect('nacPais',    PAISES, '-- País --');
  poblarSelect('corrPais',   PAISES, '-- País --');
  poblarSelect('nacDepto',   DEPARTAMENTOS_COL, '-- Departamento --');
  poblarSelect('corrDepto',  DEPARTAMENTOS_COL, '-- Departamento --');
  poblarSelect('distritoMilitar', DISTRITOS_MILITARES, '-- Distrito --');

  // Mostrar libreta militar solo si el sexo es masculino
  document.querySelectorAll('input[name="sexo"]').forEach(r => {
    r.addEventListener('change', () => {
      const secLib = document.getElementById('sec-libreta');
      secLib.style.display = r.value === 'M' ? 'block' : 'none';
    });
  });

  // Precargar si ya hay datos guardados
  if (HojaDeVida.datosPersonales) {
    cargarDatos(HojaDeVida.datosPersonales);
  }
});

// ─── VALIDACIÓN ────

function validarFormulario() {
  let valido = true;

  // Primer apellido
  const pa = document.getElementById('primerApellido').value;
  if (!requerido(pa)) {
    mostrarError('primerApellido', 'El primer apellido es obligatorio.');
    valido = false;
  } else if (!soloLetras(pa)) {
    mostrarError('primerApellido', 'Solo se permiten letras.');
    valido = false;
  } else { mostrarError('primerApellido', ''); }

  // Nombres
  const nom = document.getElementById('nombres').value;
  if (!requerido(nom)) {
    mostrarError('nombres', 'Los nombres son obligatorios.');
    valido = false;
  } else if (!soloLetras(nom)) {
    mostrarError('nombres', 'Solo se permiten letras.');
    valido = false;
  } else { mostrarError('nombres', ''); }

  // Tipo de documento
  const td = document.getElementById('tipoDoc').value;
  if (!requerido(td)) {
    mostrarError('tipoDoc', 'Seleccione el tipo de documento.');
    valido = false;
  } else { mostrarError('tipoDoc', ''); }

  // Número de documento
  const nd = document.getElementById('numDoc').value;
  if (!requerido(nd)) {
    mostrarError('numDoc', 'El número de documento es obligatorio.');
    valido = false;
  } else if (!esDocumento(nd)) {
    mostrarError('numDoc', 'Ingrese entre 6 y 12 dígitos numéricos.');
    valido = false;
  } else { mostrarError('numDoc', ''); }

  // Sexo
  const sexoVal = document.querySelector('input[name="sexo"]:checked');
  if (!sexoVal) {
    mostrarError('sexo', 'Seleccione el sexo.');
    valido = false;
  } else { mostrarError('sexo', ''); }

  // Nacionalidad
  const nacVal = document.querySelector('input[name="nac"]:checked');
  if (!nacVal) {
    mostrarError('nac', 'Seleccione la nacionalidad.');
    valido = false;
  } else { mostrarError('nac', ''); }

  // Libreta Militar (solo si sexo = M)
  if (sexoVal && sexoVal.value === 'M') {
    const clase = document.querySelector('input[name="claseLib"]:checked');
    if (!clase) {
      mostrarError('claseLibreta', 'Seleccione la clase de libreta.');
      valido = false;
    } else { mostrarError('claseLibreta', ''); }

    const nl = document.getElementById('numLibreta').value;
    if (!requerido(nl)) {
      mostrarError('numLibreta', 'Ingrese el número de libreta.');
      valido = false;
    } else { mostrarError('numLibreta', ''); }

    const dm = document.getElementById('distritoMilitar').value;
    if (!requerido(dm)) {
      mostrarError('distritoMilitar', 'Seleccione el distrito militar.');
      valido = false;
    } else { mostrarError('distritoMilitar', ''); }
  }

  // Fecha de nacimiento
  const dia  = document.getElementById('nacDia').value;
  const mes  = document.getElementById('nacMes').value;
  const anio = document.getElementById('nacAnio').value;

  if (!requerido(dia) || parseInt(dia) < 1 || parseInt(dia) > 31) {
    mostrarError('nacDia', 'Día inválido (1-31).');
    valido = false;
  } else { mostrarError('nacDia', ''); }

  if (!requerido(mes) || parseInt(mes) < 1 || parseInt(mes) > 12) {
    mostrarError('nacMes', 'Mes inválido (1-12).');
    valido = false;
  } else { mostrarError('nacMes', ''); }

  if (!requerido(anio) || parseInt(anio) < 1900 || parseInt(anio) > 2010) {
    mostrarError('nacAnio', 'Año inválido.');
    valido = false;
  } else { mostrarError('nacAnio', ''); }

  if (!requerido(document.getElementById('nacPais').value)) {
    mostrarError('nacPais', 'Seleccione el país de nacimiento.');
    valido = false;
  } else { mostrarError('nacPais', ''); }

  if (!requerido(document.getElementById('nacDepto').value)) {
    mostrarError('nacDepto', 'Seleccione el departamento.');
    valido = false;
  } else { mostrarError('nacDepto', ''); }

  const mun = document.getElementById('nacMunicipio').value;
  if (!requerido(mun)) {
    mostrarError('nacMunicipio', 'Ingrese el municipio.');
    valido = false;
  } else { mostrarError('nacMunicipio', ''); }

  // Correspondencia
  if (!requerido(document.getElementById('corrPais').value)) {
    mostrarError('corrPais', 'Seleccione el país.');
    valido = false;
  } else { mostrarError('corrPais', ''); }

  if (!requerido(document.getElementById('corrDepto').value)) {
    mostrarError('corrDepto', 'Seleccione el departamento.');
    valido = false;
  } else { mostrarError('corrDepto', ''); }

  if (!requerido(document.getElementById('corrMunicipio').value)) {
    mostrarError('corrMunicipio', 'Ingrese el municipio.');
    valido = false;
  } else { mostrarError('corrMunicipio', ''); }

  const tel = document.getElementById('telefono').value;
  if (!requerido(tel)) {
    mostrarError('telefono', 'El teléfono es obligatorio.');
    valido = false;
  } else if (!esTelefono(tel)) {
    mostrarError('telefono', 'Ingrese entre 7 y 10 dígitos.');
    valido = false;
  } else { mostrarError('telefono', ''); }

  const em = document.getElementById('email').value;
  if (!requerido(em)) {
    mostrarError('email', 'El email es obligatorio.');
    valido = false;
  } else if (!esEmail(em)) {
    mostrarError('email', 'Formato de email inválido.');
    valido = false;
  } else { mostrarError('email', ''); }

  return valido;
}

// ─── RECOGER DATOS DEL FORMULARIO ────

function recogerDatos() {
  const sexo = document.querySelector('input[name="sexo"]:checked');
  const nac  = document.querySelector('input[name="nac"]:checked');
  const cl   = document.querySelector('input[name="claseLib"]:checked');

  return {
    primerApellido:   document.getElementById('primerApellido').value.trim(),
    segundoApellido:  document.getElementById('segundoApellido').value.trim(),
    nombres:          document.getElementById('nombres').value.trim(),
    tipoDoc:          document.getElementById('tipoDoc').value,
    numDoc:           document.getElementById('numDoc').value.trim(),
    sexo:             sexo ? sexo.value : '',
    nacionalidad:     nac  ? nac.value  : '',
    paisNac:          document.getElementById('paisNac').value,
    libreta: {
      clase:    cl ? cl.value : '',
      numero:   document.getElementById('numLibreta').value.trim(),
      distrito: document.getElementById('distritoMilitar').value,
    },
    nacimiento: {
      dia:       document.getElementById('nacDia').value,
      mes:       document.getElementById('nacMes').value,
      anio:      document.getElementById('nacAnio').value,
      pais:      document.getElementById('nacPais').value,
      depto:     document.getElementById('nacDepto').value,
      municipio: document.getElementById('nacMunicipio').value.trim(),
    },
    correspondencia: {
      pais:      document.getElementById('corrPais').value,
      depto:     document.getElementById('corrDepto').value,
      municipio: document.getElementById('corrMunicipio').value.trim(),
      telefono:  document.getElementById('telefono').value.trim(),
      email:     document.getElementById('email').value.trim(),
    }
  };
}

// ─── CARGAR DATOS (para edición) ────

function cargarDatos(d) {
  if (!d) return;
  document.getElementById('primerApellido').value  = d.primerApellido  || '';
  document.getElementById('segundoApellido').value = d.segundoApellido || '';
  document.getElementById('nombres').value         = d.nombres         || '';
  document.getElementById('tipoDoc').value         = d.tipoDoc         || '';
  document.getElementById('numDoc').value          = d.numDoc          || '';
  document.getElementById('telefono').value        = d.correspondencia?.telefono || '';
  document.getElementById('email').value           = d.correspondencia?.email    || '';

  if (d.sexo) {
    const r = document.querySelector(`input[name="sexo"][value="${d.sexo}"]`);
    if (r) { r.checked = true; r.dispatchEvent(new Event('change')); }
  }
  if (d.nacionalidad) {
    const r = document.querySelector(`input[name="nac"][value="${d.nacionalidad}"]`);
    if (r) r.checked = true;
  }
}

// ─── VISTA PREVIA ────

function verPrevia() {
  const d = recogerDatos();
  const cont = document.getElementById('preview-contenido');
  const sexo = d.sexo === 'F' ? 'Femenino' : d.sexo === 'M' ? 'Masculino' : '';

  cont.innerHTML = `
    <div class="preview-item"><span class="pk">Nombre completo</span><span class="pv">${d.nombres} ${d.primerApellido} ${d.segundoApellido}</span></div>
    <div class="preview-item"><span class="pk">Documento</span><span class="pv">${d.tipoDoc} ${d.numDoc}</span></div>
    <div class="preview-item"><span class="pk">Sexo</span><span class="pv">${sexo}</span></div>
    <div class="preview-item"><span class="pk">Nacimiento</span><span class="pv">${d.nacimiento.dia}/${d.nacimiento.mes}/${d.nacimiento.anio} — ${d.nacimiento.municipio}, ${d.nacimiento.depto}</span></div>
    <div class="preview-item"><span class="pk">Teléfono</span><span class="pv">${d.correspondencia.telefono}</span></div>
    <div class="preview-item"><span class="pk">Email</span><span class="pv">${d.correspondencia.email}</span></div>
    <div class="preview-item"><span class="pk">Residencia</span><span class="pv">${d.correspondencia.municipio}, ${d.correspondencia.depto}, ${d.correspondencia.pais}</span></div>
  `;

  document.getElementById('preview').classList.add('visible');
  document.getElementById('preview').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── GUARDAR Y NAVEGAR ────

function guardarYSiguiente() {
  if (!validarFormulario()) {
    mostrarAlerta('error', '⚠️ Por favor corrija los errores antes de continuar.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  HojaDeVida.datosPersonales = recogerDatos();
  guardarHVenStorage();
  mostrarAlerta('exito', '✅ Datos guardados correctamente.');
  setTimeout(() => { window.location.href = 'formacion.html'; }, 800);
}