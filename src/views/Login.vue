<template>
  <div class="login-container">
    <div class="nav">
      <switch-theme>
        <div class="theme">
          <svg-icon icon-class="theme" />
          <span>{{ $t('theme') }}</span>
        </div>
      </switch-theme>
      <switch-language>
        <div class="language">
          <svg-icon icon-class="language" />
          <span class="language-text">{{ $t('_') }}</span>
        </div>
      </switch-language>
    </div>
    <div class="container">
      <el-form :model="loginForm" ref="form" :rules="formRules">
        <h3 class="title">{{ $t('system_login') }}</h3>
        <el-form-item prop="username">
          <svg-icon icon-class="UserFilled" />
          <el-input v-model.trim="loginForm.username" @keyup.enter="onLogin" />
        </el-form-item>
        <el-form-item prop="password">
          <svg-icon icon-class="password" />
          <el-input v-model.trim="loginForm.password" :type="showPwd ? 'text' : 'password'" @keyup.enter="onLogin" />
          <svg-icon class="eye" :icon-class="showPwd ? 'eye-open' : 'eye'" @click="onShowPwd" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" class="login-btn" @click="onLogin">{{ $t('login') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import SparkMD5 from 'spark-md5'
import store from '@/store'
import { defineComponent, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FormInstance } from 'element-plus'
import { Lang } from '@/lang'
import { PwdLoginParams } from '@/interface/systemUser'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login'
})
</script>

<script lang="ts" setup>
import SwitchLanguage from '@/components/SwitchLanguage/index.vue'
import SwitchTheme from '@/components/SwitchTheme/index.vue'
const form = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
const redirect = route.query.redirect as string
const loading = ref<boolean>(false)

const loginForm = reactive<PwdLoginParams>({
  username: '',
  password: ''
})
const formRules = {
  username: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'username' }) }],
  password: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'password' }) }]
}
const showPwd = ref<boolean>(false)
function onShowPwd() {
  showPwd.value = !showPwd.value
}

function onLogin() {
  if (form.value) {
    form.value.validate((valid: boolean) => {
      if (!valid) return
      loading.value = true
      store.dispatch('user/pwdLogin', {
        username: loginForm.username,
        password: SparkMD5.hash(loginForm.password)
      }).then(() => {
        router.push({ path: redirect || '/' })
      }).finally(() => {
        loading.value = false
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  background-color: var(--login-bg);
  position: relative;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    transform: translate(-50%, -100%);
    .title {
      color: var(--login-title);
      font-size: 24px;
      text-align: center;
    }
    .svg-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-45%);
      font-size: 1.2em;
      color: var(--login-input-icon);
      z-index: 1;
      &:not(.eye) {
        left: 1em;
      }
      &.eye {
        right: 1em;
        cursor: pointer;
      }
    }
    :deep() .el-input {
      .el-input__wrapper {
        background-color: var(--login-input-bg);
        border: 1px solid var(--login-input-border);
        box-shadow: none;
        padding: 6px 15px 6px 3em;
        .el-input__inner {
          color: var(--login-input-color);
        }
      }
    }
    .login-btn {
      width: 100%;
    }
  }
  .nav {
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    .language,
    .theme {
      color: var(--login-title);
      .svg-icon {
        font-size: 16px;
        transform: translateY(3px);
      }
      &:hover {
        color: var(--el-color-primary-light-8);
      }
    }
    .theme {
      margin-right: 1em;
    }
  }
}
</style>
