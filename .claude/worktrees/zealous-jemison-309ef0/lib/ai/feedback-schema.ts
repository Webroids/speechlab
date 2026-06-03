import { z } from 'zod'

export const FeedbackSchema = z.object({
  overall_score: z.number().int().min(0).max(100),
  one_sentence_summary: z.string().max(200),
  structure: z.object({
    score: z.number().min(0).max(10),
    framework_detected: z.string(),
    comment: z.string(),
  }),
  clarity: z.object({
    score: z.number().min(0).max(10),
    comment: z.string(),
  }),
  delivery: z.object({
    wpm_assessment: z.string(),
    filler_assessment: z.string(),
    hedging_assessment: z.string(),
    comment: z.string(),
  }),
  engagement: z.object({
    score: z.number().min(0).max(10),
    hook_quality: z.string(),
    comment: z.string(),
  }),
  top_3_strengths: z.array(z.string()).min(1).max(5),
  top_3_improvements: z
    .array(
      z.object({
        issue: z.string(),
        example_from_transcript: z.string(),
        better_alternative: z.string(),
      }),
    )
    .min(1)
    .max(5),
  framework_suggestion: z.object({
    name: z.string(),
    why: z.string(),
    how_it_would_have_sounded: z.string(),
  }),
  next_drill: z.string(),
})

export type Feedback = z.infer<typeof FeedbackSchema>
