<template>
  <div style="width: 500px; margin: 40px">
    <h2 style="text-align: center">修改用户信息</h2>
    <p style="text-align: center">tips:不想更改的属性请留空</p>
    <br />
    <div style="width: 100%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮件">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-col>
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.birth"
              style="width: 100%"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">更新</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Login from "./Login.vue";

export default {
  data() {
    return {
      form: {
        birth: "",
        email: "",
        id: -1,
        introduction: "",
        location: "",
        nickname: "",
        password: "",
        phoneNum: "",
        roles: [""],
        sex: null,
        username: "",
      },
    };
  },
  methods: {
    onSubmit() {
      // 过滤掉空值的字段
      const filteredForm = Object.keys(this.form)
        .filter(
          (key) =>
            this.form[key] !== "" &&
            this.form[key] !== null &&
            this.form[key] !== undefined
        )
        .reduce((obj, key) => {
          obj[key] = this.form[key];
          return obj;
        }, {});
        console.log(filteredForm)
      // this.$http({})
      //   .then((res) => {})
      //   .catch((err) => {});
    },
  },
};
</script>