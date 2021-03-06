import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import axios from 'axios'
Vue.use(Vuex)

var jwtDecode = require('jwt-decode');

// modules
import {projectModule} from './projectModule'
import {contactModule} from './contactModule'
import {userModule} from './userModule'


export const store = new Vuex.Store({
  modules: {
    project: projectModule,
    contact: contactModule,
    user: userModule
  },
  state: {
    authUser: {
      id: null,
      email: null,
      role: null
    },
    validToken: localStorage.getItem("default_auth_token"),
    message: "Update Form",
    flash: [],
    reveal: {
      type: null,
      title: null,
      msg: null,
      project_id: null
    },
    validUser: false,
    defaultLinks: [
      {
        name: "Home",
        url: "home"
      },
      {
        name: "Create Project Request",
        url: "new"
      },
      {
        name: "How It Works",
        url: "how"
      },
      {
        name: "Gallery",
        url: "gallery"
      },
      {
        name: "FAQ",
        url: "faq"
      }
    ],
    links: [],
    navContrast: false,
    mobileNav: false
  },
  getters: {
    authUser(state) {
      return state.authUser
    },
    validToken(state) {
      return state.validToken
    },
    message(state) {
      return state.message
    },
    flash(state) {
      return state.flash
    },
    reveal(state) {
      return state.reveal
    },
    validUser(state) {
      return state.validUser
    },
    defaultLinks(state) {
      return state.defaultLinks
    },
    links(state) {
      return state.links
    },
    navContrast(state) {
      return state.navContrast
    },
    mobileNav(state) {
      return state.mobileNav
    }
  },
  mutations: {
    setAuth(state, user) {
      state.authUser.id = user.id
      state.authUser.email = user.email
      state.authUser.role = user.role
    },
    setToken(state, token) {
      state.validToken = token
    },
    setMessage(state, message) {
      state.message = message
    },
    setFlash(state, payload) {
      var flash_obj = payload
      state.flash.push(flash_obj)
    },
    setReveal(state, payload) {
      state.reveal.reveal_type = payload.reveal_type
      state.reveal.title = payload.title
      state.reveal.msg = payload.msg
      state.reveal.project_id = payload.pid
    },
    toggleValidUser(state, bool) {
      state.validUser = bool
    },
    setLinks(state, payload) {
      state.links = payload
    },
    setNavContrast(state, bool) {
      state.navContrast = bool
    },
    toggleMobileNav(state, payload) {
      state.mobileNav = payload
    }
  },
  actions: {
    // Global actions
    setAuth({commit, dispatch}, payload) {
      if(payload != '') {
        commit('setAuth', payload)
        dispatch('setLinks', payload.role)
      } else {
        var emptyAuth = {id: null, role: 'public'}
        commit('setAuth', emptyAuth)
        dispatch('setLinks')
      }
    },
    setAuthViaToken({commit, dispatch}, payload) {
      if(payload != '') {
        var userData = jwtDecode(payload)
        var user = {
          id: userData.sub,
          email: userData.email,
          role: userData.role
        }
        commit('setAuth', user)
        dispatch('setLinks', user.role)
      } else {
        var emptyAuth = {id: null, role: 'public'}
        commit('setAuth', emptyAuth)
        dispatch('setLinks')
      }
    },
    setToken({commit, dispatch}, token) {
      commit('setToken', token)
      dispatch('setAuthViaToken', token)
    },
    setMessage({commit}, message) {
      commit('setMessage', message)
    },
    setFlash({commit}, payload) {
      commit('setFlash', payload)
    },
    setReveal({commit}, payload) {
      commit('setReveal', payload)
      $('#reveal').foundation('open');
    },
    closeReveal({commit}) {
      $('#reveal').foundation('close');
    },
    checkValidUser({commit, state}, id) {
      if(state.authUser.role == 'admin') {
        commit('toggleValidUser', true)
      } else if (state.authUser.role == 'contact') {
        if(state.authUser.id == id) {
          commit('toggleValidUser', true)
        } else {
          commit('toggleValidUser', false)
        }
      } else {
        commit('toggleValidUser', false)
      }
    },
    setLinks({commit, state}, linkType) {
      if(linkType == 'admin' || linkType == 'contact') {
        var admin_links = [...state.defaultLinks]
        admin_links.splice(2, 0, { name: "All Projects", url: "list" })
        admin_links.push( { name: "Profile", url: "account"})
        commit('setLinks', admin_links)
      } else {
        commit('setLinks', state.defaultLinks)
      }
    },
    setNavContrast({commit}, bool) {
      commit('setNavContrast', bool)
    },
    toggleMobileNav({commit}, payload) {
      commit('toggleMobileNav', payload)
    },
  }
})
