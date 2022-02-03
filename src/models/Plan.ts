import type Subject from "./Subject";
import type Timetable from "./Timetable";

export type SubjectEvent = {
    subject: Subject,
    day: number,
    time: number
}

type Plan = {
    timetable: Timetable,
    events: SubjectEvent[]
}

export default Plan;