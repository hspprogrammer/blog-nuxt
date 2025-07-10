<template>
  <div>
    <div class="min-w-7xl fixed top-0 left-0  w-full z-9999">
      <div class="bg-white flex flex-row  h-14 items-center shadow-md">
        <div class="flex flex-row justify-between items-center w-[1440px] relative left-1/2 transform -translate-x-1/2 ">
          <div class="flex flex-row items-center">
            <img class =" h-9.5 ml-6 mr-6" alt="logo" src="https://cdn.hanshanpeng.com/images/%E6%9C%AA%E5%91%BD%E5%90%8D%E9%A1%B9%E7%9B%AE-%E5%9B%BE%E5%B1%82%201%20%281%29.jpeg"/>
            <ul class="flex flex-row">
              <li v-for="item in appConfig.menus" :key="item.url" :class="'px-3 h-14 leading-14 cursor-pointer'+(route.path===item.url?' nav-link-active':' nav-link')">
                <a :href="item.url" class="w-full h-full inline-block">{{item.name}}</a>
              </li>
            </ul>
          </div>
          <UModal @after:leave="clearSearch">
            <UButton icon="i-lucide-search" variant="subtle">搜索</UButton>
            <template #content>
                <UContainer class="p-4">
                  <UCard>
                    <UInput v-model="query" placeholder="搜索..." class="w-full" />
                    <ul>
                      <li v-for="link of result" :key="link.item.id" class="mt-2">
                        <UButton variant="ghost" class="w-full" :to="linkPath(link.item.title)" target="_blank">
                          {{ link.item.title }}
                          <span class="text-gray-500 text-xs">
                            {{ link.item.content?.slice(0, 100) }}...
                          </span>
                        </UButton>
                      </li>
                    </ul>
                  </UCard>
                </UContainer>
            </template>
          </UModal>
        </div>
      </div>
    </div>
    <div class="w-[1200px] relative top-[70px] left-1/2 transform -translate-x-1/2 flex">
      <slot />
    </div>
  </div>
</template>
<script setup>
import Fuse from 'fuse.js'
import { ref,computed } from 'vue';

const route = useRoute()
const appConfig = useAppConfig()

const query = ref('')

const { data } = useAsyncData('search', () => queryCollectionSearchSections('article'))
const fuse = new Fuse(data.value || [], {
  keys: ['title', 'description'],
  includeMatches:true
})

const result = computed(() => {
  const res = fuse.search(toValue(query)).filter(item=>item.item.level==1).slice(0, 10);
  return res;
})
const linkPath = computed(() => {
  return (title)=>`/article/detail?title=${title}`;
})

const clearSearch = ()=>{
  console.log("关闭")
  query.value = ''
}

</script>


