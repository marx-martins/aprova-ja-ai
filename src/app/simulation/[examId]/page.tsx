"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, CheckCircle, Circle } from "lucide-react"

interface Exam {
  id: string
  name: string
  description: string
  organization: string
  level: string
  area: string
  questionsCount: number
  timeLimit: number
}

interface Question {
  id: string
  questionText: string
  options: string[]
  correctAnswer: number
  userAnswer?: number
  explanation?: string
}

export default function SimulationPage({ params }: { params: { examId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session && params.examId) {
      fetchExamAndStartSimulation()
    }
  }, [session, params.examId])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && questions.length > 0) {
      handleSubmitSimulation()
    }
  }, [timeLeft])

  const fetchExamAndStartSimulation = async () => {
    try {
      // Fetch exam details
      const examResponse = await fetch(`/api/exams/${params.examId}`)
      const examData = await examResponse.json()
      setExam(examData)

      // Start simulation
      const simulationResponse = await fetch("/api/simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: params.examId,
        }),
      })

      const simulationData = await simulationResponse.json()
      setQuestions(simulationData.questions)
      setTimeLeft(examData.timeLimit * 60) // Convert minutes to seconds
    } catch (error) {
      console.error("Error starting simulation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestion].userAnswer = answerIndex
    setQuestions(updatedQuestions)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitSimulation = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/simulations/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions,
        }),
      })

      const result = await response.json()
      router.push(`/results/${result.simulationId}`)
    } catch (error) {
      console.error("Error submitting simulation:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Preparando simulado...</p>
        </div>
      </div>
    )
  }

  if (!session || !exam || questions.length === 0) {
    return null
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.name}</h1>
              <p className="text-gray-600">{exam.organization}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-lg font-semibold text-red-600">
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-500">Tempo restante</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Questão {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% concluído
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQ.questionText}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    currentQ.userAnswer === index
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    {currentQ.userAnswer === index ? (
                      <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Anterior
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? "bg-primary text-white"
                    : questions[index].userAnswer !== undefined
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button onClick={handleSubmitSimulation} disabled={isSubmitting}>
              {isSubmitting ? "Finalizando..." : "Finalizar Simulado"}
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Próxima
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {questions.filter(q => q.userAnswer !== undefined).length}
              </div>
              <p className="text-sm text-gray-600">Respondidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {questions.filter(q => q.userAnswer === undefined).length}
              </div>
              <p className="text-sm text-gray-600">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {questions.length}
              </div>
              <p className="text-sm text-gray-600">Total</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
