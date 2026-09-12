import { createFileRoute } from "@tanstack/react-router";
import { LessonPlayer } from "@/components/lesson-player";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <LessonPlayer />;
}
