<template>
  <div class='tag-container'>
    <!-- 头部查询 -->
    <el-card class="box-card">
      <div slot="header" v-if="isshow">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item  :to="{ path: '/subjects/list' }"><span style="color:black">学科管理</span></el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>标签管理</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="标签名称" prop="tags">
          <el-input v-model="form.tags"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请输入">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="rForm">清除</el-button>
          <el-button size="small" type="primary" @click="hSearch" :disabled="isLoading">查询</el-button>
        </el-form-item>
        <el-form-item class="filter-item fr">
          <el-button type="text" size="small" v-if="isshow" @click="$router.back()" icon="el-icon-back">返回学科</el-button>
          <el-button size="small" style="margin-left: 10px;" @click="haddTag" type="success" icon="el-icon-edit" :disabled="isLoading">新增标签</el-button>
        </el-form-item>
      </el-form>
      <!-- / 头部查询 -->
      <!-- 数据总数 -->
      <el-alert :title="`数据一共${total}条`" type="info" show-icon></el-alert>
      <!-- / 数据总数 -->
      <!-- 查询数据列表 -->
      <el-table v-loading="isLoading" :data="tagList" style="width: 100%">
      <!-- <el-table-column align="center" prop="id" label="序号"> </el-table-column> -->
       <el-table-column label="序号" width="50" align="center">
          <template scope="scope">
            <span>{{(form.page-1)*form.pagesize+(scope.$index + 1)}} </span>
          </template>
        </el-table-column>
      <el-table-column prop="subjectName" label="所属学科" align="center"> </el-table-column>
      <el-table-column prop="tagName" label="标签名称" align="center"> </el-table-column>
      <el-table-column align="center" prop="username" label="创建者"> </el-table-column>
      <el-table-column align="center" label="创建日期">
       <template slot-scope="scope">
          {{ scope.row.addDate | parseTimeByString}}
       </template>
      </el-table-column>
      <el-table-column align="center" prop="state" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">已启用</span>
          <span v-else>已禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :fixed="false" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="hStatus(scope.row)">
            <span v-if="scope.row.state==0">启用</span>
            <span v-else >禁用</span>
          </el-button>
          <el-button type="text" size="small" @click="hEdit(scope.row)" :disabled="scope.row.state==1" >修改</el-button>
          <el-button type="text" size="small" @click="hDel(scope.row)" :disabled="scope.row.state==1">删除</el-button>
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
            layout="sizes, prev, pager, next, jumper"
          ></el-pagination>
      <!-- / 分页 -->
      <!-- 新增标签弹层 -->
      <el-dialog title="新增标签" :visible.sync="dialog" :before-close="handleClose" width="400px">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
          <!-- 所属学科 -->
          <el-form-item label="所属学科" prop="SubjectName">
            <!-- <el-input class="taginput" v-model="addForm.SubjectName"></el-input> -->
            <el-select v-model="addForm.subjectID" class="taginput" placeholder="请选择">
            <el-option v-for="sName in sNameList" :key="sName.value" :label="sName.label" :value="sName.value"></el-option>
          </el-select>
          </el-form-item>
          <!--/ 所属学科 -->
          <el-form-item label="标签名称" prop="tagName">
            <el-input v-model="addForm.tagName" class="taginput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="addTag">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- / 新增标签弹层 -->
      <!-- 修改标签弹层 -->
      <el-dialog title="修改标签" :visible.sync="dialogVisible" :before-close="editClose" width="400px">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
          <!-- 所属学科 -->
          <el-form-item label="所属学科" prop="SubjectName">
            <!-- <el-input class="taginput" v-model="addForm.SubjectName"></el-input> -->
            <el-select v-model="editForm.subjectID" class="taginput" placeholder="请选择">
            <el-option v-for="sName in sNameList" :key="sName.value" :label="sName.label" :value="sName.value"></el-option>
          </el-select>
          </el-form-item>
          <!--/ 所属学科 -->
          <el-form-item label="标签名称" prop="tagName">
            <el-input v-model="editForm.tagName" class="taginput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="editClose">取 消</el-button>
            <el-button type="primary" @click="editTag">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- / 修改标签弹层 -->
    </el-card>
  </div>
</template>

