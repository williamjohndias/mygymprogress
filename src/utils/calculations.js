// Funções de cálculo nutricional

/**
 * Calcula % de gordura usando Pollock 7 dobras
 * Fórmula diferente para homens e mulheres
 */
export const calculateBodyFatPollock7 = (data) => {
  const { peitoral, axilarMedia, triceps, subescapular, abdominal, supraIliaca, coxa, sexo, idade } = data
  
  // Converter para números e verificar se são válidos
  const p = parseFloat(peitoral)
  const ax = parseFloat(axilarMedia)
  const tr = parseFloat(triceps)
  const sub = parseFloat(subescapular)
  const abd = parseFloat(abdominal)
  const sup = parseFloat(supraIliaca)
  const cx = parseFloat(coxa)
  const age = parseFloat(idade)
  
  // Verificar se todos os valores são números válidos e maiores que 0
  if (isNaN(p) || isNaN(ax) || isNaN(tr) || isNaN(sub) || isNaN(abd) || isNaN(sup) || isNaN(cx) || isNaN(age)) {
    return null
  }
  
  if (p <= 0 || ax <= 0 || tr <= 0 || sub <= 0 || abd <= 0 || sup <= 0 || cx <= 0 || age <= 0) {
    return null
  }

  const soma = p + ax + tr + sub + abd + sup + cx
  
  // Fórmula de Pollock 7 dobras corrigida
  let densidade
  if (sexo === 'masculino') {
    densidade = 1.112 - (0.00043499 * soma) + (0.00000055 * Math.pow(soma, 2)) - (0.00028826 * age)
  } else {
    densidade = 1.097 - (0.00046971 * soma) + (0.00000056 * Math.pow(soma, 2)) - (0.00012828 * age)
  }
  
  // Validar densidade (deve estar entre 0.8 e 1.2 aproximadamente)
  if (densidade <= 0 || densidade > 1.2) {
    return null
  }
  
  // Fórmula de Siri para converter densidade em % gordura
  const bodyFat = ((4.95 / densidade) - 4.5) * 100
  
  // Garantir que está em uma faixa razoável (5% a 50%)
  const result = Math.max(5, Math.min(50, bodyFat))
  
  return result
}

/**
 * Calcula massa magra
 * massa magra = peso × (1 − BF%)
 */
export const calculateLeanMass = (peso, bodyFatPercentage) => {
  if (!peso || !bodyFatPercentage) return null
  return peso * (1 - bodyFatPercentage / 100)
}

/**
 * TMB - Harris-Benedict Revisada (1984)
 */
export const calculateTMBHarrisBenedict = (data) => {
  const { peso, altura, idade, sexo } = data
  if (!peso || !altura || !idade) return null

  if (sexo === 'masculino') {
    return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade)
  } else {
    return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade)
  }
}

/**
 * TMB - Mifflin-St Jeor (1990)
 */
export const calculateTMBMifflinStJeor = (data) => {
  const { peso, altura, idade, sexo } = data
  if (!peso || !altura || !idade) return null

  if (sexo === 'masculino') {
    return (10 * peso) + (6.25 * altura) - (5 * idade) + 5
  } else {
    return (10 * peso) + (6.25 * altura) - (5 * idade) - 161
  }
}

/**
 * TMB - Katch-McArdle (requer massa magra)
 */
export const calculateTMBKatchMcArdle = (leanMass) => {
  if (!leanMass) return null
  return 370 + (21.6 * leanMass)
}

/**
 * Calcula TDEE baseado em TMB e nível de atividade
 */
export const calculateTDEE = (tmb, activityLevel) => {
  if (!tmb) return null
  
  const factors = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    alto: 1.725,
    muitoAlto: 1.9
  }
  
  return tmb * (factors[activityLevel] || 1.2)
}

/**
 * Calcula calorias alvo baseado no objetivo
 */
export const calculateTargetCalories = (tdee, goal) => {
  if (!tdee) return null
  
  const adjustments = {
    cutting: 0.85, // Déficit de 15% (média entre 10-20%)
    manutencao: 1.0,
    bulking: 1.125 // Superávit de 12.5% (média entre 10-15%)
  }
  
  return tdee * (adjustments[goal] || 1.0)
}

