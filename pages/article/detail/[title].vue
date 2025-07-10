<template>
  <div class=" flex-1 h-fit  rounded-sm p-3 !mr-5 bg-white mb-6">
    <h1 class="mb-6 text-center font-bold text-4xl">{{page.title}}</h1>
    <div class="markdown-body">
      <ContentRenderer v-if="page" :value="page" :excerpt="true"/>
    </div>
  </div>
  
  <div class="">
    <PersonInfo />
    <ArticleOutline :outline="page.body.value" @navigate="handleNavigate"/>
  </div>
</template>
<script setup lang="js">
import PersonInfo from '@/components/PersonInfo.vue';
import ArticleOutline from '@/components/ArticleOutline.vue';

const route = useRoute()
const appConfig = useAppConfig()


const page = useState('page',()=>({}))

if(import.meta.server){
  const { data: res } = await useAsyncData(route.path, () => {
    return queryCollection('article').where('title', '=', route.params.title).first()
  })
  
  useSeoMeta({
    title:res.value.title,
    // ogTitle:res.value.ogTitle,
    // keywords:res.value.keywords,
    // description:res.value.description,
    // ogDescription:res.value.ogDescription,
    // ogImage:res.value.nickImage
  })
  page.value = res.value;
  useHeadSafe({
    link: [
      {
        rel: 'stylesheet',
        href: appConfig.markdownThemes[res.value?.theme] || appConfig.markdownThemes.default
      }
    ]
  })
}


const handleNavigate = (title) => {
  const el = document.getElementById(title.replace(/\s/g, '-').toLowerCase())
  if(el){
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
</script>