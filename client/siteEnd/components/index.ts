const components = {
    noPage: () => import("@/components/NoPage.vue"),
    login: () => import("./login/Login.vue"),
    home: () => import("./Home.vue"),
    index: () => import("./Index.vue"),
    adminInfo: () => import("./AdminInfo.vue"),
    recharge: () => import("./recharge/Recharge.vue"),
    rechargeRecord: () => import("./RechargeRecord.vue"),
    consumeRecord: () => import("./ConsumeRecord.vue"),
    profitRecord: () => import("./ProfitRecord.vue"),
    withdrawRecord: () => import("./WithdrawRecord.vue"),
    productType: () => import("./ProductType.vue"),
    product: () => import("./Product.vue"),
    adminRole: () => import("./AdminRole.vue"),
    admins: () => import("./Admins.vue"),
    usersRole: () => import("./UsersRole.vue"),
    users: () => import("./Users.vue"),
    placard: () => import("./Placard.vue"),
    feedback: () => import("./Feedback.vue"),
    userFeedback: () => import("./UserFeedback.vue"),
    settings: () => import("./Settings.vue"),
};

export default components;