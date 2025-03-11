<template>
	<div class="m-author m-block" v-loading="loading">
		<ul class="u-list" v-if="data.length">
			<li class="u-item" v-for="(item, i) in data" :key="'item-' + i">
				<a class="u-author" v-bind:href="item | formatURL" target="_blank">
					<img class="u-avatar" :src="item.user_avatar | formatAvatar" :alt="item.display_name" />
					<b class="u-name">{{ item.display_name }}</b>
					<span class="u-desc">{{ item.user_bio }}</span>
				</a>
			</li>
		</ul>
		<el-alert v-else class="m-archive-null" title="没有找到相关条目" type="info" center show-icon> </el-alert>
		<el-button class="m-archive-more" type="primary" :class="{ show: hasNextPage }" :loading="loading" @click="appendPage(++page)" icon="el-icon-arrow-down">加载更多</el-button>
		<el-pagination class="m-archive-pages" layout="prev, pager, next" background hide-on-single-page :page-size.sync="per" :total="total" :current-page.sync="page" @current-change="changePage"> </el-pagination>
	</div>
</template>

<script>
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getAuthor } from "@/service/search";
export default {
	name: "Author",
	data: function () {
		return {
			loading: false,
			data: [], //数据列表
			total: 1, //总条目数
			pages: 1, //总页数
			page: 1, //当前页数
			per: 10, //每页条目
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
		formatURL: function (item) {
			return authorLink(item.ID);
		},
		formatAvatar: function (url) {
			return showAvatar(url, "m");
		},
	},
	methods: {
		loadData: function (i = 1, append = false) {
			this.loading = true;
			getAuthor(this.q, i)
				.then((res) => {
					if (append) {
						this.data = this.data.concat(res.data.data.list);
					} else {
						window.scrollTo(0, 0);
						this.data = res.data.data.list;
					}
					this.total = res.data.data.total;
					this.pages = res.data.data.pages;
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
//搜索结果
.m-author {
	a {
		color: @hover;
	}
	.u-list {
		padding: 0;
		margin: 0;
	}

	.u-item {
		margin-bottom: @space;
		list-style: none;
	}

	.u-author {
		display: block;
		padding: 10px;
		border: 1px solid #eee;
		border-radius: 3px;
		*zoom: 1;
		img {
			width: 68px;
			height: 68px;
		}
		&:after {
			content: "";
			display: table;
			clear: both;
		}
		background-color: #fafbfc;
		&:hover {
			border-color: #ddd;
		}
	}

	.u-avatar {
		float: left;
		margin-right: @space;
	}

	.u-name {
		font-size: 16px;
		line-height: 1.5;
		letter-spacing: 0.6px;
		color: @hover;
		display: block;
	}

	.u-desc {
		display: block;
		font-size: 14px;
		line-height: 1.6;
		color: @desc;
		letter-spacing: 0.6px;
		b {
			color: @pink;
		}
	}
}
</style>
