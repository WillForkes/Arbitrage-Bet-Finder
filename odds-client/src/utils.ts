var oneDay: number = 1000 * 60 * 60 * 24;

function getMidnight(day: Date){
    const date = new Date(day);
    date.setMilliseconds(999);
    date.setSeconds(59);
    date.setMinutes(59);
    date.setHours(23);
    return date;
}
  

function isTomorrow(date: Date): boolean {
    const midnightTonight = getMidnight(new Date());
  const midnightTomorrow = new Date(midnightTonight.getTime() + oneDay);

  return date > midnightTonight && date < midnightTomorrow;
}

function isToday(date: Date) {
    return (new Date().toDateString() == date.toDateString());
}

function dateFormat(date: number): string {
    var d: Date = new Date(date *1000)
    if (isTomorrow(d)) {
        return 'Tomorrow at ' + d.toLocaleTimeString([], {timeStyle: "short"}); 
    } else if (isToday(d)) {
        return 'Today at ' + d.toLocaleTimeString([], {timeStyle: "short"})
    } else {
        return d.toLocaleString([], { dateStyle: "long", timeStyle: 'short' });
    }
}

function currencyCode(code: string, europe: boolean): string {
    if (europe) {
        return '€'
    }

    switch (code) {
        case 'US':
            return '$'
        case 'UK':
            return '£'
        default:
            return '$'
    }
}

module.exports = { dateFormat, currencyCode }