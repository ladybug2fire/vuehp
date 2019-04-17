<template>
  <div class="block">
    <br/>
    <el-tree
      :data="data"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </div>
</template>

<script>
  let id = 1000;
  export default {
    name: "step1tree",
    data() {
      const data = [
        {
          id: 1,
          label: '请输入评价目标',
        },
        {
          id: 2,
          label: '请输入评价准则',
        },
        {
          id: 3,
          label: '请输入评价方案',
        }
      ];
      return {
        data: JSON.parse(JSON.stringify(data))
      }
    },

    methods: {
      append(data) {
        const newChild = { id: id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
          <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加</el-button>
          <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
        </span>
        </span>);
      }

    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>

