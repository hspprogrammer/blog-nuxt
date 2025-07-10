

<template>
  <!-- <ContentRenderer v-if="home" :value="home" />
  <div v-else>Home not found</div> -->
  <ul class="w-[180px]  bg-white p-2 box-border mr-5 rounded-sm h-fit">
    <li v-for="item in categorys" :key="item.name" :class="'text-[var(--juejin-font-2)] '+ (item.name == chooseCategory.name ? 'category-item-active' : 'category-item')">
      <a :href="'/?category='+item.name" class="py-2.5 px-4 flex flex-row items-center">
        <img :src="item.icon" alt="Vue" class="w-4 h-4 mr-3">
        <span>{{item.name}}</span>
      </a>
    </li>
  </ul>
  <div class="w-[720px] h-fit bg-white rounded-sm mr-5 relative">
    <!-- <ul class="px-3 py-4 flex items-center border-b-[1px] border-[#eaecef]">
        <li class="sort-item-active px-3">
          推荐
        </li>
        <li class="sort-item px-3">
          最新
        </li>
    </ul> -->
    <ul class="w-full px-5 box-border">
      <li class="w-full  items-center mt-3 pb-3 border-b-[1px] border-[#eaecef]" v-for="item in articlesRes2" :key="item.id">
         <NuxtLink :to="'/article/detail?title='+item.title" target="_blank">
            <div  class="flex">
              <article class="flex-1 min-w-0">
                <h4 class="font-bold leading-6 w-full mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                  {{item.title}}
                </h4>
                <p class="text-[var(--juejin-font-3)] mb-0.5 text-[14px] max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {{item.description}}
                </p>
                <footer class="flex flex-row items-center justify-between">
                  <div>
                    <time class="text-[var(--juejin-font-3)] text-[12px] leading-4.5">
                      {{$dayjs(item.date).format('YYYY-MM-DD HH:mm:ss')}}
                    </time>
                  </div>
                  <div>
                    <!-- <span class="post-tag-item">
                      Vue
                    </span>
                    <span class="post-tag-item">
                      React
                    </span> -->
                  </div>
                </footer>
              </article>
              <img v-if="item.coverImage" :src="item.coverImage" alt="" class="w-28 h-18 overflow-hidden rounded-sm ml-6 shrink-0 object-cover"/>
            </div>
         </NuxtLink>
      </li>
    </ul>
    <UPagination v-model:page="page" :itemsPerPage="pageSize" :total="totalArticle" :to="jumpPage" class="flex justify-center my-4"/>
  </div>
  <div class="">
    <PersonInfo />
    <SiteInfo />
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import PersonInfo from '@/components/PersonInfo.vue';
import SiteInfo from '@/components/SiteInfo.vue';
import { computed, watch } from 'vue';
const route = useRoute()

const page = useState('page',()=>(route.params?.page || 1) * 1)
const pageSize = useState('pageSize',()=>10)
const chooseCategory = useState('chooseCategory',()=>({
  name:route.params?.category || ""
}))
const categorys = useState('categorys', () => [])
const articles = useState('articles', () => [])
const totalArticle = useState('totalArticle',()=>0)
const orderType = useState('orderType',()=>route.query?.orderType||1)

const appConfig = useAppConfig()
if (import.meta.server) {
  useSeoMeta({
    title:appConfig.title,
    ogTitle:appConfig.ogTitle,
    keywords:appConfig.keywords,
    description:appConfig.description,
    ogDescription:appConfig.ogDescription,
    ogImage:appConfig.nickImage
  })
}


//获取文章分类列表
const getCategory = async()=>{
  const {data:categoryRes} = await useAsyncData('category', () => {
    return queryCollection('category')
      .where('type', '=', 'article')
      .all()
  })
  categorys.value = categoryRes.value;
}

// 获取文章列表
const getArticle = async()=>{
  const {data:articlesRes} = await useAsyncData(`articleList-${chooseCategory.value.name}-${page.value}`, () => {
    return queryCollection('article')
      .order('date', 'DESC')
      .where('category', '=', chooseCategory.value.name)
      .skip((page.value - 1)*pageSize.value)
      .limit(pageSize.value)
      .all()
  })
  articles.value = articlesRes.value;
}
// 获取文章数量
const getArticleCount = async()=>{
  const {data:totalArticleRes} = await useAsyncData('totalArticle', () => {
    return queryCollection('article')
      .where('category', '=', chooseCategory.value.name)
      .count()
  })
  totalArticle.value = totalArticleRes.value;
}

if(import.meta.server){
  await getCategory();
  getArticle();
  getArticleCount();
}


const articlesRes2 = computed(() => {
  return articles.value?.map(item => {
    item.date = dayjs(item.date).format('YYYY-MM-DD HH:mm:ss')
    return item
  })
})

watch(()=>page.value,async()=>{
  getArticle();
})

const jumpPage = (page)=>{
  // console.log(page)
  return {
    params: {
      page
    }
  }
}

</script>
