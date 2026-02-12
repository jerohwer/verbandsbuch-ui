import {defineStore} from 'pinia'
import {type AccidentReport, AccidentReportSchema} from "#shared/schemas/accident-report.schema";
import {NoAuthError} from "#shared/errors/no-auth.error";
import {useSnackBar} from "#imports";

export const useAccidentReportStore = defineStore('accidentReportStore', {
    state: () => ({
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
            const {fetch, session} = useUserSession();
            await fetch();

            if (!session.value?.user) throw createError(new NoAuthError())

            const {$msFetch} = useNuxtApp();

            const result = await $msFetch('/accidentReport/')

            const parsedData = AccidentReportSchema.array().safeParse(result)

            if (!parsedData.success) throw createError("")

            this._accidentReports = parsedData.data;
        },
        async saveAccidentReport(accidentReport: AccidentReport): Promise<void> {
            const {$msFetch} = useNuxtApp();
            const {showSnackbarSuccess} = useSnackBar();
            await $msFetch('/accidentReport/', {
                method: "POST",
                body: accidentReport
            })
            showSnackbarSuccess("Der Verbandsbucheintrag wurde erfolgreich gespeichert.")
        },
        async deleteAccidentReport(id: string): Promise<void> {
            const {$msFetch} = useNuxtApp();
            const {showSnackbarSuccess} = useSnackBar();
            await $msFetch(`/accidentReport/${id}`, {
                method: "DELETE"
            })
            showSnackbarSuccess("Der Verbandsbucheitrag wurde erfolgreich gelöscht.")
        },
    },
})