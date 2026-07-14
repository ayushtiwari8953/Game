import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JavaScript module without type declarations
import SnakeGame from "@/components/snake/SnakeGame.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {title: "Snake Game"},
      // { title: "Snake Game — Classic Arcade Reimagined" },
      {
        name: "description",
        content:
          "Modern Snake game with glassmorphism UI, difficulty levels, high score, sound and mobile touch controls.",
      },
      // { property: "og:title", content: "Snake Game — Classic Arcade Reimagined" },
      {
        property: "og:description",
        content: "Play a modern take on the classic Snake game right in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <SnakeGame />;
}
