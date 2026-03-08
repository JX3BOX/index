<template>
	<div class="m-cj m-block" v-loading="loading">
		<ul class="u-list" v-if="data.length">
			<a class="m-cj-item" v-for="(item, i) in data" :href="item.ID | url" :key="i" target="_blank">
				<img class="u-icon" :src="item.IconID | icon" />
				<span class="u-title">{{ item.Name }}</span>
				<span class="u-desc">{{ item.ShortDesc }}</span>
				<i class="u-point"><img src="../assets/img/point.png" />{{ item.Point }}</i>
			</a>
		</ul>
		<el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
		<el-button class="m-archive-more" type="primary" :class="{ show: hasNextPage }" :loading="loading" @click="appendPage(++page)" icon="el-icon-arrow-down">加载更多</el-button>
		<el-pagination class="m-archive-pages" layout="prev, pager, next" background hide-on-single-page :page-size.sync="per" :total="total" :current-page.sync="page" @current-change="changePage"> </el-pagination>
	</div>
</template>

<script>
import { getCj } from "@/service/search";
import { __Root, __ossMirror, __iconPath, __ossRoot } from "@jx3box/jx3box-common/data/jx3box";
export default {
	name: "Cj",
	props: [],
	data: function () {
		return {
			loading: false,
			data: [], //数据列表
			total: 1, //总条目数
			pages: 1, //总页数
			page: 1, //当前页数
			per: 15, //每页条目
		};
	},
	computed: {
		q: function () {
			return this.$store.state.q;
		},
		hasNextPage: function () {
			return this.total > 1 && this.page < this.pages;
		},
	},
	filters: {
		icon: function (id) {
			return __iconPath + "icon/" + id + ".png";
		},
		url: function (id) {
			return __Root + "cj/#/view/" + id;
		},
	},
	methods: {
		loadData: function (i = 1, append = false) {
			this.loading = true;
			getCj(this.q, i)
				.then((res) => {
					if (append) {
						this.data = this.data.concat(res.data.data.achievements);
					} else {
						window.scrollTo(0, 0);
						this.data = res.data.data.achievements;
					}
					this.total = res.data.data.total;
					this.pages = res.data.data.last_page;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		changePage: function (i) {
			this.loadData(i);
		},
		appendPage: function (i) {
			this.loadData(i, true);
		},
	},
	watch: {
		q: function () {
			this.page = 1;
			this.loadData();
		},
	},
	mounted: function () {
		this.loadData();
	},
};
</script>

<style lang="less">
.m-cj-item {
	background-color: @bg-light;
	border: 1px solid #eee;
	.r(4px);
	.mb(20px);
	.db;
	padding: 10px;
	.clearfix;

	.u-icon {
		.r(4px);
		.fl;
		.mr(10px);
		.size(48px);
	}

	.u-title {
		.fz(14px, 2);
		.db;
		color: @primary;
	}

	.u-desc {
		color: #555;
		.db;
		.fz(12px);
	}

	transition: 0.06s border ease-in-out;
	&:hover {
		border-color: @primary;
	}

	.pr;
	.u-point {
		.pa;
		.rt(10px);
		.fz(13px, 18px);
		color: #555;
		font-style: normal;
		img {
			.size(18px);
			.fl;
			.mr(2px);
		}
	}
}
</style>
