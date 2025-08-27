"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Filter } from "lucide-react"
import { contentAPI, type Topic } from "@/lib/api"

interface TopicFilterProps {
  selectedTopicId: string | null
  onTopicSelect: (topicId: string | null) => void
}

export function TopicFilter({ selectedTopicId, onTopicSelect }: TopicFilterProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    try {
      const data = await contentAPI.getAllTopics()
      setTopics(data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">Loading topics...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filter by Topic</h3>
        </div>
        <div className="space-y-2">
          <Button
            variant={selectedTopicId === null ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onTopicSelect(null)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            All Topics
          </Button>
          {topics.map((topic) => (
            <Button
              key={topic.id}
              variant={selectedTopicId === topic.id ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onTopicSelect(topic.id)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              {topic.title}
            </Button>
          ))}
        </div>
        {selectedTopicId && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-sm">
              <Badge variant="secondary" className="mb-2">
                Current Filter
              </Badge>
              <p className="font-medium">{topics.find((t) => t.id === selectedTopicId)?.title}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {topics.find((t) => t.id === selectedTopicId)?.description}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
