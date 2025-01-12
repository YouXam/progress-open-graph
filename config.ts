
function UTC8(s: string) {
    return new Date(new Date(s + "T00:00:00Z").getTime() - 8 * 60 * 60 * 1000);
}


export default {
    title: "BUPT progress",
    description: "BUPT 学期和假期进度",
    image_copyrights: "https://yxm.pl/6",
    site_copyrights: "© YouXam",
    events: [
        {
            name: "BUPT 寒假",
            description: "2024 北京邮电大学寒假",
            start: UTC8("2024-01-13"),
            end: UTC8("2024-02-25"),
        },
        {
            name: "BUPT 春季学期",
            description: "2024 北京邮电大学春季学期",
            start: UTC8("2024-02-26"),
            end: UTC8("2024-07-05"),
        },
        {
            name: "BUPT 暑假",
            description: "2024 北京邮电大学暑假",
            start: UTC8("2024-07-06"),
            end: UTC8("2024-08-24"),
        },
        {
            name: "BUPT 秋季学期",
            description: "北京邮电大学 2024-2025 第一学期",
            start: UTC8("2024-08-26"),
            end: UTC8("2025-01-10"),
        },
        {
            name: "BUPT 寒假",
            description: "2025 北京邮电大学寒假",
            start: UTC8("2025-01-11"),
            end: UTC8("2025-02-22"),
        },
        {
            name: "BUPT 春季学期",
            description: "北京邮电大学 2024-2025 第二学期",
            start: UTC8("2025-02-23"),
            end: UTC8("2025-07-04"),
        },
    ] as Array<{
        name: string
        description: string
        start: Date
        end: Date
    }>
}
