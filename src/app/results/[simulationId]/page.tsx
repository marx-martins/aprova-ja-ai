"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Trophy, BookOpen, Clock, Zap } from "lucide-react"

interface SimulationResult {
  id: string
  score: number
  totalQuestions: number
  correctAnswers: number
  completedAt: string
  exam: {
    name: string
    organization: string
  }
  questions: Array<{
    id: string
    questionText: string
    options: string[]
    correctAnswer: number
    userAnswer: number | null
    isCorrect: boolean | null
    explanation: string | null
  }>
}

export default function ResultsPage({ params }: { params: { simulationId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [showExplanations, setShowExplanations] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session && params.simulationId) {
      fetchResults()
    }
  }, [session, params.simulationId])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/simulations/${params.simulationId}/results`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excelente! Você está muito bem preparado!"
    if (score >= 80) return "Muito bom! Continue estudando para melhorar ainda mais."
    if (score >= 60) return "Bom resultado! Revise os tópicos que você errou."
    return "Continue estudando! Com dedicação você pode melhorar muito."
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando resultados...</p>
        </div>
      </div>
    )
  }

  if (!session || !result) {
    return null
  }

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100)
  const user = session.user as any

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Simulado Finalizado!</h1>
              <p className="text-gray-600">{result.exam.name}</p>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sua Pontuação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <div className="text-2xl font-semibold mb-2">
                {result.correctAnswers} de {result.totalQuestions} questões corretas
              </div>
              <p className="text-gray-600 mb-6">{getScoreMessage(percentage)}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div 
                  className={`h-4 rounded-full ${
                    percentage >= 80 ? 'bg-green-500' : 
                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.correctAnswers}
                  </div>
                  <p className="text-sm text-gray-600">Corretas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {result.totalQuestions - result.correctAnswers}
                  </div>
                  <p className="text-sm text-gray-600">Incorretas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button onClick={() => router.push("/dashboard")}>
            Voltar ao Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowExplanations(!showExplanations)}
          >
            {showExplanations ? "Ocultar" : "Ver"} Explicações
          </Button>
        </div>

        {/* Upgrade CTA for Free Users */}
        {user.subscription === "free" && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Upgrade para Pro</CardTitle>
              <CardDescription className="text-blue-100">
                Veja explicações detalhadas para cada questão e tenha acesso a simulados ilimitados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Explicações detalhadas com IA
                </li>
                <li className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Simulados ilimitados
                </li>
                <li className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Análise de performance
                </li>
              </ul>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => router.push("/pricing")}
              >
                Fazer Upgrade - R$ 29,90/mês
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Questions Review */}
        {showExplanations && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Revisão das Questões</h2>
            
            {result.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Questão {index + 1}
                    </CardTitle>
                    <Badge 
                      variant={question.isCorrect ? "default" : "destructive"}
                      className={question.isCorrect ? "bg-green-500" : ""}
                    >
                      {question.isCorrect ? (
                        <><CheckCircle className="h-4 w-4 mr-1" /> Correta</>
                      ) : (
                        <><XCircle className="h-4 w-4 mr-1" /> Incorreta</>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{question.questionText}</p>
                  
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border-2 ${
                          optionIndex === question.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : optionIndex === question.userAnswer && !question.isCorrect
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          )}
                          {optionIndex === question.userAnswer && !question.isCorrect && (
                            <XCircle className="h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {user.subscription === "pro" && question.explanation && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Explicação:</h4>
                      <p className="text-blue-800">{question.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
