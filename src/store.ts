import { wStorage, wSync } from "./writable-stores";
import type Plan from "./models/Plan";
import type Subject from "./models/Subject";
import type Timetable from "./models/Timetable";


export const subjects = wSync<Subject[]>('subjects', []);

export const timetables = wSync<{title: string, data: Timetable}[]>('timetable_templates', []);

export const plans = wSync<{title: string, data: Plan}[]>('plans', []);

export const appSettings = wSync('app_settings', {
    subjects_by_year_selectors: [
        '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_1 .gpv-pred',
        '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_2 .gpv-pred',
        '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_3 .gpv-pred',
        '#struktura table.vsp_pane_zahlavi_opened_coat #rocnik_4 .gpv-pred',
    ],
    subject_text_filter : '\\d$',
    subject_select_button_selector: '.ui-tooltip-content input[value="Vybrat"]',
    confirm_button_selector: '.gpv-gpredzform-longer',
    timetable_selector: '.gpv_rozvrhMainTable',
    cell_subject_title_selector: '.gpv_rozvrh_roak_main',
    cell_subject_button_selector: '.gpv-RA-veVyberu'

})