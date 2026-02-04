interface Question {
  question: string
  h: string
  options: string[]
}

interface GameConfig {
  apiBaseUrl: string
  apiKey: string
}

const config: GameConfig = {
  apiBaseUrl: 'http://localhost:8000',
  apiKey: 'cOKeRTIZvRMPhVNT8jnszYn9541xK9tlB6YYYQgT7NBCpRtK'
}

export function useQuestions() {
  const questions = ref<Question[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function sanitizeQuestions(data: any[]): Question[] {
    if (!Array.isArray(data)) return []

    const out: Question[] = []
    for (const item of data) {
      const question = (item?.question ?? '').toString().trim()
      const h = (item?.h ?? '').toString().trim()

      let optionsRaw = Array.isArray(item?.options) ? item.options : []
      optionsRaw = optionsRaw
        .map((o: any) => (o ?? '').toString().trim())
        .filter(Boolean)

      if (!question || !h) continue

      const seen = new Set<string>()
      const uniqueOptions: string[] = []
      for (const o of optionsRaw) {
        if (seen.has(o)) continue
        seen.add(o)
        uniqueOptions.push(o)
      }

      out.push({ question, h, options: uniqueOptions })
    }

    return out
  }

  async function loadQuestions(gameSlug: string, lang: string = 'uz'): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const base = config.apiBaseUrl.replace(/\/+$/, '')
      const url = `${base}/api/questions?game=${encodeURIComponent(gameSlug)}&lang=${encodeURIComponent(lang)}`

      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'X-API-Key': config.apiKey
        }
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const sanitized = sanitizeQuestions(data)

      if (sanitized.length === 0) {
        throw new Error('Empty questions list')
      }

      questions.value = sanitized
      return true
    } catch (err: any) {
      console.warn('Questions load failed:', err)
      error.value = err.message || 'Failed to load questions'
      questions.value = []
      return false
    } finally {
      loading.value = false
    }
  }

  function fastHash(text: string): string {
    let hash = 5381
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) + hash + text.charCodeAt(i)
    }
    return (hash >>> 0).toString(36)
  }

  function checkAnswer(question: Question, selectedOption: string): boolean {
    return fastHash(selectedOption) === question.h
  }

  function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  return {
    questions: readonly(questions),
    loading: readonly(loading),
    error: readonly(error),
    loadQuestions,
    checkAnswer,
    shuffleArray
  }
}
