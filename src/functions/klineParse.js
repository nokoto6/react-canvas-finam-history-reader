export default (value) => {
    const rows = value.split('\n');
    const tables = rows.map(row => {
        let obj = {};
        [
            obj.openTime, // 
            obj.open, 
            obj.high, 
            obj.low, 
            obj.close, 
            obj.volume, 
            obj.closeTime, //
            obj.baseAssetVolume, 
            obj.numberOftrades, 
            obj.takerBuyVolume, 
            obj.takerBuyBaseAssetVolume, 
            obj.ignore
        ] = row.split(',').map(num => Number(num))
        return obj;
    });

    return tables
}