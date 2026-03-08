<template>
	<div id="app">
		<header>
			<Top />
			<Search />
		</header>
		<main v-if="q">
			<Namespace />
			<All v-if="type == 'all'" />
			<Post v-if="type == 'post'" />
			<Author v-if="type == 'author'" />
			<Wiki v-if="type == 'wiki'" />
			<!-- <Item v-if="type == 'item'" /> -->
			<Google v-if="type == 'google'" />
		</main>
		<footer v-show="q">
			<Bottom />
		</footer>
	</div>
</template>

<script>
import Top from "@/components/search/Top.vue";
import Bottom from "@/components/search/Bottom.vue";
import Search from "@/components/search/Search.vue";
import Wiki from "@/components/search/Wiki.vue";
import Post from "@/components/search/Post.vue";
import Namespace from "@/components/search/Namespace.vue";
import Author from "@/components/search/Author.vue";
import All from "@/components/search/All.vue";
// import Cj from '@/components/search/Cj.vue'
// import Item from '@/components/search/Item.vue'
import Google from "@/components/search/Google.vue";

export default {
	name: "App",
	data: function () {
		return {};
	},
	computed: {
		type: function () {
			return this.$store.state.type;
		},
		q: function () {
			return this.$store.state.q;
		},
	},
	components: {
		Top,
		Bottom,
		Search,
		Wiki,
		Namespace,
		Post,
		Author,
		All,
		// Cj,
		// Item,
		Google,
	},
};
</script>

<style lang="less">
@import "../../node_modules/@jx3box/jx3box-common/css/preset.css";
@import "~@/assets/css/search/layout.less";
@import "~@/assets/css/search/post.less";
</style>
