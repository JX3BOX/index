import {__spider} from '@jx3box/jx3box-common/js/jx3box.json'
import axios from 'axios'

const news = __spider + 'jx3news'
function getGameNews(){
    return axios.get(news).then((res) => {
        return res.data
    }).catch((err) => {
        console.log('获取游戏公告',err)
    })
}

const servers = __spider + 'jx3servers'
function getServers(){
    return axios.get(servers).then((res) => {
        return res.data.data
    }).catch((err) => {
        console.log('获取开服列表',err)
    })
}

export {getGameNews,getServers}