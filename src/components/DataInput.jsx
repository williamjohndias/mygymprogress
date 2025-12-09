import React, { useState, useEffect } from 'react'
import './DataInput.css'

function DataInput({ user, data, onChange }) {
  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    idade: '',
    sexo: user === 'Liam' ? 'masculino' : 'feminino',
    nivelAtividade: 'sedentario',
    goal: 'manutencao',
    tmbFormula: '',
    proteinPerKg: '',
    fatPerKg: '',
    fatPercentage: '',
    waterPerKg: '35',
    // Dobras 7 dobras
    peitoral: '',
    axilarMedia: '',
    triceps: '',
    subescapular: '',
    abdominal: '',
    supraIliaca: '',
    coxa: '',
    // Circunferências
    cintura: '',
    pescoco: '',
    quadril: '',
    braco: '',
    antebraco: '',
    coxaCircunferencia: '',
    panturrilha: '',
    peito: '',
    ombro: ''
  })

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }))
    }
  }, [data])

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange(newData)
  }

  const activityLevels = [
    { value: 'sedentario', label: 'Sedentário (1.2x)' },
    { value: 'leve', label: 'Leve (1.375x)' },
    { value: 'moderado', label: 'Moderado (1.55x)' },
    { value: 'alto', label: 'Alto (1.725x)' },
    { value: 'muitoAlto', label: 'Muito Alto (1.9x)' }
  ]

  const goals = [
    { value: 'cutting', label: 'Cutting (Déficit 10-20%)' },
    { value: 'manutencao', label: 'Manutenção' },
    { value: 'bulking', label: 'Bulking Leve (Superávit 10-15%)' }
  ]

  const tmbFormulas = [
    { value: '', label: 'Automático' },
    { value: 'mifflin', label: 'Mifflin-St Jeor' },
    { value: 'harris', label: 'Harris-Benedict Revisada' },
    { value: 'katch', label: 'Katch-McArdle (requer % gordura)' }
  ]

  return (
    <div className="data-input">
      <h2>Dados do Usuário</h2>
      
      <div className="form-section">
        <h3>Dados Básicos</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Peso (kg) *</label>
            <input
              type="number"
              step="0.1"
              value={formData.peso}
              onChange={(e) => handleChange('peso', e.target.value)}
              placeholder="Ex: 75.5"
            />
          </div>
          <div className="form-group">
            <label>Altura (cm) *</label>
            <input
              type="number"
              step="0.1"
              value={formData.altura}
              onChange={(e) => handleChange('altura', e.target.value)}
              placeholder="Ex: 175"
            />
          </div>
          <div className="form-group">
            <label>Idade *</label>
            <input
              type="number"
              value={formData.idade}
              onChange={(e) => handleChange('idade', e.target.value)}
              placeholder="Ex: 30"
            />
          </div>
          <div className="form-group">
            <label>Sexo</label>
            <input
              type="text"
              value={formData.sexo}
              disabled
              className="disabled-input"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Nível de Atividade</h3>
        <div className="form-group">
          <select
            value={formData.nivelAtividade}
            onChange={(e) => handleChange('nivelAtividade', e.target.value)}
          >
            {activityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>Objetivo</h3>
        <div className="form-group">
          <select
            value={formData.goal}
            onChange={(e) => handleChange('goal', e.target.value)}
          >
            {goals.map(goal => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>Fórmula TMB</h3>
        <div className="form-group">
          <select
            value={formData.tmbFormula}
            onChange={(e) => handleChange('tmbFormula', e.target.value)}
          >
            {tmbFormulas.map(formula => (
              <option key={formula.value} value={formula.value}>
                {formula.label}
              </option>
            ))}
          </select>
          <small>Se tiver % gordura, Katch-McArdle será sugerido automaticamente</small>
        </div>
      </div>

      <div className="form-section">
        <h3>Dobras Cutâneas (Pollock 7 dobras) - Opcional</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Peitoral (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.peitoral}
              onChange={(e) => handleChange('peitoral', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Axilar Média (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.axilarMedia}
              onChange={(e) => handleChange('axilarMedia', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Tríceps (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.triceps}
              onChange={(e) => handleChange('triceps', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Subescapular (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.subescapular}
              onChange={(e) => handleChange('subescapular', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Abdominal (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.abdominal}
              onChange={(e) => handleChange('abdominal', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Supra-ilíaca (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.supraIliaca}
              onChange={(e) => handleChange('supraIliaca', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Coxa (mm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.coxa}
              onChange={(e) => handleChange('coxa', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Circunferências Corporais - Opcional</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Cintura (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.cintura}
              onChange={(e) => handleChange('cintura', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Pescoço (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.pescoco}
              onChange={(e) => handleChange('pescoco', e.target.value)}
            />
          </div>
          {user === 'Day' && (
            <div className="form-group">
              <label>Quadril (cm)</label>
              <input
                type="number"
                step="0.1"
                value={formData.quadril}
                onChange={(e) => handleChange('quadril', e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label>Braço (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.braco}
              onChange={(e) => handleChange('braco', e.target.value)}
              placeholder="Circunferência do braço"
            />
          </div>
          <div className="form-group">
            <label>Antebraço (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.antebraco}
              onChange={(e) => handleChange('antebraco', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Coxa - Circunferência (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.coxaCircunferencia}
              onChange={(e) => handleChange('coxaCircunferencia', e.target.value)}
            />
            <small>Diferente da dobra cutânea da coxa</small>
          </div>
          <div className="form-group">
            <label>Panturrilha (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.panturrilha}
              onChange={(e) => handleChange('panturrilha', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Peito/Tórax (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.peito}
              onChange={(e) => handleChange('peito', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Ombro (cm)</label>
            <input
              type="number"
              step="0.1"
              value={formData.ombro}
              onChange={(e) => handleChange('ombro', e.target.value)}
            />
            <small>Circunferência dos ombros</small>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Ajustes Avançados</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Proteína (g/kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.proteinPerKg}
              onChange={(e) => handleChange('proteinPerKg', e.target.value)}
              placeholder="Deixe vazio para padrão"
            />
            <small>Cutting: 1.8-2.2 | Manutenção: 1.6-2.0 | Bulking: 1.6-2.4</small>
          </div>
          <div className="form-group">
            <label>Gorduras (g/kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.fatPerKg}
              onChange={(e) => handleChange('fatPerKg', e.target.value)}
              placeholder="Deixe vazio para padrão"
            />
            <small>Ou use % abaixo</small>
          </div>
          <div className="form-group">
            <label>Gorduras (% das calorias)</label>
            <input
              type="number"
              step="0.1"
              value={formData.fatPercentage}
              onChange={(e) => handleChange('fatPercentage', e.target.value)}
              placeholder="Ex: 25"
            />
            <small>Padrão: 20-30%</small>
          </div>
          <div className="form-group">
            <label>Água (ml/kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.waterPerKg}
              onChange={(e) => handleChange('waterPerKg', e.target.value)}
              placeholder="35"
            />
            <small>Faixa recomendada: 30-45 ml/kg</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataInput

