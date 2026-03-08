<template>
	<div class="m-namespace" v-loading="loading">
		<div class="m-item" v-if="data">
			<a class="u-mark" href="https://剑网3.com" target="_blank">剑网3.com</a>
			<div class="u-title">
				<a :href="'https://剑网3.com/' + data.key" target="_blank">剑网3.com/{{ data.key }}</a
				><span class="el-icon-postcard"></span>
			</div>

			<div class="u-desc">
				{{ data.desc }}
			</div>
		</div>
	</div>
</template>
<script>
import { getNamespace } from "@/service/search";
export default {
	name: "Namespace",
	data: function () {
		return {
			loading: false,
			data: "",
		};
	},
	computed: {
		q: function () {
			return this.$store.state.q;
		},
	},
	methods: {
		loadData: function () {
			this.loading = true;
			getNamespace(this.q)
				.then((res) => {
					this.data = res.data.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
	watch: {
		q: {
			immediate: true,
			handler: function (val) {
				this.loadData();
			},
		},
	},
};
</script>
<style scoped lang="less">
.m-item {
	box-shadow: 0 0 5px #dcdfe6;
	border-radius: 4px;
	margin-top: 20px;
	background-color: #fff;
	padding: 10px 20px;

	.u-title {
		.fz(14px, 2);
		a {
			color: @color-link;
			letter-spacing: 0.6px;
			box-shadow: 0 1px 0 @color-link;
			.mr(7px);
			&:hover {
				color: @hover;
				box-shadow: 0 1px 0 @hover;
			}
		}
		.el-icon-postcard {
			.fz(16px);
			.color(#555);
		}
	}
	.u-desc {
		font-size: 13px;
		line-height: 1.6;
		margin-top: 5px;
		color: #909399;
	}
	position: relative;
	.u-mark {
		letter-spacing: 1.2px;
		background-color: @black;
		color: #fff;
		border-radius: 2px;
		position: absolute;
		right: 10px;
		top: 10px;
		font-size: 12px;
		padding: 2px 4px 2px 6px;
		font-style: normal;
	}
}
</style>
