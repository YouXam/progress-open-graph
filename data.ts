
function UTC8(s: string) {
	return new Date(new Date(s + "T00:00:00Z").getTime() - 8 * 60 * 60 * 1000);
}


export default [
	{
		"name": "BUPT 春季学期",
		"description": "2024 BUPT 春季学期",
		"start": UTC8("2024-02-26"),
		"end": UTC8("2024-07-05"),
	}
]
