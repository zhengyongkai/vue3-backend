export const  getParamsNotNull = (obj)=> {
    for ( var key in obj ){
        if ( obj[key] === '' || obj[key] === null || obj[key] === undefined ){
            delete obj[key]
        }
    }
    return obj
}