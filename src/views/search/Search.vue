<template>
	<div class="m-search">
		<el-input placeholder="请输入内容" v-model="q" class="input-with-select" @change="search" clearable>
			<template #prepend>
				<el-select v-model="type" placeholder="请选择" class="m-search-type">
					<el-option label="全部" value="all">全部</el-option>
					<el-option label="作品" value="post">作品</el-option>
					<el-option label="百科" value="wiki">百科</el-option>
					<el-option label="用户" value="author">用户</el-option>
					<el-option label="谷歌" value="google">Google</el-option>
				</el-select>
			</template>
			<template #append>
				<el-button :icon="searchIcon" />
			</template>
		</el-input>
	</div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";
export default {
	name: "Search",
	props: [],
	data: function () {
		return {
			//搜索词
			q: "",
			//类型
			type: "",
			searchIcon: Search,
		};
	},
	watch: {
		type: function () {
			this.$store.commit("changeType", this.type);
		},
	},
	methods: {
		search() {
			if (!this.q) return;
			this.$store.commit("changeQuery", this.q);
		},
		init() {
			let params = new URLSearchParams(location.search);
			this.q = params.get("q") || "";
			this.type = params.get("type") || "all";
			this.search();
		},
	},
	mounted: function () {
		this.init();
	},
};
</script>

<style lang="less">
@import "@/assets/css/search/var.less";

//搜索框
.el-input-group__prepend .el-select {
	width: 80px;
}
.el-select-dropdown__item img {
	width: @space;
	vertical-align: middle;
	position: relative;
	top: -2px;
	margin-right: 5px;
}
@media screen and (max-width: @ipad-y) {
	.m-search-type {
		display: none;
	}
}
</style>
