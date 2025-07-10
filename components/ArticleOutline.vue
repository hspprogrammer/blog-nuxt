<template>
  <div class="outline-container sticky top-19 z-50">
    <h3 class="outline-title">文章大纲</h3>
    <div class="outline-content">
      <ul class="outline-list">
        <template v-for="(item, index) in outlineData" :key="index">
          <li 
          :class="['outline-item', `level-${item.level}`]"
          @click="handleNavigate(item.title)"
        >
          <span class="outline-text">{{ item.title }}</span>
        </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>

// 接收父组件传入的大纲数据
const props = defineProps({
  outline: {
    type: Array,
    required: true,
    description: '文章大纲数据，包含标题、层级和ID'
  },
  activeId: {
    type: String,
    default: '',
    description: '当前激活的大纲项ID'
  }
});
// 解析后的大纲数据
const outlineData = useState('outlineData', () => []);
  console.log(props.page)
if(import.meta.server){
  // 递归解析数据结构，提取标题信息
  const parseOutline = (nodes, result = []) => {
    nodes.forEach(node => {
      // 节点格式: [标签名, 属性对象, 内容/子节点]
      const tag = node[0];
      const attrs = node[1];
      const content = node[2];
      // const [tag, attrs, content] = node;
      // 只处理标题标签 h1-h6
      if (tag?.match(/^h[1-6]$/)) {
        // 提取标题层级
        const level = parseInt(tag.replace('h', ''));
        
        // 提取标题文本（内容可能是字符串或嵌套结构）
        let title = '';
        if (typeof content === 'string') {
          title = content;
        } else if (Array.isArray(content)) {
          // 简单处理嵌套结构中的文本（实际场景可能需要更复杂的解析）
          title = content
            .filter(item => typeof item === 'string' || (Array.isArray(item) && item[2]))
            .map(item => typeof item === 'string' ? item : item[2])
            .join('');
        }
        
        // 添加到结果数组
        result.push({
          id: attrs.id || `heading-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title,
          level,
          tag
        });
      }
      
      // 如果有子节点且是数组，递归处理
      if (Array.isArray(content)) {
        parseOutline(content, result);
      }
    });
    
    return result;
  };

  

  // 初始化解析
  outlineData.value = parseOutline(props.outline);
}
// 处理导航逻辑
  const emit = defineEmits(['navigate']);
  const handleNavigate = (id) => {
    emit('navigate', id);
  };
</script>

<style scoped>
.outline-container {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.outline-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.outline-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.outline-item {
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.outline-children {
  list-style: none;
  padding-left: 16px;
  margin: 4px 0 0 0;
}

.outline-child {
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.outline-text {
  display: inline-block;
  padding: 4px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

/* 层级样式 */
.level-1 .outline-text {
  font-weight: bold;
  font-size: 16px;
}

.level-2 .outline-text {
  font-weight: 600;
  font-size: 15px;
  padding-left: 8px;
}

.level-3 .outline-text {
  font-size: 14px;
  padding-left: 16px;
}

.level-4 .outline-text,
.level-5 .outline-text,
.level-6 .outline-text {
  font-size: 13px;
  padding-left: 24px;
  color: #4b5563;
}

/* 激活状态 */
.active .outline-text {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

/* 交互效果 */
.outline-item:hover .outline-text,
.outline-child:hover .outline-text {
  background-color: #f3f4f6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .outline-container {
    padding: 12px;
  }
  
  .level-1 .outline-text {
    font-size: 15px;
  }
  
  .level-2 .outline-text {
    font-size: 14px;
  }
  
  .level-3 .outline-text,
  .level-4 .outline-text {
    font-size: 13px;
  }
}
</style>