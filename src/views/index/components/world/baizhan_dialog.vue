<template>
    <el-dialog
        class="m-index-baizhan-dialog"
        title="本周百战地图"
        :model-value="visible"
        @update:model-value="$emit('close', false)"
        @close="$emit('close', false)"
        :close-on-click-modal="false"
        :width="isPhone ? '100%' : '800px'"
    >
        <div class="m-baizhan-wrapper" v-loading="loading">
            <baizhan-map v-if="maps.length" :maps="maps" :column="column"></baizhan-map>
        </div>
    </el-dialog>
</template>

<script>
import { $node, $cms } from "@jx3box/jx3box-common/js/api";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box";
const { __imgPath } = JX3BOX;
import BaizhanMap from "./baizhan_map.vue";

const effects = [
    { id: 1, icon: 4533, reward: 500, tags: [], rewardRegexp: /击败首领额外获取(\d+)个修罗之印。/ },
    {
        id: 2,
        icon: 13548,
        reward: 100,
        tags: ["秒杀首领"],
        rewardRegexp: /直接获得(\d+)个修罗之印，并在下次与首领的战斗中直接击败首领。/,
    },
    {
        id: 3,
        icon: 13547,
        reward: 120,
        tags: ["稀有提高"],
        rewardRegexp: /本层稀有招式要诀出现率提高，击败首领额外获得(\d+)个修罗之印。/,
    },
    {
        id: 4,
        icon: 3313,
        reward: 100,
        tags: ["随机前进"],
        rewardRegexp: /获得一个随机前进次数，直接获得(\d+)个修罗之印/,
    },
    {
        id: 5,
        icon: 4577,
        reward: 50,
        tags: ["后六翻倍"],
        rewardRegexp: /后跃六步，下一次随机前进上限翻倍，直接获得(\d+)个修罗之印。/,
    },
    {
        id: 6,
        icon: 4543,
        reward: 50,
        tags: ["前六减半"],
        rewardRegexp: /前跃六步，下一次随机前进上限减半，直接获得(\d+)个修罗之印。/,
    },
    { id: 7, icon: 4558, reward: 200, tags: [], rewardRegexp: /击败首领额外获得(\d+)个修罗之印。/ },
    { id: 8, icon: 4576, reward: 120, tags: ["后跃三步"], rewardRegexp: /后跃三步，击败首领额外获得(\d+)个修罗之印。/ },
    { id: 9, icon: 4573, reward: 0, tags: ["逆向前进"], rewardRegexp: null },
];

export default {
    name: "BaizhanDialog",
    components: { BaizhanMap },
    props: {
        visible: { type: Boolean, default: false },
        isPhone: { type: Boolean, default: false },
    },
    emits: ["close"],
    data() {
        return {
            loading: false,
            bosses: [],
            effectsData: [],
            maps: [],
            column: 10,
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async loadBosses() {
            const cache = sessionStorage.getItem("baizhan-bosses");
            if (cache) {
                this.bosses = JSON.parse(cache);
                return;
            }
            const res = await $node().get("/monster/boss");
            let list = res.data?.data || [];
            list = list.map((item) => ({
                id: item.dwNpcID,
                avatar: item.ImagePath
                    ? `${__imgPath}pve/baizhan/${item.ImagePath.match(/\\([^\\]*)\./)[1].toLowerCase()}_${
                          item.ImageFrame
                      }.png`
                    : `${__imgPath}pve/baizhan/fbcdpanel02_51.png`,
                name: item.szName,
            }));
            const unique = list.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i);
            const names = unique.map((item) => item.name).join(",");
            const resInfo = await $cms().get("/api/cms/app/monster/boss", { params: { names } });
            const bossExtra = resInfo.data?.data || [];
            this.bosses = list.map((item) => ({
                ...item,
                link: bossExtra.find((b) => b.boss_name === item.name)?.link || "",
            }));
            sessionStorage.setItem("baizhan-bosses", JSON.stringify(this.bosses));
        },
        async loadEffects() {
            const cache = sessionStorage.getItem("baizhan-effects");
            if (cache) {
                this.effectsData = JSON.parse(cache);
                return;
            }
            const res = await $node().get("/monster/effects");
            const list = res.data?.data || [];
            list.unshift({
                nID: 0,
                dwIconID: 18505,
                szName: "无",
                szDescription: "",
                reward: 0,
                tags: [],
                buffID: 24848,
            });
            this.effectsData = list.map((item) => {
                const effect = effects.find((e) => e.id === item.nID) || {};
                let reward = effect.reward;
                if (effect.rewardRegexp) {
                    const matches = item.szDescription.match(effect.rewardRegexp);
                    if (matches?.[1]) reward = Number(matches[1]);
                }
                return {
                    ...item,
                    reward: reward || 0,
                    tags: effect?.tags || [],
                };
            });
            sessionStorage.setItem("baizhan-effects", JSON.stringify(this.effectsData));
        },
        async loadMap() {
            const res = await $cms().get("/api/cms/app/monster/map");
            if (res.data?.code !== 0) return;
            const data = res.data?.data?.data || [];
            this.maps = data.map((item) => ({
                ...item,
                boss: this.bosses.find((b) => b.id === item.dwBossID),
                bossName: this.bosses.find((b) => b.id === item.dwBossID)?.name,
                bossLink: this.bosses.find((b) => b.id === item.dwBossID)?.link,
                bossAvatar: this.bosses.find((b) => b.id === item.dwBossID)?.avatar,
                effect: this.effectsData.find((e) => e.nID === item.nEffectID),
            }));
        },
        async loadData() {
            this.loading = true;
            try {
                await Promise.all([this.loadBosses(), this.loadEffects()]);
                await this.loadMap();
            } catch (e) {
                console.error("[BaizhanDialog] loadData error:", e);
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style lang="less">
.m-index-baizhan-dialog {
    .m-baizhan-wrapper {
        width: 100%;
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden;
        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
        }
    }
}
</style>
