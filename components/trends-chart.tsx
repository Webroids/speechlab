'use client'

import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface DataPoint {
  date: string
  value: number | null
}

interface RefLine {
  y: number
  label?: string
  color?: string
  dashed?: boolean
}

interface RefBand {
  y1: number
  y2: number
  color?: string
  label?: string
}

interface Props {
  data: DataPoint[]
  label: string
  color?: string
  unit?: string
  referenceLines?: RefLine[]
  referenceBand?: RefBand
}

export function TrendsChart({
  data,
  label,
  color = 'hsl(var(--primary))',
  unit = '',
  referenceLines,
  referenceBand,
}: Props) {
  const valid = data.filter((d) => d.value !== null)
  if (valid.length < 2) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
        Noch zu wenig Daten
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v: number) => [`${v}${unit}`, label]}
          labelStyle={{ fontSize: 12 }}
          contentStyle={{ fontSize: 12 }}
        />

        {/* Target band (e.g. 130–160 WPM) */}
        {referenceBand && (
          <ReferenceArea
            y1={referenceBand.y1}
            y2={referenceBand.y2}
            fill={referenceBand.color ?? 'hsl(142 76% 36% / 0.1)'}
            label={
              referenceBand.label
                ? { value: referenceBand.label, position: 'insideTopRight', fontSize: 9, fill: 'hsl(142 76% 36%)' }
                : undefined
            }
          />
        )}

        {/* Reference lines */}
        {referenceLines?.map((rl, i) => (
          <ReferenceLine
            key={i}
            y={rl.y}
            stroke={rl.color ?? 'hsl(var(--muted-foreground))'}
            strokeDasharray={rl.dashed !== false ? '4 3' : undefined}
            strokeWidth={1.5}
          >
            {rl.label && (
              <Label value={rl.label} position="insideTopRight" fontSize={9} fill={rl.color ?? 'hsl(var(--muted-foreground))'} />
            )}
          </ReferenceLine>
        ))}

        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
