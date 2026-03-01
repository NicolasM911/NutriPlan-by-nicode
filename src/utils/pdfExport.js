import jsPDF from 'jspdf'

// ── Paleta ─────────────────────────────────────────────────
const C = {
  terracotta:  [244, 132,  95],
  terracottaL: [255, 220, 205],
  amber:       [247, 178, 103],
  amberL:      [255, 240, 215],
  sage:        [130, 187, 122],
  sageL:       [220, 240, 216],
  cream:       [255, 248, 240],
  creamD:      [238, 218, 198],
  brown:       [ 61,  43,  31],
  brownL:      [140, 100,  70],
  brownXL:     [180, 140, 105],
  white:       [255, 255, 255],
  gray:        [190, 175, 162],
  black:       [ 20,  10,   5],
}

const MEAL_CONFIG = {
  juice:     { label: 'JUGO NATURAL',  dot: [130, 187, 122] },
  breakfast: { label: 'DESAYUNO',      dot: [247, 178, 103] },
  lunch:     { label: 'ALMUERZO',      dot: [244, 132,  95] },
  dinner:    { label: 'CENA',          dot: [ 94, 140, 180] },
  snack:     { label: 'SNACK',         dot: [168, 140, 200] },
}

const GOAL_LABELS = {
  helicobacter: 'Eliminar H. Pylori',
  gain_weight:  'Aumentar Peso',
  gain_muscle:  'Aumentar Masa Muscular',
  lose_weight:  'Bajar Peso',
  maintain:     'Mantener Peso',
}

const MEAL_ORDER = ['juice', 'breakfast', 'lunch', 'dinner', 'snack']

// ── Encoding Latin-1 ───────────────────────────────────────
function s(str) {
  if (str == null) return ''
  return String(str)
    .replace(/á/g,'\xe1').replace(/é/g,'\xe9').replace(/í/g,'\xed')
    .replace(/ó/g,'\xf3').replace(/ú/g,'\xfa').replace(/ü/g,'\xfc')
    .replace(/Á/g,'\xc1').replace(/É/g,'\xc9').replace(/Í/g,'\xcd')
    .replace(/Ó/g,'\xd3').replace(/Ú/g,'\xda').replace(/Ü/g,'\xdc')
    .replace(/ñ/g,'\xf1').replace(/Ñ/g,'\xd1')
    .replace(/¿/g,'\xbf').replace(/¡/g,'\xa1')
    .replace(/[""]/g,'"').replace(/['']/g,"'")
    .replace(/[–—]/g,'-')
}

// ── Helpers ────────────────────────────────────────────────
const W = 210, PAD = 14, INNER = 210 - 28

function f(doc, size, style, color) {
  doc.setFontSize(size)
  doc.setFont('helvetica', style || 'normal')
  doc.setTextColor(...(color || C.brown))
}

function box(doc, x, y, w, h, fill, r = 0) {
  doc.setFillColor(...fill)
  r ? doc.roundedRect(x, y, w, h, r, r, 'F') : doc.rect(x, y, w, h, 'F')
}

function outline(doc, x, y, w, h, stroke, r = 0) {
  doc.setDrawColor(...stroke)
  doc.setLineWidth(0.3)
  r ? doc.roundedRect(x, y, w, h, r, r, 'S') : doc.rect(x, y, w, h, 'S')
}

function bar(doc, x, y, w, h, pct, fill, bg = C.creamD) {
  doc.setFillColor(...bg)
  doc.roundedRect(x, y, w, h, h/2, h/2, 'F')
  if (pct > 0) {
    doc.setFillColor(...fill)
    doc.roundedRect(x, y, Math.max(w * Math.min(pct,100)/100, h), h, h/2, h/2, 'F')
  }
}

function hline(doc, y, x1 = PAD, x2 = W - PAD, color = C.creamD) {
  doc.setDrawColor(...color)
  doc.setLineWidth(0.3)
  doc.line(x1, y, x2, y)
}

function newPage(doc) {
  doc.addPage()
  // Franja superior sutil
  box(doc, 0, 0, W, 8, C.terracotta)
  box(doc, 0, 7, W, 1, C.amber)
  return 16
}

function pageFooter(doc, page, total, name) {
  f(doc, 7, 'normal', C.gray)
  doc.text(
    s(`NutriPlan  \xb7  ${name}  \xb7  ${new Date().toLocaleDateString('es')}  \xb7  Pag. ${page} / ${total}`),
    W/2, 291, { align: 'center' }
  )
  hline(doc, 288, 10, 200, C.creamD)
}

