document.addEventListener('DOMContentLoaded', () => {
  // Cargar datos guardados si existen
  const t = HojaDeVida.tiempoExperiencia;
  document.getElementById('sp-anios').value   = t.servidorPublico.anios   || 0;
  document.getElementById('sp-meses').value   = t.servidorPublico.meses   || 0;
  document.getElementById('priv-anios').value = t.sectorPrivado.anios     || 0;
  document.getElementById('priv-meses').value = t.sectorPrivado.meses     || 0;
  document.getElementById('ind-anios').value  = t.trabajadorIndep.anios   || 0;
  document.getElementById('ind-meses').value  = t.trabajadorIndep.meses   || 0;
  recalcular();
});

// ─── RECALCULAR TOTAL ───

function recalcular() {
  const sp   = { anios: parseInt(document.getElementById('sp-anios').value   || 0), meses: parseInt(document.getElementById('sp-meses').value   || 0) };
  const priv = { anios: parseInt(document.getElementById('priv-anios').value || 0), meses: parseInt(document.getElementById('priv-meses').value || 0) };
  const ind  = { anios: parseInt(document.getElementById('ind-anios').value  || 0), meses: parseInt(document.getElementById('ind-meses').value  || 0) };

  const total = calcularTotalExperiencia(sp, priv, ind);
  document.getElementById('total-display').textContent = `${total.anios} años, ${total.meses} meses`;
}

/**
 * Intenta calcular automáticamente desde las experiencias laborales
 * almacenadas en HojaDeVida, usando las fechas de ingreso y retiro.
 * Asigna todo al sector privado como aproximación (el usuario puede ajustar).
 */
function calcularDesdeExperiencia() {
  const exps = HojaDeVida.experienciaLaboral;
  if (!exps || exps.length === 0) {
    mostrarAlerta('info', 'ℹ️ No hay experiencias guardadas. Vaya a la sección anterior primero.');
    return;
  }

  let totalMeses = 0;
  const hoy = new Date();

  exps.forEach(e => {
    if (!e.fechaIngreso) return;
    const inicio = new Date(e.fechaIngreso);
    const fin    = e.fechaRetiro ? new Date(e.fechaRetiro) : hoy;
    const diff   = (fin.getFullYear() - inicio.getFullYear()) * 12
                 + (fin.getMonth() - inicio.getMonth());
    if (diff > 0) totalMeses += diff;
  });

  const anios = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;

  // Asignar al sector privado por defecto
  document.getElementById('priv-anios').value = anios;
  document.getElementById('priv-meses').value = meses;
  recalcular();
  mostrarAlerta('exito', `✅ Se calcularon ${anios} años y ${meses} meses desde las experiencias registradas (asignado a sector privado).`);
}

// ─── VALIDACIÓN ────

function validarFormulario() {
  let valido = true;
  const campos = ['sp-anios','sp-meses','priv-anios','priv-meses','ind-anios','ind-meses'];

  campos.forEach(id => {
    const val = document.getElementById(id).value;
    if (val === '' || parseInt(val) < 0) {
      mostrarError(id, 'Valor inválido (mínimo 0).');
      valido = false;
    } else {
      mostrarError(id, '');
    }
  });

  // Validar que meses no superen 11
  ['sp-meses','priv-meses','ind-meses'].forEach(id => {
    if (parseInt(document.getElementById(id).value) > 11) {
      mostrarError(id, 'Los meses no pueden ser mayores a 11.');
      valido = false;
    }
  });

  return valido;
}

// ─── VISTA PREVIA ────

function verPrevia() {
  const sp   = { anios: document.getElementById('sp-anios').value,   meses: document.getElementById('sp-meses').value   };
  const priv = { anios: document.getElementById('priv-anios').value, meses: document.getElementById('priv-meses').value };
  const ind  = { anios: document.getElementById('ind-anios').value,  meses: document.getElementById('ind-meses').value  };
  const total = calcularTotalExperiencia(sp, priv, ind);

  document.getElementById('preview-contenido').innerHTML = `
    <div class="preview-item"><span class="pk">Servidor Público</span><span class="pv">${sp.anios} años, ${sp.meses} meses</span></div>
    <div class="preview-item"><span class="pk">Sector Privado</span><span class="pv">${priv.anios} años, ${priv.meses} meses</span></div>
    <div class="preview-item"><span class="pk">Trab. Independiente</span><span class="pv">${ind.anios} años, ${ind.meses} meses</span></div>
    <div class="preview-item"><span class="pk">⏱️ TOTAL</span><span class="pv" style="font-weight:700;color:var(--azul)">${total.anios} años, ${total.meses} meses</span></div>
  `;
  document.getElementById('preview').classList.add('visible');
  document.getElementById('preview').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── GUARDAR Y NAVEGAR ──

function guardarYSiguiente() {
  if (!validarFormulario()) {
    mostrarAlerta('error', '⚠️ Por favor corrija los errores antes de continuar.');
    return;
  }
  const sp   = { anios: parseInt(document.getElementById('sp-anios').value),   meses: parseInt(document.getElementById('sp-meses').value)   };
  const priv = { anios: parseInt(document.getElementById('priv-anios').value), meses: parseInt(document.getElementById('priv-meses').value) };
  const ind  = { anios: parseInt(document.getElementById('ind-anios').value),  meses: parseInt(document.getElementById('ind-meses').value)  };

  HojaDeVida.tiempoExperiencia.servidorPublico = sp;
  HojaDeVida.tiempoExperiencia.sectorPrivado   = priv;
  HojaDeVida.tiempoExperiencia.trabajadorIndep = ind;
  HojaDeVida.tiempoExperiencia.total           = calcularTotalExperiencia(sp, priv, ind);
  guardarHVenStorage();

  mostrarAlerta('exito', '✅ Tiempo de experiencia guardado.');
  setTimeout(() => { window.location.href = 'certificacion.html'; }, 800);
}