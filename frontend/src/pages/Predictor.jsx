import { useEffect, useMemo, useRef, useState } from 'react'
import { useMLPredict } from '../hooks/useMLPredict'
import * as mlApi from '../services/mlApi'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import styles from './Predictor.module.css'

const MAX_HISTORY = 5

const initialFormState = {
  gender: 'female',
  ethnicity: 'group C',
  parental_education: "bachelor's degree",
  lunch: 'standard',
  test_prep: true,
  reading_score: 70,
  writing_score: 70,
}

export default function Predictor() {
  const { predict, result, loading, error, reset } = useMLPredict()
  const [form, setForm] = useState(initialFormState)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [apiChecked, setApiChecked] = useState(false)
  const [history, setHistory] = useState([])
  const lastInputRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    mlApi
      .healthCheck()
      .then(() => {
        if (!cancelled) {
          setApiAvailable(true)
          setApiChecked(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiAvailable(false)
          setApiChecked(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handlePredict = async () => {
    const payload = {
      gender: form.gender,
      ethnicity: form.ethnicity,
      parental_education: form.parental_education,
      lunch: form.lunch,
      test_prep: form.test_prep ? 'completed' : 'none',
      reading_score: Number(form.reading_score),
      writing_score: Number(form.writing_score),
    }
    lastInputRef.current = payload
    await predict(payload)
  }

  const handleClear = () => {
    setForm(initialFormState)
    reset()
    lastInputRef.current = null
  }

  useEffect(() => {
    if (!result || loading) return
    const input = lastInputRef.current
    if (!input) return
    setHistory((prev) =>
      [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          input,
          prediction: result.prediction,
          confidence: result.confidence,
          label: result.label,
        },
        ...prev,
      ].slice(0, MAX_HISTORY)
    )
    lastInputRef.current = null
  }, [result, loading])

  const confidence = result?.confidence ?? null
  const isApprove = (result?.prediction ?? result?.label) === 1 || result?.label === 'Aprueba'

  const factorList = useMemo(
    () => [
      'Curso de preparación completado o no',
      'Nivel educativo de los padres',
      'Scores de lectura y escritura',
    ],
    []
  )

  return (
    <div className={styles.page}>
      {!apiAvailable && apiChecked && (
        <div className={`${styles.banner} ${styles.bannerWarning}`}>
          El servicio de predicción no está disponible en este momento.
        </div>
      )}
      {error && (
        <div className={`${styles.banner} ${styles.bannerError}`}>
          Error al obtener la predicción: {error.message || 'Intenta de nuevo más tarde.'}
        </div>
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>Predictor de Rendimiento</h1>
        <p className={styles.subtitle}>
          Ingresa los datos del estudiante para predecir si aprobará matemáticas
        </p>
      </header>

      <div className={styles.contentLayout}>
        <section className={styles.leftColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Datos del Estudiante</h2>
                <p className={styles.cardSubtitle}>
                  Completa las características que alimentan el modelo de predicción.
                </p>
              </div>
              <span className={styles.badgeIcon}>🎓</span>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Género</label>
                </div>
                <div className={styles.radioGroup}>
                  <button
                    type="button"
                    className={`${styles.pill} ${form.gender === 'male' ? styles.pillActive : ''}`}
                    onClick={() => setForm((f) => ({ ...f, gender: 'male' }))}
                  >
                    Masculino
                  </button>
                  <button
                    type="button"
                    className={`${styles.pill} ${form.gender === 'female' ? styles.pillActive : ''}`}
                    onClick={() => setForm((f) => ({ ...f, gender: 'female' }))}
                  >
                    Femenino
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Grupo Étnico</label>
                </div>
                <select
                  className={styles.select}
                  value={form.ethnicity}
                  onChange={(e) => setForm((f) => ({ ...f, ethnicity: e.target.value }))}
                >
                  <option value="group A">Group A</option>
                  <option value="group B">Group B</option>
                  <option value="group C">Group C</option>
                  <option value="group D">Group D</option>
                  <option value="group E">Group E</option>
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Nivel Educativo de los Padres</label>
                </div>
                <select
                  className={styles.select}
                  value={form.parental_education}
                  onChange={(e) => setForm((f) => ({ ...f, parental_education: e.target.value }))}
                >
                  <option value="some high school">Some high school</option>
                  <option value="high school">High school</option>
                  <option value="some college">Some college</option>
                  <option value="associate's degree">Associate&apos;s degree</option>
                  <option value="bachelor's degree">Bachelor&apos;s degree</option>
                  <option value="master's degree">Master&apos;s degree</option>
                </select>
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label}>Tipo de Almuerzo</label>
                  <span className={styles.tooltip}>ℹ️ Indicador de nivel socioeconómico</span>
                </div>
                <div className={styles.radioGroup}>
                  <button
                    type="button"
                    className={`${styles.pill} ${form.lunch === 'standard' ? styles.pillActive : ''}`}
                    onClick={() => setForm((f) => ({ ...f, lunch: 'standard' }))}
                  >
                    Estándar
                  </button>
                  <button
                    type="button"
                    className={`${styles.pill} ${
                      form.lunch === 'free/reduced' ? styles.pillActive : ''
                    }`}
                    onClick={() => setForm((f) => ({ ...f, lunch: 'free/reduced' }))}
                  >
                    Subsidiado
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <span className={styles.label}>Curso de Preparación</span>
                </div>
                <div className={styles.toggleWrapper}>
                  <button
                    type="button"
                    className={`${styles.toggleTrack} ${
                      form.test_prep ? styles.toggleTrackOn : ''
                    }`}
                    onClick={() => setForm((f) => ({ ...f, test_prep: !f.test_prep }))}
                    aria-label="Completó curso de preparación"
                  >
                    <span
                      className={`${styles.toggleThumb} ${
                        form.test_prep ? styles.toggleThumbOn : ''
                      }`}
                    />
                  </button>
                  <span className={styles.toggleLabel}>
                    {form.test_prep ? 'Completó curso de preparación' : 'No completó el curso'}
                  </span>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.sliderRow}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>Score de Lectura</label>
                    <span className={styles.labelHint}>{form.reading_score}</span>
                  </div>
                  <div className={styles.sliderInputs}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className={styles.numberInput}
                      value={form.reading_score}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          reading_score: Math.min(
                            100,
                            Math.max(0, Number(e.target.value) || 0)
                          ),
                        }))
                      }
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      className={styles.sliderRange}
                      value={form.reading_score}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          reading_score: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.sliderRow}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>Score de Escritura</label>
                    <span className={styles.labelHint}>{form.writing_score}</span>
                  </div>
                  <div className={styles.sliderInputs}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className={styles.numberInput}
                      value={form.writing_score}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          writing_score: Math.min(
                            100,
                            Math.max(0, Number(e.target.value) || 0)
                          ),
                        }))
                      }
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      className={styles.sliderRange}
                      value={form.writing_score}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          writing_score: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handlePredict}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner /> Analizando...
                  </>
                ) : (
                  <>▶ Predecir Resultado</>
                )}
              </button>
              <button type="button" className={styles.secondaryButton} onClick={handleClear}>
                Limpiar
              </button>
            </div>
          </div>
        </section>

        <section className={styles.rightColumn}>
          <div
            className={`${styles.card} ${
              result
                ? isApprove
                  ? styles.resultCard
                  : styles.resultCardRisk
                : ''
            }`}
          >
            {!result && !loading && (
              <div className={styles.resultEmpty}>
                <div className={styles.resultEmptyIcon}>📊</div>
                <p className={styles.resultEmptyText}>
                  Completa el formulario y presiona Predecir para ver el resultado.
                </p>
              </div>
            )}

            {loading && (
              <div className={styles.resultEmpty}>
                <LoadingSpinner />
                <p className={styles.resultEmptyText}>Consultando el modelo...</p>
              </div>
            )}

            {!loading && result && (
              <>
                <div>
                  <span
                    className={`${styles.badgeResult} ${
                      isApprove ? styles.badgeApprove : styles.badgeRisk
                    }`}
                  >
                    {isApprove ? '✅ APRUEBA' : '⚠️ EN RIESGO'}
                  </span>
                  <p className={styles.resultText}>
                    {isApprove
                      ? 'El modelo predice que este estudiante aprobará matemáticas.'
                      : 'El modelo predice que este estudiante podría reprobar matemáticas.'}
                  </p>
                </div>

                {confidence != null && (
                  <div className={styles.confidenceSection}>
                    <div className={styles.confidenceLabelRow}>
                      <span>Confianza del modelo</span>
                      <span>{`${Math.round(confidence * 100)}%`}</span>
                    </div>
                    <div className={styles.confidenceBar}>
                      <div
                        className={`${styles.confidenceFill} ${
                          isApprove ? '' : styles.confidenceFillRisk
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, confidence * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.factorsList}>
                  <span>Factores considerados</span>
                  <ul>
                    {factorList.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className={`${styles.card} ${styles.historyCard}`}>
            <h3 className={styles.cardTitle}>Últimas Predicciones</h3>
            {history.length === 0 ? (
              <p className={styles.cardSubtitle}>
                Las predicciones de esta sesión aparecerán aquí.
              </p>
            ) : (
              <div className={styles.historyList}>
                {history.map((h, idx) => (
                  <div key={idx} className={styles.historyItem}>
                    <div className={styles.historyMain}>
                      <div className={styles.historyMeta}>
                        <span>{h.timestamp}</span>
                        <span>
                          {h.input.gender === 'female' ? 'Femenino' : 'Masculino'} ·{' '}
                          {h.input.ethnicity}
                        </span>
                      </div>
                      <div className={styles.historyInputs}>
                        Lectura {h.input.reading_score}, Escritura {h.input.writing_score}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`${styles.badgeResult} ${
                          (h.prediction ?? h.label) === 1 || h.label === 'Aprueba'
                            ? styles.badgeApprove
                            : styles.badgeRisk
                        }`}
                      >
                        {(h.prediction ?? h.label) === 1 || h.label === 'Aprueba'
                          ? 'Aprueba'
                          : 'En riesgo'}
                      </span>
                      {h.confidence != null && (
                        <div style={{ fontSize: 11, marginTop: 2 }}>
                          {Math.round(h.confidence * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.card} ${styles.infoCard}`}>
            <h3 className={styles.infoTitle}>ℹ️ ¿Cómo funciona este modelo?</h3>
            <p className={styles.infoText}>
              Este predictor usa un modelo de Random Forest entrenado con datos de 1,000 estudiantes.
              Analiza 7 características para estimar la probabilidad de aprobar matemáticas
              (score ≥ 60). La confianza indica qué tan seguro está el modelo — valores sobre 75% se
              consideran confiables.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