// ── Proyecciones ───────────────────────────────────────────
function getProjections(goal, weight, calories) {
  const d = {
    helicobacter: {
      title: 'Recuperacion digestiva esperada',
      items: [
        { label: 'Reduccion de inflamacion',     pct: 85, time: '2-3 semanas' },
        { label: 'Mejora sintomas digestivos',   pct: 78, time: '3-4 semanas' },
        { label: 'Fortalec. flora intestinal',   pct: 90, time: '4-6 semanas' },
        { label: 'Recuperacion mucosa gastrica', pct: 72, time: '6-8 semanas' },
      ],
      summary: [
        `Dieta de ${calories} kcal/dia disenada para no irritar la mucosa gastrica`,
        'Alimentos antiinflamatorios: brocoli, yogur probiotico, ajo, curcuma',
        'Comidas pequenas y frecuentes para reducir la carga gastrica',
        'Evitar: cafe, alcohol, citricos acidos, picantes y procesados',
      ],
    },
    gain_weight: {
      title: 'Progreso de aumento de peso esperado',
      items: [
        { label: 'Aumento de peso (mes 1)',  pct: 60, time: '+1.5 - 2 kg' },
        { label: 'Aumento de peso (mes 2)',  pct: 75, time: '+3 - 4 kg' },
        { label: 'Mejora de energia diaria', pct: 88, time: '2-3 semanas' },
        { label: 'Retencion muscular',       pct: 80, time: 'Constante' },
      ],
      summary: [
        `Superavit de +450 kcal sobre tu TDEE (${calories} kcal/dia total)`,
        'Alta densidad calorica: aguacate, frutos secos, aceite de oliva',
        '5-6 comidas al dia para mantener el superavit constante',
        'Combinado con ejercicio de fuerza para ganancia saludable',
      ],
    },
    gain_muscle: {
      title: 'Desarrollo muscular esperado',
      items: [
        { label: 'Sintesis proteica diaria',    pct: 92, time: 'Desde dia 1' },
        { label: 'Ganancia muscular (mes 1)',   pct: 70, time: '+0.5 - 1 kg' },
        { label: 'Reduccion grasa corporal',    pct: 65, time: 'Mes 2-3' },
        { label: 'Mejora rendimiento fisico',   pct: 85, time: '3-4 semanas' },
      ],
      summary: [
        `${Math.round(weight * 2)}g de proteina diaria (2g/kg) en 5 comidas`,
        `Plan de ${calories} kcal con superavit controlado de +250 kcal`,
        'Proteina en cada comida: pollo, huevos, atun, quinoa, legumbres',
        'Carbohidratos complejos pre-entreno para maximo rendimiento',
      ],
    },
    lose_weight: {
      title: 'Perdida de peso esperada',
      items: [
        { label: 'Perdida de peso (mes 1)',   pct: 80, time: '-1.5 - 2 kg' },
        { label: 'Perdida de peso (mes 2)',   pct: 88, time: '-3 - 4 kg' },
        { label: 'Reduccion grasa corporal',  pct: 82, time: 'Progresiva' },
        { label: 'Mejora de saciedad',        pct: 90, time: '1-2 semanas' },
      ],
      summary: [
        `Deficit de -450 kcal bajo tu TDEE (${calories} kcal/dia)`,
        'Alto en proteina y fibra para maxima saciedad sin hambre',
        'Deficit calorico sin comprometer masa muscular ni nutrientes',
        'Verduras sin almidon ilimitadas como base de cada comida',
      ],
    },
    maintain: {
      title: 'Mantenimiento y bienestar esperado',
      items: [
        { label: 'Estabilidad de peso', pct: 93, time: 'Constante' },
        { label: 'Niveles de energia',  pct: 88, time: '1-2 semanas' },
        { label: 'Salud digestiva',     pct: 85, time: '2-3 semanas' },
        { label: 'Bienestar general',   pct: 90, time: '3-4 semanas' },
      ],
      summary: [
        `Plan equilibrado a ${calories} kcal/dia igual a tu gasto energetico`,
        'Variedad de nutrientes para cubrir todas las necesidades diarias',
        'Distribucion balanceada: proteina, carbohidratos y grasas saludables',
        'Horario regular de comidas para regular el metabolismo',
      ],
    },
  }
  return d[goal] || d.maintain
}

