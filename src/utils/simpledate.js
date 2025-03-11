function dateFormat(str,separator = '-'){
    let dt = new Date(str)
    let month = dt.getMonth() + 1
    let date = dt.getDate()
    return polish(month) + separator + polish(date)
}

function polish(val){
    return val<10 ? ('0' + val) : val
}

export {dateFormat , polish}
