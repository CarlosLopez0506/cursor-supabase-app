/**
 * Dashboard - Main dashboard page.
 * Purpose: Executive view of student performance metrics and charts, based on the PRD.
 * Modify: Later, replace mock data with real Supabase queries.
 */
import {
  BarChartWidget,
  LineChartWidget,
  PieChartWidget,
  ScatterChartWidget,
} from '../components/charts'
import KpiCard from '../components/ui/KpiCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useSupabase } from '../hooks/useSupabase'
import styles from './Dashboard.module.css'

function computeAverageMath(students) {
  if (!students.length) return 0
  const total = students.reduce((sum, s) => sum + s.math_score, 0)
  return total / students.length
}

function computePassRate(students) {
  if (!students.length) return 0
  const passed = students.filter((s) => s.pass_math === 1).length
  return (passed / students.length) * 100
}

function computePrepImpact(students) {
  const withPrep = students.filter((s) => s.test_prep === 'completed')
  const withoutPrep = students.filter((s) => s.test_prep === 'none')
  if (!withPrep.length || !withoutPrep.length) return 0
  const avgWith = computeAverageMath(withPrep)
  const avgWithout = computeAverageMath(withoutPrep)
  return avgWith - avgWithout
}

function buildParentalEducationBarData(students) {
  const groups = {}
  students.forEach((s) => {
    const key = s.parental_education
    if (!groups[key]) {
      groups[key] = { parental_education: key, sum: 0, count: 0 }
    }
    groups[key].sum += s.math_score
    groups[key].count += 1
  })
  return Object.values(groups).map((g) => ({
    parental_education: g.parental_education,
    avg_math_score: g.sum / g.count,
  }))
}

function buildGenderSubjectBarData(students) {
  const groups = {}
  students.forEach((s) => {
    const key = s.gender
    if (!groups[key]) {
      groups[key] = {
        gender: key,
        math_sum: 0,
        reading_sum: 0,
        writing_sum: 0,
        count: 0,
      }
    }
    groups[key].math_sum += s.math_score
    groups[key].reading_sum += s.reading_score
    groups[key].writing_sum += s.writing_score
    groups[key].count += 1
  })
  return Object.values(groups).map((g) => ({
    gender: g.gender,
    math: g.math_sum / g.count,
    reading: g.reading_sum / g.count,
    writing: g.writing_sum / g.count,
  }))
}

function buildScatterData(students) {
  return students.map((s) => ({
    reading_score: s.reading_score,
    writing_score: s.writing_score,
    test_prep: s.test_prep,
  }))
}

function buildEthnicityPieData(students) {
  const groups = {}
  students.forEach((s) => {
    const key = s.ethnicity
    if (!groups[key]) {
      groups[key] = { ethnicity: key, count: 0 }
    }
    groups[key].count += 1
  })
  return Object.values(groups)
}

export default function Dashboard() {
  const {
    data: students = [],
    loading,
    error,
  } = useSupabase('students')

  const avgMath = computeAverageMath(students)
  const passRate = computePassRate(students)
  const prepImpact = computePrepImpact(students)
  const totalStudents = students.length

  const kpis = [
    {
      title: 'Promedio Matemáticas',
      value: `${avgMath.toFixed(1)}`,
      subtitle: 'sobre 100 puntos',
      color: 'primary',
    },
    {
      title: 'Tasa de Aprobación',
      value: `${passRate.toFixed(1)}%`,
      subtitle: 'estudiantes con score ≥ 60',
      color: passRate > 60 ? 'success' : 'danger',
    },
    {
      title: 'Mejora con Prep Course',
      value: `${prepImpact >= 0 ? '+' : ''}${prepImpact.toFixed(1)} pts`,
      subtitle: 'vs estudiantes sin preparación',
      color: 'success',
    },
    {
      title: 'Total Estudiantes',
      value: `${totalStudents}`,
      subtitle: 'en el dataset',
      color: 'primary',
    },
  ]

  const barParental = buildParentalEducationBarData(students)
  const barGenderSubjects = buildGenderSubjectBarData(students)
  const scatterData = buildScatterData(students)
  const pieEthnicity = buildEthnicityPieData(students)

  if (error) {
    return <div>Error loading data: {error.message}</div>
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard de Rendimiento</h1>
        <p className={styles.subtitle}>Análisis general del dataset de 1,000 estudiantes</p>
      </header>

      <section className={styles.kpiGrid}>
        {kpis.map((k) => (
          <KpiCard
            key={k.title}
            title={k.title}
            value={k.value}
            subtitle={k.subtitle}
            color={k.color}
          />
        ))}
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className={styles.chartsRow}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Rendimiento por Educación Familiar</h2>
                <p className={styles.cardSubtitle}>
                  Promedio de math_score agrupado por nivel educativo de los padres
                </p>
              </div>
              <BarChartWidget
                data={barParental}
                xKey="parental_education"
                yKey="avg_math_score"
                yLabel="Promedio Math"
                title={null}
                color="#4F46E5"
                height={280}
              />
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Comparación de Scores por Materia</h2>
                <p className={styles.cardSubtitle}>
                  Promedio de math, reading y writing por género
                </p>
              </div>
              <LineChartWidget
                data={barGenderSubjects}
                xKey="gender"
                yKey="math"
                title={null}
                color="#4F46E5"
                height={280}
              />
            </div>
          </section>

          <section className={styles.chartsRowSecondary}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Reading vs Writing Score</h2>
                <p className={styles.cardSubtitle}>
                  Coloreado por completar curso de preparación
                </p>
              </div>
              <ScatterChartWidget
                data={scatterData}
                xKey="reading_score"
                yKey="writing_score"
                title={null}
                color="#4F46E5"
                height={280}
              />
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Distribución por Grupo Étnico</h2>
                <p className={styles.cardSubtitle}>Porcentaje de estudiantes por grupo</p>
              </div>
              <PieChartWidget
                data={pieEthnicity}
                nameKey="ethnicity"
                valueKey="count"
                title={null}
                height={280}
              />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
