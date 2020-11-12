<template>
  <el-card class="box-card">
    <!-- 表单搜索区
      inline: 行内表单样式
    -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="formInline.keyword" placeholder="根据文章标题搜索"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.state" placeholder="请选择">
          <el-option label="禁用" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  size="small" @click="onRemove">清除</el-button>
        <el-button  size="small" type="primary" @click="onSubmit" :loading="isloading">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right">
      <!-- 添加文章区
        append-to-body：让弹框显示在body标签的上层    :visible.sync：是否弹出        options：富文本编辑器配置对象
      -->
      <el-button size="small" type="success" @click="hClickAdd"><i class="el-icon-edit"></i>新增技巧</el-button>
        <el-dialog append-to-body title="新增文章" :visible.sync="dialogAddForm" width="60%">
          <el-form ref="addForm" :rules="ruleInline" :model="form">
            <el-form-item label="文章标题：" :label-width="formLabelWidth" prop="title">
              <el-input v-model.trim="form.title"></el-input>
            </el-form-item>
            <el-form-item label="文章内容：" :label-width="formLabelWidth" prop="articleBody">
              <quill-editor v-model="form.articleBody" :options="editorOption"></quill-editor>
            </el-form-item>
            <el-form-item label="视频地址：" :label-width="formLabelWidth">
              <el-input v-model.trim="form.videoURL" placeholder="请输入视频地址"></el-input>
            </el-form-item>
            <el-form-item style="text-align: right;">
              <el-button @click="hCancel">取 消</el-button>
              <el-button type="primary" @click="hAppendArticle">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-form-item>
    </el-form>
    <!-- 显示数据条 -->
    <h5 class="dataRow">
      <i class="el-icon-info"></i>
      数据一共 {{counts}} 条
    </h5>
    <!-- 表格数据区 -->
    <el-table
      class="tableData"
      :data="articles"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        prop="index"
        label="序号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        label="文章标题"
        align="center"
        width="300">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
          <i class="el-icon-film" v-show="scope.row.videoURL" @click="hVideo(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="visits"
        align="center"
        label="阅读数"
        width="120">
      </el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="录入人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="录入时间"
        width="150">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTimeByString}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        align="center"
        label="状态"
        width="120">
        <!-- 状态自定义模板 -->
        <template slot-scope="scope">
          <!-- 0-已禁用，1-已启用 -->
          <!-- {{scope.row.status}} -->
          <el-tag v-if="scope.row.state===0" type="info">已禁用</el-tag>
          <el-tag v-else-if="scope.row.state===1">已启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="operation"
        label="操作">
        <!-- 操作自定义模板  -->
        <template slot-scope="scope">
          <!-- 预览文章区 -->
          <el-button type="text" @click="hPreview(scope.row.id)">预览</el-button>
          <!-- 状态切换 -->
          <el-button type="text" @click="hArticleState(scope.row)">
            <span v-if="scope.row.state===1">禁用</span>
            <span v-else>启用</span>
          </el-button>
          <!-- 编辑修改区 -->
          <!-- <el-button type="text">修改</el-button> -->
          <el-button :disabled="scope.row.state===1" type="text" @click="hEdit(scope.row.id)">修改</el-button>
          <!-- 删除文章区 -->
          <el-button :disabled="scope.row.state===1"  type="text" @click="hDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区
      size-change: 每页条数发生变化时触发
      current-change： 当前页发生变化时触发
      page-sizes：每页显示个数选择器的选项设置
      page-size： 每页显示的条数
    -->
    <el-pagination
      style="margin-top: 50px"
      @size-change="hSizeChange"
      @current-change="hPageChange"
      :current-page="Number(curPage)"
      :page-sizes="[10, 5, 3, 2]"
      :page-size="Number(pagesize)"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Number(counts)">
    </el-pagination>
    <!-- 文章预览弹窗 -->
    <el-dialog append-to-body title="预览文章" :visible.sync="dialogTableVisible" width="60%">
      <el-card
        shadow="never"
        class="box-card"
        body-style="padding: 20px 8px; background-color: #F5F5F5;">
        <div slot="header" class="el-card__header">
          <h2>{{rowPreview.title}}</h2>
          <p>
            <span style="margin-right: 5px">{{rowPreview.createTime | parseTimeByString}}</span>
            <span style="margin-right: 5px">超级管理员</span>
            <span>
              <i class="el-icon-view" style="margin-right: 5px"></i>{{rowPreview.visits}}
            </span>
          </p>
        </div>
        <div class="el-card__body" v-html="rowPreview.articleBody"></div>
      </el-card>
    </el-dialog>
    <!-- 文章修改弹窗 -->
    <el-dialog append-to-body title="修改文章" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="form" :rules="ruleInline" :model="rowPreview">
        <el-form-item el-form-item label="文章标题：" :label-width="formLabelWidth" prop="title">
          <el-input v-model.trim="rowPreview.title"></el-input>
        </el-form-item>
        <el-form-item label="文章内容：" :label-width="formLabelWidth" prop="articleBody">
          <quill-editor v-model="rowPreview.articleBody" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="视频地址：" :label-width="formLabelWidth">
          <el-input v-model="rowPreview.videoURL" placeholder="请输入视频地址"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button @click="hCancel">取 消</el-button>
          <el-button type="primary" @click="hSaveArticle">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 视频弹窗 -->
    <div class="video-preview">
      <el-dialog
        :visible.sync="centerDialogVisible"
        @open="hOpen"
        @close="hClose"
        center>
        <div class="box">
        <video :src="videoUrl" autoplay loop id="video"></video>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