// ══════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// ══════════════════════════════════════════════════════════
export function exportPlanToPDF(userParams, weekPlan) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = 0

  // ─────────────────────────────────────────
  // PÁG 1 — PORTADA
  // ─────────────────────────────────────────

  // Fondo degradado simulado (tres rectángulos)
  box(doc, 0, 0, W, 297, C.cream)
  box(doc, 0, 0, W, 90, C.terracotta)
  box(doc, 0, 86, W, 8, C.amber)

  // Logotipo / título
  f(doc, 32, 'bold', C.white)
  doc.text('NutriPlan', PAD, 36)
  f(doc, 11, 'normal', [255, 230, 215])
  doc.text(s('Tu plan alimenticio personalizado'), PAD, 48)

  // Nombre del usuario en grande
  f(doc, 18, 'bold', C.white)
  doc.text(s(userParams.name), PAD, 66)
  f(doc, 10, 'normal', [255, 220, 200])
  doc.text(s(`${GOAL_LABELS[userParams.goal] || userParams.goal}  \xb7  ${userParams.calories} kcal/dia`), PAD, 76)

  // ── Tarjetas de perfil (6 datos en 3 columnas) ──
  y = 102
  f(doc, 10, 'bold', C.brown)
  doc.text(s('Perfil del usuario'), PAD, y)
  y += 6

  const profile = [
    { label: 'Peso',        val: `${userParams.weight} kg` },
    { label: 'Altura',      val: `${userParams.height} cm` },
    { label: 'Edad',        val: `${userParams.age} anos` },
    { label: 'Calorias',    val: `${userParams.calories} kcal` },
    { label: 'Objetivo',    val: GOAL_LABELS[userParams.goal] || userParams.goal },
    { label: 'Preferencia', val: userParams.preference !== 'none' ? userParams.preference : 'Sin restriccion' },
  ]
  const cw = INNER / 3
  profile.forEach((p, i) => {
    const cx = PAD + (i % 3) * cw
    const cy = y + Math.floor(i / 3) * 22
    box(doc, cx, cy, cw - 3, 20, C.white, 3)
    outline(doc, cx, cy, cw - 3, 20, C.creamD, 3)
    // dot acento
    box(doc, cx + 4, cy + 6, 3, 3, C.terracotta, 1.5)
    f(doc, 7, 'bold', C.brownXL)
    doc.text(s(p.label.toUpperCase()), cx + 10, cy + 7.5)
    f(doc, 10, 'bold', C.brown)
    doc.text(s(p.val), cx + 4, cy + 16)
  })
  y += 50

  // ── Macros ──
  hline(doc, y, PAD, W - PAD, C.creamD)
  y += 7
  f(doc, 10, 'bold', C.brown)
  doc.text(s('Distribucion de macronutrientes diaria'), PAD, y)
  y += 7

  const tgtMap = {
    helicobacter:[.20,.50,.30], gain_weight:[.25,.50,.25],
    gain_muscle:[.35,.45,.20],  lose_weight:[.35,.35,.30], maintain:[.25,.50,.25],
  }
  const t = tgtMap[userParams.goal] || tgtMap.maintain
  const kcal = userParams.calories
  const macros = [
    { label: 'Proteina',      g: Math.round(kcal*t[0]/4), pct: Math.round(t[0]*100), color: C.terracotta },
    { label: 'Carbohidratos', g: Math.round(kcal*t[1]/4), pct: Math.round(t[1]*100), color: C.amber },
    { label: 'Grasas',        g: Math.round(kcal*t[2]/9), pct: Math.round(t[2]*100), color: C.sage },
  ]
  macros.forEach((m, i) => {
    const bx = PAD, bw = INNER, by = y + i * 16
    f(doc, 9, 'bold', C.brown)
    doc.text(s(m.label), bx, by + 5)
    f(doc, 8, 'normal', C.brownL)
    doc.text(`${m.pct}%  (${m.g}g)`, bx + bw, by + 5, { align: 'right' })
    bar(doc, bx, by + 7, bw, 5, m.pct, m.color)
  })
  y += 58

  // ── Resumen semanal (si existe) ──
  if (weekPlan.weekSummary) {
    box(doc, PAD, y, INNER, 22, C.amberL, 4)
    f(doc, 8, 'bold', C.brown)
    doc.text(s('Resumen de tu plan'), PAD + 5, y + 7)
    f(doc, 8, 'normal', C.brownL)
    const sumLines = doc.splitTextToSize(s(weekPlan.weekSummary), INNER - 10)
    doc.text(sumLines.slice(0, 2), PAD + 5, y + 14)
    y += 28
  }

  // ── Tabla resumen de días (mini-tabla) ──
  y = newPage(doc);
  hline(doc, y, PAD, W - PAD, C.creamD)
  y += 7
  f(doc, 10, 'bold', C.brown)
  doc.text(s('Resumen calórico semanal'), PAD, y)
  y += 7

  // Encabezado tabla
  box(doc, PAD, y, INNER, 8, C.brown, 2)
  f(doc, 7, 'bold', C.white)
  const colDay = 35, colKcal = 28, colP = 22, colC = 22, colG = 22, colJugo = 33
  doc.text('DIA', PAD + 3, y + 5.5)
  doc.text('KCAL', PAD + colDay + 3, y + 5.5)
  doc.text('PROTEINA', PAD + colDay + colKcal + 3, y + 5.5)
  doc.text('CARBOS', PAD + colDay + colKcal + colP + 3, y + 5.5)
  doc.text('GRASAS', PAD + colDay + colKcal + colP + colC + 3, y + 5.5)
  doc.text('JUGO', PAD + colDay + colKcal + colP + colC + colG + 3, y + 5.5)
  y += 8

  weekPlan.weekPlan.forEach((day, idx) => {
    const rowBg = idx % 2 === 0 ? C.cream : C.white
    box(doc, PAD, y, INNER, 7, rowBg)
    outline(doc, PAD, y, INNER, 7, C.creamD)

    const allMeals = Object.values(day.meals)
    const totalP = allMeals.reduce((a, m) => a + (m?.protein || 0), 0)
    const totalC = allMeals.reduce((a, m) => a + (m?.carbs   || 0), 0)
    const totalG = allMeals.reduce((a, m) => a + (m?.fat     || 0), 0)
    const juiceName = day.meals?.juice?.name || '-'

    f(doc, 7.5, 'bold', C.brown)
    doc.text(s(day.day), PAD + 3, y + 5)
    f(doc, 7.5, 'normal', C.brownL)
    doc.text(`${day.totalCalories}`, PAD + colDay + 3, y + 5)
    doc.text(`${totalP}g`, PAD + colDay + colKcal + 3, y + 5)
    doc.text(`${totalC}g`, PAD + colDay + colKcal + colP + 3, y + 5)
    doc.text(`${totalG}g`, PAD + colDay + colKcal + colP + colC + 3, y + 5)
    f(doc, 6.5, 'normal', C.brownL)
    const juiceShort = doc.splitTextToSize(s(juiceName), colJugo - 4)
    doc.text(juiceShort[0], PAD + colDay + colKcal + colP + colC + colG + 3, y + 5)
    y += 7
  })
  y += 4

  // ─────────────────────────────────────────
  // PÁG 2 — PROYECCIONES
  // ─────────────────────────────────────────

  const proj = getProjections(userParams.goal, userParams.weight, userParams.calories)

  f(doc, 14, 'bold', C.terracotta)
  doc.text(s(proj.title), PAD, y + 8)
  y += 18
  hline(doc, y, PAD, W - PAD, C.terracottaL)
  y += 8

  proj.items.forEach(item => {
    const bx = PAD, bw = INNER
    box(doc, bx, y, bw, 18, C.cream, 3)
    outline(doc, bx, y, bw, 18, C.creamD, 3)
    // Dot color
    box(doc, bx + 4, y + 7, 4, 4, C.sage, 2)
    f(doc, 9, 'bold', C.brown)
    doc.text(s(item.label), bx + 12, y + 10)
    f(doc, 8, 'normal', C.brownL)
    doc.text(s(item.time), bx + bw - 5, y + 10, { align: 'right' })
    bar(doc, bx + 4, y + 13, bw - 35, 3.5, item.pct, C.sage)
    f(doc, 8, 'bold', C.sage)
    doc.text(`${item.pct}%`, bx + bw - 18, y + 16)
    y += 22
  })

  y += 6
  hline(doc, y, PAD, W - PAD, C.creamD)
  y += 10

  // Claves del plan
  f(doc, 11, 'bold', C.brown)
  doc.text(s('Claves de tu plan'), PAD, y)
  y += 10

  proj.summary.forEach((line, i) => {
    // Dot numerado
    box(doc, PAD, y - 3, 6, 6, C.terracotta, 3)
    f(doc, 7, 'bold', C.white)
    doc.text(`${i+1}`, PAD + 1.8, y + 1.2)
    f(doc, 9, 'normal', C.brown)
    const lines = doc.splitTextToSize(s(line), INNER - 12)
    doc.text(lines, PAD + 10, y)
    y += lines.length * 6 + 4
  })

  // Consejos generales en la misma página si caben
  y = newPage(doc)
  if (weekPlan.generalTips?.length) {
    y += 6
    hline(doc, y, PAD, W - PAD, C.sageL)
    y += 8
    f(doc, 11, 'bold', C.brown)
    doc.text(s('Consejos de tu plan'), PAD, y)
    y += 10

    weekPlan.generalTips.forEach((tip, i) => {
      if (y > 272) { y = newPage(doc); y += 4 }
      box(doc, PAD, y - 3.5, 5, 5, C.sage, 2.5)
      f(doc, 7, 'bold', C.white)
      doc.text(`${i+1}`, PAD + 1.5, y + 1)
      f(doc, 9, 'normal', C.brown)
      const lines = doc.splitTextToSize(s(tip), INNER - 12)
      doc.text(lines, PAD + 9, y)
      y += lines.length * 6 + 4
    })
  }

  // ─────────────────────────────────────────
  // PÁGS 3+ — PLAN SEMANAL (1 día por bloque)
  // ─────────────────────────────────────────

  // Función para renderizar un día completo
  // Retorna la altura total consumida
  function renderDay(doc, day, startY) {
    let dy = startY

    // Encabezado del día — banda completa
    box(doc, PAD, dy, INNER, 12, C.amber, 3)
    f(doc, 11, 'bold', C.brown)
    doc.text(s(day.day.toUpperCase()), PAD + 5, dy + 8.5)
    f(doc, 9, 'bold', C.brownL)
    doc.text(s(`${day.totalCalories} kcal totales`), PAD + INNER - 5, dy + 8.5, { align: 'right' })
    dy += 16

    // Comidas del día — una por fila, ancho completo
    const meals = MEAL_ORDER.filter(k => day.meals[k]).map(k => [k, day.meals[k]])

    meals.forEach(([key, meal]) => {
      const cfg = MEAL_CONFIG[key] || { label: key.toUpperCase(), dot: C.brownL }
      const mealH = 22

      box(doc, PAD, dy, INNER, mealH, C.white, 3)
      outline(doc, PAD, dy, INNER, mealH, C.creamD, 3)

      // Franja izquierda de color por tipo
      box(doc, PAD, dy, 4, mealH, cfg.dot, 3)

      // Etiqueta tipo
      f(doc, 6.5, 'bold', cfg.dot)
      doc.text(cfg.label, PAD + 8, dy + 6.5)

      // Nombre del plato
      f(doc, 9, 'bold', C.brown)
      const nameFit = doc.splitTextToSize(s(meal.name), 95)
      doc.text(nameFit[0], PAD + 8, dy + 13)

      // Descripción corta
      f(doc, 7, 'normal', C.brownXL)
      const descFit = doc.splitTextToSize(s(meal.description || ''), 95)
      doc.text(descFit[0], PAD + 8, dy + 19)

      // Calorías destacadas
      f(doc, 13, 'bold', C.terracotta)
      doc.text(`${meal.calories}`, PAD + INNER - 5, dy + 12, { align: 'right' })
      f(doc, 7, 'normal', C.brownXL)
      doc.text('kcal', PAD + INNER - 5, dy + 18, { align: 'right' })

      // Macros (columna derecha intermedia)
      const mx = PAD + 108
      f(doc, 7, 'normal', C.brownL)
      doc.text(`P: ${meal.protein}g`, mx, dy + 8)
      doc.text(`C: ${meal.carbs}g`,   mx, dy + 14)
      doc.text(`G: ${meal.fat}g`,     mx, dy + 20)

      // Prep time
      f(doc, 7, 'normal', C.brownXL)
      doc.text(s(`  ${meal.prepTime || '15 min'}`), mx + 20, dy + 8)

      dy += mealH + 3
    })

    return dy - startY  // altura total usada
  }

  // Calcular altura aproximada de un día
  function dayHeight(day) {
    const mealCount = MEAL_ORDER.filter(k => day.meals[k]).length
    return 12 + 16 + mealCount * 25 + 8  // header + gap + comidas + margen
  }

  // Renderizar los 7 días, 2-3 por página según espacio
  y = newPage(doc)

  // Mini-header de sección
  f(doc, 13, 'bold', C.terracotta)
  doc.text(s('Plan semanal completo'), PAD, y + 6)
  f(doc, 8, 'normal', C.brownL)
  doc.text(s(`7 dias  \xb7  ${userParams.calories} kcal/dia  \xb7  ${userParams.name}`), PAD, y + 13)
  hline(doc, y + 17, PAD, W - PAD, C.terracottaL)
  y += 24

  weekPlan.weekPlan.forEach(day => {
    const h = dayHeight(day)
    if (y + h > 276) {
      y = newPage(doc)
      y += 4
    }
    renderDay(doc, day, y)
    y += h + 4
  })

  // ── Footers en todas las páginas ──────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    pageFooter(doc, i, totalPages, userParams.name)
  }

  doc.save(s(`NutriPlan_${userParams.name}_${new Date().toISOString().slice(0,10)}.pdf`))
}
