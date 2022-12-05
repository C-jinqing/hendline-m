<template>
  <div class="login-container">
    <van-nav-bar title="登录" class="page-nav-bar" />
    <van-form @submit="onSubmit" ref="buttonCode">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userImformation.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>

      <van-field
        center
        clearable
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userImformation.code"
        type="number"
        maxlength="6"
      >
        <template #button>
          <van-count-down
            :time="1000 * 10"
            v-if="isCountDownShow"
            format="ss"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            size="small"
            round
            native-type="button"
            @click="onSendCode"
            >发送验证码</van-button
          >
        </template>
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
      </van-field>
      <div style="margin: 16px">
        <van-button class=".buttonLogin" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/login'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 短信验证码
      },
      userImformation: {
        mobile: [
          { required: true, message: '请填写手机号' },
          {
            pattern:
              /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
            message: '请输入正确的手机格式'
          }
        ],
        code: [
          { required: true },
          { pattern: /^\d{6}$/, message: '请填写正确的验证码格式' }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit () {
      const user = this.user
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const res = await login(user)
        console.log(res)
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登陆成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号码或验证码错误')
        } else {
          this.$toast.fail('登陆失败')
        }
      }
    },

    async onSendCode () {
      try {
        await this.$refs.buttonCode.validate('mobile')
        this.isCountDownShow = true
      } catch (err) {
        console.log('验证失败', err)
      }
      // 发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast.success('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送频繁，请稍后尝试')
        } else {
          this.$toast('发送失败')
        }
      }
    }
  }
}
</script>

<style>
.van-field__button .van-button {
  background-color: #ededed;
}
.van-button--info {
  background-color: #6db4fb;
  border: none;
}
</style>
