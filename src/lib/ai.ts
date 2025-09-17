import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

export interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export class AIQuestionGenerator {
  private openai?: OpenAI
  private genAI?: GoogleGenerativeAI

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    }
    
    if (process.env.GOOGLE_AI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    }
  }

  async generateQuestions(examName: string, count: number = 10): Promise<Question[]> {
    if (this.openai) {
      return this.generateWithOpenAI(examName, count)
    }
    
    if (this.genAI) {
      return this.generateWithGemini(examName, count)
    }

    throw new Error('No AI API key configured')
  }

  private async generateWithOpenAI(examName: string, count: number): Promise<Question[]> {
    if (!this.openai) throw new Error('OpenAI not configured')

    const prompt = `
    Gere ${count} questões de múltipla escolha para o concurso público: ${examName}
    
    Cada questão deve ter:
    - Uma pergunta clara e objetiva
    - 4 alternativas (A, B, C, D)
    - Uma resposta correta
    - Uma explicação detalhada do porquê a resposta está correta
    
    Formato de resposta (JSON):
    [
      {
        "question": "Pergunta aqui",
        "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
        "correctAnswer": 0,
        "explanation": "Explicação detalhada aqui"
      }
    ]
    
    As questões devem ser relevantes para o concurso público brasileiro e seguir o padrão de concursos.
    `

    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error('No response from OpenAI')

    try {
      return JSON.parse(content)
    } catch (error) {
      throw new Error('Failed to parse AI response')
    }
  }

  private async generateWithGemini(examName: string, count: number): Promise<Question[]> {
    if (!this.genAI) throw new Error('Gemini not configured')

    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
    Gere ${count} questões de múltipla escolha para o concurso público: ${examName}
    
    Cada questão deve ter:
    - Uma pergunta clara e objetiva
    - 4 alternativas (A, B, C, D)
    - Uma resposta correta
    - Uma explicação detalhada do porquê a resposta está correta
    
    Formato de resposta (JSON):
    [
      {
        "question": "Pergunta aqui",
        "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
        "correctAnswer": 0,
        "explanation": "Explicação detalhada aqui"
      }
    ]
    
    As questões devem ser relevantes para o concurso público brasileiro e seguir o padrão de concursos.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      return JSON.parse(text)
    } catch (error) {
      throw new Error('Failed to parse AI response')
    }
  }
}
