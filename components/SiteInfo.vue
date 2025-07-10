<template>
  <div class="w-[260px] p-2 pt-0 box-border mb-5 rounded-sm h-fit text-[#9aa3ab] text-[12px]">
    <p class="mb-2">
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
        {{appConfig.icp}}
      </a>
    </p>
    <p class="mb-2">{{appConfig.copyright}}</p>
  </div>
</template>
<script setup>
const appConfig = useAppConfig()

</script>