<script>
import { status } from '@/api/hmmm/constants'
import { list, add, changeState, remove, update } from '@/api/hmmm/tags'
import { simple } from '@/api/hmmm/subjects'
export default {
  name: 'Tags',
  data () {
    return {
      isLoading: false, // 加载状态
      isshow: false, // 返回学科按钮隐藏
      sNameList: [], // 所有的学科
      addForm: {
        subjectID: '', // 当选选中的学科ID
        tagName: '' // 新增标签名
      },
      editForm: {
        id: '', // 当前数据的id
        subjectName: '', // 当选选中的学科名称
        subjectID: '', // 当选选中的学科ID
        tagName: '' // 修改标签名
      },
      dialogVisible: false, // 是否显示弹层
      dialog: false,
      total: 0, // 数据总数
      form: {
        tags: '', // 标签名称
        state: null,
        page: 1,
        pagesize: 10,
        subjectName: '',
        subjectID: ''
      },
      tagList: [], // 标签查询列表
      rules: {
        tagName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]

      }
    }
  },
  created () {
    this.loadTags() // 获取标签列表
    // 获取学科列表
    this.loadSname()
    this.getPath()
  },
  computed: {
    status () {
      return status
    }
  },
  watch: {
    '$route' () {
      this.getPath()
    }
    // 'addForm.tagName': {
    //   handler (val, oldval) {
    //     if (val !== oldval) {
    //       // console.log(123)
    //       // this.handleClose()
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    // 获取学科
    async loadSname () {
      try {
        const res = await simple()
        this.sNameList = res.data
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取列表数据
    async loadTags () {
      this.isLoading = true
      // this.isDisable = false
      // this.form.subjectName = this.$route.query.name
      const data = {
        page: this.form.page,
        pagesize: this.form.pagesize,
        subjectName: this.form.subjectName,
        subjectID: this.form.subjectID,
        tagName: this.form.tags.replaceAll(' ', ''),
        state: this.form.state
      }
      // console.log('1234', data.subjectName)
      try {
        const res = await list(data)
        this.total = res.data.counts
        // console.log('获取标签列表数据', res)
        this.tagList = res.data.items
        // console.log('1234', res.data.subjectName)
        this.isLoading = false
      } catch (err) {
        console.log(err)
      }
    },
    // 按钮显示
    showBtn () {
      if (this.$route.query.id) {
        this.isshow = true
        // console.log(345677)
      } else {
        this.isshow = false
      }
    },
    // 跳转
    getPath () {
      this.form.subjectID = this.$route.query.id
      this.showBtn()
      // 1. 重置页码
      this.form.page = 1
      // 2. 刷新页面
      this.loadTags()
    },
    // 查询
    hSearch () {
      // 1. 重置页码
      this.form.page = 1
      // 2. 刷新页面
      this.loadTags()
    },
    // 清除
    rForm () {
      this.form.tags = ''
      this.form.state = null
      this.loadTags()
    },
    // 更改状态
    async hStatus (val) {
      val.state = val.state === 0 ? 1 : 0
      console.log('val', val)
      try {
        const res = await changeState({ id: val.id, state: val.state })
        console.log(res)
        this.$message.success('已成功修改状态！')
        this.loadTags()
      } catch (err) {
        console.log('修改状态失败原因', err)
        this.$message.error('修改状态失败!')
      }
    },
    // 修改
    hEdit (row) {
      this.dialogVisible = true
      console.log(row)
      this.editForm.tagName = row.tagName
      this.editForm.subjectID = row.subjectID
      this.editForm.id = row.id
    },
    // 修改x和取消
    editClose () {
      this.dialogVisible = false
      this.$refs.editForm.resetFields()
    },
    // 修改的表单验证
    editTag () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.doeditTag()
        }
      })
    },
    // 点击确认修改
    async doeditTag () {
      console.log(this.editForm.id)
      try {
        const res = await update(this.editForm)
        this.editForm = res
        console.log(res)
        this.$message.success('修改成功')
        this.loadTags()
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
            this.loadTags()
          } catch (err) {
            console.log(err)
            this.$message.error('删除失败!')
          }
        }).catch(() => {
          this.$message.info('已取消操作!')
        })
    },
    // 点击新增
    haddTag () {
      this.dialog = true
    },
    // 询问取消新增
    handleClose (done) {
      if (this.addForm.tagName !== '' || this.addForm.subjectID !== '') {
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
    //
    // 新增表单验证
    addTag () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.doaddTag()
          // alert(123)
        }
      })
    },
    // 确定新增
    async doaddTag () {
      try {
        // const { subjectName, tagName } = this.addForm
        const res = await add(this.addForm
        )
        this.$message.success('新增成功')
        console.log(res)
        this.addForm.subjectID = '' // 添加成功清空学科ID
        this.addForm.tagName = '' // 添加成功清空标签名
        this.form.page = 1
        this.loadTags() // 新增成功刷新页面
        this.dialog = false
      } catch (err) {
        this.$message.error('新增失败')
      }
    },
    // 每页显示信息条数
    hSizeChange (val) {
      this.form.pagesize = val
      if (this.form.page === 1) {
        this.loadTags(this.form)
      }
    },
    // 进入某一页
    hPageChange (page) {
      this.form.page = page
      console.log('当前页码', page)
      this.loadTags()
    }
  }

}
</script>

<style >
.fr {
  float:right;
}
.taginput {
  width: 200px;
}
</style>
