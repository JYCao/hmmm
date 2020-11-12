<template>
  <div class='tag-container'>
    <!-- 头部查询 -->
    <el-card class="box-card">
      <!-- 学科名称输入框 -->
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="学科名称" prop="subjectName">
          <el-input v-model="form.subjectName"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- 清空按钮 -->
          <el-button size="small" @click="rForm">清除</el-button>
          <!-- 搜索按钮 -->
          <el-button size="small" type="primary" @click="hSearch" :disabled ="isLoading">搜索</el-button>
        </el-form-item>
        <el-form-item class="filter-item fr">
          <!-- 新增按钮 -->
          <el-button size="small" style="margin-left: 10px;" @click="haddSubject" type="success" icon="el-icon-edit">新增学科</el-button>
        </el-form-item>
      </el-form>
      <!-- / 头部查询 -->
      <!-- 数据总数 -->
      <el-alert :title="`数据一共${total}条`" type="info" show-icon>
      </el-alert>
      <!-- / 数据总数 -->
      <!-- 查询数据列表 -->
      <el-table v-loading="isLoading" :data="subjecList" style="width: 100%">
      <!-- <el-table-column align="center" width="50px" prop="id" label="序号"> </el-table-column> -->
      <!-- 列表序号 -->
      <el-table-column label="序号" width="50" align="center">
        <template scope="scope">
          <span>{{(form.page-1)*form.pagesize+(scope.$index + 1)}} </span>
        </template>
      </el-table-column>
      <!-- 列表学科名称 -->
      <el-table-column prop="subjectName" width="140px" label="学科名称" align="center">
      </el-table-column>
      <!-- 列表创建者 -->
      <el-table-column prop="username" width="120px" label="创建者" align="center">
      </el-table-column>
      <!-- 列表创建日期 -->
      <el-table-column align="center" width="160px" label="创建日期">
       <template slot-scope="scope">
          {{ scope.row.addDate | parseTimeByString}}
       </template>
      </el-table-column>
      <!-- 列表前台是否显示  二级目录数-->
      <el-table-column align="center"  width="120px" prop="isFrontDisplay" label="前台是否显示">
        <template slot-scope="scope">
          <span v-if="scope.row.isFrontDisplay==1">显示</span>
          <span v-else>不显示</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="120px" prop="twoLevelDirectory" label="二级目录">
      </el-table-column>
      <!-- 列表标签数量 题目数量  -->
      <el-table-column align="center" width="100px" prop="tags" label="标签"> </el-table-column>
      <el-table-column align="center" width="100px" prop="totals" label="题目数量"> </el-table-column>
      <el-table-column align="center" :fixed="false" fit="true" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="hCatalog(scope.row)">学科分类</el-button>
          <el-button type="text" size="mini" @click="hTag(scope.row)">学科标签</el-button>
          <el-button type="text" size="small" @click="hEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="hDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
      <!-- / 查询数据列表 -->
      <!-- 分页 -->
      <!--
        size-change : 每页条数size改变会触发
        current-change ： 当前页page改变会触发
        page-sizes : 每页显示个数选择器
        page-size : 每页显示数据的个数
       -->
      <el-pagination
        background
        :disabled="isLoading"
        @size-change="hSizeChange"
        @current-change="hPageChange"
        :current-page="Number(form.page)"
        :total="Number(total)"
        :page-size="Number(form.pagesize)"
        :page-sizes="[10,20,30, 50]"
        layout="sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- / 分页 -->
      <!-- 新增学科弹层 -->
      <el-dialog title="新增标签" :visible.sync="dialog" :before-close="handleClose" width="400px">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
          <!-- 所属学科 -->
          <el-form-item label="学科名称" prop="subjectName">
            <el-input class="subjectinput" v-model="addForm.subjectName"></el-input>
          </el-form-item>
          <!-- switch开关 -->
          <el-form-item label="是否显示">
            <el-switch v-model="addForm.isFrontDisplay" :active-value="1" :inactive-value="0"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <!-- 提交按钮 -->
          <el-form-item>
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="addSubject">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- / 新增标签弹层 -->
      <!-- 修改标签弹层 -->
      <el-dialog title="修改标签" :visible.sync="dialogVisible" :before-close="editClose" width="400px">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
          <!-- 所属学科 -->
          <el-form-item label="学科名称" prop="subjectName">
            <el-input class="subjectinput" v-model="editForm.subjectName"></el-input>
          </el-form-item>
          <!-- switch 按钮 -->
          <el-form-item label="是否显示">
          <el-switch v-model="editForm.isFrontDisplay"  :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <!-- 提交按钮 -->
          <el-form-item>
            <el-button @click="editClose">取 消</el-button>
            <el-button type="primary" @click="editSubject">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 修改标签弹层 -->
    </el-card>
  </div>
</template>

