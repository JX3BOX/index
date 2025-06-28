<template>
    <div class="m-index-minirec">
        <a href="/achievement/overview" class="u-link" target="_blank">
            <img class="u-pic" src="@/assets/img/right/achievement.png" alt="资历宝典" />
            <span class="u-txt">资历宝典</span>
        </a>
        <a href="/adventure/treasure" class="u-link" target="_blank">
            <img class="u-pic" src="@/assets/img/right/treasure.png" alt="奇遇珍卷" />
            <span class="u-txt">奇遇珍卷</span>
        </a>
    </div>
</template>

<script>
export default {
   name : 'MiniRecRight',
   props:[],
   components : {},
   data : function(){
       return {

       }
   },
   computed:{},
   watch:{},
   methods:{},
   created:function(){},
   mounted:function(){},
}
</script>

<style scoped lang="less">
.m-index-minirec{
    margin-top:20px;
    .u-txt{.none;}
    .flex;
    gap:10px;
    .u-link{
        .w(50%);
        flex-shrink: 1;
        flex-grow: 1;
        overflow: hidden;
        .db;
    }
    .u-pic{
        .w(100%);
        .h(auto);
        .r(6px);
        .db;

        transition: all 0.15s ease-in-out;
        &:hover{
            filter:brightness(1.1) saturate(1.1);
        }
    }
}
</style>
