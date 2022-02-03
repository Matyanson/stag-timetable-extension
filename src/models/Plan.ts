import type Subject from "./Subject";
import type Timetable from "./Timetable";

export type Event = {
    subject: Subject,
    day: number,
    time: number
}

type Plan = {
    timetable: Timetable,
    events: Event[]
}

export default Plan;