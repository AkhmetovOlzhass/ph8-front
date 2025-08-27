"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { contentAPI, type Topic } from "@/lib/api"

export function TopicsSection() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    try {
      const data = await contentAPI.getAllTopics()
      setTopics(data)
    } catch (error) {
      setError("Failed to load topics")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError("")
    try {
      await contentAPI.createTopic({ title, slug })
      setTitle("")
      setSlug("")
      setIsCreateOpen(false)
      loadTopics()
    } catch (error) {
      setError("Failed to create topic")
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-300">Loading topics...</div>
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Topics</h1>
          <p className="text-gray-400">Manage physics learning topics</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Topic</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter topic title"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter topic description"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <Button type="submit" disabled={creating} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                {creating ? "Creating..." : "Create Topic"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Card key={topic.id} className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg text-white">{topic.title}</CardTitle>
              <CardDescription className="text-gray-400">{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Created: {new Date(topic.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {topics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No topics created yet. Create your first topic to get started.</p>
        </div>
      )}
    </div>
  )
}
