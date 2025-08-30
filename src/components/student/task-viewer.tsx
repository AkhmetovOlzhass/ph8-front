"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock, Target, Zap, Flame, Calendar, Check } from "lucide-react"
import { contentAPI, type Task, type Topic } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "../ui/input"

interface TaskViewerProps {
  taskId: string
  onBack: () => void
}

interface UserTaskProgress {
  status: "NOT_STARTED" | "IN_PROGRESS" | "SOLVED"
  lastAnswer?: string
  attempts: number
}

export function TaskViewer({ taskId, onBack }: TaskViewerProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  const [showSolution, setShowSolution] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const [userAnswer, setUserAnswer] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [progress, setProgress] = useState<UserTaskProgress | null>(null)

  useEffect(() => {
    loadTask()
  }, [taskId])

  const loadTask = async () => {
    try {
      const taskData = await contentAPI.getTask(taskId)
      setTask(taskData)

      if (taskData?.topicId) {
        const topicData = await contentAPI.getTopicById(taskData.topicId)
        setTopic(topicData)
      }

      const userProgress = await contentAPI.getUserProgress()
      const thisTaskProgress = userProgress.find((p: any) => p.taskId === taskId)
      setProgress(thisTaskProgress || null)
    } catch (error) {
      console.error("Failed to load task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return
    setSubmitting(true)
    try {
      const res = await contentAPI.submitAnswer(task.id, userAnswer)

      setProgress({
        status: res.progress.status,
        lastAnswer: res.progress.lastAnswer,
        attempts: res.progress.attempts,
      })

      setResult(res.correct
        ? "✅ Correct answer!" 
        : "❌ Wrong answer, try again."
      )
    } catch (err) {
      console.error("Failed to submit answer", err)
      setResult("⚠️ Failed to submit your answer.")
    } finally {
      setSubmitting(false)
    }
  }

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <Target className="h-4 w-4" /> }
      case "MEDIUM":
        return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: <Clock className="h-4 w-4" /> }
      case "HARD":
        return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: <Zap className="h-4 w-4" /> }
      case "EXTREME":
        return { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: <Flame className="h-4 w-4" /> }
      default:
        return { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: <Target className="h-4 w-4" /> }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <div className="text-lg text-slate-300">Loading challenge...</div>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-400 text-lg">Challenge not found</p>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Challenges
          </Button>
        </div>
      </div>
    )
  }

  const difficultyConfig = getDifficultyConfig(task.difficulty)

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Challenges
          </Button>
          <Badge
            className={`${difficultyConfig.bg} ${difficultyConfig.color} ${difficultyConfig.border} flex items-center gap-1.5 px-3 py-1.5 font-medium`}
          >
            {difficultyConfig.icon}
            {task.difficulty}
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                  {task.title}
                  {progress?.status === "SOLVED" && (
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-200">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="text-lg text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {task.bodyMd}
                </CardDescription>

                {progress?.lastAnswer && (
                  <div className="mt-3 text-sm text-slate-400">
                    <span className="font-semibold text-slate-300">Your last answer:</span>{" "}
                    <span className="text-emerald-400">{progress.lastAnswer}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitAnswer} className="mt-6 flex gap-3">
                  <Input
                    name="userAnswer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="flex-1 bg-slate-800 border-slate-700 text-white"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </form>

                {result && (
                  <p className="mt-3 text-sm font-medium text-center text-slate-300">{result}</p>
                )}
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  {topic && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{topic.title}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solution Section */}
          <div className="space-y-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white"
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? "Hide Official Solution" : "Show Official Solution"}
                  </Button>
                  <AnimatePresence initial={false}>
                    {showSolution && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                          <p className="text-slate-200 whitespace-pre-wrap">
                            {task.officialSolution || "No solution provided"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white"
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    {showAnswer ? "Hide Correct Answer" : "Reveal Correct Answer"}
                  </Button>
                  <AnimatePresence initial={false}>
                    {showAnswer && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 text-center">
                          <p className="text-xl font-semibold text-emerald-400">
                            {task.correctAnswer || "No answer provided"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
