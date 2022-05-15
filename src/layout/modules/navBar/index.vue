<template>
  <div class="navbar">
    <div class="navbar-left">
      <svg-icon icon-class="expand" :class="{fold: sidebarOpened}" @click="toggleSidebar" />
      <el-breadcrumb>
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in menuLevel" :key="index">
            <span>{{ $t(`menu.${item}`, item) }}</span>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
    <div class="navbar-right">
      <switch-theme>
        <svg-icon icon-class="theme" />
      </switch-theme>
      <switch-language>
        <svg-icon icon-class="language" />
      </switch-language>
      <el-dropdown trigger="click" popper-class="dropdown-class">
        <div class="avatar-container">
          <el-avatar shape="square" :src="userInfo.avatar" fit="fill">{{userInfo.username}}</el-avatar>
          <svg-icon icon-class="caret-bottom" class="svg-icon" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="refreshInfo">{{ $t('refresh_info') }}</el-dropdown-item>
            <el-dropdown-item divided @click="openUserInfo">{{ $t('personal_information') }}</el-dropdown-item>
            <el-dropdown-item @click="onModifyPwd">{{ $t('modify_password') }}</el-dropdown-item>
            <el-dropdown-item divided @click="onLogout">{{ $t('logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <form-dialog ref="userInfoForm" v-slot="{row}" @save="userInfoSave">
      <el-form-item :label="$t('avatar')">
        <upload v-model="row.avatar" :width="60" :height="60" />
      </el-form-item>
      <el-form-item :label="$t('username')">
        <el-input v-model="row.username" disabled />
      </el-form-item>
      <el-form-item :label="$t('name')">
        <el-input v-model="row.name" disabled />
      </el-form-item>
      <el-form-item :label="$t('mobile')">
        <el-input v-model="row.mobile" />
      </el-form-item>
      <el-form-item :label="$t('email')">
        <el-input v-model="row.email" />
      </el-form-item>
    </form-dialog>

    <form-dialog ref="modifyPwdForm" :rules="modifyPwdRules" v-slot="{row}" @save="modifyPwdSave">
      <el-form-item :label="$t('old_password')" prop="old_password">
        <el-input v-model="row.old_password" show-password type="password" />
      </el-form-item>
      <el-form-item :label="$t('new_password')" prop="new_password">
        <el-input v-model="row.new_password" show-password type="password" />
      </el-form-item>
      <el-form-item :label="$t('confirm_password')" prop="confirm_password">
        <el-input v-model="row.confirm_password" show-password type="password" />
      </el-form-item>
    </form-dialog>
  </div>
</template>

<script lang="ts">
import { editUserInfo, modifyPwd, refresh } from '@/apis/modules/systemUser'
import { Lang } from '@/lang'
import router from '@/router'
import { ComponentFormDialogInstance } from '@/interface'
import { ElLoadingService, ElMessage } from 'element-plus'
import SparkMD5 from 'spark-md5'
import { computed, defineComponent, ref } from 'vue'
import { Menu, ModifyPasswordParams, UserInfo } from '@/interface/systemUser'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'NavBar'
})
</script>

<script lang="ts" setup>
import SwitchLanguage from '@/components/SwitchLanguage/index.vue'
import SwitchTheme from '@/components/SwitchTheme/index.vue'

const { getters, dispatch } = useStore()

const sidebarOpened = computed<boolean>(() => {
  return getters['app/sidebarOpened']
})

function toggleSidebar() {
  dispatch('app/toggleSidebar')
}

const menuLevel = computed<string[]>(() => {
  const menuActive: number = parseInt(getters['app/menuActive'])
  const getLevel = (menus: Menu[], level: string[] = []): string[] => {
    for (const menu of menus) {
      if (menu.url === '#' && menu.children.length > 0) {
        const res = getLevel(menu.children)
        if (res.length > 0) {
          res.unshift(menu.title)
          return res
        }
      } else {
        if (menu.id === menuActive) {
          level.unshift(menu.title)
          return level
        }
      }
    }
    return []
  }
  return getLevel(getters['user/menus'])
})

const userInfo = computed<UserInfo>(() => {
  return getters['user/userInfo']
})

function refreshInfo() {
  refresh().then(async() => {
    await dispatch('user/getUserInfo')
    await dispatch('user/getMenu')
    ElMessage.success(Lang.message('refresh_success'))
  })
}

const userInfoForm = ref<ComponentFormDialogInstance<UserInfo>>()

function openUserInfo() {
  if (userInfoForm.value) {
    const userInfoData: UserInfo = getters['user/userInfo']
    userInfoForm.value.open({
      avatar: userInfoData.avatar,
      username: userInfoData.username,
      name: userInfoData.name,
      mobile: userInfoData.mobile,
      email: userInfoData.email
    })
  }
}

function userInfoSave(row: UserInfo, shutDown: Function) {
  const loading = ElLoadingService()
  editUserInfo(row).then(() => {
    ElMessage.success(Lang.message('save_success'))
    shutDown()
  }).finally(() => {
    loading.close()
  })
}

function onLogout() {
  dispatch('user/logout').then(() => {
    router.push({ name: 'Login' })
  })
}

const modifyPwdForm = ref<ComponentFormDialogInstance<ModifyPasswordParams>>()

const modifyPwdRules = {
  old_password: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'old_password' }) }],
  new_password: [{ required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'new_password' }) }],
  confirm_password: [
    { required: true, trigger: 'blur', message: () => Lang.validate('input', { name: 'confirm_password' }) },
    {
      trigger: 'blur',
      validator(rule: any, value: string, callback: Function) {
        if (modifyPwdForm.value && value !== modifyPwdForm.value.row.new_password) {
          return callback(new Error(Lang.validate('entered_password_differ')))
        }
        return true
      }
    }
  ]
}

function onModifyPwd() {
  if (modifyPwdForm.value) {
    modifyPwdForm.value.open()
  }
}

function modifyPwdSave(row: ModifyPasswordParams, shutDown: Function) {
  const loading = ElLoadingService()
  modifyPwd({
    old_password: SparkMD5.hash(row.old_password),
    new_password: SparkMD5.hash(row.new_password),
    confirm_password: SparkMD5.hash(row.confirm_password)
  }).then(() => {
    ElMessage.success(Lang.message('save_success'))
    shutDown()
  }).finally(() => {
    loading.close()
  })
}

</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  &-left {
    display: flex;
    .svg-icon {
      cursor: pointer;
      vertical-align: middle;
      font-size: 20px;
      color: var(--el-text-color-primary);
      &.fold {
        transform: rotate(180deg);
      }
    }
    .el-breadcrumb {
      display: inline-block;
      margin-left: 1em;
      line-height: 20px;
    }
  }
  &-right {
    display: flex;
    align-items: center;
    .switch-language,
    .switch-theme {
      margin-right: 1em;
      .svg-icon {
        font-size: 20px;
        &:hover {
          color: var(--el-color-info);
        }
      }
    }
    .avatar-container {
      display: flex;
      align-items: flex-end;
      cursor: pointer;
    }
  }
}
</style>
