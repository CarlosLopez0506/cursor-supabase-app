/**
 * DataExplorer - Explorador de Datos.
 * Purpose: View and filter the students dataset from Supabase according to the PRD.
 * Modify: Adjust filters or columns if the students schema changes.
 */
import { useState, useMemo } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import FilterBar from '../components/ui/FilterBar'
import DataTable from '../components/ui/DataTable'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import styles from './DataExplorer.module.css'

const TABLE_NAME = 'students'

const COLUMNS = [
  { key: 'id', label: '#', sortable: true },
  { key: 'gender', label: 'Género', sortable: true },
  { key: 'ethnicity', label: 'Grupo', sortable: true },
  { key: 'parental_education', label: 'Educ. Parental', sortable: true },
  { key: 'lunch', label: 'Almuerzo', sortable: false },
  { key: 'test_prep', label: 'Curso Prep.', sortable: true },
  { key: 'math_score', label: 'Matemáticas', sortable: true },
  { key: 'reading_score', label: 'Lectura', sortable: true },
  { key: 'writing_score', label: 'Escritura', sortable: true },
  { key: 'pass_math', label: 'Resultado', sortable: true },
]

const FILTER_CONFIG = [
  {
    key: 'gender',
    label: 'Género',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  },
  {
    key: 'parental_education',
    label: 'Educación Parental',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: 'some high school', label: 'Some high school' },
      { value: 'high school', label: 'High school' },
      { value: 'some college', label: 'Some college' },
      { value: "associate's degree", label: "Associate's degree" },
      { value: "bachelor's degree", label: "Bachelor's degree" },
      { value: "master's degree", label: "Master's degree" },
    ],
  },
  {
    key: 'test_prep',
    label: 'Curso de Prep.',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: 'completed', label: 'Completado' },
      { value: 'none', label: 'No completado' },
    ],
  },
  {
    key: 'math_score_range',
    label: 'Math Score',
    type: 'range',
    min: 0,
    max: 100,
  },
  {
    key: 'pass_math',
    label: 'Resultado',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: '1', label: 'Aprobó' },
      { value: '0', label: 'Reprobó' },
    ],
  },
]

function exportToCSV(data, columns, filename = 'export.csv') {
  const headers = columns.map((c) => c.label).join(',')
  const rows = data.map((row) =>
    columns.map((c) => {
      const v = row[c.key]
      return typeof v === 'string' && v.includes(',') ? `"${v}"` : v
    }).join(',')
  )
  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function DataExplorer() {
  const [filterState, setFilterState] = useState({})
  const { data, loading, error } = useSupabase(TABLE_NAME)

  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter((row) => {
      if (filterState.gender && row.gender !== filterState.gender) return false
      if (
        filterState.parental_education &&
        row.parental_education !== filterState.parental_education
      )
        return false
      if (filterState.test_prep && row.test_prep !== filterState.test_prep) return false
      if (filterState.pass_math && String(row.pass_math) !== filterState.pass_math) return false

      const range = filterState.math_score_range
      if (range) {
        if (range.min != null && row.math_score < range.min) return false
        if (range.max != null && row.math_score > range.max) return false
      }

      return true
    })
  }, [data, filterState])

  const totalCount = data?.length || 0
  const filteredCount = filteredData.length

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Explorador de Datos</h1>
          <p className={styles.subtitle}>Filtra, ordena y exporta el dataset completo</p>
        </div>
        <button
          onClick={() => exportToCSV(filteredData, COLUMNS)}
          disabled={loading || !filteredData.length}
          className={styles.exportButton}
        >
          Exportar CSV
        </button>
      </header>

      <section className={styles.filtersSection}>
        <FilterBar filters={FILTER_CONFIG} onChange={setFilterState} />
      </section>

      <p className={styles.summary}>
        Mostrando <span className={styles.summaryHighlight}>{filteredCount}</span> de{' '}
        <span className={styles.summaryHighlight}>{totalCount}</span> estudiantes
      </p>

      {error && (
        <div className={styles.error}>
          Error al cargar datos: {error.message}. Verifica tu configuración de Supabase.
        </div>
      )}

      <section className={styles.tableSection}>
        {loading ? (
          <LoadingSpinner />
        ) : filteredData.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Ningún estudiante coincide con los filtros aplicados.</p>
          </div>
        ) : (
          <DataTable data={filteredData} columns={COLUMNS} pageSize={10} />
        )}
      </section>
    </div>
  )
}
