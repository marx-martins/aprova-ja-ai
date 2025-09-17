import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample exams
  const exams = [
    {
      name: "Concurso INSS 2024",
      description: "Simulado para o concurso do Instituto Nacional do Seguro Social",
      organization: "INSS",
      level: "federal",
      area: "geral",
      questionsCount: 50,
      timeLimit: 180,
    },
    {
      name: "Concurso Banco do Brasil 2024",
      description: "Simulado para o concurso do Banco do Brasil",
      organization: "Banco do Brasil",
      level: "federal",
      area: "especifico",
      questionsCount: 40,
      timeLimit: 150,
    },
    {
      name: "Concurso Polícia Civil SP 2024",
      description: "Simulado para o concurso da Polícia Civil de São Paulo",
      organization: "Polícia Civil SP",
      level: "estadual",
      area: "especifico",
      questionsCount: 60,
      timeLimit: 240,
    },
    {
      name: "Concurso Prefeitura São Paulo 2024",
      description: "Simulado para concursos da Prefeitura de São Paulo",
      organization: "Prefeitura SP",
      level: "municipal",
      area: "geral",
      questionsCount: 45,
      timeLimit: 180,
    },
    {
      name: "Concurso Receita Federal 2024",
      description: "Simulado para o concurso da Receita Federal",
      organization: "Receita Federal",
      level: "federal",
      area: "especifico",
      questionsCount: 70,
      timeLimit: 300,
    },
    {
      name: "Concurso Tribunal de Justiça 2024",
      description: "Simulado para concursos de Tribunais de Justiça",
      organization: "TJ",
      level: "estadual",
      area: "especifico",
      questionsCount: 50,
      timeLimit: 200,
    },
  ]

  for (const exam of exams) {
    await prisma.exam.upsert({
      where: { name: exam.name },
      update: {},
      create: exam,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
