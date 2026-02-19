import {defineStore} from 'pinia'
import {type AccidentReport, AccidentReportSchema} from "#shared/schemas/accident-report.schema";
import {useSnackBar} from "#imports";
import validateUser from "~/composables/validate-user.composable";

export const useAccidentReportStore = defineStore('accidentReportStore', {
    state: () => ({
        _route: '/entry',
        _accidentReports: [] as AccidentReport[],
        _currentAccidentReportIndex: null as number | null
    }),
    getters: {
        accidentReports: (state) => state._accidentReports,
        currentAccident: (state) => computed(
            () => state._currentAccidentReportIndex ? state._accidentReports[state._currentAccidentReportIndex] : null),
    },
    actions: {
        setCurrentAccident(index: number | null): void {
            this._currentAccidentReportIndex = index;
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
        async saveAccidentReport(accidentReport: AccidentReport): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();
            const {showSnackbarSuccess} = useSnackBar();
            await $msFetch(`${this._route}/`, {
                method: "POST",
                body: accidentReport
            })
            showSnackbarSuccess("Der Verbandsbucheintrag wurde erfolgreich gespeichert.")
        },

        async updateReport(accidentReport: AccidentReport): Promise<void> {
            await validateUser();
            const {$msFetch} = useNuxtApp();
            const {showSnackbarSuccess} = useSnackBar();
            await $msFetch(`${this._route}/`, {
                method: "PUT",
                body: accidentReport
            })
            showSnackbarSuccess("Der Verbandsbucheintrag wurde erfolgreich gespeichert.")
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