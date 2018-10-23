const components = {
    noPage: () => import("@/components/NoPage.vue"),
    login: () => import("./login/Login.vue"),
    home: () => import("./Home.vue"),
    index: () => import("./Index.vue"),
    myInfo: () => import("./MyInfo.vue"),
    recharge: () => import("./recharge/Recharge.vue"),
    rechargeRecord: () => import("./RechargeRecord.vue"),
    consumeRecord: () => import("./ConsumeRecord.vue"),
    profitRecord: () => import("./ProfitRecord.vue"),
    withdrawRecord: () => import("./WithdrawRecord.vue"),
    lowerUsers: () => import("./LowerUsers.vue"),
    feedback: () => import("./Feedback.vue"),
};

export default components;