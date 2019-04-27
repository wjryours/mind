import Cookies from 'js-cookie'

export function getCookies(key) {
    return Cookies.get(key)
}
export function setCookies(key, value, expires) {
    expires ? Cookies.set(key, value, expires) : Cookies.set(key, value)
}
export function removeCookies(key) {
    Cookies.remove(key)
}
export function getLocalStorage(key) {
    return localStorage.getItem(key)
}
export function setLocalStorage(key, value) {
    localStorage.setItem(key, value)
}
export function removeLocalStorage(key) {
    localStorage.removeItem(key)
}
export function createFileAndDownload(filename, content) {
    //创建文件并下载
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}
export function compareObjectIsEqual(origin, target) {
    if (typeof target === 'object') {
        if (typeof origin !== 'object') {
            return false
        }
        for (let key of Object.keys(target)) {
            if (!compareObjectIsEqual(origin[key], target[key])) {
                return false
            }
        }
        for (let key of Object.keys(origin)) {
            if (!compareObjectIsEqual(target[key], origin[key])) {
                return false
            }
        }
        return true
    } else return origin === target
}
function parseDate(d) {
    if (typeof (d) === 'string' && d.indexOf('-')) {
        var has_hms = d.indexOf(' ')
        var da = [], t = [0, 0, 0]
        if (has_hms > 0) {
            d = d.split(' ')
            da = d[0].split('-')
            t = d[1].split(':')
        } else {
            da = d.split('-')
        }
        return new Date(da[0], da[1] - 1, da[2], t[0], t[1], t[2])
    } else {
        if (typeof (d) !== 'object') {
            d = new Date(d)
        }
    }
    return d
}
export function formatDate(d, format) {
    d = parseDate(d)
    var full_year, mon, day, hour, minute, second
    full_year = d.getFullYear()
    mon = d.getMonth() + 1
    if (mon < 10) {
        mon = '0' + mon
    }
    day = d.getDate()
    if (day < 10) {
        day = '0' + day
    }
    hour = d.getHours()
    if (hour < 10) {
        hour = '0' + hour
    }
    minute = d.getMinutes()
    if (minute < 10) {
        minute = '0' + minute
    }
    second = d.getSeconds()
    if (second < 10) {
        second = '0' + second
    }
    var formatedDate = ""
    switch (format) {
        case 'mm-dd':
            formatedDate = mon + '-' + day
            break
        case 'yyyy-mm':
            formatedDate = full_year + '-' + mon
            break
        case 'dd:hh':
            formatedDate = day + "日 " + hour + "时"
            break
        case 'mmddhh:mm':
            formatedDate = mon + '月' + day + "日 " + hour + ":" + minute
            break
        case 'yyyymmdd:hhmm':
            formatedDate = full_year + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 " + hour + ":" + minute
            break
        case 'yyyy-mm-dd hh:mm':
            formatedDate = full_year + '-' + mon + '-' + day + " " + hour + ":" + minute
            break
        case 'yyyy-mm-dd hh:mm:ss':
            formatedDate = full_year + '-' + mon + '-' + day + " " + hour + ":" + minute + ":" + second
            break
        case 'yyyymmdd:hhmmss':
            formatedDate = full_year + '-' + mon + '-' + day + " " + hour + ":" + minute + ":" + second
            break
        case 'mm-dd hhmmss':
            formatedDate = mon + '-' + day + " " + hour + ":" + minute + ":" + second
            break
        case 'hhmmss':
            formatedDate = hour + ":" + minute + ":" + second
            break
        case 'yyyymmdd':
            formatedDate = full_year.toString() + mon + day
            break
        case 'yyyyymmmdd':
            formatedDate = full_year + "年" + mon + "月" + day
            break
        case 'yyyy/mm/dd':
            formatedDate = full_year + '/' + mon + '/' + day
            break
        default:
            formatedDate = full_year + '-' + mon + '-' + day
            break
    }
    return formatedDate
}