// 导入时间过滤器
// eslint-disable-next-line no-unused-vars
import { parseTimeByString } from '@/filters/index.js'
// 导入富文本样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入富文本组件
import { quillEditor } from 'vue-quill-editor'
// 引入获取文章列表数据接口
import { list, detail, changeState, update, remove, add } from '@/api/hmmm/articles.js'
export default {
  components: {
    // 注册富文本
    quillEditor
  },
  data () {
    return {
      // 表单验证
      ruleInline: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        articleBody: [
          { required: true, message: '文章内容不能为空', trigger: 'blur' }
        ]
      },
      isloading: false, // loading加载状态
      pagesize: 10, // 每页多少条
      counts: 0, // 当前文章的总条数
      curPage: 1, // 当前要查询的页码
      dialogTableVisible: false, // 预览弹框
      dialogFormVisible: false, // 编辑弹框
      dialogAddForm: false, // 添加弹框
      videoUrl: '', // 弹窗中视频地址
      centerDialogVisible: false, // 视频弹框
      formLabelWidth: '120px',
      // 添加文章
      form: {
        title: '', // 标题
        articleBody: '', // 内容
        videoURL: '' // 视频地址
      },
      // 查询文章表单数据
      formInline: {
        keyword: null, // 关键字
        state: null // 状态
      },
      articles: [], // 文章列表数据
      rowPreview: {}, // 每行的数据
      // isEnable: false
      // 富文本配置对象
      editorOption: {
        // 占位配置
        placeholder: '',
        modules: {
        // 配置工具栏
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    // 视频播放功能
    hVideo (row) {
      this.centerDialogVisible = true
      console.log(row)
      this.videoUrl = row.videoURL
    },
    hOpen () {
      document.getElementById('video')
    },
    hClose () {
      // alert('1')
      document.getElementById('video').pause()
    },
    // 分页功能
    hPageChange (curPage) {
      // console.log(curPage)
      // 更新当前页码
      this.curPage = curPage
      // 发送请求
      this.loadArticles()
    },
    hSizeChange (val) {
      // 查询结果显示的当前页码为第一页
      this.curPage = 1
      this.pagesize = val
      this.loadArticles()
    },
    // 添加文章功能
    hClickAdd () {
      // 1. 点击弹出弹框
      this.dialogAddForm = true
    },
    hAppendArticle () {
      // 2. 表单验证
      this.$refs.addForm.validate((valid) => {
        console.log(valid)
        if (valid) {
          this.loadAddArticle()
        } else {
          return false
        }
      })
    },
    async loadAddArticle () {
      // 3. 发送请求添加文章
      try {
        // 修改成功后的代码
        await add(this.form)
        this.$message.success('添加成功')
        // 3-1  清空表单
        this.$refs.addForm.resetFields()
        // 3-2  关闭弹框
        this.dialogAddForm = false
        // 3-3  重发请求
        this.loadArticles()
      } catch (err) {
        // 修改失败后的代码
        console.log(err)
        this.$message.error('添加失败')
        this.dialogAddForm = false
      }
    },
    // 删除文章功能
    hDelete (row) {
      // 获取要删除的文章Id
      const id = row.id
      // console.log('要删除的文章id是', id)
      // 提示用户是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        // 2. 发送请求删除文章
        remove({ id }).then(res => {
          // 删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadArticles()
        })
      }).catch(() => {
        // 删除失败
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑文章功能
    async hEdit (idx) {
      // 1. 弹出弹框
      this.dialogFormVisible = true
      // 2. 发送请求获取当前文章的数据
      const res = await detail({ id: idx })
      console.log(res)
      // 3. 保存数据，将数据渲染到表单
      this.rowPreview = res.data
    },
    hSaveArticle () {
      // 4. ref 验证
      this.$refs.form.validate(async (valid) => {
        console.log(valid)
        if (valid) {
          // 5. 发送请求修改文章
          try {
            // 修改成功后的代码
            const res = await update(this.rowPreview)
            console.log(res)
            this.$message.success('修改成功')
            this.dialogFormVisible = false
          } catch (err) {
            // 修改失败后的代码
            console.log(err)
            this.$message.error('修改失败')
            this.dialogFormVisible = false
          }
        } else {
          return false
        }
      })
    },
    hCancel () {
      // 关闭弹框
      this.dialogFormVisible = false
      this.dialogAddForm = false
    },
    // 文章状态切换
    async hArticleState (row) {
      // 1. 点击改变状态
      row.state = row.state === 0 ? 1 : 0
      // 2. 发送请求
      try {
        // 修改成功后的代码
        const res = await changeState({ id: row.id, state: row.state })
        console.log(res)
        this.$message.success('操作成功')
        this.dialogFormVisible = false
      } catch (err) {
        // 修改失败后的代码
        console.log(err)
        this.$message.error('操作失败')
        this.dialogFormVisible = false
      }
    },
    // 文章预览功能
    async hPreview (idx) {
      // 1. 弹出弹框
      this.dialogTableVisible = true
      // 2. 发送请求
      const res = await detail({ id: idx })
      // console.log(res)
      // 3. 把数据显示到页面
      this.rowPreview = res.data
    },
    // 获取文章列表数据
    async loadArticles () {
      // 0. 更改loading
      this.isloading = true
      // 1. 拼接查询参数
      const { keyword, state } = this.formInline
      // 2. 发送ajax请求
      const res = await list({ page: this.curPage, pagesize: this.pagesize, keyword, state })
      // console.log(res)
      // 3. 把数据渲染到页面
      this.articles = res.data.items
      // 更新总条数
      this.counts = res.data.counts
      // 4. 更改loading
      this.isloading = false
    },
    // 文章查询功能
    async onSubmit () {
      // 查询结果显示的当前页码为第一页
      this.curPage = 1
      // 发送请求
      this.loadArticles()
    },
    // 清除表单
    onRemove () {
      this.formInline.keyword = null
      this.formInline.state = null
      this.loadArticles()
    }
  }
}
</script>
<style scoped lang='less'>
.box-card {
  margin: 10px;
}
.dataRow {
  padding: 8px;
  background-color: #F4F4F5;
  color: #8F9399;
  border-radius: 3px;
}
.box-card /deep/ {
  margin: 0;
  border: none;
}
/deep/ .el-card__header  {
  padding: 0;
  border-bottom:  1px dashed #cccccc;
  h2 {
    color: #5F6266;
  }
}
.el-card__body /deep/ {
  padding: 0;
}

// 富文本样式
// 在父组件中去设置子组件的样式，加上/deep/ 实现穿透功能
.quill-editor /deep/ .ql-editor{
  height: 200px;
}
.quill-editor /deep/ .ql-toolbar.ql-snow{
  padding: 0 8px;
}

.video-preview ::v-deep .el-dialog__body {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0,0,0,.3);
  width: 100%;
  height: 100%;
  overflow: hidden;
  .box {
    width: 800px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    video {
      width: 100%;
      height: 100%;
      z-index: 999;
    }
  }
}
.video-preview ::v-deep .el-dialog__header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color:  rgba(0,0,0,.3);
  z-index: 9;
  // .el-dialog__title {
  //   background-color: rgba(0,0,0,0);
  //   width: 100%;
  // height: 100%;
  // }
  .el-dialog__headerbtn   {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 30px;
    left: 50%;
    z-index: 9999;
    // -webkit-transform: translate(-50%);
    transform: translate(-50%);
    background: rgba(0,0,0,.4);
    // -webkit-box-shadow: 0 0 5px rgba(0,0,0,.4);
    box-shadow: 0 0 5px rgba(0,0,0,.4);
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
  }
}

</style>
