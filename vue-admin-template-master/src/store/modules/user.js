import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRoutes, asyncRoutes, resetRouter, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    //用户头像
    avatar: '',
    //菜单标记
    routes: [],
    //角色信息
    roles: [],
    //按钮权限信息
    buttons: [],
    // 对比之后项目中已有的已补路由，与服务器返回的标记信息进行对比需要展示的路由
    resultAsyncRoutes: [],
    //用户最终需要展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //用户名
    state.name = userInfo.name;
    //用户投降
    state.avatar = userInfo.avatar;
    //菜单权限标记
    state.routers = userInfo.routers;
    //按钮权限标记
    state.buttons = userInfo.buttons;
    //角色
    state.rules = userInfo.roles;
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex把偶才能当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes;
    // 计算出当前用户需要展示的所有路由 
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    //给路由器头添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }

}

//定义一个函数，两个数组进行对比，对比出用户到底显示那些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // console.log(asyncRoutes, 1111);
  // console.log(routes, 222);
  //过滤出当前用户[超级管理|普通员工]需要展示的异步路由
  return asyncRoutes.filter(item => {
    //数组当中没有这个元素返回的索引值-1，如果有这个元素返回的索引值一定不是1
    if (routes.indexOf(item.name) != -1) {
      // 递归
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token);
      return 'ok';
    } else {
      return Promise.reject(new error("faile"));
    }

    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        //vuex存储用户全部信息
        commit('SET_USERINFO', data);
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes));
        // if (!data) {
        //   return reject('Verification failed, please Login again.')
        // }
        // const { name, avatar } = data
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

