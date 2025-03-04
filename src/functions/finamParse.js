import finamDateToDate from "./finamDateToDate";

export default value => {
    //<TICKER>,<PER>,<DATE>,<TIME>,<OPEN>,<HIGH>,<LOW>,<CLOSE>,<VOL>
    const tables = value.split('\r\n').map(row => {
        const rowSplit = row.split(',');
        const [ticker, per, date, time, open, high, low, close, vol] = rowSplit;
        if( ticker ) {
            return {dateTime: finamDateToDate(date, time), open: Number(open), high: Number(high), low: Number(low), close: Number(close), vol: Number(vol)};
        } else {
            return {}
        }
    }).sort((a, b) => a.dateTime - b.dateTime);

    return tables
}