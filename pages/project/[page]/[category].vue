

<template>
  <ul class="w-[180px]  bg-white p-2 box-border mr-5 rounded-sm h-fit">
    <li v-for="item in categorys" :key="item.name" :class="'text-[var(--juejin-font-2)] '+ (item.name == chooseCategoryName? 'category-item-active' : 'category-item')">
      <a :href="'/project?category='+item.name" class="py-2.5 px-4 flex flex-row items-center">
        <img :src="item.icon" alt="Vue" class="w-4 h-4 mr-3">
        <span>{{item.name}}</span>
      </a>
    </li>
  </ul>
  <div class="flex-1 h-fit  rounded-sm mr-5">
    <ul class="w-full flex flex-wrap box-border">
      <li class="mb-3 mr-3" v-for="item in projects2">
        <NuxtLink :to="item.link || '/project/detail?title='+item.title" target="_blank">
          <div  class="w-[318px] border-b-[1px] border-[#eaecef] project-item bg-white">
            <NuxtImg loading="lazy" :src="item.image", alt="" width="318" height="176" class="w-full h-44 overflow-hidden rounded-sm shrink-0 object-cover"/>
            <article class="w-full p-6">
              <UTooltip :delay-duration="0" :text="item.title">
                <h4 class="text-[20px] font-bold  leading-6 w-full mb-0.5  ">
                  <span href="/" class="w-full whitespace-nowrap overflow-hidden text-ellipsis inline-block ">{{item.title}}</span>
                </h4>
              </UTooltip>
              <UTooltip :delay-duration="0" :text="item.description">
                <p class="text-[var(--juejin-font-3)] mb-0.5 max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {{item.description}}
                </p>
              </UTooltip>
              <footer class="flex flex-row items-center justify-between">
                <div>
                  <time class="text-[var(--juejin-font-3)] text-[12px] leading-4.5">
                      {{$dayjs(item.date).format('YYYY-MM-DD HH:mm:ss')}}
                  </time>
                </div>
              </footer>
            </article>
          </div>
        </NuxtLink>
      </li>
    </ul>
    <UPagination v-if="totalProject" v-model:page="page" :itemsPerPage="pageSize" :total="totalProject" :to="jumpPage" class="flex justify-center my-4"/>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, watch } from 'vue';
const route = useRoute()
const appConfig = useAppConfig()

const page = useState('page',()=>(route.params?.page || 1) * 1)
const pageSize = useState('pageSize',()=>10)
const chooseCategoryName = useState('chooseCategory',()=>(route.params?.category || ""))
const categorys = useState('categorys', () => [])
const projects = useState('projects', () => [])
const totalProject = useState('totalProject',()=>0)

//获取项目分类列表
const getCategory = async()=>{
  const {data:categoryRes} = await useAsyncData('category', () => {
    return queryCollection('category')
      .where('type', '=', 'project')
      .all()
  })
  categorys.value = categoryRes.value;
}
// 获取项目列表
const getProject = async()=>{
  const {data:projectsRes} = await useAsyncData('projectList', () => {
    return queryCollection('project')
    .order('date', 'DESC')
      .where('category', '=', chooseCategoryName.value)
      .skip((page.value - 1)*pageSize.value)
      .limit(pageSize.value)
      .all()
  })
  projects.value = projectsRes.value;
}
// 获取项目数量
const getProjectCount = async()=>{
  const {data:totalProjectRes} = await useAsyncData('totalProject', () => {
    return queryCollection('project')
      .where('category', '=', chooseCategoryName.value)
      .count()
  })
  totalProject.value = totalProjectRes.value;
}

if(import.meta.server){
  await getCategory();
  getProject();
  getProjectCount();
  useSeoMeta({
    title:"项目列表",
    ogTitle:appConfig.ogTitle,
    keywords:appConfig.keywords,
    description:appConfig.description,
    ogDescription:appConfig.ogDescription,
    ogImage:appConfig.nickImage
  })
}

const projects2 = computed(() => {
  return projects.value?.map(item => {
    item.date = dayjs(item.date).format('YYYY-MM-DD HH:mm:ss')
    return item
  })
})

watch(()=>page.value,async()=>{
  getProject();
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
