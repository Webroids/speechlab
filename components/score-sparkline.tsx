'use client'

import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  scores: { date: string; score: number }[]
  currentScore: number
}

export function ScoreSparkline({ scores, currentScore }: Props) {
  if (scores.length < 2) return null

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Verlauf (letzte {scores.length} Aufnahmen)
        </span>
        <span className="text-xs text-green-600 dark:text-green-400">
          {scores[scores.length - 1]!.score > scores[0]!.score
            ? `↑ +${scores[scores.length - 1]!.score - scores[0]!.score} Punkte`
            : scores[scores.length - 1]!.score < scores[0]!.score
              ? `↓ ${scores[scores.length - 1]!.score - scores[0]!.score} Punkte`
              : '→ Gleich geblieben'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={56}>
        <LineChart data={scores} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Tooltip
            formatter={(v: number) => [v, 'Score']}
            labelFormatter={(label) => label}
            contentStyle={{ fontSize: 11 }}
          />
          <ReferenceLine y={currentScore} stroke="hsl(var(--primary))" strokeDasharray="3 3" strokeWidth={1} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 2.5, fill: 'hsl(var(--primary))' }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
