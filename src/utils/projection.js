// Funções para calcular projeções de resultados da dieta

/**
 * Calcula projeção de peso e tempo baseado em déficit/superávit calórico
 * 
 * @param {Object} data - Dados do usuário
 * @param {Object} results - Resultados calculados
 * @returns {Object} Projeção de resultados
 */
export const calculateProjection = (data, results) => {
  if (!data || !results || !results.targetCalories || !results.tdee) {
    return null
  }

  const currentWeight = parseFloat(data.peso)
  const currentBF = results.bodyFatPercentage || null
  const tdee = results.tdee
  const targetCalories = results.targetCalories
  const goal = data.goal || 'manutencao'

  // Calcular déficit/superávit diário
  const deficit = tdee - targetCalories

  // Se for manutenção, não há projeção
  if (goal === 'manutencao' || Math.abs(deficit) < 50) {
    return {
      deficit: 0,
      weeks: 0,
      months: 0,
      projectedWeight: currentWeight,
      projectedBF: currentBF
    }
  }

  // 1 kg de gordura = aproximadamente 7700 kcal
  const caloriesPerKg = 7700

  // Calcular mudança de peso por semana
  const weeklyDeficit = deficit * 7 // Déficit semanal
  const weeklyWeightChange = weeklyDeficit / caloriesPerKg // kg por semana

  // Definir objetivo de peso (estimativa baseada no objetivo)
  let targetWeightChange = 0
  if (goal === 'cutting') {
    // Para cutting, assumir perda de 5-10% do peso atual
    targetWeightChange = currentWeight * 0.075 // 7.5% em média
  } else if (goal === 'bulking') {
    // Para bulking, assumir ganho de 5-10% do peso atual
    targetWeightChange = currentWeight * 0.075 // 7.5% em média
  }

  // Calcular semanas necessárias
  let weeks = 0
  if (Math.abs(weeklyWeightChange) > 0.01) {
    weeks = Math.abs(targetWeightChange / weeklyWeightChange)
  }

  // Limitar a projeção a 52 semanas (1 ano)
  weeks = Math.min(weeks, 52)
  const months = (weeks / 4.33).toFixed(1)

  // Calcular peso projetado
  let projectedWeight
  if (goal === 'cutting') {
    projectedWeight = currentWeight - (weeklyWeightChange * weeks)
  } else {
    projectedWeight = currentWeight + (weeklyWeightChange * weeks)
  }

  // Garantir valores razoáveis
  projectedWeight = Math.max(40, Math.min(200, projectedWeight))

  // Calcular % gordura projetado (se disponível)
  let projectedBF = null
  if (currentBF !== null && currentBF !== undefined) {
    if (goal === 'cutting') {
      // Assumir que 70% da perda de peso é gordura
      const fatLoss = (currentWeight - projectedWeight) * 0.7
      const fatMass = (currentWeight * currentBF / 100) - fatLoss
      projectedBF = (fatMass / projectedWeight) * 100
    } else if (goal === 'bulking') {
      // Assumir que 50% do ganho é gordura (50% massa magra)
      const fatGain = (projectedWeight - currentWeight) * 0.5
      const fatMass = (currentWeight * currentBF / 100) + fatGain
      projectedBF = (fatMass / projectedWeight) * 100
    } else {
      projectedBF = currentBF
    }
    
    // Garantir valores razoáveis
    projectedBF = Math.max(5, Math.min(50, projectedBF))
  }

  return {
    deficit: deficit,
    weeklyDeficit: weeklyDeficit,
    weeklyWeightChange: weeklyWeightChange,
    targetWeightChange: targetWeightChange,
    weeks: Math.round(weeks),
    months: parseFloat(months),
    projectedWeight: projectedWeight,
    projectedBF: projectedBF,
    currentWeight: currentWeight,
    currentBF: currentBF
  }
}

/**
 * Calcula projeção detalhada semana a semana
 */
export const calculateWeeklyProjection = (data, results, weeks = 12) => {
  const projection = calculateProjection(data, results)
  if (!projection || projection.weeks === 0) {
    return []
  }

  const weeklyData = []
  const currentWeight = parseFloat(data.peso)
  const currentBF = results.bodyFatPercentage || null
  const weeklyChange = projection.weeklyWeightChange

  for (let week = 0; week <= Math.min(weeks, projection.weeks); week++) {
    let weight
    let bf = null

    if (data.goal === 'cutting') {
      weight = currentWeight - (weeklyChange * week)
    } else if (data.goal === 'bulking') {
      weight = currentWeight + (weeklyChange * week)
    } else {
      weight = currentWeight
    }

    if (currentBF !== null) {
      if (data.goal === 'cutting') {
        const fatLoss = (currentWeight - weight) * 0.7
        const fatMass = (currentWeight * currentBF / 100) - fatLoss
        bf = (fatMass / weight) * 100
      } else if (data.goal === 'bulking') {
        const fatGain = (weight - currentWeight) * 0.5
        const fatMass = (currentWeight * currentBF / 100) + fatGain
        bf = (fatMass / weight) * 100
      } else {
        bf = currentBF
      }
      bf = Math.max(5, Math.min(50, bf))
    }

    weeklyData.push({
      week,
      weight: Math.max(40, Math.min(200, weight)),
      bodyFat: bf
    })
  }

  return weeklyData
}

