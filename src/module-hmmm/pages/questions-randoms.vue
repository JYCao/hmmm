<template>
  <div class='container'>
    <el-card class="box-card">

      <!-- 搜索框 -->
      <el-form ref="form" label-width="80px" style="">
        <el-form-item label="关键字">
          <el-input  placeholder="根据编号搜索" style="width: 21%" v-model="params.keyword" type="" size="small"></el-input>
          <div style="float: right">
            <el-button @click="hClear" size="small">清除</el-button>
            <el-button @click="hSearch" size="small" type="primary">搜索</el-button>
          </div>
        </el-form-item>
      </el-form>

      <!-- 提示总条数 -->
      <el-alert
        :title="amount"
        type="info"
        show-icon
        :closable="false">
      </el-alert>

      <!-- 内容  -->
      <el-table :data="data" style="margin-top: 15px">

        <!-- 序号 -->
        <el-table-column align="center" label="序号" width="80px">
          <template scope="scope">
            <span>{{(params.page-1)*params.pagesize+(scope.$index+1)}}</span>
          </template>
        </el-table-column>

        <!-- 编号 -->
        <el-table-column align="center" prop="id" label="编号" width="230px">
        </el-table-column>

        <!-- 题型 -->
        <el-table-column align="center" prop="1" label="题型" width="80px">
          <template slot-scope="scope">
            <!-- 判断题型选项 -->
            <div v-if="scope.row.questionType == 1">单选</div>
            <div v-else-if="scope.row.questionType == 2">多选</div>
            <div v-else-if="scope.row.questionType == 3">简答</div>
          </template>
        </el-table-column>

        <!-- 题目编号 -->
        <el-table-column align="center" label="题目编号" width="230px">
          <template slot-scope="scope">
            <!-- 循环遍历渲染数据 -->
            <div v-for="(item,index) in scope.row.questionIDs" :key="index">
              <a @click="titleNumber(item.id)" href="javascript:;" style="color: rgb(0, 153, 255)">
                {{item.number}}
              </a>
            </div>
          </template>
        </el-table-column>

        <!-- 录入时间 -->
        <el-table-column align="center" prop="addTime" label="录入时间"  width="230px">
        </el-table-column>

        <!-- 答题时间 -->
        <el-table-column align="center" prop="totalSeconds" label="答题时间(s)" width="230px">
        </el-table-column>

        <!-- 正确率 -->
        <el-table-column align="center" prop="accuracyRate" label="正确率(%)" width="230px">
        </el-table-column>

        <!-- 录入人 -->
        <el-table-column align="center" prop="userName" label="录入人">
        </el-table-column>

        <!-- 删除操作 -->
        <el-table-column align="center" label="操作" width="80px">
          <template slot-scope="scope">
            <el-button
              title="删除"
              icon="el-icon-delete"
              plain
              circle
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹框 -->
      <el-dialog
        destroy-on-close
        style="padding: 10px"
        title="题目预览"
        width="48%"
        :visible.sync="centerDialogVisible">

        <!-- 子组件 -->
        <questions-randoms :result="res"></questions-randoms>

        <!-- 关闭按钮 -->
        <span slot="footer">
          <el-button type="primary" @click="centerDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          :current-page="params.page"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 50, 100]"
          background
          @current-change="change"
          :page-size="params.pagesize"
          layout=" prev, pager, next, sizes,jumper"
          :total="counts">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>

<script>
import { removeRandoms, randoms, detail } from '@/api/hmmm/questions.js'

export default {
  data () {
    return {
      params: {
        // 当前页码
        page: 1,
        // 当前页大小
        pagesize: 10,
        // 搜索的关键字
        keyword: ''
      },
      centerDialogVisible: false, // 弹框默认不显示
      counts: 0, // 总记录数
      data: [], // 保存表单的数据
      amount: '', // 提示的总条数(一段文字)
      res: '' // 保存数据，传给子组件
    }
  },

  created () {
    this.loadList()
  },

  methods: {

    // 弹出层
    async titleNumber (id) {
      // 点击后显示弹框
      this.centerDialogVisible = !this.centerDialogVisible
      // 发请求拿数据传给子
      const res = await detail({ id: id })
      // 保存数据
      this.res = res.data
    },

    // 搜索关键字
    hSearch () {
      // 如果搜索框为空，终止操作
      if (this.keyword === '') {
        return
      }
      this.params.keyword = this.params.keyword.replaceAll(' ', '')
      // 重新发送请求渲染页面
      this.loadList()
      // 重置当前页码为第一页
      this.params.page = 1
    },

    // 点击清除按钮
    hClear () {
      // 清空input表单的数据
      this.params.keyword = ''
      // 重新发送请求渲染页面
      this.loadList()
      // 重置当前页码为第一页
      this.params.page = 1
    },
    // 点击删除，传出id
    handleDelete (row) {
      // 提示是否选择删除
      this.$confirm('确定删除', '提示', { type: 'warning' }).then(() => {
        // 点击确定后传入id值,去执行ajax请求
        this.doDelete(row.id)
      }).catch(() => {
        // 取消删除
      })
    },

    // 接收传入的id值
    async doDelete (idObj) {
      try {
        // 讲id传入ajax请求中
        const res = await removeRandoms({ id: idObj })
        console.log(res)
        this.$message.success('删除成功') // 提示
        // 删除成功重新发请求渲染页面
        this.loadList()
      } catch (err) {
        this.$message.error('删除失败') // 提示
      }
    },

    // 每页条数选项
    handleSizeChange (pagesize) {
      // 选择每页显示条数然后重新赋值
      this.params.pagesize = pagesize
      // 重置当前页码为第一页
      this.params.page = 1
      // 重新发送请求渲染数据
      this.loadList()
    },

    // 发请求拿数据
    async loadList () {
      try {
        const res = await randoms(this.params) // ajax请求时传出去
        this.counts = res.data.counts // 总记录数
        this.data = res.data.items // 保存数据
        this.amount = `数据一共${this.counts}条` // 提示总条数(一段文字)
      } catch (err) {
        console.log(err)
      }
    },

    // 点击页码切换
    change (page) {
      // 设置当前页码为点击后的页码
      this.params.page = page
      // 重新渲染页面
      this.loadList()
    }
  }
}
</script>

<style>

.container {
  margin: 10px
}

.block {
  float: right;
  margin: 20px 0;
  text-align: center;
}

</style>
