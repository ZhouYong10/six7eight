const components = {
    noPage: () => import("@/components/NoPage.vue"),
    login: () => import("./login/Login.vue"),
    home: () => import("./Home.vue"),
    index: () => import("./Index.vue"),
    adminInfo: () => import("./AdminInfo.vue"),
    recharge: () => import("./Recharge.vue"),
    rechargeRecord: () => import("./RechargeRecord.vue"),
    consumeRecord: () => import("./ConsumeRecord.vue"),
    profitRecord: () => import("./ProfitRecord.vue"),
    withdrawRecord: () => import("./WithdrawRecord.vue"),
    productType: () => import("./ProductType.vue"),
    product: () => import("./Product.vue"),
    adminRole: () => import("./AdminRole.vue"),
    admins: () => import("./Admins.vue"),
    users: () => import("./Users.vue"),
    feedback: () => import("./Feedback.vue"),
    settings: () => import("./Settings.vue"),
};

export default components;