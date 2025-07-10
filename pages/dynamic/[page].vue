

<template>
  <div class="w-[920px] h-fit  rounded-sm mr-5">
    <!-- <ul class="px-3 py-4 flex items-center border-b-[1px] border-[#eaecef]">
        <li class="sort-item-active px-3">
          最新
        </li>
        <li class="sort-item px-3">
          最热
        </li>
    </ul> -->
    <ul class="w-full px-5 box-border" id="dynamics">
      <li class="w-full flex mb-3 bg-white pb-3 border-b-[1px] border-[#eaecef] rounded-2xl p-5 overflow-hidden" v-for="item in dynamics" :key="item.id">
        <UAvatar :src="appConfig.nickImage" size="3xl" />
        <div class="ml-3">
          <div class="mb-3">
            <p class="mb-1.5">{{appConfig.author}}</p>
            <p class="text-dimmed">{{$dayjs(item.date).format('YYYY-MM-DD HH:mm:ss')}}</p>
          </div>
          <div>
            <p class="mb-3">
             {{item.content}}
            </p>
            <div class="w-120 flex flex-wrap"  @click="showImage($event,item.stem)" v-if="item.images.length" :id="item.stem">
              <img class="dynamic-img-item" v-for="(img,index) in item.images" :key="index" alt="logo" :src="img" :data-index="index"/>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <UPagination v-model:page="page" :total="totalDynamic" :to="jumpPage" class="flex justify-center my-4"/>
  </div>
  <div class="">
    <PersonInfo />
    <SiteInfo />
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {  watch } from 'vue';
import PersonInfo from '@/components/PersonInfo.vue';
import SiteInfo from '@/components/SiteInfo.vue';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

const appConfig = useAppConfig()
const route = useRoute()

const page = useState('page',()=>(route.params?.page || 1) * 1)
const pageSize = useState('pageSize',()=>10)
const dynamics = useState('dynamics', () => [])
const totalDynamic = useState('totalDynamic',()=>0)

// useSeoMeta({
//   title: home.value?.title,
//   description: home.value?.description
// })

const showImage = (e,id)=>{
  if(e.target.tagName === 'IMG'){
    try{
      const gallery = new Viewer(document.getElementById(id), {
        initialViewIndex: e.target.getAttribute('data-index') * 1,
        url: 'src',
        navbar: true,
        title: false,
        toolbar: true,
        button: true,
        zoomRatio: 0.1,
        minZoomRatio: 0.1,
        maxZoomRatio: 10,
        zoomOnTouch: true,
        zoomOnMouse: true,
        visible: function() {
          return window.innerWidth >= 768;
        }
      });
  //     const index = e.target.getAttribute('data-index');
  // console.log(e.target.tagName === 'IMG',id,index,gallery)
      // gallery.view();
    }catch(err){
      console.log(err)
    }
  }
}

// 获取动态列表
const getDynamic = async()=>{
  const {data:dynamicsRes} = await useAsyncData('dynamicList', () => {
    return queryCollection('dynamic')
    .order('date', 'DESC')
      .skip((page.value - 1)*pageSize.value)
      .limit(pageSize.value)
      .all()
  })
  dynamics.value = dynamicsRes.value.map(item => {
    item.date = dayjs(item.date).format('YYYY-MM-DD HH:mm:ss')
    return item
  });
}
// 获取动态数量
const getDynamicCount = async()=>{
  const {data:totalDynamicRes} = await useAsyncData('totalDynamic', () => {
    return queryCollection('dynamic')
      .count()
  })
  totalDynamic.value = totalDynamicRes.value;
}

if(import.meta.server){
  getDynamic();
  getDynamicCount();
  useSeoMeta({
    title:"生活动态",
    ogTitle:appConfig.ogTitle,
    keywords:appConfig.keywords,
    description:appConfig.description,
    ogDescription:appConfig.ogDescription,
    ogImage:appConfig.nickImage
  })
}


watch(()=>page.value,async()=>{
  getDynamic();
})

const jumpPage = (page)=>{
  // console.log(page)
  return {
    query: {
      page
    }
  }
}
</script>


<!-- <style>
@import url("~/assets/css/viewer.min.css");
</style> -->