<script>
import { list, remove, add, update } from '@/api/hmmm/subjects'
export default {
  name: 'subject',
  data () {
    return {
      // 查询数据
      form: {
        subjectName: '', // 查询的学科
        page: 1, // 默认页码
        pagesize: 10 // 默认显示条数
      },
      // 新增学科数据项
      addForm: {
        subjectName: '', // 新增的学科
        isFrontDisplay: 1// 是否显示在页面上
      },
      // 修改学科数据项
      editForm: {
        id: '', // 修改的学科的id
        subjectName: '', // 修改的学科
        isFrontDisplay: 1 // 是否显示在页面上
      },
      // 表单验证
      rules: {
        subjectName: [
          { required: true, message: '请输入学科名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]

      },
      dialogVisible: false, // 修改弹框是否显示
      dialog: false, // 新增弹框是否显示
      total: 0, // 数据总数
      subjecList: [], // 学科查询列表
      isLoading: false // 是否加载状态
    }
  },
  created () {
    this.loadSubject()
  },

  methods: {
    // 请求列表
    async loadSubject () {
      this.isLoading = true // 开启加载状态
      // 获取查询条件
      const data = {
        // replaceAll(' ', '') 去除字符串中的空格
        subjectName: this.form.subjectName.replaceAll(' ', ''),
        page: this.form.page,
        pagesize: this.form.pagesize
      }
      try {
        const res = await list(data)
        // console.log('学科列表', res)
        this.subjecList = res.data.items
        this.total = res.data.counts // 数据总数
        this.isLoading = false // 关闭加载状态
      } catch (err) {
        console.log(err)
      }
    },
    // 学科查询
    hSearch () {
      this.form.page = 1 // 查询后页面跳到第一页
      this.loadSubject()
    },
    // 清除
    rForm () {
      this.form.subjectName = ''
      this.loadSubject()
    },
    // 新增学科
    haddSubject () {
      this.dialog = true // 开启弹框
    },
    // 询问取消新增
    handleClose (done) {
      if (this.addForm.subjectName !== '') {
        this.$confirm('有数据未提交，确定关闭吗').then(() => {
        // function(done)，done 用于关闭 Dialog
          done()
          console.info("点击右上角 'X' ，取消按钮或遮罩层时触发")
        }).catch(() => {
          console.log('点击确定时触发')
        })
        this.$refs.addForm.resetFields()
      } else {
        this.dialog = false
        this.$refs.addForm.resetFields()
      }
    },
    // 新增表单验证
    addSubject () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.doaddSubject()
          // alert(123)
        }
      })
    },
    // 点击确定新增
    async doaddSubject () {
      try {
        const res = await add(this.addForm)
        this.$message.success('新增成功')
        this.addForm.subjectName = '' // 新增成功清空学科输入框
        this.addForm.isFrontDisplay = 1 // 新增成功恢复显示初始数据
        console.log(res)
        this.dialog = false
        this.form.page = 1
        this.loadSubject()
      } catch (err) {
        // console.log(err)
        this.$message.error('新增失败')
      }
    },
    // 学科分类跳转地址
    hCatalog (row) {
      this.$router.push({
        path: '/subjects/directorys?',
        query: {
          id: row.id,
          name: row.subjectName
        }
      })
    },
    // 学科标签跳转地址
    hTag (row) {
      this.$router.push({
        path: '/subjects/tags?',
        query: {
          id: row.id,
          name: row.subjectName
        }
      })
    },
    // 修改
    hEdit (row) {
      this.dialogVisible = true
      // console.log('修改行学科数据', row)
      this.editForm.id = row.id
      this.editForm.subjectName = row.subjectName
    },
    // 修改x和取消
    editClose () {
      this.dialogVisible = false
      this.$refs.editForm.resetFields()
    },
    // 修改表单验证
    editSubject  () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.doeditSubject()
        }
      })
    },
    // 点击确认修改
    async doeditSubject () {
      try {
        const res = await update(this.editForm)
        this.editForm = res
        // console.log('学科修改', res)
        this.$message.success('修改成功')
        this.editForm.subjectName = ''
        this.loadSubject()
        this.dialogVisible = false
      } catch (err) {
        console.log(err)
        this.$message.error('修改失败')
      }
    },
    // 删除
    hDel (row) {
      this.$confirm('此操作将永久删除该标签 ' + ', 是否继续?', '提示', { type: 'warning' })
        .then(async () => {
          console.log('你要删除的id是', row.id)
          try {
            const res = await remove({ id: row.id })
            console.log(res)
            this.$message.success('删除成功!')
            this.loadSubject()
          } catch (err) {
            console.log(err)
            this.$message.error('删除失败!')
          }
        }).catch(() => {
          this.$message.info('已取消操作!')
        })
    },
    // 每页显示信息条数
    hSizeChange (val) {
      this.form.pagesize = val
      if (this.form.page === 1) {
        this.loadSubject(this.form)
      }
    },
    // 进入某一页
    hPageChange (page) {
      this.form.page = page
      console.log('当前页码', page)
      this.loadSubject()
    }
  }
}
</script>

<style scoped>
.fr {
  float:right;
}
.subjectinput {
  width: 200px;
}
</style>
