<template>
	<div class="p-search">
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
import Top from "./Top.vue";
import Bottom from "./Bottom.vue";
import Search from "./Search.vue";
import Wiki from "./Wiki.vue";
import Post from "./Post.vue";
import Namespace from "./Namespace.vue";
import Author from "./Author.vue";
import All from "./All.vue";
// import Cj from '@/components/search/Cj.vue'
// import Item from '@/components/search/Item.vue'
import Google from "./Google.vue";

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
@import "@jx3box/jx3box-common/css/preset.css";
@import "@/assets/css/search/layout.less";
@import "@/assets/css/search/post.less";
</style>
