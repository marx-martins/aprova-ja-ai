"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Trophy, Zap } from "lucide-react"

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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchExams()
    }
  }, [session])

  const fetchExams = async () => {
    try {
      const response = await fetch("/api/exams")
      const data = await response.json()
      setExams(data)
    } catch (error) {
      console.error("Error fetching exams:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user as any

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user.name || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Escolha um concurso e comece seu simulado com IA
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Plano Atual
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.subscription === "pro" ? "Pro" : "Gratuito"}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.subscription === "pro" 
                  ? "Simulados ilimitados" 
                  : `${user.simulationsUsed || 0}/${user.simulationsLimit || 3} simulados usados`
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Simulados Realizados
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.simulationsUsed || 0}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Melhor Pontuação
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Ainda não realizado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Exams Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Concursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{exam.name}</CardTitle>
                    <Badge variant="secondary">{exam.level}</Badge>
                  </div>
                  <CardDescription>{exam.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {exam.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {exam.questionsCount} questões
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {exam.timeLimit} min
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => router.push(`/simulation/${exam.id}`)}
                    disabled={user.subscription === "free" && (user.simulationsUsed || 0) >= (user.simulationsLimit || 3)}
                  >
                    Iniciar Simulado
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        {user.subscription === "free" && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Upgrade para Pro</CardTitle>
              <CardDescription className="text-blue-100">
                Desbloqueie simulados ilimitados e explicações detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Simulados ilimitados
                </li>
                <li className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2" />
                  Explicações detalhadas com IA
                </li>
                <li className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Acesso a todos os concursos
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
      </div>
    </div>
  )
}