/**
 * Calcula macronutrientes
 */
export const calculateMacros = (data, targetCalories, leanMass, peso) => {
  if (!targetCalories || !peso) return null

  const { goal, proteinPerKg, fatPerKg, fatPercentage } = data
  
  // Proteína (g/kg baseado no objetivo)
  let proteinGrams
  if (proteinPerKg) {
    proteinGrams = peso * proteinPerKg
  } else {
    // Valores padrão por objetivo
    const proteinRanges = {
      cutting: 2.0, // Média entre 1.8-2.2
      manutencao: 1.8, // Média entre 1.6-2.0
      bulking: 2.0 // Média entre 1.6-2.4
    }
    proteinGrams = peso * (proteinRanges[goal] || 1.8)
  }
  
  const proteinCalories = proteinGrams * 4

  // Gorduras
  let fatGrams
  if (fatPerKg) {
    fatGrams = peso * fatPerKg
  } else if (fatPercentage) {
    fatGrams = (targetCalories * fatPercentage / 100) / 9
  } else {
    // Padrão: 25% das calorias ou 1g/kg (o que for maior)
    const fatFromPercentage = (targetCalories * 0.25) / 9
    const fatFromKg = peso * 1.0
    fatGrams = Math.max(fatFromPercentage, fatFromKg)
  }
  
  const fatCalories = fatGrams * 9

  // Carboidratos (calorias restantes)
  const remainingCalories = targetCalories - proteinCalories - fatCalories
  const carbGrams = remainingCalories / 4

  return {
    protein: Math.round(proteinGrams * 10) / 10,
    carbs: Math.round(carbGrams * 10) / 10,
    fats: Math.round(fatGrams * 10) / 10,
    proteinCalories,
    carbCalories: remainingCalories,
    fatCalories
  }
}

/**
 * Calcula água diária
 */
export const calculateWater = (peso, waterPerKg) => {
  if (!peso) return null
  const mlPerKg = waterPerKg || 35
  return peso * mlPerKg
}

/**
 * Função principal que calcula todos os valores nutricionais
 */
export const calculateNutrition = (data) => {
  const results = {}
  
  // 1. % Gordura (Pollock 7 dobras)
  results.bodyFatPercentage = calculateBodyFatPollock7(data)
  
  // 2. Massa Magra
  if (results.bodyFatPercentage) {
    results.leanMass = calculateLeanMass(data.peso, results.bodyFatPercentage)
  }
  
  // 3. TMB (escolher fórmula)
  let tmb = null
  let tmbFormula = data.tmbFormula || 'mifflin'
  
  // Se tem BF e não especificou fórmula, sugerir Katch-McArdle
  if (results.leanMass && !data.tmbFormula) {
    tmbFormula = 'katch'
  }
  
  if (tmbFormula === 'katch' && results.leanMass) {
    tmb = calculateTMBKatchMcArdle(results.leanMass)
    results.tmbFormula = 'Katch-McArdle'
  } else if (tmbFormula === 'harris') {
    tmb = calculateTMBHarrisBenedict(data)
    results.tmbFormula = 'Harris-Benedict Revisada'
  } else {
    tmb = calculateTMBMifflinStJeor(data)
    results.tmbFormula = 'Mifflin-St Jeor'
  }
  
  results.tmb = tmb
  
  // 4. TDEE
  results.tdee = calculateTDEE(tmb, data.nivelAtividade || 'sedentario')
  
  // 5. Calorias Alvo
  results.targetCalories = calculateTargetCalories(results.tdee, data.goal || 'manutencao')
  results.goal = data.goal || 'manutencao'
  
  // 6. Macronutrientes
  results.macros = calculateMacros(data, results.targetCalories, results.leanMass, data.peso)
  
  // 7. Água
  results.water = calculateWater(data.peso, data.waterPerKg)
  
  // 8. TEF (Thermic Effect of Food) - ~10% do TDEE
  results.tef = results.tdee ? results.tdee * 0.1 : null
  
  return results
}

