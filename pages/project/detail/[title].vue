<template>
   <div class=" flex-1 h-fit  rounded-sm p-3 !mr-5 bg-white mb-6">
    <h1 class="mb-6 text-center font-bold text-4xl">{{project.title}}</h1>
    <div class="markdown-body">
      <ContentRenderer v-if="project" :value="project" :excerpt="true"/>
    </div>
  </div>
  <div class="">
    <PersonInfo />
  </div>
</template>
<script setup lang="js">
import PersonInfo from '@/components/PersonInfo.vue';

const route = useRoute()
const appConfig = useAppConfig()


const project = useState('project',()=>({}))

if(import.meta.server){
  const { data: res } = await useAsyncData(route.path, () => {
    return queryCollection('project').where('title', '=', route.params.title).first()
  })
  
  useSeoMeta({
    title:res.value.title,
    // ogTitle:res.value.ogTitle,
    // keywords:res.value.keywords,
    // description:res.value.description,
    // ogDescription:res.value.ogDescription,
    // ogImage:res.value.nickImage
  })
  project.value = res.value;
  useHeadSafe({
    link: [
      {
        rel: 'stylesheet',
        href: appConfig.markdownThemes[res.value?.theme] || appConfig.markdownThemes.default
      }
    ]
  })
}

</script>