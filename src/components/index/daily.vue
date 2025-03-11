<template>
    <div class="m-daily m-sideblock">
        <div class="m-daily-header m-sideblock-header" :style="{backgroundImage:bg}">
            <div class="u-time">{{ year }}年{{ month }}月{{ date }}日</div>
            <img class="u-wechat" src="../../assets/img/right/qrcode.png" alt />
            <div class="u-list">
                <span class="u-weibo u-item">
                    <img svg-inline src="../../assets/img/weibo.svg" />
                    <em>官方微博：</em>
                    <a href="https://weibo.com/jx3box" target="_blank">
                        <b>JX3BOX魔盒</b>
                    </a>
                </span>
                <span class="u-weixin u-item">
                    <img svg-inline src="../../assets/img/wechat.svg" />
                    <em>微信公众号：</em>
                    <b>剑三魔盒</b>
                </span>
            </div>
        </div>

        <div>
            <calendar></calendar>
        </div>

        <!-- 隐藏的内容 -->
        <!-- <div class="m-daily-content" v-if="client == 'std'">
            <table>
                <thead>
                    <tr>
                        <th>活动</th>
                        <th>区服</th>
                        <th>项目</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in daily" :key="i">
                        <td>{{ item.type }}</td>
                        <td>{{ item.zone }}</td>
                        <td>{{ item.name }}</td>
                    </tr>
                    <tr>
                        <td>美人图</td>
                        <td>
                            <el-select v-model="server" placeholder="区服" size="mini" class="u-select-meirentu">
                                <el-option v-for="item in servers" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-tooltip class="item" effect="dark" :content="(meirentu && meirentu.desc) || '无'" placement="bottom">
                                <div>
                                    {{ (meirentu && meirentu.name) || "今日暂无画像" }}
                                </div>
                            </el-tooltip>
                        </td>
                    </tr>
                    <tr>
                        <td>福缘宠物</td>
                        <td>全服</td>
                        <td>
                            <a v-for="item in luckyList" :key="item.Index" class="u-pet" :href="getPetLink(item.Index)" target="_blank">{{ item.Name }}</a>
                        </td>
                    </tr>
                    <el-tooltip popper-class="m-next-match" v-if="furnitureCategory || furnitureProperty">
                        <div :class="{'u-next-match': furnitureNextMatch}" slot="content" v-html="nl2br(furnitureNextMatch && furnitureNextMatch.content) || '无'"></div>
                        <tr>
                            <td>园宅会赛</td>
                            <td>{{ furnitureProperty && furnitureProperty.content }}</td>
                            <td class="u-furniture">
                                <a class="u-pet" href="/furniture?match=1" target="_blank">{{ furnitureCategory && furnitureCategory.content }}</a>
                            </td>
                        </tr>
                    </el-tooltip>
                </tbody>
            </table>
        </div> -->
    </div>
</template>

<script>
import { getDaily, getMeirentu, getPets, getPetLucky, getFurniture } from "@/service/spider";
import servers from "@jx3box/jx3box-data/data/server/server_cn.json";
import { theme } from "../../../setting.json";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);
import {nl2br} from '@/utils/filters'
import calendar from '../v2/calendar.vue';
import {__imgPath} from '@jx3box/jx3box-common/data/jx3box.json'
export default {
    name: "daily",
    components: {
        calendar
    },
    props: [],
    data: function() {
        return {
            year: "",
            month: "",
            date: "",

            daily: [],

            meirentu: "",
            servers,
            server: "蝶恋花",

            luckyList: [],
            furniture: [],
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client;
        },
        my_server: function() {
            return this.$store.state.server;
        },
        theme: function() {
            return theme[this.client];
        },
        bg : function (){
            return `url(${__imgPath}topic/${this.theme}/daily.png)`
        },
        // 园宅会赛显示text
        furnitureCategory: function (){
            return this.furniture?.find(item => item.subtype === 'category')
        },
        // 园宅会赛类型
        furnitureProperty: function (){
            return this.furniture?.find(item => item.subtype === 'property')
        },
        furnitureNextMatch: function (){
            // return this.furniture?.find(item => item.subtype === 'next_match')
            return ''
        }
    },
    watch: {
        my_server: function(val) {
            if (val) this.server = val;
        },
        server: {
            // immediate: true,
            handler: function(val) {
                if (this.client == "std") {
                    val && this.loadMeirentu();
                }
            },
        },
    },
    methods: {
        initDate: function() {
            let dt = new Date();
            this.year = dt.getFullYear();
            this.month = dt.getMonth() + 1;
            this.date = dt.getDate();
        },
        loadDaily: function() {
            getDaily('today').then((res) => {
                let list = res.data.data || [];
                this.daily = list?.map(item => {
                    return {
                        type: item.task_type,
                        zone: "全服",
                        name: item.activity_name
                    }
                })
            });
        },
        loadPetLucky: function() {
            getPetLucky().then((res) => {
                let data = res.data.std;
                let dateIndex = dayjs(new Date()).format('MDD')
                let ids = data[dateIndex];
                getPets(ids).then((res) => {
                    this.luckyList = res.data.list;
                });
            });
        },
        loadMeirentu: function() {
            getMeirentu(this.server).then((res) => {
                this.meirentu = res.data.data;
            });
        },
        // 园宅会赛
        setFurniture(res) {
            let data = res.data.data;

            try {
                this.furniture = data
            } catch (e) {
                this.furniture = [];
            }
        },
        loadFurniture: function (){
            try {
                let furniture = sessionStorage.getItem('furniture')

                furniture = furniture && JSON.parse(furniture);

                if (furniture) {
                    this.setFurniture(furniture)
                } else {
                    const params = {
                        subtypes: "category,property,next_match",
                        start: dayjs().startOf('isoWeek').format('YYYY-MM-DD'),
                        end: dayjs().endOf('isoWeek').format('YYYY-MM-DD')
                    };
                    getFurniture(params).then((res) => {
                        this.setFurniture(res)

                        if (res.data?.data?.length) {
                            sessionStorage.setItem('furniture', JSON.stringify(res))
                        }
                    });
                }
            } catch(e) {
                console.error(e);
                this.furniture = []
            }
        },
        //前往宠物单页
        getPetLink: function(petIndex) {
            return `/pet/${petIndex}`;
        },
        nl2br,
    },
    mounted: function() {
        this.initDate();
        // if (this.client == "std") {
        //     this.loadDaily();
        //     this.loadPetLucky();
        //     this.loadFurniture()
        // }
    },
};
</script>

<style lang="less">
@import "../../assets/css/index/daily.less";
</style>
