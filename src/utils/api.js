import BaseAxios from './axios'

const Axios = new BaseAxios()

const API = {
    getUserInfo(params) {
        return Axios.post(`/auth/get_user_info`, params)
    },
    userLogin(params) {
        return Axios.post(`/auth/login`, params)
    },
    userLoginOut(params) {
        return Axios.post(`/auth/logout`, params)
    },
    userRegister(params) {
        return Axios.post(`/auth/add_staff`, params)
    },
    getAllPermission(params) {
        return Axios.post(`/auth/get_all_permission`, params)
    },
    setGroupPermission(params) {
        return Axios.post(`/auth/set_group_permission`, params)
    },
    getAllGroups(params) {
        return Axios.post(`/auth/get_all_groups`, params)
    },
    addNewGroup(params) {
        return Axios.post(`/auth/add_group`, params)
    },
    deleteGroup(params) {
        return Axios.post(`/auth/ajax_remove_group`, params)
    },
    getAllStaff(params) {
        return Axios.post(`/auth/get_all_staff`, params)
    },
    getGroupStaff(params) {
        return Axios.post(`/auth/get_staff_group_relation`, params)
    },
    addGroupStaff(params) {
        return Axios.post(`/auth/add_staff_to_group`, params)
    },
    deleteGroupStaff(params) {
        return Axios.post(`/auth/remove_staff_from_group`, params)
    },
    getRegisteredCategory(params) {
        return Axios.post(`/search/ajax_get_register_cats`, params)
    },
    getMainCategory(params) {
        return Axios.post(`/search/ajax_get_main_cats`, params)
    },
    getRefundReasons(params) {
        return Axios.post(`/search/ajax_get_refund_reasons`, params)
    },
    getProductVersion(params) {
        return Axios.post(`/search/ajax_get_statistics_version_info`, params)
    },
    getCustomQueryTableData(params) {
        return Axios.post(`/search/ajax_search_orders`, params)
    }
}
export default API