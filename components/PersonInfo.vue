<template>
  <div class="w-[260px]  bg-white p-2 box-border mb-5 rounded-sm h-fit">
    <div class="flex flex-col items-center">
      <img :src="appConfig.nickImage" alt="" class="w-[60px] h-[60px] rounded-full mb-3 object-cover">
      <p class="text-[var(--juejin-font-2)] mb-4">{{appConfig.title}}</p>
      <div class="text-xl">
        <nuxt-link v-for="item in appConfig.socials" :key="item.url"  :to="item.url" target="_blank">
          <UIcon :name="item.icon" class="cursor-pointer w-5 h-5 mx-1.5 text-gray-600"/>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script setup>
const appConfig = useAppConfig()

</script>