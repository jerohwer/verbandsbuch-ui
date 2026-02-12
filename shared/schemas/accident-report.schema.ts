import {z} from "zod"
import {MaterialSchema} from "#shared/schemas/material.schema";

export const AccidentReportSchema = z.object({
    id: z.uuid(),
    time: z.string(),
    incident_place: z.string(),
    incident_description: z.string(),
    victim: z.string(),
    injury: z.string(),
    first_aider: z.string(),
    /**
     * Materialliste Record<Material-uuid, anzahl (number)>
     */
    usedMaterial: z.record(z.uuid(), z.number()),
    measurement: z.string(),
    room_id: z.string()
})

export type AccidentReport = z.infer<typeof AccidentReportSchema>