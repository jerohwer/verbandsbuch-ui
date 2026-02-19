import {defineStore} from 'pinia'
import {type AccidentReport, AccidentReportSchema} from "#shared/schemas/accident-report.schema";
import {useSnackBar, useUserSession} from "#imports";
import validateUser from "~/composables/validate-user.composable";

export const useAccidentReportStore = defineStore('accidentReportStore', {
    state: () => ({
        _route: '/entry',
        _accidentReports: [] as AccidentReport[]
    }),
    getters: {
        accidentReports: (state) => state._accidentReports
    },
    actions: {
        toDTO(accidentReport: AccidentReport) {
            console.log("AccidentReport: ", accidentReport)
            return {
                kitId: accidentReport.kit.id,
                occurredAt: accidentReport.occurredAt,
                description: accidentReport.description,
                firstAider: accidentReport.firstAider,
                materialList: accidentReport.materialList,
                message: accidentReport.message,
                incident: accidentReport.incident,
                measures: accidentReport.measures,
                witness: accidentReport.witness,
            }
        },
        async getAllAccidentReportsForUser(): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();

            const result = await $msFetch(`${this._route}/`)
            console.log("result: ", result)

            const parsedData = AccidentReportSchema.array().safeParse(result)

            if (!parsedData.success) throw createError(parsedData.error)

            this._accidentReports = parsedData.data;
        },
        async getAccidentReportById(id: string): Promise<AccidentReport> {
            await validateUser();
            const {$msFetch} = useNuxtApp();
            console.log("Route: ", `${this._route}/${id}`)
            const result = await $msFetch(`${this._route}/${id}`)
            console.log("result: ", result)

            const parsedData = AccidentReportSchema.safeParse(result)

            if (!parsedData.success) throw createError(parsedData.error)

            return parsedData.data;
        },
        async saveAccidentReport(accidentReport: AccidentReport): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();
            const {showSnackbarSuccess} = useSnackBar();
            console.log("Body: ", this.toDTO(accidentReport))
            await $msFetch(`${this._route}/`, {
                method: "POST",
                body: this.toDTO(accidentReport)
            })
            showSnackbarSuccess("Der Verbandsbucheintrag wurde erfolgreich gespeichert.")
        },

        async updateReport(accidentReport: AccidentReport): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();
            const {showSnackbarSuccess} = useSnackBar();

            await $msFetch(`${this._route}/${accidentReport.id}`, {
                method: "PUT",
                body: this.toDTO(accidentReport)
            })
            showSnackbarSuccess("Der Verbandsbucheintrag wurde erfolgreich aktualisiert.")
        },

        async deleteAccidentReport(id: string): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();
            const {showSnackbarSuccess} = useSnackBar();
            await $msFetch(`${this._route}/${id}`, {
                method: "DELETE"
            })
            showSnackbarSuccess("Der Verbandsbucheintrag wurde erfolgreich gelöscht.")
        },
    },
})