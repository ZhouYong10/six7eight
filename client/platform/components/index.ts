const components = {
    noPage: () => import("@/components/NoPage.vue"),
    login: () => import("./login/Login.vue"),
    home: () => import("./Home.vue"),
    index: () => import("./Index.vue"),
    adminInfo: () => import("./AdminInfo.vue"),
    orderError: () => import("./OrderError.vue"),
    recharge: () => import("./Recharge.vue"),
    withdraw: () => import("./Withdraw.vue"),
    productTypes: () => import("./ProudctTypes.vue"),
    productAll: () => import("./ProudctAll.vue"),
    placardsPlatform: () => import("./PlacardsPlatform.vue"),
    placardsSite: () => import("./PlacardsSite.vue"),
    sites: () => import("./Sites.vue"),
    feedbackSite: () => import("./FeedbackSite.vue"),
    feedbackUser: () => import("./FeedbackUser.vue"),
    adminsRole: () => import("./AdminsRole.vue"),
    adminsList: () => import("./AdminsList.vue")
}

export default components;