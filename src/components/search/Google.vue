<template>
    <div class="m-google" :style="{height:H + 'px'}" v-if="show">
        <iframe v-if="$store.state.q" :src="url" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    name: "Google",
    data : function (){
        return {
            H : 37,
            vpnerror : false,
            isfirst : true  //仅显示一次
        }
    },
    computed : {
        url : function (){
            return this.$store.state.q ? './google_proxy.html?q=' + this.$store.state.q : ''
            //https://cse.google.com/cse?cx=011450975203877314992:itycvatvhcp&q=
        },
        show : function (){
            return this.$store.state.type == 'google'
        },
    },
    mounted : function (){
        window.addEventListener('message',(e)=>{
            console.log(e);
            e.data.code ?
            this.$nextTick().then(()=>{
                this.H = e.data.H;
            }) :
            this.vpnerror = true

            this.isfirst = false
        });
    }
};
</script> 

<style lang="less">
//搜索结果
.m-google {
    background-color: #fff;
    border-radius: 6px;
    padding: @space;
    margin-top: @space;
    min-height:1200px;

    iframe{
        width:100%;
        height:100%;
    }
}
</style>
