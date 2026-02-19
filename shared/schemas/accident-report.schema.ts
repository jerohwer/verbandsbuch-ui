import {z} from "zod"
import {FirstAidKitSchema} from "#shared/schemas/first-aid-kit.schema";
import type User from "#shared/types/nuxt-auth-utils"

export const AccidentReportSchema = z.object({
    id: z.uuid(),
    kit: FirstAidKitSchema,
    createdBy: z.custom<typeof User>(),
    occurredAt: z.string().transform((val) => new Date(val)),
    description: z.string(),
    measures: z.string().optional().nullable(),
    createdAt: z.string().transform((val) => new Date(val))
})

export type AccidentReport = z.infer<typeof AccidentReportSchema>